"use client";
import React, { useState } from 'react';
import { Perhitungan } from '@/types';

interface Input4Props {
    perhitungan: Perhitungan;
    handler: (perhitungan: Perhitungan) => void;
}

export default function Input4({ perhitungan, handler }: Input4Props) {
    const [alternatifIndex, setAlternatifIndex] = useState(0);

    const onChangeIndex = (isNext: boolean) => {
        if (isNext) {
            setAlternatifIndex(prev => prev + 1);
        } else {
            setAlternatifIndex(prev => prev - 1);
        }
    };

    return (
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-8">
            <h2 className="mb-2 text-xl font-bold text-foreground">
                Nilai Alternatif: {perhitungan.alternatif[alternatifIndex]?.name || `Alternatif ${alternatifIndex + 1}`}
            </h2>
            <div className="text-sm text-muted-foreground mb-6">
               ({alternatifIndex + 1} / {perhitungan.alternatif.length})
            </div>
            <form action="#">
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    {perhitungan.kriteria.map((e, i) => {
                        return (
                            <React.Fragment key={i}>
                                <div>
                                    <label
                                        htmlFor={`name-${i}`}
                                        className="block mb-2 text-sm font-medium text-foreground"
                                    >
                                        {e.name || `Kriteria ${i + 1}`}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id={`name-${i}`}
                                        className="bg-muted border border-input text-foreground text-sm rounded-lg block w-full p-2.5"
                                        value={e.name}
                                        required
                                        disabled
                                        readOnly
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor={`item-weight-${i}`}
                                        className="block mb-2 text-sm font-medium text-foreground"
                                    >
                                        Nilai
                                    </label>
                                    <input
                                        type="number"
                                        name="item-weight"
                                        id={`item-weight-${i}`}
                                        className="bg-input border border-input text-foreground text-sm rounded-lg focus:ring-ring focus:ring-2 block w-full p-2.5 placeholder:text-muted-foreground"
                                        placeholder={"0"}
                                        required
                                        onWheel={(e) => (e.target as HTMLElement).blur()}
                                        value={perhitungan.alternatif[alternatifIndex]?.nilaiKriteria[i] === 0 ? '' : (perhitungan.alternatif[alternatifIndex]?.nilaiKriteria[i] ?? '')}
                                        onChange={(e) => {
                                            let newPerhitungan = { ...perhitungan };
                                            newPerhitungan.alternatif[alternatifIndex].nilaiKriteria[i] = parseInt(e.target.value === '' ? '0' : e.target.value);
                                            handler(newPerhitungan);
                                        }}
                                    />
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </form>

            <div className="flex justify-between mt-6">
                <button
                    type='button'
                    onClick={() => onChangeIndex(false)}
                    disabled={alternatifIndex === 0}
                    className={
                        alternatifIndex === 0
                            ? "inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                            : "inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    }
                >
                    Previous
                </button>
                <button
                    type='button'
                    onClick={() => onChangeIndex(true)}
                    disabled={alternatifIndex === perhitungan.alternatif.length - 1}
                    className={
                        alternatifIndex === perhitungan.alternatif.length - 1
                            ? "inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                            : "inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    }
                >
                    Next
                </button>
            </div>
        </div>
    );
}