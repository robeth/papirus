var React = require('react');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');
var DateRangeField = require('../forms/fields/date-range-field');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

var DataPembelian = React.createClass({
  getInitialState: function(){
    var today = moment();
    var lastMonth = moment().subtract(30, 'days');

    return {
      instances: [],
      startDate: lastMonth,
      endDate: today
    };
  },

  componentDidMount: function(){
    this.fetchPembelian();
  },

  componentDidUpdate: function(prevProps, prevState){
    if(prevState.startDate === this.state.startDate &&
      prevState.endDate === this.state.endDate){
        return;
      }

    this.fetchPembelian();
  },

  fetchPembelian: function(){
    var component = this;
    var startDateString = component.state.startDate.format('YYYY-MM-DD');
    var endDateString = component.state.endDate.format('YYYY-MM-DD');

    ModelProxy.get('Pembelian')
      .getSummary(null, startDateString, endDateString)
      .then(function onPembeliansRetrieveSuccess(pembelians){
        console.log('Retrieve all pembelians data success!');
        console.log(pembelians);
        component.setState({instances: pembelians});
      })
      .catch(function onPembeliansRetrieveFailed(error){
        console.log('Retrieving pembelians failed...');
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
    return 'Pembelian from ' + start + ' to ' + end + '.csv'
  },

  pembelianLinkFormatter: function(cell, row){
    return <LinkHelper.Deposit depositId={cell} />;
  },

  nasabahLinkFormatter: function(cell, row){
    return (
      <div>
        <LinkHelper.Customer customerId={cell.id} />
        {cell.nama}
      </div>
    );
  },

  dateFormatter: function(cell, row){
    return cell.toString();
  },

  nasabahFilterValue: function(cell, row){
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
          dataField='id'
          dataSort={true}
          dataAlign="center"
          filter={{type: "TextFilter"}}
          dataFormat={this.pembelianLinkFormatter}>
          Kode
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='nota'
          dataSort={true}
          filter={{type: "TextFilter"}}>
          Nota
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='Nasabah'
          filter={{type: "TextFilter"}}
          filterValue={this.nasabahFilterValue}
          dataSort={true}
          dataFormat={this.nasabahLinkFormatter}>
          Nasabah
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='tanggal'
          filter={{type: "DateFilter"}}
          dataSort={true}
          dataAlign="center"
          dataFormat={this.dateFormatter}>
          Tanggal
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='value'
          dataAlign='right'
          filter={{type: "NumberFilter"}}
          dataSort={true}>
          Nilai
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='weight'
          dataAlign='right'
          filter={{type: "NumberFilter"}}
          dataSort={true}>
          Tonase
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

module.exports = DataPembelian;
