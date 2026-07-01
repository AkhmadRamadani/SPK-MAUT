"use client";
import React, { ChangeEvent } from "react";
import { Perhitungan } from "@/types";

interface Input2Props {
    perhitungan: Perhitungan;
    handler: (perhitungan: Perhitungan) => void;
}

export default function Input2({ perhitungan, handler }: Input2Props) {
    const changeHandler = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        let newPerhitungan = { ...perhitungan };
        let arrayBefore = [...newPerhitungan.alternatif];
        arrayBefore[i].name = e.target.value;
        newPerhitungan.alternatif = arrayBefore;
        handler(newPerhitungan);
    };

    const kurangAlternatif = () => {
        if (perhitungan.alternatif.length > 1) {
            let newPerhitungan = { ...perhitungan };
            let arrayBefore = [...newPerhitungan.alternatif];
            arrayBefore.pop();
            newPerhitungan.alternatif = arrayBefore;
            handler(newPerhitungan);
        }
    };

    const tambahAlternatif = () => {
        let newPerhitungan = { ...perhitungan };
        let arrayBefore = [...newPerhitungan.alternatif];
        arrayBefore.push({ name: '', nilaiKriteria: [] });
        newPerhitungan.alternatif = arrayBefore;
        handler(newPerhitungan);
    };

    return (
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">
                Tambahkan Alternatif
            </h2>
            <form action="#">
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    {perhitungan.alternatif.map((e, i) => {
                        return (
                            <div key={i}>
                                <label
                                    htmlFor={`name-${i}`}
                                    className="block mb-2 text-sm font-medium text-foreground"
                                >
                                    Nama Alternatif {i + 1}
                                </label>
                                <input
                                    type="text"
                                    name={`name-${i}`}
                                    id={`name-${i}`}
                                    className="bg-input border border-input text-foreground text-sm rounded-lg focus:ring-ring focus:ring-2 block w-full p-2.5 placeholder:text-muted-foreground"
                                    placeholder="Ketik nama alternatif"
                                    required
                                    value={perhitungan.alternatif[i].name}
                                    onChange={(e) => changeHandler(e, i)}
                                />
                            </div>
                        );
                    })}
                </div>
            </form>
            <div className="flex justify-center gap-2 mt-6">
                <button
                    type="button"
                    onClick={tambahAlternatif}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    + Tambah
                </button>
                <button
                    type="button"
                    onClick={kurangAlternatif}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                    - Hapus
                </button>
            </div>
        </div>
    );
}