import React from 'react';

class DataAwal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
  }

  componentDidMount() {
    this.setData(this.props.data);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setData(this.props.data);
    }
  }

  setData(data) {
    this.setState({ data });
  }

  render() {
    const { data } = this.state;

    return (
      <React.Fragment>

        <h1 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Data Alternatif
        </h1>

        <div className="relative overflow-x-auto">

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-white uppercase dark:bg-gray-700 dark:text-gray-400 bg-gradient-to-tr from-[#9089fc] to-[#ff80b5]">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nama Alternatif
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
              {data &&
                data.alternatif.map((e, i) => {
                  return (
                    <tr
                      key={i}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="px-6 py-3 text-sm">{e.name}</td>
                      {e.nilaiKriteria.map((element, index) => {
                        return (
                          <td key={index} className="px-6 py-3 text-sm">
                            {element}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <h1 className="mb-4 mt-8 text-xl font-bold text-gray-900 dark:text-white">
          Data Kriteria
        </h1>
        <div className="relative overflow-x-auto">

          <div className="inline-block min-w-full overflow-hidden align-middle">

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-white uppercase dark:bg-gray-700 dark:text-gray-400 bg-gradient-to-tr from-[#9089fc] to-[#ff80b5]" >
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Nama Kriteria
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Bobot
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tipe
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.kriteria.map((e, i) => {
                    return (
                      <tr
                        key={i}
                        className="border-b border-gray-200 dark:border-gray-700"
                      >
                        <td className="px-6 py-3 text-sm">{e.name}</td>
                        <td className="px-6 py-3 text-sm">{e.bobot}</td>
                        <td className="px-6 py-3 text-sm">
                          {e.tipe == 1 ? 'Benefit' : 'Cost'}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

      </React.Fragment>
    );
  }
}

export default DataAwal;
