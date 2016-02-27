var React = require('react');
var Helper = require('../helper');
var Penarikan = window.Models.Penarikan;
var Pembelian = window.Models.Pembelian;
var Nasabah = window.Models.Nasabah;

var DataPenarikan = React.createClass({
  getInitialState: function(){
    return {penarikanInstances: []};
  },
  componentDidMount: function(){
    var instance = this;
    Penarikan
      .findAll({
        include: [
          {model: Pembelian, as: 'Pembelians'},
          {model: Nasabah, as: 'Nasabah'}
        ]
      })
      .then(function(penarikans){
        console.log('Retrieve all penarikans data success!');
        console.log(penarikans);
        instance.setState({penarikanInstances: penarikans});
      })
      .catch(function(error){
        console.log('Retrieving penarikan failed...');
        console.log(error);
      });
  },

  generateOnItemClick: function(penarikanId){
    var component = this;
    return function(){
      return Helper.call('changePage', ['detail-penarikan', {penarikanId: penarikanId}])
    };
  },

  render: function(){
    var component = this;
    var rows = this.state.penarikanInstances.map(function(penarikan, index){
      return (
        <tr key={index}>
          <td className="text-center">{index + 1}</td>
          <td className="text-center">
            <a onClick={component.generateOnItemClick(penarikan.id)}>
              <span className="label label-primary">{ 'T' + penarikan.id}</span>
            </a>
          </td>
          <td className="text-center">{penarikan.nota}</td>
          <td>
            <span className="label label-info">N{penarikan.Nasabah.id}</span>
            {penarikan.Nasabah.nama}
          </td>
          <td className="text-center">{penarikan.tanggal.toString()}</td>
          <td className="text-right">{penarikan.getValue()}</td>
        </tr>
      );
    });

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
                    <input data-widget="calendar-range" className="form-control pull-right"></input>
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
                      <th className="text-center">Nota</th>
                      <th className="text-center">Tanggal</th>
                      <th className="text-center">Nasabah</th>
                      <th className="text-center">Nilai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
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

module.exports = DataPenarikan;
