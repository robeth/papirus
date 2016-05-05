var React = require('react');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');

var DataVendor = React.createClass({
  getInitialState: function(){
    return {instances: []};
  },
  componentDidMount: function(){
    var instance = this;
    ModelProxy.get('Vendor')
      .findAll()
      .then(function onVendorRetrieveSuccess(vendors){
        console.log('Retrieve all vendors data success!');
        console.log(vendors);
        instance.setState({instances: vendors});
      })
      .catch(function onVendorRetrieveFailed(error){
        console.log('Retrieving vendor failed...');
        console.log(error);
      });
  },

  render: function(){
    var component = this;
    var rows = this.state.instances.map(function(account, index){
      return (
        <tr key={index}>
          <td className="text-center">{index}</td>
          <td className="text-center">
            <LinkHelper.Vendor vendorId={account.id}/>
          </td>
          <td>{account.nama} </td>
          <td>{account.alamat}</td>
          <td>{account.alamat}</td>
        </tr>
      );
    }.bind(component));
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
                      <th className="text-center">Nama</th>
                      <th className="text-center">Alamat</th>
                      <th className="text-center">Telepon</th>
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

module.exports = DataVendor;
