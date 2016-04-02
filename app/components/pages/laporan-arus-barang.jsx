var React = require('react');
var DateRangeField = require('../forms/fields/date-range-field');
var moment = require('moment');
var RawQueries = window.Models.RawQueries;

var StockFlowReport = React.createClass({
  getInitialState: function(){
    return {
      stockSummary: [],
      startDate: moment().startOf('month'),
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

  render: function(){
    var rows = this.state.stockSummary.map(function(stockEntry, index){
      return (
        <tr key={index}>
          <td className="text-right">{index + 1}</td>
          <td className="text-center">{stockEntry.kode}</td>
          <td>{stockEntry.nama}</td>
          <td className="text-right text-green">{stockEntry.individualDeposit}</td>
          <td className="text-right text-green">{stockEntry.groupDeposit}</td>
          <td className="text-right text-green">{stockEntry.convertionOutput}</td>
          <td className="text-right text-red">{stockEntry.sale}</td>
          <td className="text-right text-red">{stockEntry.convertionInput}</td>
        </tr>
      );
    });

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
                <div className="table-responsive">
                  <table data-widget="advanced-table" className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th className="text-center">#</th>
                        <th className="text-center">Kode</th>
                        <th className="text-center">Nama Barang</th>
                        <th className="text-center">Pembelian Indiv</th>
                        <th className="text-center">Pembelian Kolektif</th>
                        <th className="text-center">Hasil Konversi</th>
                        <th className="text-center">Penjualan</th>
                        <th className="text-center">Input Konversi</th>
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
        </div>
      </section>
    );
  }
});

module.exports = StockFlowReport;
