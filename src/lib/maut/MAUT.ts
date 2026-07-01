import { Perhitungan } from '@/types';

class MAUT {
    perhitungan: Perhitungan;

    constructor(perhitungan: Perhitungan) {
        this.perhitungan = perhitungan;
    }

    setMinMaxForEveryKriteria() {
        this.perhitungan.kriteria.forEach((e, i) => {
            let array = this.perhitungan.alternatif.map((alt) => {
                return alt.nilaiKriteria[i] || 0;
            });
            let min = Math.min(...array);
            let max = Math.max(...array);
            this.perhitungan.kriteria[i].min = min;
            this.perhitungan.kriteria[i].max = max;
        });
    }

    normalizeBobotKriteria() {
        let sum = 0;
        this.perhitungan.kriteria.forEach((e) => {
            sum += parseFloat(e.bobot.toString());
            sum = parseFloat(sum.toFixed(1));
        });
        if (sum === 1) {
            for (let i = 0; i < this.perhitungan.kriteria.length; i++) {
                this.perhitungan.kriteria[i].bobotNorm = parseFloat(this.perhitungan.kriteria[i].bobot.toString());
            }
        } else {
            for (let i = 0; i < this.perhitungan.kriteria.length; i++) {
                this.perhitungan.kriteria[i].bobotNorm = parseFloat(this.perhitungan.kriteria[i].bobot.toString()) / sum;
            }
        }
    }

    private costNormalization(data: number, min: number, max: number) {
        let hasil = (max - data) / (max - min);
        if (isNaN(hasil)) return 1;
        return hasil;
    }

    private benefitNormalization(data: number, min: number, max: number) {
        let hasil = (data - min) / (max - min);
        if (isNaN(hasil)) return 1;
        return hasil;
    }

    normalizeNilaiKriteria() {
        this.perhitungan.alternatif.forEach((e, i) => {
            this.perhitungan.alternatif[i].nilaiKriteriaNorm = [...this.perhitungan.alternatif[i].nilaiKriteria];
        });
        this.perhitungan.alternatif.forEach((e, i) => {
            e.nilaiKriteriaNorm?.forEach((val, index) => {
                const kriteria = this.perhitungan.kriteria[index];
                const min = kriteria.min ?? 0;
                const max = kriteria.max ?? 0;
                if (kriteria.tipe === 1 || kriteria.tipe === "1" || kriteria.tipe === '1') {
                    this.perhitungan.alternatif[i].nilaiKriteriaNorm![index] = this.benefitNormalization(val, min, max);
                } else {
                    this.perhitungan.alternatif[i].nilaiKriteriaNorm![index] = this.costNormalization(val, min, max);
                }
            });
        });
    }

    weightedNormalizedValue() {
        this.perhitungan.alternatif.forEach((e, i) => {
            this.perhitungan.alternatif[i].weightedNormalizedValue = e.nilaiKriteriaNorm?.map((val, index) => {
                return val * (this.perhitungan.kriteria[index].bobotNorm ?? 0);
            });
        });
    }

    sumOfWeightedNormalizedValue() {
        this.perhitungan.alternatif.forEach((e, i) => {
            this.perhitungan.alternatif[i].sumOfWeightedNormalizedValue = e.weightedNormalizedValue?.reduce((a, b) => a + b, 0) ?? 0;
        });
    }

    getRank() {
        let array = this.perhitungan.alternatif.map((e) => {
            return { name: e.name, rank: e.sumOfWeightedNormalizedValue ?? 0 };
        });
        array.sort((a, b) => {
            return b.rank - a.rank;
        });
        return array;
    }

    rankThisShit() {
        this.setMinMaxForEveryKriteria();
        this.normalizeBobotKriteria();
        this.normalizeNilaiKriteria();
        this.weightedNormalizedValue();
        this.sumOfWeightedNormalizedValue();
        let rank = this.getRank();
        return rank;
    }
}

export default MAUT;
