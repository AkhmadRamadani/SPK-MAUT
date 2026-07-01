"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { firestore } from "@/lib/firebase/config";
import { Header } from "@/components/Header";
import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { query, collection, where, orderBy, limit, startAfter, getDocs, DocumentSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/context/AuthContext";
import { Perhitungan } from "@/types";

const PAGE_SIZE = 9;

export default function Dashboard() {
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [listPerhitungan, setListPerhitungan] = useState<Perhitungan[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [selectedMethod, setSelectedMethod] = useState("maut");
    const lastDocRef = useRef<DocumentSnapshot | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const observerRef = useRef<IntersectionObserver | null>(null);

    const fetchPerhitungan = useCallback(async (loadMore = false) => {
        if (isLoading || (!loadMore && !hasMore)) return;

        setIsLoading(true);
        try {
            let q;
            if (loadMore && lastDocRef.current) {
                q = query(
                    collection(firestore, "perhitungan"),
                    where("isPublic", "==", true),
                    orderBy("createdAt", "desc"),
                    startAfter(lastDocRef.current),
                    limit(PAGE_SIZE)
                );
            } else if (!loadMore) {
                q = query(
                    collection(firestore, "perhitungan"),
                    where("isPublic", "==", true),
                    orderBy("createdAt", "desc"),
                    limit(PAGE_SIZE)
                );
            } else {
                setIsLoading(false);
                return;
            }

            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                if (!loadMore) setHasMore(false);
                setIsLoading(false);
                return;
            }

            const newItems: Perhitungan[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data() as Omit<Perhitungan, 'id'>;
                newItems.push({ ...data, id: doc.id });
            });

            // Update last document for next pagination
            lastDocRef.current = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

            if (loadMore) {
                setListPerhitungan(prev => [...prev, ...newItems]);
            } else {
                setListPerhitungan(newItems);
            }

            // If we got fewer than PAGE_SIZE, no more data
            if (querySnapshot.docs.length < PAGE_SIZE) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Error fetching documents: ", error);
        } finally {
            setIsLoading(false);
            setIsInitialLoading(false);
        }
    }, [isLoading, hasMore]);

    // Initial load
    useEffect(() => {
        fetchPerhitungan(false);
    }, [fetchPerhitungan]);

    // Intersection observer for infinite scroll
    useEffect(() => {
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    fetchPerhitungan(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sentinelRef.current) {
            observerRef.current.observe(sentinelRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [hasMore, isLoading, fetchPerhitungan]);

    return (
        <>
            <Header />
            <div className="relative min-h-screen flex flex-col">
                {/* Hero Section */}
                <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-16">
                    <div className="w-full max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4">
                            Sistem Pendukung Keputusan
                        </h1>
                        <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                            Sistem Pendukung Keputusan Pemilihan Alternatif
                            Terbaik Menggunakan Berbagai Metode (MAUT, TOPSIS, SAW, WP, AHP)
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="relative">
                                <select
                                    className="px-4 py-3 pr-10 rounded-lg border border-input bg-input text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                                    value={selectedMethod}
                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                >
                                    <option value="maut" className="bg-background">MAUT</option>
                                    <option value="topsis" className="bg-background">TOPSIS</option>
                                    <option value="saw" className="bg-background">SAW</option>
                                    <option value="wp" className="bg-background">WP</option>
                                    <option value="ahp" className="bg-background">AHP</option>
                                </select>
                                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                            </div>
                            <button
                                onClick={(e) => {
                                    if (!user) {
                                        e.preventDefault();
                                        signInWithGoogle();
                                    } else {
                                        router.push(`/${selectedMethod}/input`);
                                    }
                                }}
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-primary-foreground rounded-lg bg-primary hover:bg-primary/90 transition-colors"
                            >
                                Hitung
                            </button>

                            <Link
                                href="/about"
                                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-foreground rounded-lg border border-input bg-background hover:bg-accent transition-colors"
                            >
                                Tentang
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Calculations */}
                <section className="border-t border-border bg-muted/30">
                    <div className="container px-6 py-12 mx-auto">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-semibold text-foreground">
                                Perhitungan Publik Terbaru
                            </h2>
                            <span className="text-sm text-muted-foreground">
                                {listPerhitungan.length > 0 && `${listPerhitungan.length}${!hasMore ? '' : '+'} item`}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {listPerhitungan.map((e, i) => (
                                <div
                                    key={e.id || i}
                                    className="p-6 rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md hover:border-primary/50 transition-all cursor-pointer"
                                    onClick={() => {
                                        sessionStorage.setItem('perhitungan_state', JSON.stringify(e));
                                        router.push(`/${(e.method || 'maut').toLowerCase()}/result`);
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-semibold line-clamp-1">
                                            {e.name}
                                        </h3>
                                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded">
                                            {e.method || 'MAUT'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                        {e.deskripsi ? e.deskripsi.substring(0, 120) : ""}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-sm font-medium text-foreground">
                                                {e.authorName}
                                            </span>
                                            <p className="text-xs text-muted-foreground">
                                                {e.createdAt && e.createdAt.toDate ? new Intl.DateTimeFormat('id-ID', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: '2-digit'
                                                }).format(e.createdAt.toDate()) : ""}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Loading skeletons */}
                            {isLoading && Array.from({ length: 3 }).map((_, i) => (
                                <div key={`skeleton-${i}`} className="p-6 rounded-xl border border-border bg-card shadow-sm animate-pulse">
                                    <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                                    <div className="h-4 bg-muted rounded w-full mb-2" />
                                    <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                                    <div className="flex items-center justify-between">
                                        <div className="h-4 bg-muted rounded w-1/3" />
                                        <div className="h-3 bg-muted rounded w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty state */}
                        {listPerhitungan.length === 0 && !isLoading && !isInitialLoading && (
                            <p className="text-muted-foreground text-center py-12">
                                Belum ada perhitungan publik.
                            </p>
                        )}

                        {/* Initial loading */}
                        {isInitialLoading && (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={`init-skeleton-${i}`} className="p-6 rounded-xl border border-border bg-card shadow-sm animate-pulse">
                                        <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                                        <div className="h-4 bg-muted rounded w-full mb-2" />
                                        <div className="h-4 bg-muted rounded w-2/3 mb-4" />
                                        <div className="flex items-center justify-between">
                                            <div className="h-4 bg-muted rounded w-1/3" />
                                            <div className="h-3 bg-muted rounded w-1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sentinel for infinite scroll */}
                        <div ref={sentinelRef} className="h-4" />

                        {/* No more items */}
                        {!hasMore && listPerhitungan.length > 0 && (
                            <p className="text-muted-foreground text-center text-sm py-8">
                                Semua item telah dimuat
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}