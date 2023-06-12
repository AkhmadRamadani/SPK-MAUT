class MAUT {
    constructor(perhitungan) {
        this.perhitungan = perhitungan;
    }

    setMinMaxForEveryKriteria() {
        this.perhitungan.kriteria.forEach((e, i) => {
            let array = this.perhitungan.alternatif.map((e, index) => {
                return e.nilaiKriteria[i];
            });
            let min = Math.min(...array);
            let max = Math.max(...array);
            this.perhitungan.kriteria[i].min = min;
            this.perhitungan.kriteria[i].max = max;
        });
        console.log('this.perhitungan', this.perhitungan);
    }

    normalizeBobotKriteria() {
        let sum = 0;
        this.perhitungan.kriteria.forEach((e, i) => {
            sum += parseFloat(e.bobot);
            sum = parseFloat(sum.toFixed(1));
        });
        console.log("total bobot", sum);
        if (sum === 1) {
            console.log("sum bobot = 1");
            for (let i = 0; i < this.perhitungan.kriteria.length; i++) {
                this.perhitungan.kriteria[i].bobotNorm = this.perhitungan.kriteria[i].bobot;
            }
        } else {
            console.log("sum bobot != 1");
            for (let i = 0; i < this.perhitungan.kriteria.length; i++) {
                this.perhitungan.kriteria[i].bobotNorm = this.perhitungan.kriteria[i].bobot / sum;
            }
        }
    }

    #costNormalization(data, min, max) {
        let hasil = (max - data) / (max - min);
        if (isNaN(hasil)) return 1;
        return hasil;
    }

    #benefitNormalization(data, min, max) {
        let hasil = (data - min) / (max - min);
        // if hasil NaN, return 1
        if (isNaN(hasil)) return 1;
        return hasil;
    }


    normalizeNilaiKriteria() {
        this.perhitungan.alternatif.forEach((e, i) => {
            this.perhitungan.alternatif[i].nilaiKriteriaNorm = this.perhitungan.alternatif[i].nilaiKriteria.map((e, index) => {
                return e;
            });
        });
        this.perhitungan.alternatif.forEach((e, i) => {
            this.perhitungan.alternatif[i].nilaiKriteriaNorm.forEach((e, index) => {
                if (this.perhitungan.kriteria[index].tipe === 1 || this.perhitungan.kriteria[index].tipe === "1" || this.perhitungan.kriteria[index].tipe === '1') {
                    this.perhitungan.alternatif[i].nilaiKriteriaNorm[index] = this.#benefitNormalization(e, this.perhitungan.kriteria[index].min, this.perhitungan.kriteria[index].max);
                } else {
                    this.perhitungan.alternatif[i].nilaiKriteriaNorm[index] = this.#costNormalization(e, this.perhitungan.kriteria[index].min, this.perhitungan.kriteria[index].max);
                }
            });
        });
    }

    weightedNormalizedValue() {
        this.perhitungan.alternatif.forEach((e, i) => {
            this.perhitungan.alternatif[i].weightedNormalizedValue = this.perhitungan.alternatif[i].nilaiKriteriaNorm.map((e, index) => {
                return e * this.perhitungan.kriteria[index].bobotNorm;
            });
        });
    }

    sumOfWeightedNormalizedValue() {
        this.perhitungan.alternatif.forEach((e, i) => {
            this.perhitungan.alternatif[i].sumOfWeightedNormalizedValue = this.perhitungan.alternatif[i].weightedNormalizedValue.reduce((a, b) => a + b, 0);
        });
    }

    getRank() {
        let array = this.perhitungan.alternatif.map((e, i) => {
            return { name: e.name, rank: e.sumOfWeightedNormalizedValue };
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