import { Perhitungan, DSSAlgorithm, DSSResult, DSSMethod } from './types';

/**
 * SAW / MAUT — Simple Additive Weighting.
 * Normalize (min-max) -> weight -> sum across the row -> rank.
 * This is your original MAUT class, adapted to return a DSSResult
 * so it's storable/comparable alongside TOPSIS/WP/AHP.
 */
class SAW implements DSSAlgorithm {
    readonly method: DSSMethod = 'SAW';
    perhitungan: Perhitungan;

    constructor(perhitungan: Perhitungan) {
        this.perhitungan = perhitungan;
    }

    private setMinMaxForEveryKriteria() {
        this.perhitungan.kriteria.forEach((_e, i) => {
            const array = this.perhitungan.alternatif.map((alt) => alt.nilaiKriteria[i] || 0);
            this.perhitungan.kriteria[i].min = Math.min(...array);
            this.perhitungan.kriteria[i].max = Math.max(...array);
        });
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

    private costNormalization(data: number, min: number, max: number) {
        const hasil = (max - data) / (max - min);
        return isNaN(hasil) ? 1 : hasil;
    }

    private benefitNormalization(data: number, min: number, max: number) {
        const hasil = (data - min) / (max - min);
        return isNaN(hasil) ? 1 : hasil;
    }

    private normalizeNilaiKriteria() {
        this.perhitungan.alternatif.forEach((e, i) => {
            this.perhitungan.alternatif[i].nilaiKriteriaNorm = [...e.nilaiKriteria];
        });
        this.perhitungan.alternatif.forEach((e, i) => {
            e.nilaiKriteriaNorm?.forEach((val, index) => {
                const kriteria = this.perhitungan.kriteria[index];
                const min = kriteria.min ?? 0;
                const max = kriteria.max ?? 0;
                const isBenefit = kriteria.tipe === 1 || kriteria.tipe === '1';
                this.perhitungan.alternatif[i].nilaiKriteriaNorm![index] = isBenefit
                    ? this.benefitNormalization(val, min, max)
                    : this.costNormalization(val, min, max);
            });
        });
    }

    private weightedNormalizedValue() {
        this.perhitungan.alternatif.forEach((e, i) => {
            this.perhitungan.alternatif[i].weightedNormalizedValue = e.nilaiKriteriaNorm?.map(
                (val, index) => val * (this.perhitungan.kriteria[index].bobotNorm ?? 0)
            );
        });
    }

    private sumOfWeightedNormalizedValue() {
        this.perhitungan.alternatif.forEach((e, i) => {
            this.perhitungan.alternatif[i].sumOfWeightedNormalizedValue =
                e.weightedNormalizedValue?.reduce((a, b) => a + b, 0) ?? 0;
        });
    }

    rankThisShit(): DSSResult {
        this.setMinMaxForEveryKriteria();
        this.normalizeBobotKriteria();
        this.normalizeNilaiKriteria();
        this.weightedNormalizedValue();
        this.sumOfWeightedNormalizedValue();

        const ranking = this.perhitungan.alternatif
            .map((e) => ({ name: e.name, rank: e.sumOfWeightedNormalizedValue ?? 0 }))
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
                minMax: this.perhitungan.kriteria.map((k) => ({ name: k.name, min: k.min, max: k.max })),
                normalizedMatrix: this.perhitungan.alternatif.map((a) => ({
                    name: a.name,
                    nilaiKriteriaNorm: a.nilaiKriteriaNorm,
                })),
                weightedMatrix: this.perhitungan.alternatif.map((a) => ({
                    name: a.name,
                    weightedNormalizedValue: a.weightedNormalizedValue,
                })),
            },
            ranking,
        };
    }
}

export default SAW;
