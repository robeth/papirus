var React = require('react');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

var DataVendor = React.createClass({
  getInitialState: function(){
    return {instances: []};
  },

  componentDidMount: function(){
    this.fetchVendor();
  },

  fetchVendor: function(){
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

  getCsvFilename: function(){
    var today = moment().format('YYYY-MM-DD');
    return 'vendor-' + today + '.csv';
  },

  vendorFormatter: function(cell, row){
    return <LinkHelper.Vendor vendorId={cell}/>;
  },

  render: function(){
    var component = this;
    var table = (
      <BootstrapTable
        data={this.state.instances}
        condensed={true}
        hover={true}
        pagination={true}
        exportCSV={true}
        csvFileName={this.getCsvFilename()}
        options={{sizePerPage: 25}}>
        <TableHeaderColumn
          isKey={true}
          dataField='id'
          dataSort={true}
          filter={{type: 'TextFilter'}}
          dataFormat={this.vendorFormatter}
          dataAlign="center"
          >
          Kode
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='nama'
          dataSort={true}
          filter={{type: 'TextFilter'}}
          >
          Nama
        </TableHeaderColumn>
        <TableHeaderColumn dataField='alamat' filter={{type: 'TextFilter'}}>
          Alamat
        </TableHeaderColumn>
        <TableHeaderColumn dataField='telepon' filter={{type: 'TextFilter'}}>
          Telepon
        </TableHeaderColumn>
      </BootstrapTable>
    );
    return (
      <section className="content">
        <div className="row">
          <div className="col-xs-12">
            <div className="box box-info">
              <div className="box-body">
                {table}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
});

module.exports = DataVendor;
