import React, { Component, useState, useEffect } from "react";
import { auth, signInWithGoogle, firestore } from "../../firebase/firebase_config";
import { useAuthState } from "react-firebase-hooks/auth";
import { Header } from "../components/Header";
import { Dialog } from "@headlessui/react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getDocs, collection } from '@firebase/firestore';
import LoadingDialog from "../components/LoadingDialog";
import withNavigateHooks from "../navigate/withNavigateHooks";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            auth: props.auth,
            db: props.db,
            listPerhitungan: [],
            isLoading: true,
        }
    }

    componentDidMount() {
        this.setState({
            user: this.props.user,
            auth: this.props.auth,
            db: this.props.db,
        })
        this.getListPerhitungan();
        console.log(this.props);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.user !== this.props.user) {
            this.setState({
                user: this.props.user,
                auth: this.props.auth,
                db: this.props.db,
            })
        }
    }

    getListPerhitungan = async () => {
        getDocs(collection(firestore, "perhitungan")).then((querySnapshot) => {
            let listPerhitungan = [];
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                data.id = doc.id;
                listPerhitungan.push(data);
            });
            this.setState({ listPerhitungan, isLoading: false });
        });
    }

    render() {
        return (
            <React.Fragment>
                <LoadingDialog open={this.state.isLoading} handler={() => { }} />
                <Header user={this.props.user} auth={auth} signInWithGoogle={signInWithGoogle} />
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
                    <div className="py-8 px-4 mx-auto lg:py-16">
                        <div className="flex flex-col items-center justify-center w-full mx-auto mb-16 text-center lg:w-1/2">
                            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-5xl">
                                Sistem Pendukung Keputusan
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400">
                                Sistem Pendukung Keputusan Pemilihan Alternatif
                                Terbaik Menggunakan Metode MAUT
                            </p>

                            <div className="flex flex-col items-center justify-center w-full mx-auto mt-8 lg:flex-row lg:w-2/3">
                                <Link
                                    to={
                                        this.props.user ? "/input" : null
                                    }
                                    onClick={() => {
                                        if (!this.props.user) {
                                            signInWithGoogle()
                                        }
                                    }}
                                    className="w-full px-6 py-3 mb-3 mr-3 text-sm font-bold text-center text-white uppercase transition-all duration-150 ease-linear bg-gradient-to-tr from-[#9089fc] to-[#ff80b5] rounded shadow outline-none active:bg-gray-700 hover:shadow-lg focus:outline-none"
                                >
                                    Hitung
                                </Link>

                                <Link
                                    to="/about"
                                    className="w-full px-6 py-3 mb-3 mr-3 text-sm font-bold text-center text-white uppercase transition-all duration-150 ease-linear bg-gradient-to-tr from-[#9089fc] to-[#ff80b5] rounded shadow outline-none active:bg-gray-700 hover:shadow-lg focus:outline-none"
                                >
                                    Tentang
                                </Link>


                            </div>

                        </div>

                    </div>
                    <section className="bg-none dark:bg-gray-900">
                        <div className="container px-6 py-10 mx-auto">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-white">
                                    Perhitungan baru-baru ini
                                </h1>
                                {/* <button className="focus:outline-none">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6 text-gray-600 transition-colors duration-300 transform dark:text-gray-400 hover:text-blue-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </button> */}
                            </div>
                            <hr className="my-8 border-gray-200 dark:border-gray-700" />
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">


                                {
                                    this.state.listPerhitungan.map((e, i) => {
                                        return (
                                            <div key={i} className="p-8 bg-white rounded shadow dark:bg-gray-800 cursor-pointer" onClick={() => {
                                                this.props.navigation('/result', { state: { perhitungan: e } })
                                            }}>
                                                <h1 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
                                                    {e.name}
                                                </h1>
                                                <p className="mt-2 text-gray-500 dark:text-gray-400">
                                                    {e.deskripsi.substring(0, 120)}...
                                                </p>
                                                <div className="flex items-center justify-between mt-4">
                                                    <div>
                                                        <a
                                                            href="#"
                                                            className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:underline hover:text-gray-500"
                                                        >
                                                            {e.authorName}
                                                        </a>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">

                                                            {
                                                                new Intl.DateTimeFormat('id-ID', {
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: '2-digit'
                                                                }).format(e.createdAt.toDate())
                                                            }

                                                        </p>
                                                    </div>
                                                  
                                                </div>
                                            </div>
                                        );
                                    }
                                    )
                                }
                            </div>
                        </div>
                    </section>

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
            </React.Fragment>
        );
    }
}

export default withNavigateHooks(Dashboard);