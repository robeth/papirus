var React = require('react');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

var DataKategori = React.createClass({
  getInitialState: function(){
    return {instances: []};
  },

  componentDidMount: function(){
    this.fetchCategory();
  },

  fetchCategory: function(){
    var component = this;
    ModelProxy.get('Kategori')
      .findAllWithReportCategory()
      .then(function onKategoriRetrieveSuccess(categories){
        console.log('Retrieve all categories data success!');
        console.log(categories);
        component.setState({instances: categories});
      })
      .catch(function onKategoriRetrieveFailed(error){
        console.log('Retrieving category failed...');
        console.log(error);
      });
  },

  getCsvFilename: function(){
    var today = moment().format('YYYY-MM-DD');
    return 'category-' + today + '.csv';
  },

  categoryFormatter: function(cell, row, formatExtraData, rowIdx){
    return <LinkHelper.Category categoryId={row.id} categoryCode={row.kode}/>;
  },

  reportCategoryFormatter: function(cell, row){
    return cell.nama;
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
          dataField='kode'
          dataSort={true}
          filter={{type: 'TextFilter'}}
          dataFormat={this.categoryFormatter}
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
        <TableHeaderColumn
          dataField='ReportCategory'
          dataSort={true}
          filter={{type: 'TextFilter'}}
          filterValue={this.reportCategoryFormatter}
          dataFormat={this.reportCategoryFormatter}
          >
          Jenis
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='stabil'
          dataSort={true}
          filter={{type: 'NumberFilter'}}
          >
          Stabil
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='fluktuatif'
          dataSort={true}
          filter={{type: 'NumberFilter'}}
          >
          Fluktuatif
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='satuan'
          filter={{type: 'TextFilter'}}
          >
          Satuan
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

module.exports = DataKategori;
