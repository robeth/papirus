var React = require('react');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');

var PenjualanRow = React.createClass({
  propTypes:{
    index: React.PropTypes.number.isRequired,
    penjualan: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      id: this.props.penjualan.id,
      tanggal: this.props.penjualan.tanggal,
      nota: this.props.penjualan.nota,
      vendor: {},
      value: null,
      weight: null
    };
  },

  componentDidMount: function() {
    var component = this;
    component.props.penjualan.getVendor()
      .then(function(vendorInstance){
        component.setState({vendor: vendorInstance});
      })
      .catch(function(error){
        console.log('DataPenjualan-Row-Error retrieving vendor');
      })

    component.props.penjualan.getValue()
      .then(function(value){
        console.log('Penjualan (' + component.props.penjualan.id + ') value : ' + value);
        component.setState({value: value});
      })
      .catch(function(error){
        console.log('Error fetching value of Penjualan (' + component.props.penjualan.id + ')');
      });

    component.props.penjualan.getWeight()
      .then(function(weight){
        console.log('Penjualan (' + component.props.penjualan.id + ') weight : ' + weight);
        component.setState({weight: weight});
      })
      .catch(function(error){
        console.log('Error fetching weight of Penjualan (' + component.props.penjualan.id + ')');
      });
  },

  render: function(){
    return (
      <tr>
        <td className="text-center">{this.props.index}</td>
        <td className="text-center">
          <LinkHelper.Sale saleId={this.state.id}/>
        </td>
        <td className="text-center">{this.state.nota}</td>
        <td>
          <LinkHelper.Vendor vendorId={this.state.vendor.id}/>
          {this.state.vendor.nama}
        </td>
        <td className="text-center">{this.state.tanggal.toString()}</td>
        <td className="text-right">{this.state.value}</td>
        <td className="text-right">{this.state.weight}</td>
      </tr>
    );
  }
});

var DataPenjualan = React.createClass({
  getInitialState: function(){
    return {penjualanInstances: []};
  },
  componentDidMount: function(){
    var instance = this;
    ModelProxy.get('Penjualan')
      .findAll()
      .then(function onPenjualansRetrieveSuccess(penjualans){
        console.log('Retrieve all penjualans data success!');
        console.log(penjualans);
        instance.setState({penjualanInstances: penjualans});
      })
      .catch(function onPenjualansRetrieveFailed(error){
        console.log('Retrieving penjualans failed...');
        console.log(error);
      });
  },

  render: function(){
    var component = this;
    var rows = this.state.penjualanInstances.map(function(penjualan, index){
      return <PenjualanRow key={penjualan.id} index={index} penjualan={penjualan}/>;
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
                      <th className="text-center">Vendor</th>
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

module.exports = DataPenjualan;
