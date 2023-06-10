import React, { Component, useEffect, useState } from 'react';
import Input2 from './input2';
import Input3 from './input3';
import Input4 from './input4';
import Input1 from './input1';
import CustomDialog from '../components/Dialog';
import DialogType from '../enum/DialogType';
import MAUT from '../perhitungan/MAUT';
import { read, utils } from 'xlsx';
import LoadingDialog from '../components/LoadingDialog';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { addDoc, collection, getDoc, doc, setDoc } from '@firebase/firestore';
import { firestore } from "../../firebase/firebase_config"
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebase_config';
import { Header } from '../components/Header';

const menuInputList = [
    <Input1 />,
    <Input2 />,
    <Input3 />,
    <Input4 />
];


function NavigateToResult(props) {
    const navigate = useNavigate();
    React.useEffect(() => {
        navigate('/result', { state: { perhitungan: props.perhitungan } });
    }, []);
}

export function Input(props) {
    const location = useLocation();
    const [data, setData] = useState();

    useEffect(() => {
        if (location.state) {
            setData(location.state.perhitungan);
            console.log('location', location.state.perhitungan);
        }
    }, [location]);

    return (
        <InputView user={props.user} dataPassed={location.state !== null ? location.state.perhitungan : undefined} isEdit={location.state !== null ? true : false} />
    )
}

class InputView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedMenu: 0,
            perhitungan: this.props.dataPassed !== undefined ? props.dataPassed : {
                name: '',
                kriteria: [],
                alternatif: [],
                deskripsi: '',
            },
            isDialogOpen: false,
            errorWarning: false,
            excelFile: null,
            dataAlternatif: [],
            dataKriteria: [],
            isLoading: false,
            isFinish: false,
            user: null,
            isEdit: this.props.isEdit,
        };
    }

    componentDidMount() {
        // if (this.props.dataPassed !== undefined) {
        //     this.setState({
        //         perhitungan: this.props.dataPassed,
        //         user: this.props.user,
        //     })
        // } else {
        //     this.setState({
        //         perhitungan: {
        //             name: '',
        //             kriteria: [],
        //             alternatif: [],
        //             deskripsi: '',
        //         },
        //         user: this.props.user,
        //     }) 
        // }

    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                perhitungan: {
                    name: '',
                    kriteria: [],
                    alternatif: [],
                    deskripsi: '',
                },
                user: this.props.user,
            })
        }
    }

    changeMenuHandler = async (isNext) => {
        const { perhitungan, selectedMenu } = this.state;
        if (isNext) {
            if (selectedMenu === 0) {
                if (!(this.state.excelFile !== null)) {
                    if (perhitungan.name === '' || perhitungan.kriteria.length === 0 || perhitungan.alternatif.length === 0) {
                        this.setState({ errorWarning: true });
                        return;
                    }
                }
            }
            else if (selectedMenu === 1) {
                for (let index = 0; index < perhitungan.alternatif.length; index++) {
                    const element = perhitungan.alternatif[index];
                    if (element.name.length === 0) {
                        this.setState({ errorWarning: true });
                        return;
                    }
                }
            }
            else if (selectedMenu === 2) {
                for (let index = 0; index < perhitungan.kriteria.length; index++) {
                    const element = perhitungan.kriteria[index];
                    if (element.name.length === 0 || element.bobot === 0) {
                        this.setState({ errorWarning: true });
                        return;
                    }
                }
                if (!(this.state.excelFile !== null) && this.state.isEdit === false) {
                    this.setState({
                        perhitungan: {
                            ...perhitungan,
                            alternatif: [
                                ...perhitungan.alternatif.map((e, i) => {
                                    return {
                                        ...e,
                                        nilaiKriteria: [...Array(perhitungan.kriteria.length)].map((e, i) => {
                                            return 0;
                                        })
                                    }
                                })
                            ]
                        }
                    })
                }
            }
            this.setState({
                selectedMenu: selectedMenu + 1,
                errorWarning: false,

            });
        } else {
            if (selectedMenu === 3) {
                this.setState({
                    isDialogOpen: true,
                });
                return;
            }
            this.setState({ selectedMenu: selectedMenu - 1, errorWarning: false, });
        }
    }

    perhitunganHandler = (perhitungan) => {
        this.setState({ perhitungan });
    }

    perhitunganAlternatifHandler = (alternatif) => {
        this.setState({ alternatif });
    }

    perhitunganKriteriaHandler = (kriteria) => {
        this.setState({ kriteria });
    }

    hitungHandler = (perhitungan) => {
        this.setState({ isLoading: true });
        let maut = new MAUT(perhitungan);
        let data = maut.rankThisShit();
        console.log('data', data);
        let perhitunganBaru = { ...perhitungan };
        perhitunganBaru.rank = data;
        perhitunganBaru.createdAt = new Date();
        perhitunganBaru.author = this.props.user.uid;
        perhitunganBaru.authorName = this.props.user.displayName;
        if (this.state.isEdit) {
            perhitunganBaru.id = this.props.dataPassed.id;
            setDoc(doc(firestore, "perhitungan", this.props.dataPassed.id), perhitunganBaru).then(() => {
                this.setState({ perhitungan: perhitunganBaru, isFinish: true, isLoading: false });
            }).catch((error) => {
                console.error("Error adding document: ", error);
                this.setState({ isLoading: false });
            });
        } else {
            addDoc(collection(firestore, "perhitungan"), perhitunganBaru).then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                perhitunganBaru.id = docRef.id;
                this.setState({ perhitungan: perhitunganBaru, isFinish: true, isLoading: false });
            }).catch((error) => {
                console.error("Error adding document: ", error);
                this.setState({ isLoading: false });
            });
        }

    }

    importExcelHandler = () => {
        this.setState({ isLoading: true });
        const file = this.state.excelFile;
        const reader = new FileReader();
        let dataAlternatifMentah = [];
        let dataKriteriaMentah = [];
        let dataTabelAwal = [];
        let metadata = [];
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = read(bstr, { type: 'binary' });

            const wsMetaDataName = wb.SheetNames[0];
            const wsMetaData = wb.Sheets[wsMetaDataName];
            metadata = utils.sheet_to_json(wsMetaData, { header: 1 });

            const wsAlternatifName = wb.SheetNames[1];
            const wsAlternatif = wb.Sheets[wsAlternatifName];
            dataAlternatifMentah = utils.sheet_to_json(wsAlternatif, { header: 1 });
            const lenghtOfAlternatif = dataAlternatifMentah.length;
            const wsKriteriaName = wb.SheetNames[2];
            const wsKriteria = wb.Sheets[wsKriteriaName];
            dataKriteriaMentah = utils.sheet_to_json(wsKriteria, { header: 1 });
            const lenghtOfKriteria = dataKriteriaMentah.length;

            const wsTabelAwalName = wb.SheetNames[3];
            const wsTabelAwal = wb.Sheets[wsTabelAwalName];
            dataTabelAwal = utils.sheet_to_json(wsTabelAwal, { header: 1 });

            let dataAlternatif = [];
            let dataKriteria = [];
            for (let index = 1; index < lenghtOfAlternatif; index++) {
                const element = dataAlternatifMentah[index];
                dataAlternatif.push({
                    name: element[0],
                    nilaiKriteria: [...Array(lenghtOfKriteria - 1)].map((e, i) => {
                        return 0;
                    })
                })
            }
            for (let index = 1; index < lenghtOfKriteria; index++) {
                const element = dataKriteriaMentah[index];
                dataKriteria.push({
                    name: element[0],
                    bobot: element[1],
                    tipe: element[2],
                })
            }

            // input nilai kriteria dari tabel awal
            for (let index = 1; index < lenghtOfAlternatif; index++) {
                const element = dataTabelAwal[index];
                for (let index2 = 1; index2 < lenghtOfKriteria; index2++) {
                    const element2 = element[index2];
                    dataAlternatif[index - 1].nilaiKriteria[index2 - 1] = element2;
                }
            }

            this.setState({
                perhitungan: {
                    name: metadata[1][0],
                    kriteria: dataKriteria,
                    alternatif: dataAlternatif,
                    deskripsi: metadata[1][1],
                }
            })
        };
        reader.readAsBinaryString(file);

        this.setState({ isLoading: false });
    }

    render() {
        const { selectedMenu, perhitungan } = this.state;

        return (
            <div className="w-full flex flex-col items-center">

                {
                    (() => {
                        if (this.props.user !== null) {
                            return <Header user={this.props.user} auth={auth} />
                        }
                    })()
                }
                {
                    (() => {
                        if (this.state.isFinish) {
                            return <NavigateToResult perhitungan={perhitungan} />

                        }
                    })()
                }
                <LoadingDialog open={this.state.isLoading} handler={() => { }} />
                <CustomDialog
                    open={this.state.errorWarning}
                    type={DialogType.WARNING}
                    name="errorWarning"
                    handler={() => this.setState({ errorWarning: false })}
                    okHandler={() => this.setState({ errorWarning: false })}
                    title="Peringatan"
                    content="Silakan isi data-data yang dibutuhkan untuk melakukan perhitungan MAUT." />

                <CustomDialog
                    open={this.state.isDialogOpen}
                    type={DialogType.WARNING}
                    name="isDialogOpen"
                    handler={() => this.setState({ isDialogOpen: false })}
                    okHandler={() => {
                        this.setState({ isDialogOpen: false, selectedMenu: this.state.selectedMenu - 1 });
                    }}
                    title="Peringatan"
                    content="Jika Anda kembali ke menu sebelumnya, data yang telah diinputkan akan hilang. Apakah anda yakin?" />

                <div className="relative isolate px-6 pt-14 lg:px-8">
                    <div
                        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <Link
                        to={'..'}
                    >
                        <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-white"
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
                    {
                        (() => {
                            if (selectedMenu === 0) {
                                return (
                                    <Input1
                                        perhitungan={perhitungan}
                                        handler={this.perhitunganHandler}
                                    />
                                );
                            } else if (selectedMenu === 1) {
                                return (
                                    <Input2
                                        perhitungan={perhitungan}
                                        handler={this.perhitunganHandler}
                                    />
                                );
                            } else if (selectedMenu === 2) {
                                return (
                                    <Input3
                                        perhitungan={perhitungan}
                                        handler={this.perhitunganHandler} />
                                );
                            } else if (selectedMenu === 3) {
                                return <Input4 perhitungan={perhitungan} handler={this.perhitunganHandler} />;
                            }
                        })()
                    }
                    {/* import excel */}
                    {
                        (
                            () => {
                                if (selectedMenu === 0) {
                                    return (
                                        <React.Fragment>
                                            <div className="flex justify-center items-center space-x-2 mx-4 mb-4">
                                                <div>
                                                    <input className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                                        id="file-input" type="file"
                                                        onChange={(e) => this.setState({ excelFile: e.target.files[0] })} />
                                                </div>
                                                <button className='bg-green-500 hover:bg-green-700 text-white font-bold px-4 py-2 rounded'
                                                    onClick={() => {
                                                        if (this.state.excelFile !== null) {
                                                            this.importExcelHandler();
                                                            document.getElementById('file-input').value = '';
                                                            this.setState({});
                                                        }
                                                    }}>Import Excel</button>
                                            </div>
                                            <a href="https://docs.google.com/spreadsheets/d/1d7cJZG4fGoSP2ZAA6pOhn1QY51xjLLJoquN7FkeTWi4/edit?usp=sharing"
                                                className="mx-4 block text-center text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"
                                                target="_blank"
                                                rel="noreferrer">
                                                Download Template Excel
                                            </a>
                                        </React.Fragment>
                                    );
                                }
                            }
                        )()
                    }



                    <div className="flex justify-center space-x-2">
                        <button
                            type="submit"
                            disabled={selectedMenu === 0}
                            onClick={() => this.changeMenuHandler(false)}
                            className={
                                selectedMenu === 0
                                    ? "inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-gray-300 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-gray-400"
                                    : "inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                            }
                        >
                            Sebelumnya
                        </button>

                        <button
                            type="submit"
                            onClick={
                                selectedMenu === menuInputList.length - 1 ?
                                    () => this.hitungHandler(perhitungan) :
                                    () => this.changeMenuHandler(true)
                            }
                            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                        >
                            {
                                selectedMenu === menuInputList.length - 1 ?
                                    "Hitung" :
                                    "Selanjutnya"
                            }
                        </button>
                    </div>

                    {/* button checker state */}
                    {/* center  */}
                    {/* <div className="flex justify-center space-x-2">
                        <button onClick={() => console.log(this.state.perhitungan)}>Check State</button>
                        <button onClick={this.dialogToggleHandler}>Show Dialog</button>
                    </div> */}
                    <div
                        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Input
