var React = require('react');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');
var DateRangeField = require('../forms/fields/date-range-field');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

var DataPenarikan = React.createClass({
  getInitialState: function(){
    var lastMonth = moment().subtract(30, 'days');
    var today = moment();

    return {
      startDate: lastMonth,
      endDate: today,
      instances: []
    };
  },

  componentDidMount: function(){
    this.fetchPenarikan();
  },

  componentDidUpdate: function(prevProps, prevState){
    if(this.state.startDate == prevState.startDate &&
      this.state.endDate == prevState.endDate){
        return;
      }

    this.fetchPenarikan();
  },

  fetchPenarikan: function(){
    var component = this;
    var startDateString = this.state.startDate.format('YYYY-MM-DD');
    var endDateString = this.state.endDate.format('YYYY-MM-DD');

    ModelProxy.get('Penarikan')
      .findAll({
        include: [
          {model: ModelProxy.get('Pembelian'), as: 'Pembelians'},
          {model: ModelProxy.get('Nasabah'), as: 'Nasabah'}
        ],
        where: {
          tanggal: {
            $gte: startDateString,
            $lte: endDateString
          }
        }
      })
      .then(function(penarikans){
        console.log('Retrieve all penarikans data success!');
        console.log(penarikans);
        component.setState({instances: penarikans});
      })
      .catch(function(error){
        console.log('Retrieving penarikan failed...');
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
    return 'Penarikan from ' + start + ' to ' + end + '.csv';
  },

  penarikanLinkFormatter: function(cell, row){
    return <LinkHelper.Withdrawal withdrawalId={cell} />;
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
          dataFormat={this.penarikanLinkFormatter}>
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
          filter={{type: "TextFilter"}}
          dataSort={true}
          dataAlign="center"
          dataFormat={this.dateFormatter}>
          Tanggal
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='total'
          dataAlign='right'
          filter={{type: "NumberFilter"}}
          dataSort={true}>
          Nilai
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

module.exports = DataPenarikan;
