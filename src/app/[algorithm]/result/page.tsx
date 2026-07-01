"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { Header } from "@/components/Header";
import CustomDialog, { DialogType } from "@/components/CustomDialog";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Perhitungan } from "@/types";
import DataAwal from "@/components/result/DataAwal";
import MinMax from "@/components/result/MinMax";
import Normalisasi from "@/components/result/Normalisasi";
import Pembobotan from "@/components/result/Pembobotan";
import Rank from "@/components/result/Rank";
import AlgorithmSteps from "@/components/result/AlgorithmSteps";

export default function Result() {
    const { user } = useAuth();
    const router = useRouter();
    const params = useParams();
    const algorithm = (params?.algorithm as string)?.toUpperCase() || 'MAUT';
    const [data, setData] = useState<Perhitungan | null>(null);
    const [selectedTab, setSelectedTab] = useState(0);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedData = sessionStorage.getItem('perhitungan_state');
        if (storedData) {
            try {
                setData(JSON.parse(storedData));
            } catch (error) {
                console.error("Failed to parse calculation data", error);
            }
        }
    }, []);

    const deleteHandler = async (dataToDelete: Perhitungan) => {
        if (!dataToDelete.id) return;
        setIsLoading(true);
        try {
            await deleteDoc(doc(firestore, "perhitungan", dataToDelete.id));
            setIsLoading(false);
            router.push("/");
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            alert("Data gagal dihapus");
        }
    };

    const editHandler = () => {
        if (data && data.id) {
            router.push(`/${algorithm.toLowerCase()}/input?edit=${data.id}`);
        } else {
            router.push(`/${algorithm.toLowerCase()}/input`);
        }
    };

    const getTabs = () => {
        let t = ['Data Awal'];
        if (algorithm === 'MAUT') t.push('Min Max', 'Normalisasi', 'Pembobotan');
        if (algorithm === 'SAW') t.push('Min Max', 'Normalisasi', 'Pembobotan');
        if (algorithm === 'TOPSIS') t.push('Normalisasi', 'Pembobotan', 'Solusi Ideal', 'Jarak (D+/D-)');
        if (algorithm === 'WP') t.push('Vektor S', 'Vektor V');
        if (algorithm === 'AHP') t.push('Matriks Berpasangan');
        t.push('Hasil');
        return t;
    };
    const tabs = getTabs();

    return (
        <div className="min-h-screen bg-background">
            <CustomDialog
                open={isDeleteDialogOpen}
                type={DialogType.WARNING}
                handler={() => setIsDeleteDialogOpen(false)}
                okHandler={() => {
                    setIsDeleteDialogOpen(false);
                    if (data) {
                        deleteHandler(data);
                    }
                }}
                title="Hapus Data"
                content="Apakah anda yakin ingin menghapus data ini?"
            />

            <Header />

            <div className="px-6 py-8 max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold text-foreground truncate">
                            {data?.name ? `Hasil Perhitungan: ${data.name}` : 'Hasil Perhitungan'}
                        </h1>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {data && user && data.author === user.uid && (
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                        >
                            Hapus
                        </button>
                    )}
                    {data && user && data.author === user.uid && (
                        <button
                            type="button"
                            onClick={editHandler}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                        >
                            Edit
                        </button>
                    )}
                    <Link
                        href={`/${algorithm.toLowerCase()}/input`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        Input Data Baru
                    </Link>
                </div>

                {/* Tabs - mobile select */}
                <div className="mb-6 sm:hidden">
                    <label htmlFor="tabs" className="sr-only">Select a tab</label>
                    <select
                        id="tabs"
                        name="tabs"
                        onChange={(e) => setSelectedTab(e.target.selectedIndex)}
                        className="bg-input border border-input text-foreground text-sm rounded-lg block w-full p-2.5"
                    >
                        {tabs.map((tab, idx) => (
                            <option key={idx} value={idx}>{tab}</option>
                        ))}
                    </select>
                </div>

                {/* Tabs - desktop */}
                <ul className="hidden sm:flex flex-wrap -mb-px text-sm font-medium text-center mb-6">
                    {tabs.map((tab, idx) => (
                        <li key={idx} className="me-2">
                            <button
                                type="button"
                                onClick={() => setSelectedTab(idx)}
                                className={
                                    selectedTab === idx
                                        ? "inline-flex items-center px-4 py-3 border-b-2 border-primary text-primary rounded-t-lg"
                                        : "inline-flex items-center px-4 py-3 border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                }
                            >
                                {tab}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Tab content */}
                <div className="rounded-xl border border-border bg-card shadow-sm">
                    <div className="p-4 sm:p-6">
                        {selectedTab === 0 && <DataAwal data={data} />}

                        {algorithm === 'MAUT' && selectedTab === 1 && <MinMax data={data} />}
                        {algorithm === 'MAUT' && selectedTab === 2 && <Normalisasi data={data} />}
                        {algorithm === 'MAUT' && selectedTab === 3 && <Pembobotan data={data} />}

                        {algorithm !== 'MAUT' && selectedTab > 0 && selectedTab < tabs.length - 1 && (
                            <AlgorithmSteps data={data} algorithm={algorithm} stepKey={tabs[selectedTab]} />
                        )}

                        {selectedTab === tabs.length - 1 && <Rank data={data} />}
                    </div>
                </div>
            </div>
        </div>
    );
}