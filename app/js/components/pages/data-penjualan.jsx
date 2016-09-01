var React = require('react');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');
var DateRangeField = require('../forms/fields/date-range-field');
var ReactBsTable = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var moment = require('moment');

var DataPenjualan = React.createClass({
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
    this.fetchPenjualan();
  },

  componentDidUpdate: function(prevProps, prevState){
    if(prevState.startDate == this.state.startDate &&
      prevState.endDate == this.state.endDate){
      return;
    }

    this.fetchPenjualan();
  },

  fetchPenjualan: function(){
    var component = this;
    var startDateString = component.state.startDate.format('YYYY-MM-DD');
    var endDateString = component.state.endDate.format('YYYY-MM-DD');

    ModelProxy.get('Penjualan')
      .findAllEager(startDateString, endDateString)
      .then(function onPenjualansRetrieveSuccess(penjualans){
        console.log('Retrieve all penjualans data success!');
        console.log(penjualans);
        component.setState({instances: penjualans});
      })
      .catch(function onPenjualansRetrieveFailed(error){
        console.log('Retrieving penjualans failed...');
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
    return 'Penjualan from ' + start + ' to ' + end + '.csv';
  },

  penjualanLinkFormatter: function(cell, row){
    return <LinkHelper.Sale saleId={cell} />;
  },

  vendorLinkFormatter: function(cell, row){
    return (
      <div>
        <LinkHelper.Vendor vendorId={cell.id} />
        {cell.nama}
      </div>
    );
  },

  dateFormatter: function(cell, row){
    return cell.toString();
  },

  vendorFilterValue: function(cell, row){
    return cell.nama;
  },

  render: function(){
      // <tr>
      //   <td className="text-center">{this.props.index}</td>
      //   <td className="text-center">
      //     <LinkHelper.Sale saleId={this.state.id}/>
      //   </td>
      //   <td className="text-center">{this.state.nota}</td>
      //   <td>
      //     <LinkHelper.Vendor vendorId={this.state.vendor.id}/>
      //     {this.state.vendor.nama}
      //   </td>
      //   <td className="text-center">{this.state.tanggal.toString()}</td>
      //   <td className="text-right">{this.state.value}</td>
      //   <td className="text-right">{this.state.weight}</td>
      // </tr>
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
          dataFormat={this.penjualanLinkFormatter}>
          Kode
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='nota'
          dataSort={true}
          filter={{type: "TextFilter"}}>
          Nota
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField='Vendor'
          filter={{type: "TextFilter"}}
          filterValue={this.vendorFilterValue}
          dataSort={true}
          dataFormat={this.vendorLinkFormatter}>
          Vendor
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

module.exports = DataPenjualan;
