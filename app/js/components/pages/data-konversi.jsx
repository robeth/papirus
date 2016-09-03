var React = require('react');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');
var DateRangeField = require('../forms/fields/date-range-field');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

var DataKonversi = React.createClass({
  getInitialState: function(){
    var today = moment();
    var lastMonth = moment().subtract(30, 'days');

    return {
      startDate: lastMonth,
      endDate: today,
      instances: []
    };
  },

  componentDidMount: function(){
    this.fetchKonversi();
  },

  componentDidUpdate: function(prevProps, prevState){
    if(prevState.startDate === this.state.startDate &&
      prevState.endDate === this.state.endDate){
        return;
      }

    this.fetchKonversi();
  },

  fetchKonversi: function(){
    var component = this;
    var startDateString = component.state.startDate.format('YYYY-MM-DD');
    var endDateString = component.state.endDate.format('YYYY-MM-DD');

    ModelProxy.get('Konversi')
      .findAllEager(startDateString, endDateString)
      .then(function onKonversisRetrieveSuccess(konversis){
        console.log('Retrieve all konversis data success!');
        console.log(konversis);
        component.setState({instances: konversis});
      })
      .catch(function onKonversisRetrieveFailed(error){
        console.log('Retrieving konversis failed...');
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
    return 'Konversi from ' + start + ' to ' + end + '.csv';
  },

  konversiLinkFormatter: function(cell, row){
    return <LinkHelper.Convertion convertionId={cell} />;
  },

  dateFormatter: function(cell, row){
    return cell.toString();
  },

  render: function(){
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
          dataAlign="center"
          filter={{type: "TextFilter"}}
          dataFormat={this.konversiLinkFormatter}>
          Kode
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='nota'
          dataSort={true}
          filter={{type: "TextFilter"}}>
          Nota
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='tanggal'
          filter={{type: "TextFilter"}}
          dataSort={true}
          dataAlign="center"
          dataFormat={this.dateFormatter}>
          Tanggal
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='inputValue'
          dataAlign='right'
          filter={{type: "NumberFilter"}}
          dataSort={true}>
          Nilai
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='inputWeight'
          dataAlign='right'
          filter={{type: "NumberFilter"}}
          dataSort={true}>
          Tonase Input
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='outputWeight'
          dataAlign='right'
          filter={{type: "NumberFilter"}}
          dataSort={true}>
          Tonase Output
        </TableHeaderColumn>
      </BootstrapTable>
    );

    return (
      <section className="content">
        <div className="row">
          <div className="col-md-6">
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

module.exports = DataKonversi;
