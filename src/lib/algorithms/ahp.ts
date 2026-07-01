import { DSSAlgorithm, DSSResult, DSSMethod } from './types';

/**
 * AHP — Analytic Hierarchy Process.
 *
 * Structurally different from the other three: instead of a raw
 * decision matrix (alternative x criteria values), AHP takes PAIRWISE
 * COMPARISON matrices — one for the criteria against each other, and
 * one per criterion for the alternatives against each other — using
 * Saaty's 1-9 fundamental scale. It derives weights (priority vectors)
 * from those comparisons and checks their consistency (CR) before
 * trusting them.
 *
 * Because the input shape differs from Perhitungan, AHP has its own
 * input type below. If you already store pairwise matrices from a
 * UI (sliders / dropdowns of "A is how much more important than B"),
 * this maps directly onto that.
 */

// Random Index (Saaty), keyed by matrix size n. n=1,2 -> 0 (always consistent).
const RI: Record<number, number> = {
    1: 0, 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, 6: 1.24, 7: 1.32, 8: 1.41, 9: 1.45, 10: 1.49,
};

export interface AHPKriteria {
    name: string;
}

export interface AHPInput {
    id?: string | number;
    kriteria: AHPKriteria[];
    alternatifNames: string[];
    // n x n pairwise comparison matrix for criteria (n = kriteria.length)
    // matrix[i][j] = how much more important criteria[i] is than criteria[j]
    kriteriaPairwise: number[][];
    // one m x m pairwise comparison matrix per criterion (m = alternatifNames.length)
    // alternatifPairwise[k] is the matrix for kriteria[k]
    alternatifPairwise: number[][][];
}

interface PriorityResult {
    weights: number[];
    lambdaMax: number;
    CI: number;
    CR: number;
    consistent: boolean; // CR <= 0.1 is the conventional threshold
}

class AHP implements DSSAlgorithm {
    readonly method: DSSMethod = 'AHP';
    input: AHPInput;

    private kriteriaPriority?: PriorityResult;
    private alternatifPriorities: PriorityResult[] = []; // one per criterion
    private finalScores: number[] = [];

    constructor(input: AHPInput) {
        this.input = input;
    }

    /**
     * Eigenvector approximation via the standard AHP shortcut:
     * normalize each column, then average each row.
     * (Full eigenvalue decomposition isn't needed for AHP-sized matrices —
     * this is the method Saaty himself recommends for hand/software calc.)
     */
    private priorityVectorFrom(matrix: number[][]): PriorityResult {
        const n = matrix.length;

        const colSums = new Array(n).fill(0);
        for (let j = 0; j < n; j++) {
            for (let i = 0; i < n; i++) colSums[j] += matrix[i][j];
        }

        const normalized = matrix.map((row) => row.map((val, j) => (colSums[j] === 0 ? 0 : val / colSums[j])));

        const weights = normalized.map((row) => row.reduce((a, b) => a + b, 0) / n);

        // Consistency check: lambda_max = average of (A*w)_i / w_i
        const Aw = matrix.map((row) => row.reduce((acc, val, j) => acc + val * weights[j], 0));
        const ratios = Aw.map((val, i) => (weights[i] === 0 ? 0 : val / weights[i]));
        const lambdaMax = ratios.reduce((a, b) => a + b, 0) / n;

        const CI = n <= 2 ? 0 : (lambdaMax - n) / (n - 1);
        const ri = RI[n] ?? 1.49; // fall back to n=10 value for very large matrices
        const CR = ri === 0 ? 0 : CI / ri;

        return { weights, lambdaMax, CI, CR, consistent: CR <= 0.1 };
    }

    private computeKriteriaWeights() {
        this.kriteriaPriority = this.priorityVectorFrom(this.input.kriteriaPairwise);
    }

    private computeAlternatifWeightsPerKriteria() {
        this.alternatifPriorities = this.input.alternatifPairwise.map((matrix) =>
            this.priorityVectorFrom(matrix)
        );
    }

    private aggregateFinalScores() {
        const nAlt = this.input.alternatifNames.length;
        const kriteriaWeights = this.kriteriaPriority!.weights;

        this.finalScores = new Array(nAlt).fill(0);
        this.alternatifPriorities.forEach((priorityResult, k) => {
            priorityResult.weights.forEach((w, i) => {
                this.finalScores[i] += w * kriteriaWeights[k];
            });
        });
    }

    rankThisShit(): DSSResult {
        this.computeKriteriaWeights();
        this.computeAlternatifWeightsPerKriteria();
        this.aggregateFinalScores();

        const ranking = this.input.alternatifNames
            .map((name, i) => ({ name, rank: this.finalScores[i] ?? 0 }))
            .sort((a, b) => b.rank - a.rank);

        const inconsistentWarnings: string[] = [];
        if (!this.kriteriaPriority!.consistent) {
            inconsistentWarnings.push(
                `Criteria comparison matrix is inconsistent (CR=${this.kriteriaPriority!.CR.toFixed(3)} > 0.1). Re-check pairwise inputs.`
            );
        }
        this.alternatifPriorities.forEach((p, k) => {
            if (!p.consistent) {
                inconsistentWarnings.push(
                    `Alternative comparison matrix for "${this.input.kriteria[k].name}" is inconsistent (CR=${p.CR.toFixed(3)} > 0.1).`
                );
            }
        });

        return {
            method: this.method,
            perhitunganId: this.input.id,
            computedAt: new Date().toISOString(),
            weights: this.input.kriteria.map((k, i) => ({
                kriteria: k.name,
                bobotNorm: this.kriteriaPriority!.weights[i] ?? 0,
            })),
            steps: {
                kriteriaPriority: this.kriteriaPriority,
                alternatifPriorities: this.alternatifPriorities.map((p, k) => ({
                    kriteria: this.input.kriteria[k].name,
                    ...p,
                })),
                inconsistentWarnings, // surface these in the UI before trusting the ranking
            },
            ranking,
        };
    }
}

export default AHP;
