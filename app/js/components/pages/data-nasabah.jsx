var React = require('react');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var classnames = require('classnames');

var DataNasabah = React.createClass({
  getInitialState: function(){
    return {accountType: 'kolektif', accounts: []};
  },

  componentDidMount: function(){
    this.refreshAccountTable();
  },

  componentDidUpdate: function(prevProps, prevState){
    if(prevState.accountType == this.state.accountType){
      return;
    }
    this.refreshAccountTable();
  },

  refreshAccountTable: function(){
    // TODO show loading icon instead of empty table until query is finished
    var component = this;
    ModelProxy.get('Nasabah')
      .findAll({
        where: {jenis: this.state.accountType }
      })
      .then(function onAccountRetrieveSuccess(accounts){
        console.log('Retrieve all accounts data success!');
        console.log(accounts);
        component.setState({accounts: accounts});
      })
      .catch(function onAccountRetrieveFailed(error){
        console.log('Retrieving accounts failed...');
        console.log(error);
      });
  },

  getAccountHandler: function(accountType){
    var component = this;
    return function(){
      component.setState({accountType: accountType});
    };
  },

  getCsvFilename: function(){
    var today = moment().format('YYYY-MM-DD');
    return 'nasabah-' + this.state.accountType + '-' + today + '.csv';
  },

  accountFormatter: function(cell, row){
    return <LinkHelper.Customer customerId={cell}/>;
  },

  render: function(){
    var component = this;
    var table = (
      <BootstrapTable
        data={this.state.accounts}
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
          dataFormat={this.accountFormatter}
          dataAlign="center"
          >
          Kode
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='no_induk'
          dataSort={true}
          filter={{type: 'TextFilter'}}
          >
          No Induk
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
          <div className="col-md-4 col-xs-12">
            <div className="box box-info">
              <div className="box-header">
                <h3 className="box-title">Jenis</h3>
              </div>
              <div className="box-body">
                <div className="btn-group">
                  <button className={classnames(
                      'btn',
                      'btn-default',
                      {active: this.state.accountType === 'kolektif'})}
                      onClick={this.getAccountHandler('kolektif')}>
                    <i className="fa fa-building"></i> Kolektif
                  </button>
                  <button className={classnames(
                      'btn',
                      'btn-default',
                      {active: this.state.accountType === 'individu'})}
                      onClick={this.getAccountHandler('individu')}>
                    <i className="fa fa-child"></i> Individu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
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

module.exports = DataNasabah;
