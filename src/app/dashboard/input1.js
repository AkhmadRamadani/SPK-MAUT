import React, { Component } from "react";

class Input1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            perhitungan: props.perhitungan,
        };
    }

    changeHandler = (e) => {
        let newPerhitungan = { ...this.state.perhitungan };
        newPerhitungan[e.target.name] = e.target.value;
        this.props.handler(newPerhitungan)
        this.setState({ perhitungan: newPerhitungan });


    };

    jumlahHandler = (e) => {
        // console.log(typeof e.target.value);
        if (e.target.value) {
            let newPerhitungan = { ...this.state.perhitungan };
            // create array from 0 to n 
            // n = e.target.value
            let lengthOfArray = e.target.value;
            if (e.target.name === 'kriteria') {

                let array = [...Array(parseInt(lengthOfArray))].map((e, i) => {
                    return { name: '', bobot: 0, tipe: "1" };
                });
                newPerhitungan.kriteria = array;
            } else if (e.target.name === 'alternatif') {
                let array = [...Array(parseInt(lengthOfArray))].map((e, i) => {
                    return { name: '', nilaiKriteria: [] };
                });
                newPerhitungan.alternatif = array;
            }

            this.props.handler(newPerhitungan)
            this.setState({ perhitungan: newPerhitungan });
        }
    };

    componentDidMount(){
        this.setState({perhitungan: this.props.perhitungan})
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.perhitungan !== this.props.perhitungan){
            this.setState({perhitungan: this.props.perhitungan})
        }
    }


    render() {
        const { perhitungan } = this.state;

        return (
            <section className="bg-none dark:bg-gray-900">
                <div className="py-8 px-4 mx-auto max-w-2xl lg:py-16">
                    <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                        Tambahkan Perhitungan MAUT Baru
                    </h2>
                    <form action="#">
                        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="name"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Nama Perhitungan
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Ketik nama perhitungan"
                                    defaultValue={perhitungan.name}
                                    onChange={this.changeHandler}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="kriteria"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Jumlah Kriteria
                                </label>
                                <input
                                    type="number"
                                    name="kriteria"
                                    min={0}
                                    id="kriteria"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder={0}
                                    onWheel={(e) => e.target.blur()}
                                    defaultValue={perhitungan.kriteria.length !== 0 ? perhitungan.kriteria.length : ''}
                                    onChange={this.jumlahHandler}
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="alternatif"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Jumlah Alternatif
                                </label>
                                <input
                                    type="number"
                                    name="alternatif"
                                    min={0}
                                    id="alternatif"
                                    onWheel={(e) => e.target.blur()}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder={0}
                                    defaultValue={perhitungan.alternatif.length !== 0 ? perhitungan.alternatif.length : ''}
                                    onChange={this.jumlahHandler}
                                    required
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="deskripsi"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Deskripsi
                                </label>
                                <textarea
                                    name="deskripsi"
                                    id="deskripsi"
                                    rows={8}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                    placeholder="Ketik deskripsi perhitungan"
                                    defaultValue={perhitungan.deskripsi}
                                    onChange={this.changeHandler}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </section>
        );
    }
}

export default Input1;
