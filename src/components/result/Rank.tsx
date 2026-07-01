"use client";
import React from 'react';
import { Perhitungan } from '@/types';

interface RankProps {
    data: Perhitungan | null;
}

export default function Rank({ data }: RankProps) {
    if (!data || !data.rank) return null;

    return (
        <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Ranking</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-primary-foreground uppercase bg-primary">
                        <tr>
                            <th scope="col" className="px-4 py-3">No</th>
                            <th scope="col" className="px-4 py-3">Nama Alternatif</th>
                            <th scope="col" className="px-4 py-3">Nilai</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.rank.map((e, i) => (
                            <tr
                                key={i}
                                className="border-b border-border hover:bg-accent/30 transition-colors"
                            >
                                <td className="px-4 py-3 font-medium">{i + 1}</td>
                                <td className="px-4 py-3">{e.name}</td>
                                <td className="px-4 py-3">{e.rank}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}