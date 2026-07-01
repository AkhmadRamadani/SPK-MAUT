"use client";
import React, { ChangeEvent } from 'react';
import { Perhitungan } from '@/types';

const typeOfKriteria = [
    { value: 1, name: 'Benefit' },
    { value: 2, name: 'Cost' }
];

interface Input3Props {
    perhitungan: Perhitungan;
    handler: (perhitungan: Perhitungan) => void;
}

export default function Input3({ perhitungan, handler }: Input3Props) {
    const changeHandler = (e: ChangeEvent<HTMLInputElement>, i: number) => {
        let newPerhitungan = { ...perhitungan };
        let arrayBefore = [...newPerhitungan.kriteria];
        (arrayBefore[i] as any)[e.target.name] = e.target.value;
        newPerhitungan.kriteria = arrayBefore;
        handler(newPerhitungan);
    };

    const kurangKriteria = () => {
        if (perhitungan.kriteria.length > 1) {
            let newPerhitungan = { ...perhitungan };
            let arrayBefore = [...newPerhitungan.kriteria];
            arrayBefore.pop();
            newPerhitungan.kriteria = arrayBefore;
            handler(newPerhitungan);
        }
    };

    const tambahKriteria = () => {
        let newPerhitungan = { ...perhitungan };
        let arrayBefore = [...newPerhitungan.kriteria];
        arrayBefore.push({ name: '', bobot: 0, tipe: "1" });
        newPerhitungan.kriteria = arrayBefore;
        handler(newPerhitungan);
    };

    return (
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">
                Tambahkan Kriteria
            </h2>
            <form action="#">
                <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                    {perhitungan.kriteria.map((e, i) => {
                        let dataKriteria = perhitungan.kriteria[i];
                        return (
                            <React.Fragment key={i}>
                                <div>
                                    <label
                                        htmlFor={`name-${i}`}
                                        className="block mb-2 text-sm font-medium text-foreground"
                                    >
                                        Nama Kriteria {i + 1}
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id={`name-${i}`}
                                        className="bg-input border border-input text-foreground text-sm rounded-lg focus:ring-ring focus:ring-2 block w-full p-2.5 placeholder:text-muted-foreground"
                                        placeholder="Ketik nama kriteria"
                                        required
                                        value={dataKriteria.name}
                                        onChange={(e) => changeHandler(e, i)}
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor={`bobot-${i}`}
                                        className="block mb-2 text-sm font-medium text-foreground"
                                    >
                                        Bobot
                                    </label>
                                    <input
                                        type="number"
                                        name="bobot"
                                        id={`bobot-${i}`}
                                        className="bg-input border border-input text-foreground text-sm rounded-lg focus:ring-ring focus:ring-2 block w-full p-2.5 placeholder:text-muted-foreground"
                                        placeholder={"0"}
                                        required
                                        onWheel={(e) => (e.target as HTMLElement).blur()}
                                        value={dataKriteria.bobot === 0 ? '' : dataKriteria.bobot}
                                        onChange={(e) => changeHandler(e, i)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`tipe-${i}`} className="block mb-2 text-sm font-medium text-foreground">Jenis Kriteria</label>
                                    <select
                                        value={perhitungan.kriteria[i].tipe}
                                        onChange={(e) => {
                                            let newPerhitungan = { ...perhitungan };
                                            let arrayBefore = [...newPerhitungan.kriteria];
                                            arrayBefore[i].tipe = e.target.value;
                                            newPerhitungan.kriteria = arrayBefore;
                                            handler(newPerhitungan);
                                        }}
                                        name='tipe'
                                        id={`tipe-${i}`}
                                        className="bg-input border border-input text-foreground text-sm rounded-lg focus:ring-ring focus:ring-2 block w-full p-2.5"
                                    >
                                        {typeOfKriteria.map((option) => (
                                            <option value={option.value} key={option.value}>{option.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </form>

            <div className="flex justify-center gap-2 mt-6">
                <button
                    type="button"
                    onClick={tambahKriteria}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                    + Tambah
                </button>
                <button
                    type="button"
                    onClick={kurangKriteria}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                >
                    - Hapus
                </button>
            </div>
        </div>
    );
}