import { Perhitungan, DSSResult, DSSAlgorithm } from './types';
import SAW from './saw';
import TOPSIS from './topsis';
import WP from './wp';
import AHP, { AHPInput } from './ahp';

export * from './types';
export { SAW, TOPSIS, WP, AHP };

/**
 * Factory for the three matrix-based methods that share the same
 * Perhitungan input shape. AHP is intentionally excluded here since
 * its input (pairwise comparisons) is structurally different — call
 * `new AHP(ahpInput).rankThisShit()` directly, or see runAHP() below.
 */
export function createDSS(method: 'SAW' | 'TOPSIS' | 'WP', perhitungan: Perhitungan): DSSAlgorithm {
    switch (method) {
        case 'SAW':
            return new SAW(perhitungan);
        case 'TOPSIS':
            return new TOPSIS(perhitungan);
        case 'WP':
            return new WP(perhitungan);
    }
}

export function runAHP(input: AHPInput): DSSResult {
    return new AHP(input).rankThisShit();
}

/**
 * Run every matrix-based method against the same Perhitungan and get
 * back all four DSSResults in one shot — handy for a "compare methods"
 * view, or for writing all of them to the DB in a single transaction.
 */
export function runAll(perhitungan: Perhitungan): DSSResult[] {
    return (['SAW', 'TOPSIS', 'WP'] as const).map((m) => createDSS(m, perhitungan).rankThisShit());
}
