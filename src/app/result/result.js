import React, { Component, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import DataAwal from "./data_awal";
import MinMax from "./min_max";
import Normalisasi from "./normalisasi";
import Pembobotan from "./pembobotan";
import Rank from "./rank";
import { Header } from "../components/Header";
import CustomDialog from "../components/Dialog";
import { deleteDoc, collection, where, query, doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase_config";

export default function Result(props) {
    const location = useLocation();
    const [data, setData] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        setData(location.state.perhitungan);
    }, [location]);

    return (
        <ResultView data={data} user={props.user} auth={props.auth} signInWithGoogle={props.signInWithGoogle} navigation={navigate} />
    )

}

class ResultView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            selectedTab: 0,
            isMyData: false,
            user: null,
            isDeleteDialogOpen: false,
            isLoading: false,
        }
    }

    componentDidMount() {
        this.setState({
            data: this.props.data,
            user: this.props.user,
        })

    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                data: this.props.data,
                user: this.props.user,
            })
        }
    }

    selectTabHandler = (index) => {
        this.setState({
            selectedTab: index
        })
    }

    deleteHandler = (data) => {
        console.log(data);
        this.setState({ isLoading: true });
        deleteDoc(doc(firestore, "perhitungan", data.id)).then(() => {
            this.setState({ isLoading: false });
            this.props.navigation("/");

        }).catch((error) => {
            console.log(error);
            this.setState({ isLoading: false });
            alert("Data gagal dihapus");
        });
    }

    render() {
        return (
            <div className="relative isolate px-6 pt-14 lg:px-8">
                <CustomDialog
                    open={this.state.isDeleteDialogOpen}
                    handler={() => { this.setState({ isDeleteDialogOpen: false }) }}
                    okHandler={() => {
                        this.setState({ isDeleteDialogOpen: false })
                        this.deleteHandler(this.state.data)
                    }}
                    title="Hapus Data"
                    content="Apakah anda yakin ingin menghapus data ini?"
                    type="warning"
                />
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[35.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{
                            clipPath:
                                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                        }}
                    />
                </div>
                <Header user={this.props.user} auth={this.props.auth} signInWithGoogle={this.props.signInWithGoogle} />
                <div className="py-8 px-4 my-4 w-full">
                    {/* make it horizontal align */}
                    <div className="flex items-center justify-between w-full">
                        {/* arrow left icon with round container */}
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
                        {/* div make justify between */}
                        <div className="flex items-center justify-between w-full">
                            {/* title */}

                            <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white ml-4">
                                Hasil Perhitungan
                            </h1>
                            {/* button */}
                            <div className="flex items-center justify-center px-4  text-sm font-medium text-white bg-gradient-to-tr hidden md:flex">
                                {/* button delete */}
                                {
                                    this.state.data && this.props.user && this.state.data.author === this.props.user.uid ?
                                        <React.Fragment>
                                            <button
                                                onClick={() => {
                                                    this.setState({ isDeleteDialogOpen: true })
                                                }}
                                                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4 mr-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                                Hapus
                                            </button>
                                            <button
                                                onClick={() => {
                                                    this.props.navigation(
                                                        '/input',
                                                        {
                                                            state: {
                                                                perhitungan: this.state.data
                                                            }
                                                        }
                                                    )
                                                }}
                                                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] rounded-md hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 m-4"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4 mr-2"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                                Edit
                                            </button>

                                        </React.Fragment>
                                        : null
                                }

                                {
                                    this.props.user ?
                                        <Link
                                            to={'/input'}
                                            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] rounded-md hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                />
                                            </svg>
                                            Input Data
                                        </Link>
                                        : null
                                }
                            </div>
                        </div>
                    </div>

                    {/* make 3 button like above in row and only visible in mobile version */}
                    <div className="flex items-center justify-between w-full mb-4 md:hidden">
                        {/* button delete */}
                        {
                            this.state.data && this.props.user && this.state.data.author === this.props.user.uid ?
                                <React.Fragment>
                                    <button
                                        onClick={() => {
                                            this.setState({ isDeleteDialogOpen: true })
                                        }}
                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Hapus
                                    </button>
                                    <button
                                        onClick={() => {
                                            this.props.navigation(
                                                '/input',
                                                {
                                                    state: {
                                                        perhitungan: this.state.data
                                                    }
                                                }
                                            )
                                        }}
                                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] rounded-md hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 m-4"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        Edit
                                    </button>

                                </React.Fragment>
                                : null
                        }
                        {
                            this.props.user ?
                                <Link
                                    to={'/input'}
                                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] rounded-md hover:bg-opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                    Input Data
                                </Link>
                                : null
                                
                        }
                    </div>


                    <div className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        <div className="sm:hidden">
                            <label htmlFor="tabs" className="sr-only">
                                Select a tab
                            </label>
                            <select
                                id="tabs"
                                name="tabs"
                                onChange={(e) => this.selectTabHandler(e.target.selectedIndex)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                                <option>Data Awal</option>
                                <option>Min Max</option>
                                <option>Normalisasi</option>
                                <option>Pembobotan</option>
                                <option>Hasil</option>
                            </select>
                        </div>
                        <ul className="hidden text-sm font-medium text-center text-gray-500 divide-x divide-gray-200 rounded-lg shadow sm:flex dark:divide-gray-700 dark:text-gray-400">
                            <li className="w-full">
                                <a
                                    onClick={() => this.selectTabHandler(0)}
                                    className={
                                        this.state.selectedTab === 0 ?
                                            "inline-block w-full p-4 text-white bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] focus:ring-4 focus:ring-none-300 active focus:outline-none dark:bg-gray-700 dark:text-white rounded"
                                            : "inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                    }
                                >
                                    Data Awal
                                </a>
                            </li>
                            <li className="w-full">
                                <a
                                    onClick={() => this.selectTabHandler(1)}
                                    className={
                                        this.state.selectedTab === 1 ?
                                            "inline-block w-full p-4 text-white bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] focus:ring-4 focus:ring-none-300 active focus:outline-none dark:bg-gray-700 dark:text-white rounded"
                                            : "inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                    }
                                >
                                    Min Max
                                </a>
                            </li>
                            <li className="w-full">
                                <a
                                    onClick={() => this.selectTabHandler(2)}
                                    className={
                                        this.state.selectedTab === 2 ?
                                            "inline-block w-full p-4 text-white bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] focus:ring-4 focus:ring-none-300 active focus:outline-none dark:bg-gray-700 dark:text-white rounded"
                                            : "inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                    }
                                >
                                    Normalisasi
                                </a>
                            </li>
                            <li className="w-full">
                                <a
                                    onClick={() => this.selectTabHandler(3)}
                                    className={
                                        this.state.selectedTab === 3 ?
                                            "inline-block w-full p-4 text-white bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] focus:ring-4 focus:ring-none-300 active focus:outline-none dark:bg-gray-700 dark:text-white rounded"
                                            : "inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                    }
                                >
                                    Pembobotan
                                </a>
                            </li>
                            <li className="w-full">
                                <a
                                    onClick={() => this.selectTabHandler(4)}
                                    className={
                                        this.state.selectedTab === 4 ?
                                            "inline-block w-full p-4 text-white bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] focus:ring-4 focus:ring-none-300 active focus:outline-none dark:bg-gray-700 dark:text-white rounded"
                                            : "inline-block w-full p-4 bg-white hover:text-gray-700 hover:bg-gray-50 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
                                    }
                                >
                                    Hasil
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="mb-4  text-xl font-bold text-gray-900 dark:text-white">
                        {
                            (
                                () => {
                                    switch (this.state.selectedTab) {
                                        case 0:

                                            return <DataAwal data={this.state.data} />
                                        case 1:
                                            return <MinMax data={this.state.data} />
                                        case 2:
                                            return <Normalisasi data={this.state.data} />
                                        case 3:
                                            return <Pembobotan data={this.state.data} />
                                        case 4:
                                            return <Rank data={this.state.data} />
                                        default:
                                            break;
                                    }
                                }
                            )()
                        }
                    </div>
                </div>
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
        )
    }
}
