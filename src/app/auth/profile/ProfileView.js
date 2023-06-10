
import React, { Component } from "react";
import { getDocs, collection, where, query } from '@firebase/firestore';
import { Header } from "../../components/Header";
import { auth, signInWithGoogle, firestore } from "../../../firebase/firebase_config";
import withNavigateHooks from "../../navigate/withNavigateHooks";
import LoadingDialog from "../../components/LoadingDialog";


class ProfileView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            listPerhitungan: [],
            isLoading: true,
            user: props.user,
        }
    }

    componentDidMount() {
        this.setState({ user: this.props.user });
        this.getListPerhitungan();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.user !== this.props.user) {
            this.setState({ user: this.props.user });
            this.getListPerhitungan();
        }
    }

    getListPerhitungan = async () => {
        const { user } = this.state;

        const q = query(collection(firestore, "perhitungan"), where("author", "==", user.uid));
        const docs = await getDocs(q);
        let listPerhitungan = [];
        docs.forEach((doc) => {
            let data = doc.data();
            data.id = doc.id;
            listPerhitungan.push(data);
        });
        this.setState({ listPerhitungan, isLoading: false });
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
                    
                    <section className="bg-none dark:bg-gray-900">
                        <div className="container px-6 py-10 mx-auto">
                            <div className="flex items-center justify-between">
                                <h1 className="text-3xl font-semibold text-gray-800 capitalize lg:text-4xl dark:text-white">
                                    Riwayat Perhitungan Anda
                                </h1>
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
                                                                    day: '2-digit',
                                                                }).format(e.createdAt.toDate())
                                                            }

                                                        </p>
                                                    </div>
                                                    <a
                                                        href="#"
                                                        className="inline-block text-blue-500 underline hover:text-blue-400"
                                                    >
                                                        Read more
                                                    </a>
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

export default withNavigateHooks(ProfileView);