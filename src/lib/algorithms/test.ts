import { Perhitungan } from './types';
import { runAll } from './index';
import AHP, { AHPInput } from './ahp';

const perhitungan: Perhitungan = {
    id: 'sample-1',
    kriteria: [
        { name: 'Harga', bobot: 0.3, tipe: 0 }, // cost
        { name: 'Kualitas', bobot: 0.4, tipe: 1 }, // benefit
        { name: 'Garansi', bobot: 0.3, tipe: 1 }, // benefit
    ],
    alternatif: [
        { name: 'Laptop A', nilaiKriteria: [8000000, 8, 2] },
        { name: 'Laptop B', nilaiKriteria: [6500000, 6, 1] },
        { name: 'Laptop C', nilaiKriteria: [9500000, 9, 3] },
    ],
};

console.log('=== SAW / TOPSIS / WP ===');
for (const result of runAll(structuredClone(perhitungan))) {
    console.log(result.method, JSON.stringify(result.ranking));
}

console.log('\n=== AHP ===');
const ahpInput: AHPInput = {
    id: 'sample-1-ahp',
    kriteria: [{ name: 'Harga' }, { name: 'Kualitas' }, { name: 'Garansi' }],
    alternatifNames: ['Laptop A', 'Laptop B', 'Laptop C'],
    kriteriaPairwise: [
        [1, 3, 2],
        [1 / 3, 1, 1 / 2],
        [1 / 2, 2, 1],
    ],
    alternatifPairwise: [
        // Harga (cost-ish, but AHP pairwise is just "preference", direction is up to how you compare)
        [
            [1, 1 / 2, 3],
            [2, 1, 4],
            [1 / 3, 1 / 4, 1],
        ],
        // Kualitas
        [
            [1, 2, 1 / 2],
            [1 / 2, 1, 1 / 3],
            [2, 3, 1],
        ],
        // Garansi
        [
            [1, 3, 1 / 3],
            [1 / 3, 1, 1 / 5],
            [3, 5, 1],
        ],
    ],
};
const ahpResult = new AHP(ahpInput).rankThisShit();
console.log('AHP', JSON.stringify(ahpResult.ranking));
console.log('warnings:', (ahpResult.steps as any).inconsistentWarnings);
