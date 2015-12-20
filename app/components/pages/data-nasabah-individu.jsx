var React = require('react');

var DataNasabahIndividu = React.createClass({
  render: function(){
    return (
      <section className="content">
        <div className="row">
          <div className="col-md-6">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Periode</h3>
              </div>
              <div className="box-body">
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-addon"><i className="fa fa-calendar"></i></div>
                    <input data-widget="calendar-range" className="form-control pull-right" value="11/01/2015 - 11/30/2015"></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <div className="box box-info">
              <div className="box-body">
                <table data-widget="advanced-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Kode</th>
                      <th className="text-center">No Induk</th>
                      <th className="text-center">Nama</th>
                      <th className="text-center">Alamat</th>
                      <th className="text-center">Telepon</th>
                      <th className="text-center">Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center">1</td>
                      <td className="text-center"><a href="#"><span className="label label-info">N107</span></a></td>
                      <td className="text-center">I01234</td>
                      <td>Iin </td>
                      <td>Bratang Lapangan</td>
                      <td>031-5400123</td>
                      <td className="text-right">90.000,00</td>
                    </tr>
                    <tr>
                      <td className="text-center">2</td>
                      <td className="text-center"><a href="#"><span className="label label-info">N88</span></a></td>
                      <td className="text-center">I01235</td>
                      <td>Cinta </td>
                      <td>Mulyorejo I</td>
                      <td>088877001122</td>
                      <td className="text-right">200.000,00</td>
                    </tr>
                    <tr>
                      <td className="text-center">3</td>
                      <td className="text-center"><a href="#"><span className="label label-info">N34</span></a></td>
                      <td className="text-center">I03034</td>
                      <td>Dudu </td>
                      <td>Ahmad Yani 10-1</td>
                      <td>031-52007575</td>
                      <td className="text-right">20.000,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = DataNasabahIndividu;
