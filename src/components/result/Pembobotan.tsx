"use client";
import React from 'react';
import { Perhitungan } from '@/types';

interface PembobotanProps {
    data: Perhitungan | null;
}

export default function Pembobotan({ data }: PembobotanProps) {
    if (!data) return null;

    return (
        <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Data Pembobotan</h2>
            <div className="overflow-x-auto">
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
                                {e.weightedNormalizedValue?.map((element, index) => (
                                    <td key={index} className="px-4 py-3">{element}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}