var React = require('react');
var Helper = require('../helper');
var Pembelian = window.Models.Pembelian;

var PembelianRow = React.createClass({
  propTypes:{
    index: React.PropTypes.number.isRequired,
    pembelian: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      id: this.props.pembelian.id,
      tanggal: this.props.pembelian.tanggal,
      nota: this.props.pembelian.nota,
      nasabah: {},
      value: null,
      weight: null
    };
  },

  componentDidMount: function() {
    var component = this;
    component.props.pembelian.getNasabah()
      .then(function(nasabahInstance){
        component.setState({nasabah: nasabahInstance});
      })
      .catch(function(error){
        console.log('DataPembelian-Row-Error retrieving nasabah');
      })

    component.props.pembelian.getValue()
      .then(function(value){
        console.log('Pembelian (' + component.props.pembelian.id + ') value : ' + value);
        component.setState({value: value});
      })
      .catch(function(error){
        console.log('Error fetching value of Pembelian (' + component.props.pembelian.id + ')');
      });

    component.props.pembelian.getWeight()
      .then(function(weight){
        console.log('Pembelian (' + component.props.pembelian.id + ') weight : ' + weight);
        component.setState({weight: weight});
      })
      .catch(function(error){
        console.log('Error fetching weight of Pembelian (' + component.props.pembelian.id + ')');
      });
  },

  generateOnItemClick: function(pembelianId){
    return function(){
      Helper.call('changePage',['detail-pembelian', {pembelianId: pembelianId}]);
    };
  },

  render: function(){
    return (
      <tr>
        <td className="text-center">{this.props.index}</td>
        <td className="text-center">
          <a onClick={this.generateOnItemClick(this.state.id)}>
            <span className="label label-primary">B{this.state.id}</span>
          </a>
        </td>
        <td className="text-center">{this.state.nota}</td>
        <td>
          <span className="label label-info">N{this.state.nasabah.id}</span>
          {this.state.nasabah.nama}
        </td>
        <td className="text-center">{this.state.tanggal.toString()}</td>
        <td className="text-right">{this.state.value}</td>
        <td className="text-right">{this.state.weight}</td>
      </tr>
    );
  }
});

var DataPembelian = React.createClass({
  getInitialState: function(){
    return {pembelianInstances: []};
  },
  componentDidMount: function(){
    var instance = this;
    Pembelian
      .findAll()
      .then(function onPembeliansRetrieveSuccess(pembelians){
        console.log('Retrieve all pembelians data success!');
        console.log(pembelians);
        instance.setState({pembelianInstances: pembelians});
      })
      .catch(function onPembeliansRetrieveFailed(error){
        console.log('Retrieving pembelians failed...');
        console.log(error);
      });
  },

  _generateOnItemClick: function(argument, pembelianId){
    var component = this;
    return function(){return component.props.changePage(argument, {pembelianId: pembelianId})};
  },

  render: function(){
    var component = this;
    var rows = this.state.pembelianInstances.map(function(pembelian, index){
      return <PembelianRow key={pembelian.id} index={index} pembelian={pembelian}/>;
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
                      <th className="text-center">Nasabah</th>
                      <th className="text-center">Tanggal</th>
                      <th className="text-center">Nilai</th>
                      <th className="text-center">Tonase</th>
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

module.exports = DataPembelian;
