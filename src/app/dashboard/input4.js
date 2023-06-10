import React, { Component } from 'react';

class Input4 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perhitungan: props.perhitungan,
            alternatifIndex: 0,
        };
    }

    onChangeIndex = (isNext) => {
        if (isNext) {
            this.setState({ alternatifIndex: this.state.alternatifIndex + 1 });
        } else {
            this.setState({ alternatifIndex: this.state.alternatifIndex - 1 });
        }
    }

    render() {
        console.log('alternatifIndex', this.state.alternatifIndex);
        return (
            <section className="bg-none dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Tambahkan Data Untuk Alternatif {this.state.perhitungan.alternatif[this.state.alternatifIndex].name}
                    </h2>
                    <form action="#">
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            {
                                this.state.perhitungan.kriteria.map((e, i) => {
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
                                                    value={e.name}
                                                    required=""
                                                    disabled
                                                    readOnly
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="item-weight"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Nilai
                                                </label>
                                                <input
                                                    type="number"
                                                    name="item-weight"
                                                    id="item-weight"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                    placeholder={0}
                                                    required=""
                                                    onWheel={(e) => e.target.blur()}
                                                    value={this.state.perhitungan.alternatif[this.state.alternatifIndex].nilaiKriteria[i] === 0 ? '' : this.state.perhitungan.alternatif[this.state.alternatifIndex].nilaiKriteria[i]}
                                                    onChange={(e) => {
                                                        let newPerhitungan = this.state.perhitungan;
                                                        newPerhitungan.alternatif[this.state.alternatifIndex].nilaiKriteria[i] = parseInt(e.target.value === '' ? 0 : e.target.value);
                                                        this.props.handler(newPerhitungan);
                                                        this.setState({ perhitungan: newPerhitungan });
                                                    }}
                                                />
                                            </div>

                                        </React.Fragment>
                                    );
                                })
                            }
                        </div>
                    </form>


                </div>

                <div className="flex justify-between px-4 py-3  sm:px-6">

                    {/* Previous Button */}
                    <button
                        type='submit'
                        onClick={() => this.onChangeIndex(false)}
                        disabled={this.state.alternatifIndex === 0}
                        className={
                            this.state.alternatifIndex === 0 ?
                                "inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-gray-300 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-gray-400"
                                : "inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                        }
                    >
                        Previous
                    </button>
                    {/* Next Button */}
                    <button
                        type='submit'
                        onClick={() => this.onChangeIndex(true)}
                        disabled={this.state.alternatifIndex === this.state.perhitungan.alternatif.length - 1}
                        className={
                            this.state.alternatifIndex === this.state.perhitungan.alternatif.length - 1 ?
                                "inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-gray-300 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-gray-400"
                                : "inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                        }
                    >
                        Next
                    </button>
                </div>
            </section>
        );
    }
}

export default Input4;
