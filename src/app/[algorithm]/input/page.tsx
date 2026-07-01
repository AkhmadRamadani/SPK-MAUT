"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { Header } from '@/components/Header';
import Input1 from '@/components/Input1';
import Input2 from '@/components/Input2';
import Input3 from '@/components/Input3';
import Input4 from '@/components/Input4';
import CustomDialog, { DialogType } from '@/components/CustomDialog';
import MAUT from '@/lib/maut/MAUT';
import { read, utils } from 'xlsx';
import LoadingDialog from '@/components/LoadingDialog';
import Link from 'next/link';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase/config';
import { useAuth } from '@/context/AuthContext';
import { Perhitungan } from '@/types';

const menuInputList = [
    Input1,
    Input2,
    Input3,
    Input4
];

function InputPageContent() {
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    const algorithm = (params?.algorithm as string)?.toUpperCase();
    const editId = searchParams.get('edit');

    const [selectedMenu, setSelectedMenu] = useState(0);
    const [perhitungan, setPerhitungan] = useState<Perhitungan>({
        name: '',
        kriteria: [],
        alternatif: [],
        deskripsi: '',
        isPublic: true,
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [errorWarning, setErrorWarning] = useState(false);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        const loadEditData = () => {
            const dataStr = sessionStorage.getItem('perhitungan_state');
            if (dataStr) {
                try {
                    const data = JSON.parse(dataStr);
                    if (data && editId && data.id === editId) {
                        setPerhitungan(data);
                        setIsEdit(true);
                    }
                } catch (e) {
                    console.error("Failed to parse stored data", e);
                }
            }
        };
        loadEditData();
    }, [editId]);

    const changeMenuHandler = (isNext: boolean) => {
        if (isNext) {
            if (selectedMenu === 0) {
                if (!excelFile) {
                    if (perhitungan.name === '' || perhitungan.kriteria.length === 0 || perhitungan.alternatif.length === 0) {
                        setErrorWarning(true);
                        return;
                    }
                }
            }
            else if (selectedMenu === 1) {
                for (let index = 0; index < perhitungan.alternatif.length; index++) {
                    const element = perhitungan.alternatif[index];
                    if (element.name.length === 0) {
                        setErrorWarning(true);
                        return;
                    }
                }
            }
            else if (selectedMenu === 2) {
                for (let index = 0; index < perhitungan.kriteria.length; index++) {
                    const element = perhitungan.kriteria[index];
                    if (element.name.length === 0 || element.bobot === 0) {
                        setErrorWarning(true);
                        return;
                    }
                }
                if (!excelFile && !isEdit) {
                    setPerhitungan({
                        ...perhitungan,
                        alternatif: perhitungan.alternatif.map((e) => {
                            return {
                                ...e,
                                nilaiKriteria: Array(perhitungan.kriteria.length).fill(0)
                            };
                        })
                    });
                }
            }
            setSelectedMenu(prev => prev + 1);
            setErrorWarning(false);
        } else {
            if (selectedMenu === 3) {
                setIsDialogOpen(true);
                return;
            }
            setSelectedMenu(prev => prev - 1);
            setErrorWarning(false);
        }
    };

    const hitungHandler = async (data: Perhitungan) => {
        if (!user) {
            alert("Anda harus login terlebih dahulu untuk melakukan perhitungan.");
            router.push('/login');
            return;
        }
        setIsLoading(true);
        try {
            let rankData;
            let stepsData;
            if (algorithm === 'MAUT') {
                let maut = new MAUT(data);
                rankData = maut.rankThisShit();
            } else if (['SAW', 'TOPSIS', 'WP', 'AHP'].includes(algorithm)) {
                const { createDSS } = await import('@/lib/algorithms');
                const dssResult = createDSS(algorithm as any, data as any).rankThisShit();
                rankData = dssResult.ranking;
                stepsData = dssResult.steps;
            } else {
                throw new Error("Algorithm not supported yet");
            }
            
            let perhitunganBaru = { ...data };
            perhitunganBaru.rank = rankData;
            if (stepsData) {
                perhitunganBaru.steps = JSON.stringify(stepsData);
            }
            perhitunganBaru.method = algorithm;
            perhitunganBaru.createdAt = new Date();
            perhitunganBaru.author = user.uid;
            perhitunganBaru.authorName = user.displayName || user.email || 'Anonymous';

            if (isEdit && data.id) {
                perhitunganBaru.id = data.id;
                await setDoc(doc(firestore, "perhitungan", data.id), perhitunganBaru);
            } else {
                const docRef = await addDoc(collection(firestore, "perhitungan"), perhitunganBaru);
                perhitunganBaru.id = docRef.id;
            }
            sessionStorage.setItem('perhitungan_state', JSON.stringify(perhitunganBaru));
            router.push(`/${algorithm.toLowerCase()}/result`);
        } catch (error) {
            console.error("Error adding document: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    const importExcelHandler = () => {
        if (!excelFile) return;
        setIsLoading(true);
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target?.result;
            const wb = read(bstr, { type: 'binary' });

            const wsMetaDataName = wb.SheetNames[0];
            const wsMetaData = wb.Sheets[wsMetaDataName];
            const metadata: any[][] = utils.sheet_to_json(wsMetaData, { header: 1 });

            const wsAlternatifName = wb.SheetNames[1];
            const wsAlternatif = wb.Sheets[wsAlternatifName];
            const dataAlternatifMentah: any[][] = utils.sheet_to_json(wsAlternatif, { header: 1 });
            const lenghtOfAlternatif = dataAlternatifMentah.length;

            const wsKriteriaName = wb.SheetNames[2];
            const wsKriteria = wb.Sheets[wsKriteriaName];
            const dataKriteriaMentah: any[][] = utils.sheet_to_json(wsKriteria, { header: 1 });
            const lenghtOfKriteria = dataKriteriaMentah.length;

            const wsTabelAwalName = wb.SheetNames[3];
            const wsTabelAwal = wb.Sheets[wsTabelAwalName];
            const dataTabelAwal: any[][] = utils.sheet_to_json(wsTabelAwal, { header: 1 });

            let dataAlternatif = [];
            let dataKriteria = [];

            for (let index = 1; index < lenghtOfAlternatif; index++) {
                const element = dataAlternatifMentah[index];
                dataAlternatif.push({
                    name: element[0],
                    nilaiKriteria: Array(lenghtOfKriteria - 1).fill(0)
                });
            }

            for (let index = 1; index < lenghtOfKriteria; index++) {
                const element = dataKriteriaMentah[index];
                dataKriteria.push({
                    name: element[0],
                    bobot: element[1],
                    tipe: element[2],
                });
            }

            for (let index = 1; index < lenghtOfAlternatif; index++) {
                const element = dataTabelAwal[index];
                for (let index2 = 1; index2 < lenghtOfKriteria; index2++) {
                    const element2 = element[index2];
                    if (dataAlternatif[index - 1]) {
                        dataAlternatif[index - 1].nilaiKriteria[index2 - 1] = element2;
                    }
                }
            }

            setPerhitungan({
                name: metadata[1]?.[0] || '',
                kriteria: dataKriteria,
                alternatif: dataAlternatif,
                deskripsi: metadata[1]?.[1] || '',
                isPublic: true
            });
            setIsLoading(false);
        };
        reader.readAsBinaryString(excelFile);
    };

    return (
        <div className="w-full min-h-screen flex flex-col bg-background">
            <Header />

            <LoadingDialog open={isLoading} handler={() => { }} />
            <CustomDialog
                open={errorWarning}
                type={DialogType.WARNING}
                handler={() => setErrorWarning(false)}
                okHandler={() => setErrorWarning(false)}
                title="Peringatan"
                content="Silakan isi data-data yang dibutuhkan untuk melakukan perhitungan."
            />

            <CustomDialog
                open={isDialogOpen}
                type={DialogType.WARNING}
                handler={() => setIsDialogOpen(false)}
                okHandler={() => {
                    setIsDialogOpen(false);
                    setSelectedMenu(selectedMenu - 1);
                }}
                title="Peringatan"
                content="Jika Anda kembali ke menu sebelumnya, data yang telah diinputkan akan hilang. Apakah anda yakin?"
            />

            <div className="relative px-6 pt-8 pb-16 w-full max-w-5xl mx-auto">
                {/* Breadcrumb back */}
                <div className="flex w-full items-start mb-6">
                    <Link href="/">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg border border-border bg-card shadow-sm cursor-pointer hover:bg-accent transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5 text-foreground"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </div>
                    </Link>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
                    {['Info Dasar', 'Alternatif', 'Kriteria', 'Nilai'].map((label, idx) => (
                        <div key={idx} className="flex items-center gap-2 flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                                selectedMenu === idx
                                    ? 'bg-primary text-primary-foreground'
                                    : selectedMenu > idx
                                    ? 'bg-primary/60 text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                            }`}>
                                {idx + 1}
                            </div>
                            <span className={`text-sm font-medium ${selectedMenu === idx ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {label}
                            </span>
                            {idx < 3 && (
                                <div className={`w-8 h-px ${selectedMenu > idx ? 'bg-primary/60' : 'bg-border'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-full">
                    {selectedMenu === 0 && <Input1 perhitungan={perhitungan} handler={setPerhitungan} />}
                    {selectedMenu === 1 && <Input2 perhitungan={perhitungan} handler={setPerhitungan} />}
                    {selectedMenu === 2 && <Input3 perhitungan={perhitungan} handler={setPerhitungan} />}
                    {selectedMenu === 3 && <Input4 perhitungan={perhitungan} handler={setPerhitungan} />}
                </div>

                {selectedMenu === 0 && (
                    <React.Fragment>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 my-6 max-w-2xl mx-auto">
                            <div className="w-full">
                                <input
                                    className="block w-full text-sm text-foreground border border-input rounded-lg cursor-pointer bg-input file:hidden file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                                    id="file-input"
                                    type="file"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setExcelFile(e.target.files[0]);
                                        }
                                    }}
                                />
                            </div>
                            <button
                                className='px-4 py-2 text-sm font-semibold text-primary-foreground rounded-lg bg-primary hover:bg-primary/90 transition-colors whitespace-nowrap'
                                onClick={() => {
                                    if (excelFile) {
                                        importExcelHandler();
                                        (document.getElementById('file-input') as HTMLInputElement).value = '';
                                    }
                                }}
                            >
                                Import Excel
                            </button>
                        </div>
                        <a
                            href="https://docs.google.com/spreadsheets/d/1d7cJZG4fGoSP2ZAA6pOhn1QY51xjLLJoquN7FkeTWi4/edit?usp=sharing"
                            className="mx-auto block w-fit text-center text-sm px-4 py-2 text-foreground rounded-lg border border-border bg-card hover:bg-accent transition-colors"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Download Template Excel
                        </a>
                    </React.Fragment>
                )}

                <div className="flex justify-center gap-3 pb-16">
                    <button
                        type="button"
                        disabled={selectedMenu === 0}
                        onClick={() => changeMenuHandler(false)}
                        className={
                            selectedMenu === 0
                                ? "inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-muted text-muted-foreground cursor-not-allowed"
                                : "inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                        }
                    >
                        Sebelumnya
                    </button>

                    <button
                        type="button"
                        onClick={
                            selectedMenu === menuInputList.length - 1
                                ? () => hitungHandler(perhitungan)
                                : () => changeMenuHandler(true)
                        }
                        className="inline-flex items-center px-5 py-2.5 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                        {selectedMenu === menuInputList.length - 1 ? "Hitung" : "Selanjutnya"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function InputPage() {
    return (
        <Suspense fallback={<LoadingDialog open={true} handler={() => {}} />}>
            <InputPageContent />
        </Suspense>
    );
}