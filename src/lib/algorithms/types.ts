// ─────────────────────────────────────────────────────────────
// Shared domain types (extends what you already have in @/types)
// ─────────────────────────────────────────────────────────────

export type TipeKriteria = 1 | '1' | 0 | '0'; // 1/'1' = benefit, 0/'0' = cost

export interface Kriteria {
    id?: string | number;
    name: string;
    bobot: number | string;
    bobotNorm?: number;
    tipe: TipeKriteria;
    min?: number;
    max?: number;
}

export interface Alternatif {
    id?: string | number;
    name: string;
    nilaiKriteria: number[];
    nilaiKriteriaNorm?: number[];
    weightedNormalizedValue?: number[];
    sumOfWeightedNormalizedValue?: number;
}

export interface Perhitungan {
    id?: string | number;
    kriteria: Kriteria[];
    alternatif: Alternatif[];
}

// ─────────────────────────────────────────────────────────────
// Unified result shape — every algorithm returns this.
// This is what you persist to the database. `steps` holds the
// full audit trail (matrices at each stage) so you can show
// "how the score was derived" in the UI later without recomputing.
// ─────────────────────────────────────────────────────────────

export type DSSMethod = 'MAUT' | 'SAW' | 'TOPSIS' | 'WP' | 'AHP';

export interface RankedAlternatif {
    name: string;
    rank: number; // final score, higher = better, already sorted desc
}

export interface DSSResult {
    method: DSSMethod;
    perhitunganId?: string | number;
    computedAt: string; // ISO timestamp, set at rankThisShit() time
    weights: { kriteria: string; bobotNorm: number }[];
    steps: Record<string, unknown>; // method-specific intermediate matrices
    ranking: RankedAlternatif[];
}

// Every algorithm class implements this so they're interchangeable
// (factory, comparison tools, batch re-ranking, etc.)
export interface DSSAlgorithm {
    readonly method: DSSMethod;
    rankThisShit(): DSSResult;
}
