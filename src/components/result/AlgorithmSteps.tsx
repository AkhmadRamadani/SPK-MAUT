"use client";
import React from 'react';
import { Perhitungan } from '@/types';

export function MatrixTable({ title, kriteria, data, rowLabels }: { title: string, kriteria: any[], data: number[][], rowLabels: string[] }) {
    if (!data || data.length === 0) return null;
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-primary-foreground uppercase bg-primary">
                        <tr>
                            <th className="px-4 py-3">Alternatif</th>
                            {kriteria.map((k, i) => (
                                <th key={i} className="px-4 py-3">{k.name || k.nama || `C${i+1}`}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr key={i} className="border-b border-border hover:bg-accent/30">
                                <td className="px-4 py-3 font-medium">{rowLabels[i]}</td>
                                {row.map((val, j) => (
                                    <td key={j} className="px-4 py-3">{(val || 0).toFixed(4)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function VectorTable({ title, data, rowLabels }: { title: string, data: number[], rowLabels: string[] }) {
    if (!data || data.length === 0) return null;
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-primary-foreground uppercase bg-primary">
                        <tr>
                            <th className="px-4 py-3">Alternatif</th>
                            <th className="px-4 py-3">Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((val, i) => (
                            <tr key={i} className="border-b border-border hover:bg-accent/30">
                                <td className="px-4 py-3 font-medium">{rowLabels[i]}</td>
                                <td className="px-4 py-3">{(val || 0).toFixed(4)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function CriteriaVectorTable({ title, kriteria, data }: { title: string, kriteria: any[], data: number[] }) {
    if (!data || data.length === 0) return null;
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">{title}</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-primary-foreground uppercase bg-primary">
                        <tr>
                            <th className="px-4 py-3">Kriteria</th>
                            <th className="px-4 py-3">Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((val, i) => (
                            <tr key={i} className="border-b border-border hover:bg-accent/30">
                                <td className="px-4 py-3 font-medium">{kriteria[i]?.name || kriteria[i]?.nama || `C${i+1}`}</td>
                                <td className="px-4 py-3">{(val || 0).toFixed(4)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function AlgorithmSteps({ data, algorithm, stepKey }: { data: Perhitungan, algorithm: string, stepKey: string }) {
    const steps = typeof data.steps === 'string' ? JSON.parse(data.steps) : (data.steps || {});
    const altNames = data.alternatif.map(a => a.name);

    if (algorithm === 'SAW') {
        if (stepKey === 'Min Max') {
            const minMax = steps.minMax || [];
            return (
                <div>
                    <h2 className="text-xl font-bold text-foreground mb-4">Nilai Min / Max per Kriteria</h2>
                    <table className="w-full text-sm text-left mb-8">
                        <thead className="text-xs text-primary-foreground uppercase bg-primary">
                            <tr>
                                <th className="px-4 py-3">Kriteria</th>
                                <th className="px-4 py-3">Min</th>
                                <th className="px-4 py-3">Max</th>
                            </tr>
                        </thead>
                        <tbody>
                            {minMax.map((m: any, i: number) => (
                                <tr key={i} className="border-b border-border hover:bg-accent/30">
                                    <td className="px-4 py-3 font-medium">{m.name}</td>
                                    <td className="px-4 py-3">{m.min}</td>
                                    <td className="px-4 py-3">{m.max}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }
        if (stepKey === 'Normalisasi') {
            const matrix = (steps.normalizedMatrix || []).map((a: any) => a.nilaiKriteriaNorm);
            return <MatrixTable title="Matriks Normalisasi (SAW)" kriteria={data.kriteria} data={matrix} rowLabels={altNames} />;
        }
        if (stepKey === 'Pembobotan') {
            const matrix = (steps.weightedMatrix || []).map((a: any) => a.weightedNormalizedValue);
            return <MatrixTable title="Matriks Terbobot (SAW)" kriteria={data.kriteria} data={matrix} rowLabels={altNames} />;
        }
    }

    if (algorithm === 'TOPSIS') {
        if (stepKey === 'Normalisasi') {
            return <MatrixTable title="Matriks Normalisasi (TOPSIS)" kriteria={data.kriteria} data={steps.normalizedMatrix || []} rowLabels={altNames} />;
        }
        if (stepKey === 'Pembobotan') {
            return <MatrixTable title="Matriks Terbobot (TOPSIS)" kriteria={data.kriteria} data={steps.weightedMatrix || []} rowLabels={altNames} />;
        }
        if (stepKey === 'Solusi Ideal') {
            return (
                <div>
                    <CriteriaVectorTable title="Solusi Ideal Positif (A+)" kriteria={data.kriteria} data={steps.idealPositive || []} />
                    <CriteriaVectorTable title="Solusi Ideal Negatif (A-)" kriteria={data.kriteria} data={steps.idealNegative || []} />
                </div>
            );
        }
        if (stepKey === 'Jarak (D+/D-)') {
            return (
                <div>
                    <VectorTable title="Jarak ke Solusi Ideal Positif (D+)" data={steps.distancePositive || []} rowLabels={altNames} />
                    <VectorTable title="Jarak ke Solusi Ideal Negatif (D-)" data={steps.distanceNegative || []} rowLabels={altNames} />
                </div>
            );
        }
    }

    if (algorithm === 'WP') {
        if (stepKey === 'Vektor S') {
            return <VectorTable title="Nilai Vektor S" data={steps.sVector || []} rowLabels={altNames} />
        }
        if (stepKey === 'Vektor V') {
            return <VectorTable title="Nilai Vektor V (Preferensi)" data={steps.vVector || []} rowLabels={altNames} />
        }
    }

    if (algorithm === 'AHP') {
        if (stepKey === 'Matriks Berpasangan') {
            const kp = steps.kriteriaPriority as any;
            if (!kp) return <p>Data matriks AHP tidak tersedia.</p>;
            return (
                <div>
                    <MatrixTable title="Matriks Perbandingan Kriteria" kriteria={data.kriteria} data={kp.matrix || []} rowLabels={data.kriteria.map(k => k.name)} />
                    <CriteriaVectorTable title="Bobot Prioritas Kriteria (Eigen Vector)" kriteria={data.kriteria} data={kp.weights || []} />
                </div>
            );
        }
    }

    return <div>Belum ada tampilan detail untuk step ini.</div>;
}
