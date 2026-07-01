"use client";
import React, { useState } from 'react';
import { Header } from '@/components/Header';

export default function HelpView() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqItems = [
        {
            question: "Bagaimana cara memulai perhitungan?",
            answer: "Untuk memulai perhitungan, Anda harus login terlebih dahulu. Setelah login, Anda dapat mengakses menu 'Input Data' dari dashboard atau header aplikasi."
        },
        {
            question: "Bagaimana cara mengisi data alternatif dan kriteria?",
            answer: "Pada halaman 'Input Data', Anda akan melewati 4 tahap pengisian form:\n• Tahap 1: Mengisi informasi dasar seperti nama perhitungan, jumlah kriteria, dan jumlah alternatif.\n• Tahap 2: Memasukkan nama untuk masing-masing alternatif.\n• Tahap 3: Menentukan nama kriteria, bobot kepentingan, dan tipe (Benefit/Cost).\n• Tahap 4: Memasukkan nilai performa setiap alternatif terhadap kriteria yang telah ditentukan.\n\nAnda juga dapat mengimpor data menggunakan file Excel dengan mengunduh template yang disediakan pada Tahap 1."
        },
        {
            question: "Dimana saya bisa melihat riwayat perhitungan saya?",
            answer: "Anda dapat melihat semua riwayat perhitungan Anda dengan mengunjungi halaman Profile (klik pada nama Anda di pojok kanan atas setelah login, lalu pilih Profile)."
        },
        {
            question: "Apa itu SPK-DSS?",
            answer: "SPK-DSS adalah Sistem Pendukung Keputusan yang menyediakan berbagai metode (MAUT, TOPSIS, SAW, WP, AHP) untuk membantu Anda mengevaluasi alternatif berdasarkan kriteria tertentu dan memberikan rekomendasi terbaik."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="mx-auto max-w-3xl px-6 py-12">
                <h1 className="text-3xl font-bold text-foreground mb-8 text-center">Bantuan</h1>
                <div className="space-y-3">
                    {faqItems.map((item, idx) => (
                        <div key={idx} className="rounded-lg border border-border bg-card overflow-hidden">
                            <button
                                onClick={() => toggleAccordion(idx)}
                                className={`w-full flex items-center justify-between p-4 text-left font-medium transition-colors ${
                                    openIndex === idx ? 'bg-accent' : 'hover:bg-accent/50'
                                }`}
                            >
                                <span className="text-foreground">{item.question}</span>
                                <svg 
                                    className={`w-5 h-5 text-muted-foreground transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {openIndex === idx && (
                                <div className="p-4 pt-0 border-t border-border">
                                    <p className="text-muted-foreground text-sm whitespace-pre-line">{item.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}