"use client";
import React, { ChangeEvent } from "react";
import { Perhitungan } from "@/types";

interface Input1Props {
    perhitungan: Perhitungan;
    handler: (perhitungan: Perhitungan) => void;
}

export default function Input1({ perhitungan, handler }: Input1Props) {
    const changeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let newPerhitungan = { ...perhitungan };
        if (e.target.name === "isPublic") {
            newPerhitungan.isPublic = (e.target as HTMLInputElement).checked;
        } else {
            (newPerhitungan as any)[e.target.name] = e.target.value;
        }
        handler(newPerhitungan);
    };

    const jumlahHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            let newPerhitungan = { ...perhitungan };
            let lengthOfArray = parseInt(e.target.value);
            if (e.target.name === 'kriteria') {
                let array = [...Array(lengthOfArray)].map(() => {
                    return { name: '', bobot: 0, tipe: "1" };
                });
                newPerhitungan.kriteria = array;
            } else if (e.target.name === 'alternatif') {
                let array = [...Array(lengthOfArray)].map(() => {
                    return { name: '', nilaiKriteria: [] };
                });
                newPerhitungan.alternatif = array;
            }
            handler(newPerhitungan);
        }
    };

    return (
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-8">
            <h2 className="mb-6 text-xl font-bold text-foreground">
                Tambahkan Perhitungan Baru
            </h2>
            <form action="#">
                <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                    <div className="sm:col-span-2">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-foreground">
                            Nama Perhitungan
                        </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="bg-input border border-input text-foreground text-sm rounded-lg focus:ring-ring focus:ring-2 block w-full p-2.5 placeholder:text-muted-foreground"
                            placeholder="Ketik nama perhitungan"
                            value={perhitungan.name}
                            onChange={changeHandler}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="kriteria" className="block mb-2 text-sm font-medium text-foreground">
                            Jumlah Kriteria
                        </label>
                        <input
                            type="number"
                            name="kriteria"
                            min={0}
                            id="kriteria"
                            className="bg-input border border-input text-foreground text-sm rounded-lg focus:ring-ring focus:ring-2 block w-full p-2.5 placeholder:text-muted-foreground"
                            placeholder={"0"}
                            onWheel={(e) => (e.target as HTMLElement).blur()}
                            value={perhitungan.kriteria.length || ''}
                            onChange={jumlahHandler}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="alternatif" className="block mb-2 text-sm font-medium text-foreground">
                            Jumlah Alternatif
                        </label>
                        <input
                            type="number"
                            name="alternatif"
                            min={0}
                            id="alternatif"
                            onWheel={(e) => (e.target as HTMLElement).blur()}
                            className="bg-input border border-input text-foreground text-sm rounded-lg focus:ring-ring focus:ring-2 block w-full p-2.5 placeholder:text-muted-foreground"
                            placeholder={"0"}
                            value={perhitungan.alternatif.length || ''}
                            onChange={jumlahHandler}
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="deskripsi" className="block mb-2 text-sm font-medium text-foreground">
                            Deskripsi
                        </label>
                        <textarea
                            name="deskripsi"
                            id="deskripsi"
                            rows={6}
                            className="block p-2.5 w-full text-sm text-foreground bg-input rounded-lg border border-input focus:ring-ring focus:ring-2 placeholder:text-muted-foreground"
                            placeholder="Ketik deskripsi perhitungan"
                            value={perhitungan.deskripsi}
                            onChange={changeHandler}
                        />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="isPublic"
                            id="isPublic"
                            className="w-4 h-4 text-primary bg-input border-input rounded focus:ring-ring focus:ring-2"
                            checked={perhitungan.isPublic}
                            onChange={changeHandler}
                        />
                        <label htmlFor="isPublic" className="text-sm font-medium text-foreground">
                            Jadikan Publik (Dapat dilihat oleh semua orang)
                        </label>
                    </div>
                </div>
            </form>
        </div>
    );
}