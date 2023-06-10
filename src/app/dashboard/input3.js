import React, { Component } from 'react';

const typeOfKriteria = [
    {
        'value': 1,
        'name': 'Benefit',
    },
    {
        'value': 2,
        'name': 'Cost',
    }
];

class Input3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perhitungan: props.perhitungan,
        };

    }

    changeHandler = (e, i) => {
        let newPerhitungan = { ...this.state.perhitungan };
        let arrayBefore = newPerhitungan.kriteria;
        arrayBefore[i][e.target.name] = e.target.value;
        newPerhitungan.kriteria = arrayBefore;

        this.props.handler(newPerhitungan)
        this.setState({ perhitungan: newPerhitungan });
    }

    kurangKriteria = () => {
        if (this.state.perhitungan.alternatif.length > 1) {
            let newPerhitungan = { ...this.state.perhitungan };
            let arrayBefore = newPerhitungan.kriteria;
            arrayBefore.pop();
            this.props.handler(newPerhitungan)
            this.setState({ perhitungan: newPerhitungan });
        }
    }

    tambahKriteria = () => {
        let newPerhitungan = { ...this.state.perhitungan };
        let arrayBefore = newPerhitungan.kriteria;
        arrayBefore.push(
            { name: '', bobot: 0, tipe: "1" }
        );
        newPerhitungan.kriteria = arrayBefore;

        this.props.handler(newPerhitungan)
        this.setState({ perhitungan: newPerhitungan });
    }

    render() {
        return (
            <section className="bg-none dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Tambahkan Kriteria
                    </h2>
                    <form action="#">
                        <div className="grid gap-1 sm:grid-cols-3 sm:gap-6">
                            {
                                this.state.perhitungan.kriteria.map((e, i) => {
                                    let dataKriteria = this.state.perhitungan.kriteria[i];
                                    return (
                                        <React.Fragment key={i}>
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Nama Kriteria {i + 1}
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder="Ketik nama kriteria"
                                                    required=""
                                                    defaultValue={dataKriteria.name}
                                                    onChange={(e) => this.changeHandler(e, i)}
                                                />
                                            </div>
                                            <div>
                                                <label
                                                    htmlFor="bobot"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Bobot
                                                </label>
                                                <input
                                                    type="number"
                                                    name="bobot"
                                                    id="bobot"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder={0}
                                                    required=""
                                                    onWheel={(e) => e.target.blur()}
                                                    defaultValue={dataKriteria.bobot === 0 ? '' : dataKriteria.bobot}
                                                    onChange={(e) => this.changeHandler(e, i)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="tipe" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Jenis Kriteria</label>
                                                <select value={this.state.perhitungan.kriteria[i].tipe} onChange={(e) => {
                                                    let newPerhitungan = { ...this.state.perhitungan };
                                                    let arrayBefore = newPerhitungan.kriteria;
                                                    arrayBefore[i].tipe = e.target.value
                                                    newPerhitungan.kriteria = arrayBefore;

                                                    this.props.handler(newPerhitungan)
                                                    this.setState({ perhitungan: newPerhitungan });
                                                }}
                                                    name='tipe'
                                                    id="tipe" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                                    {
                                                        typeOfKriteria.map((option, index) => {
                                                            return <option value={option.value} key={option.value} defaultValue={option.value}>{option.name}</option>
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </div>
                    </form>

                    {/* button tambah jumlah alternatif */}
                    <div className="flex justify-center space-x-2">
                        <button
                            type="submit"
                            onClick={this.tambahKriteria}
                            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                        >
                            +
                        </button>
                        <button
                            type="submit"
                            onClick={this.kurangKriteria}
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

export default Input3;
