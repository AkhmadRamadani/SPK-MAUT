import { Perhitungan, DSSAlgorithm, DSSResult, DSSMethod } from './types';

/**
 * WP — Weighted Product.
 * No separate normalization step: weights become exponents directly
 * (positive for benefit criteria, negative for cost criteria).
 * S_i = Π (x_ij ^ w_j)   ->   V_i = S_i / Σ S_i   -> rank.
 */
class WP implements DSSAlgorithm {
    readonly method: DSSMethod = 'WP';
    perhitungan: Perhitungan;

    private S: number[] = [];
    private V: number[] = [];

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

    /**
     * WP is scale-sensitive when a criterion value is 0 (0^negative = Infinity).
     * Guard: treat a 0 raw value as 1 for the purposes of the exponentiation,
     * same defensive spirit as the isNaN guards in your MAUT normalizers.
     */
    private computeS() {
        this.S = this.perhitungan.alternatif.map((alt) => {
            let s = 1;
            alt.nilaiKriteria.forEach((val, j) => {
                const kriteria = this.perhitungan.kriteria[j];
                const w = kriteria.bobotNorm ?? 0;
                const isBenefit = kriteria.tipe === 1 || kriteria.tipe === '1';
                const exponent = isBenefit ? w : -w;
                const base = val === 0 ? 1 : val;
                s *= Math.pow(base, exponent);
            });
            return s;
        });
    }

    private computeV() {
        const totalS = this.S.reduce((a, b) => a + b, 0);
        this.V = this.S.map((s) => (totalS === 0 ? 0 : s / totalS));
    }

    rankThisShit(): DSSResult {
        this.normalizeBobotKriteria();
        this.computeS();
        this.computeV();

        const ranking = this.perhitungan.alternatif
            .map((e, i) => ({ name: e.name, rank: this.V[i] ?? 0 }))
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
                S: this.perhitungan.alternatif.map((a, i) => ({ name: a.name, S: this.S[i] })),
                V: this.perhitungan.alternatif.map((a, i) => ({ name: a.name, V: this.V[i] })),
            },
            ranking,
        };
    }
}

export default WP;
