class Perhitungan{
    constructor(name, kriteria, alternatif, deskripsi){
        this.name = name;
        this.kriteria = kriteria;
        this.alternatif = alternatif;
        this.deskripsi = deskripsi;
    }

    getName(){
        return this.name;
    }

    getKriteria(){
        return this.kriteria;
    }

    getAlternatif(){
        return this.alternatif;
    }

    getDeskripsi(){
        return this.deskripsi;
    }

    setName(name){
        this.name = name;
    }

    setKriteria(kriteria){
        this.kriteria = kriteria;
    }

    setAlternatif(alternatif){
        this.alternatif = alternatif;
    }

    setDeskripsi(deskripsi){
        this.deskripsi = deskripsi;
    }
}