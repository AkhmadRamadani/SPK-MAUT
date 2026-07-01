export interface Kriteria {
    name: string;
    bobot: number | string;
    tipe: string | number;
    min?: number;
    max?: number;
    bobotNorm?: number;
}

export interface Alternatif {
    name: string;
    nilaiKriteria: number[];
    nilaiKriteriaNorm?: number[];
    weightedNormalizedValue?: number[];
    sumOfWeightedNormalizedValue?: number;
}

export interface RankResult {
    name: string;
    rank: number;
}

export interface Perhitungan {
    id?: string;
    name: string;
    deskripsi: string;
    isPublic: boolean;
    method?: string;
    kriteria: Kriteria[];
    alternatif: Alternatif[];
    steps?: any;
    rank?: RankResult[];
    author?: string;
    authorName?: string;
    createdAt?: any;
}
