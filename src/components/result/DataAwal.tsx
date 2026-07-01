"use client";
import React from 'react';
import { Perhitungan } from '@/types';

interface DataAwalProps {
    data: Perhitungan | null;
}

export default function DataAwal({ data }: DataAwalProps) {
    if (!data) return null;

    return (
        <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Data Alternatif</h2>
            <div className="overflow-x-auto mb-8">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-primary-foreground uppercase bg-primary">
                        <tr>
                            <th scope="col" className="px-4 py-3">Nama Alternatif</th>
                            {data.kriteria.map((e, i) => (
                                <th key={i} scope="col" className="px-4 py-3">{e.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.alternatif.map((e, i) => (
                            <tr
                                key={i}
                                className="border-b border-border hover:bg-accent/30 transition-colors"
                            >
                                <td className="px-4 py-3 font-medium">{e.name}</td>
                                {e.nilaiKriteria.map((element, index) => (
                                    <td key={index} className="px-4 py-3">{element}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2 className="text-xl font-bold text-foreground mb-4">Data Kriteria</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-primary-foreground uppercase bg-primary">
                        <tr>
                            <th scope="col" className="px-4 py-3">Nama Kriteria</th>
                            <th scope="col" className="px-4 py-3">Bobot</th>
                            <th scope="col" className="px-4 py-3">Tipe</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.kriteria.map((e, i) => (
                            <tr
                                key={i}
                                className="border-b border-border hover:bg-accent/30 transition-colors"
                            >
                                <td className="px-4 py-3">{e.name}</td>
                                <td className="px-4 py-3">{e.bobot}</td>
                                <td className="px-4 py-3">
                                    {e.tipe === 1 || e.tipe === '1' ? 'Benefit' : 'Cost'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}