var React = require('react');
var DateRangeField = require('../forms/fields/date-range-field');

var moment = require('moment');
var ModelProxy = require('../../models/proxy');
var LinkHelper = require('../helpers/link-helper');
var classNames = require('classnames');

var UnsettledDepositReport = React.createClass({
  getInitialState: function(){
    return {
      summary: [],
      startDate: moment(new Date('1900-01-01')),
      endDate: moment().endOf('month'),
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
    var component = this;
    var startDateString = component.state.startDate.format('YYYY-MM-DD');
    var endDateString = component.state.endDate.format('YYYY-MM-DD');

    ModelProxy.get('RawQueries')
      .unsettledDeposit(component.state.accountType, startDateString, endDateString)
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

  goTo: function(depositId){
    var component = this;
    return function(){
      component.refs['withdrawal-link-' + depositId].goTo();
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
        var expiryDate = moment(deposit.tanggal).add(14, 'd')
          .format('YYYY-MM-DD');
        var row = null;
        if(depIdx == 0){
          row = (
            <tr key={deposit.id}>
              <td className='text-right' rowSpan={deposits.length}>
                {accIdx + 1}
              </td>
              <td className='text-center'>
                <LinkHelper.Deposit depositId={deposit.id} />
              </td>
              <td className='text-center'>{deposit.nota}</td>
              <td className='text-center' rowSpan={deposits.length}>
                <LinkHelper.Customer customerId={deposit.Nasabah.id} />
                {deposit.Nasabah.nama}
              </td>
              <td className='text-center'>{deposit.tanggal}</td>
              <td className='text-center'>{expiryDate}</td>
              <td className='text-right'>{deposit.totalValue}</td>
              <td className='text-right'>{deposit.remainingValue}</td>
              <td className='text-right' rowSpan={deposits.length}>
                {account.totalUnsettled}
              </td>
              <td className='text-center' rowSpan={deposits.length}>
                <LinkHelper.Hidden
                  ref={'withdrawal-link-' + deposit.id}
                  to='form-penarikan'
                  properties={{initialNasabahId: deposit.Nasabah.id}}/>
                <a onClick={this.goTo(deposit.id)}>
                  Penarikan <i className='fa fa-tag'></i>
                </a>
              </td>
            </tr>
          );
        } else {
          row = (
            <tr key={deposit.id}>
              <td className='text-center'>
                <LinkHelper.Deposit depositId={deposit.id} />
              </td>
              <td className='text-center'>{deposit.nota}</td>
              <td className='text-center'>{deposit.tanggal}</td>
              <td className='text-center'>{expiryDate}</td>
              <td className='text-right'>{deposit.totalValue}</td>
              <td className='text-right'>{deposit.remainingValue}</td>
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
                      <th className="text-center">Kode</th>
                      <th className="text-center">Nota</th>
                      <th className="text-center">Nasabah</th>
                      <th className="text-center">Tanggal</th>
                      <th className="text-center">Jatuh Tempo</th>
                      <th className="text-center">Total Transaksi</th>
                      <th className="text-center">Belum Lunas</th>
                      <th className="text-center">Total Utang</th>
                      <th className="text-center">Action</th>
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
module.exports = UnsettledDepositReport;
