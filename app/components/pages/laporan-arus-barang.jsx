var React = require('react');
var DateRangeField = require('../forms/fields/date-range-field');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;

var moment = require('moment');
var RawQueries = window.Models.RawQueries;

var StockFlowReport = React.createClass({
  getInitialState: function(){
    return {
      stockSummary: [],
      startDate: moment(new Date('1900-01-01')),
      endDate: moment().endOf('month')
    };
  },

  componentDidMount: function() {
    this.refreshReport();
  },

  componentDidUpdate: function(previousProps, previousState){
    if(previousState.startDate === this.state.startDate &&
      previousState.endDate === this.state.endDate){
        return;
      }
    this.refreshReport();
  },

  refreshReport: function(){
    var component = this;
    var startDateString = component.state.startDate.format('YYYY-MM-DD');
    var endDateString = component.state.endDate.format('YYYY-MM-DD');

    RawQueries
      .stockFlow(startDateString, endDateString)
      .then(function(stockSummary){
        component.setState({
          stockSummary: stockSummary
        })
      })
      .catch(function(error){
        console.log(error);
      });
  },

  handleDateChange: function(eventData){
    this.setState({
      startDate: eventData.startDate,
      endDate: eventData.endDate
    });
  },

  getCsvFilename: function(){
    var start = this.state.startDate.format('YYYY-MM-DD');
    var end = this.state.endDate.format('YYYY-MM-DD');
    return 'StockFlow from ' + start + ' to ' + end + '.csv'
  },

  render: function(){
    var table = (
      <BootstrapTable
        data={this.state.stockSummary}
        condensed={true}
        hover={true}
        search={true}
        pagination={true}
        exportCSV={true}
        csvFileName={this.getCsvFilename()}
        options={{sizePerPage: 25}}>
        <TableHeaderColumn isKey={true} dataField='kode' dataSort={true}>
          Kode
        </TableHeaderColumn>
        <TableHeaderColumn dataField='nama' dataSort={true}>
          Nama Barang
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='individualDeposit'
          dataAlign='right'
          columnClassName='text-green'>
          Pembelian Indiv
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='groupDeposit'
          dataAlign='right'
          columnClassName='text-green'>
          Pembelian Kolektif
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='convertionOutput'
          dataAlign='right'
          columnClassName='text-green'>
          Hasil Konversi
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='sale'
          dataAlign='right'
          columnClassName='text-red'>
          Penjualan
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='convertionInput'
          dataAlign='right'
          columnClassName='text-red'>
          Bahan Konversi
        </TableHeaderColumn>
      </BootstrapTable>
    );

    return (
      <section className="content">
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Periode</h3>
              </div>
              <div className="box-body">
                <DateRangeField
                  ref='date-picker'
                  initialStartDate={this.state.startDate}
                  initialEndDate={this.state.endDate}
                  onEvent={this.handleDateChange}
                />
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
module.exports = StockFlowReport;
