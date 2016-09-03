var React = require('react');
var DateRangeField = require('../forms/fields/date-range-field');

var moment = require('moment');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');
var classNames = require('classnames');

var DepositReport = React.createClass({
  getInitialState: function(){
    // TODO Sensible startDate to avoid initial empty table
    return {
      summary: [],
      startDate: moment.utc('1900-01-01'),
      endDate: moment.utc().endOf('month'),
      accountType: 'kolektif'
    };
  },

  componentDidMount: function() {
    this.refreshReport();
  },

  componentDidUpdate: function(previousProps, previousState){
    if(previousState.startDate === this.state.startDate &&
      previousState.endDate === this.state.endDate &&
      previousState.accountType === this.state.accountType){
        return;
      }
    this.refreshReport();
  },

  refreshReport: function(){
    // TODO show loading icon instead of empty table until query is finished
    // TODO disable date selector until query is finished
    var component = this;
    var startDateString = component.state.startDate.format('YYYY-MM-DD');
    var endDateString = component.state.endDate.format('YYYY-MM-DD');

    ModelProxy.get('RawQueries')
      .depositSummary(component.state.accountType, startDateString, endDateString)
      .then(function(summary){
        component.setState({
          summary: summary
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

  getAccountHandler: function(accountType){
    var component = this;
    return function(){
      component.setState({accountType: accountType});
    };
  },

  getRows: function(){
    var summary = this.state.summary;
    var rows = [];

    for(var accIdx = 0; accIdx < summary.length; accIdx++){
      var account = summary[accIdx];
      var deposits = account.deposits;

      for(var depIdx = 0; depIdx < deposits.length; depIdx++){
        var deposit = deposits[depIdx];
        var row = null;
        if(depIdx == 0){
          var categorySummary = [];
          var index = 0;
          for(var reportCategoryId in account.summary){
            if(account.summary.hasOwnProperty(reportCategoryId)){
              var content = account.summary[reportCategoryId].name +
                ' : ' +
                account.summary[reportCategoryId].totalWeight +
                ' ' +
                account.summary[reportCategoryId].unit;

              categorySummary.push(<li key={index}>{content}</li>);
              index++;
            }
          }
          row = (
            <tr key={deposit.id}>
              <td className='text-right' rowSpan={deposits.length}>
                {accIdx + 1}
              </td>
              <td className='text-center' rowSpan={deposits.length}>
                {deposit.Nasabah.no_induk}
              </td>
              <td className='text-center' rowSpan={deposits.length}>
                <LinkHelper.Customer customerId={deposit.Nasabah.id} />
                {deposit.Nasabah.nama}
              </td>
              <td className='text-center' rowSpan={deposits.length}>
                {deposit.Nasabah.nama_pj}
              </td>
              <td className='text-left' rowSpan={deposits.length}>
                {deposit.Nasabah.alamatj}
              </td>
              <td className='text-center' rowSpan={deposits.length}>
                {deposit.Nasabah.telepon}
              </td>
              <td className='text-center'>
                <LinkHelper.Deposit depositId={deposit.id} />
              </td>
              <td className='text-center'>{deposit.tanggal}</td>
              <td className='text-center'>{deposit.calculateValue()}</td>
              <td className='text-right'>{deposit.calculateWeight()}</td>
              <td className='text-right' rowSpan={deposits.length}>
                {account.totalValue}
              </td>
              <td className='text-right' rowSpan={deposits.length}>
                {account.totalWeight}
              </td>
              <td rowSpan={deposits.length}>
                <ul>{categorySummary}</ul>
              </td>
            </tr>
          );
        } else {
          row = (
            <tr key={deposit.id}>
              <td className='text-center'>
                <LinkHelper.Deposit depositId={deposit.id} />
              </td>
              <td className='text-center'>{deposit.tanggal}</td>
              <td className='text-center'>{deposit.calculateValue()}</td>
              <td className='text-right'>{deposit.calculateWeight()}</td>
            </tr>
          );
        }

        rows.push(row);
      }
    }

    return rows;
  },

  render: function(){
    return (
      <section className="content">
        <div className="row">
          <div className="col-md-4 col-xs-12">
            <div className="box box-info">
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
          <div className="col-md-4 col-xs-12">
            <div className="box box-info">
              <div className="box-header">
                <h3 className="box-title">Nasabah</h3>
              </div>
              <div className="box-body">
                <div className="btn-group">
                  <button className={classNames(
                      'btn',
                      'btn-default',
                      {active: this.state.accountType === 'kolektif'})}
                      onClick={this.getAccountHandler('kolektif')}>
                    <i className="fa fa-building"></i> Kolektif
                  </button>
                  <button className={classNames(
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
            <div className="box box-success">
              <div className="box-body">
                <table data-widget="advanced-table" className="table table-bordered table-hover">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">No Induk</th>
                      <th className="text-center">Nasabah</th>
                      <th className="text-center">PJ</th>
                      <th className="text-center">Alamat</th>
                      <th className="text-center">Telepon</th>
                      <th className="text-center">Pembelian</th>
                      <th className="text-center">Tanggal</th>
                      <th className="text-center">Nilai</th>
                      <th className="text-center">Tonase</th>
                      <th className="text-center">Total Nilai</th>
                      <th className="text-center">Total Tonase</th>
                      <th className="text-center">Rangkuman</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.getRows()}
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
module.exports = DepositReport;
