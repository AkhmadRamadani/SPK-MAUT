import React, { Component } from "react";

class Input2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perhitungan: props.perhitungan,
        };
    }

    changeHandler = (e, i) => {
        let newPerhitungan = { ...this.state.perhitungan };
        let arrayBefore = newPerhitungan.alternatif;
        arrayBefore[i].name = e.target.value;
        newPerhitungan.alternatif = arrayBefore;

        this.props.handler(newPerhitungan)
        this.setState({ perhitungan: newPerhitungan });
    }

    kurangAlternatif = () => {
        if (this.state.perhitungan.alternatif.length > 1) {
            let newPerhitungan = { ...this.state.perhitungan };
            let arrayBefore = newPerhitungan.alternatif;
            arrayBefore.pop();
            this.props.handler(newPerhitungan)
            this.setState({ perhitungan: newPerhitungan });
        }
    }

    tambahAlternatif = () => {
        let newPerhitungan = { ...this.state.perhitungan };
        let arrayBefore = newPerhitungan.alternatif;
        arrayBefore.push({
            name: '',
        });
        newPerhitungan.alternatif = arrayBefore;

        this.props.handler(newPerhitungan)
        this.setState({ perhitungan: newPerhitungan });
    }



    render() {
        return (
            <section className="bg-none dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Tambahkan Alternatif
                    </h2>
                    <form action="#">
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

                            {
                                this.state.perhitungan.alternatif.map((e, i) => {
                                    return (
                                        <div key={i}>
                                            <label
                                                htmlFor="name"
                                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                Nama Alternatif {i + 1}
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                placeholder="Ketik nama alternatif"
                                                required=""
                                                defaultValue={this.state.perhitungan.alternatif[i].name}
                                                onChange={(e) => this.changeHandler(e, i)}
                                            />
                                        </div>
                                    )
                                })
                            }



                        </div>
                    </form>
                    {/* button tambah jumlah alternatif */}
                    <div className="flex justify-center space-x-2">
                        <button
                            type="submit"
                            onClick={this.tambahAlternatif}
                            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                        >
                            +
                        </button>
                        <button
                            type="submit"
                            onClick={this.kurangAlternatif}
                            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-red-700 rounded-lg focus:ring-4 focus:ring-red-200 dark:focus:ring-red-900 hover:bg-red-800"
                        >
                            -
                        </button>
                    </div>

                </div>
            </section>
        );
    }
}

export default Input2;
