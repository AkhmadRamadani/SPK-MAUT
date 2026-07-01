import { Perhitungan, DSSAlgorithm, DSSResult, DSSMethod } from './types';

/**
 * TOPSIS — Technique for Order Preference by Similarity to Ideal Solution.
 * Vector-normalize -> weight -> distance to ideal+/ideal- -> preference ratio -> rank.
 */
class TOPSIS implements DSSAlgorithm {
    readonly method: DSSMethod = 'TOPSIS';
    perhitungan: Perhitungan;

    private normalizedMatrix: number[][] = [];
    private weightedMatrix: number[][] = [];
    private idealPositive: number[] = [];
    private idealNegative: number[] = [];
    private distancePositive: number[] = [];
    private distanceNegative: number[] = [];
    private preferenceScore: number[] = [];

    constructor(perhitungan: Perhitungan) {
        this.perhitungan = perhitungan;
    }

    private normalizeBobotKriteria() {
        let sum = 0;
        this.perhitungan.kriteria.forEach((e) => {
            sum += parseFloat(e.bobot.toString());
            sum = parseFloat(sum.toFixed(1));
        });
        this.perhitungan.kriteria.forEach((_e, i) => {
            const bobot = parseFloat(this.perhitungan.kriteria[i].bobot.toString());
            this.perhitungan.kriteria[i].bobotNorm = sum === 1 ? bobot : bobot / sum;
        });
    }

    private vectorNormalization() {
        const nAlt = this.perhitungan.alternatif.length;
        const nKriteria = this.perhitungan.kriteria.length;

        const denom: number[] = [];
        for (let j = 0; j < nKriteria; j++) {
            let sumSq = 0;
            for (let i = 0; i < nAlt; i++) {
                const val = this.perhitungan.alternatif[i].nilaiKriteria[j] || 0;
                sumSq += val * val;
            }
            denom[j] = Math.sqrt(sumSq);
        }

        this.normalizedMatrix = this.perhitungan.alternatif.map((alt) =>
            alt.nilaiKriteria.map((val, j) => (denom[j] === 0 ? 0 : val / denom[j]))
        );
    }

    private computeWeightedMatrix() {
        this.weightedMatrix = this.normalizedMatrix.map((row) =>
            row.map((val, j) => val * (this.perhitungan.kriteria[j].bobotNorm ?? 0))
        );
    }

    private determineIdealSolutions() {
        const nKriteria = this.perhitungan.kriteria.length;
        for (let j = 0; j < nKriteria; j++) {
            const column = this.weightedMatrix.map((row) => row[j]);
            const max = Math.max(...column);
            const min = Math.min(...column);
            const isBenefit =
                this.perhitungan.kriteria[j].tipe === 1 || this.perhitungan.kriteria[j].tipe === '1';
            this.idealPositive[j] = isBenefit ? max : min;
            this.idealNegative[j] = isBenefit ? min : max;
        }
    }

    private calculateDistances() {
        this.distancePositive = this.weightedMatrix.map((row) =>
            Math.sqrt(row.reduce((acc, val, j) => acc + Math.pow(val - this.idealPositive[j], 2), 0))
        );
        this.distanceNegative = this.weightedMatrix.map((row) =>
            Math.sqrt(row.reduce((acc, val, j) => acc + Math.pow(val - this.idealNegative[j], 2), 0))
        );
    }

    private calculatePreferenceScore() {
        this.preferenceScore = this.distancePositive.map((dPlus, i) => {
            const dMinus = this.distanceNegative[i];
            const total = dPlus + dMinus;
            return total === 0 ? 0 : dMinus / total;
        });
    }

    rankThisShit(): DSSResult {
        this.normalizeBobotKriteria();
        this.vectorNormalization();
        this.computeWeightedMatrix();
        this.determineIdealSolutions();
        this.calculateDistances();
        this.calculatePreferenceScore();

        const ranking = this.perhitungan.alternatif
            .map((e, i) => ({ name: e.name, rank: this.preferenceScore[i] ?? 0 }))
            .sort((a, b) => b.rank - a.rank);

        return {
            method: this.method,
            perhitunganId: this.perhitungan.id,
            computedAt: new Date().toISOString(),
            weights: this.perhitungan.kriteria.map((k) => ({
                kriteria: k.name,
                bobotNorm: k.bobotNorm ?? 0,
            })),
            steps: {
                normalizedMatrix: this.normalizedMatrix,
                weightedMatrix: this.weightedMatrix,
                idealPositive: this.idealPositive,
                idealNegative: this.idealNegative,
                distancePositive: this.distancePositive,
                distanceNegative: this.distanceNegative,
            },
            ranking,
        };
    }
}

export default TOPSIS;
