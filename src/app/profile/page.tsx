"use client";
import React, { useState, useEffect } from "react";
import { getDocs, collection, where, query } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { firestore } from "@/lib/firebase/config";
import { useAuth } from "@/context/AuthContext";
import LoadingDialog from "@/components/LoadingDialog";
import { Perhitungan } from "@/types";

export default function ProfileView() {
    const { user } = useAuth();
    const router = useRouter();
    const [listPerhitungan, setListPerhitungan] = useState<Perhitungan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getListPerhitungan = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }
            try {
                const q = query(collection(firestore, "perhitungan"), where("author", "==", user.uid));
                const docs = await getDocs(q);
                let perhitungans: Perhitungan[] = [];
                docs.forEach((doc) => {
                    let data = doc.data() as Perhitungan;
                    data.id = doc.id;
                    perhitungans.push(data);
                });
                setListPerhitungan(perhitungans);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user !== undefined) {
            getListPerhitungan();
        }
    }, [user]);

    const navigateToResult = (data: Perhitungan) => {
        sessionStorage.setItem('perhitungan_state', JSON.stringify(data));
        const algorithm = (data.method || 'maut').toLowerCase();
        router.push(`/${algorithm}/result`);
    };

    return (
        <React.Fragment>
            <LoadingDialog open={isLoading} handler={() => { }} />
            <Header />
            <div className="min-h-screen bg-background">
                <div className="px-6 py-16">
                    <div className="container mx-auto max-w-5xl">
                        <h1 className="text-3xl font-bold text-foreground mb-8">
                            Riwayat Perhitungan Anda
                        </h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {listPerhitungan.map((e, i) => (
                                <div
                                    key={i}
                                    className="p-6 rounded-xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
                                    onClick={() => navigateToResult(e)}
                                >
                                    <h2 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
                                        {e.name}
                                    </h2>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {e.deskripsi ? e.deskripsi.substring(0, 120) : ""}
                                    </p>
                                    <div>
                                        <span className="text-sm font-medium text-foreground hover:underline">
                                            {e.authorName}
                                        </span>
                                        <p className="text-xs text-muted-foreground">
                                            {e.createdAt && (e.createdAt as any).toDate
                                                ? new Intl.DateTimeFormat('id-ID', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: '2-digit',
                                                }).format((e.createdAt as any).toDate())
                                                : ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {!isLoading && listPerhitungan.length === 0 && (
                                <p className="text-muted-foreground col-span-full text-center py-8">
                                    Belum ada riwayat perhitungan.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}