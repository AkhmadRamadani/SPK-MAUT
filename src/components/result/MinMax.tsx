"use client";
import React from 'react';
import { Perhitungan } from '@/types';

interface MinMaxProps {
    data: Perhitungan | null;
}

export default function MinMax({ data }: MinMaxProps) {
    if (!data) return null;

    return (
        <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Min Max</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-primary-foreground uppercase bg-primary">
                        <tr>
                            <th scope="col" className="px-4 py-3">Min/Max</th>
                            {data.kriteria.map((e, i) => (
                                <th key={i} scope="col" className="px-4 py-3">{e.name}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b border-border">
                            <td className="px-4 py-3 font-medium">Min</td>
                            {data.kriteria.map((e, i) => (
                                <td key={i} className="px-4 py-3">{e.min}</td>
                            ))}
                        </tr>
                        <tr className="border-b border-border">
                            <td className="px-4 py-3 font-medium">Max</td>
                            {data.kriteria.map((e, i) => (
                                <td key={i} className="px-4 py-3">{e.max}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}