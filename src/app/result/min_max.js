import React, { Component } from "react";

export default class MinMax extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        }
    }

    componentDidMount() {
        this.setState({
            data: this.props.data
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                data: this.props.data
            })
        }
    }

    render() {
        const { data } = this.state;
        return (
            <React.Fragment>
                <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
                    Min Max
                </h1>
                <div className="relative overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-white uppercase dark:bg-gray-700 dark:text-gray-400 bg-gradient-to-tr from-[#9089fc] to-[#ff80b5]">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Min/Max
                                </th>
                                {data &&
                                    data.kriteria.map((e, i) => {
                                        return (
                                            <th key={i} scope="col" className="px-6 py-3">
                                                {e.name}
                                            </th>
                                        );
                                    })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr

                                className="border-b border-gray-200 dark:border-gray-700"
                            >
                                <td className="px-6 py-3 text-sm">Min</td>
                                {
                                    data &&
                                    data.kriteria.map((e, i) => {
                                        return (
                                            <td key={i} className="px-6 py-3 text-sm">
                                                {e.min}
                                            </td>
                                        );
                                    })
                                }
                            </tr>
                            <tr

                                className="border-b border-gray-200 dark:border-gray-700"
                            >
                                <td className="px-6 py-3 text-sm">Max</td>
                                {
                                    data &&
                                    data.kriteria.map((e, i) => {
                                        return (
                                            <td key={i} className="px-6 py-3 text-sm">
                                                {e.max}
                                            </td>
                                        );
                                    })
                                }
                            </tr>
                        </tbody>
                    </table>
                </div>
            </React.Fragment>
        );
    }
}