"use client";
import React from 'react';
import NextImage from 'next/image';
import { ServerIcon, RocketLaunchIcon, LockClosedIcon } from '@heroicons/react/20/solid';
import { Header } from '@/components/Header';

export default function AboutView() {
    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="mx-auto max-w-5xl px-6 py-16">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">Putuskan Lebih Cerdas</p>
                    <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
                        Pendekatan yang lebih matang dalam mengambil keputusan
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        SPK-DSS merupakan sistem pendukung keputusan yang mengubah proses pertimbangan yang kompleks menjadi analisis yang terstruktur, objektif, dan mudah dipahami.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <RocketLaunchIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Proses yang Efisien</h3>
                        <p className="text-muted-foreground text-sm">
                            Algoritma-algoritma yang menyederhanakan perhitungan berlapis menjadi hasil yang siap digunakan dalam hitungan detik.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <LockClosedIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Penilaian yang Objektif</h3>
                        <p className="text-muted-foreground text-sm">
                            Setiap alternatif dievaluasi berdasarkan bobot kriteria yang telah ditentukan, sehingga hasil keputusan bebas dari bias subjektif.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl border border-border bg-card shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                            <ServerIcon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">Data yang Terjaga</h3>
                        <p className="text-muted-foreground text-sm">
                            Seluruh riwayat perhitungan tersimpan aman di cloud dan dapat diakses kapan pun, dari perangkat mana pun.
                        </p>
                    </div>
                </div>

                <div className="mt-16 text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Tentang SPK-DSS</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        Sistem Pendukung Keputusan (SPK) ini menyediakan berbagai metode pengambilan keputusan yang dirancang untuk mengevaluasi berbagai alternatif secara komprehensif berdasarkan sejumlah atribut atau kriteria yang saling berkaitan. Aplikasi ini mengimplementasikan metode populer seperti MAUT, TOPSIS, SAW, WP, dan AHP.
                    </p>
                    <div className="mt-8 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-sm font-medium text-primary">
                            &quot;Membantu Anda membuat keputusan yang lebih terukur, objektif, dan dapat dipertanggungjawabkan.&quot;
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4 italic">
                        &ldquo;Keputusan terbaik lahir dari data yang tepat dan metode yang tepercaya.&rdquo;
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <NextImage
                            className="h-10 w-10 rounded-full border-2 border-primary"
                            src="https://avatars.githubusercontent.com/u/42328348?s=400&v=4"
                            width={40}
                            height={40}
                            alt="Akhmad Ramadani"
                            unoptimized
                        />
                        <div>
                            <div className="text-sm font-semibold text-foreground">Akhmad Ramadani</div>
                            <div className="text-xs text-muted-foreground">Pencipta</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}