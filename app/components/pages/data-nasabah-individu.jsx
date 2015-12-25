var React = require('react');
var Nasabah = window.Models.Nasabah;

var DataNasabahIndividu = React.createClass({
  getInitialState: function(){
    return {accounts: []};
  },
  componentDidMount: function(){
    var instance = this;
    Nasabah
      .findAll()
      .then(function onAccountRetrieveSuccess(accounts){
        console.log('Retrieve all accounts data success!');
        console.log(accounts);
        instance.setState({accounts: accounts});
      })
      .catch(function onAccountRetrieveFailed(error){
        console.log('Retrieving accounts failed...');
        console.log(error);
      });
  },

  _generateOnItemClick: function(argument, nasabahId){
    return function(){return this.props.changePage(argument, {nasabahId: nasabahId})};
  },

  render: function(){
    var component = this;
    var rows = this.state.accounts.map(function(account, index){
      return (
        <tr>
          <td className="text-center">{index}</td>
          <td className="text-center"><a onClick={this._generateOnItemClick('detail-nasabah', account.id).bind(component)}><span className="label label-info">{account.id}</span></a></td>
          <td className="text-center">I01234</td>
          <td>{account.nama} </td>
          <td>{account.alamat}</td>
          <td>-</td>
          <td className="text-right">-</td>
        </tr>
      );
    }.bind(component));
    return (
      <section className="content">
        <div className="row">
          <div className="col-md-6">
            <div className="box">
              <div className="box-header">
                <h3 className="box-title">Periode</h3>
              </div>
              <div className="box-body">
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-addon"><i className="fa fa-calendar"></i></div>
                    <input data-widget="calendar-range" className="form-control pull-right"></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <div className="box box-info">
              <div className="box-body">
                <table data-widget="advanced-table" className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Kode</th>
                      <th className="text-center">No Induk</th>
                      <th className="text-center">Nama</th>
                      <th className="text-center">Alamat</th>
                      <th className="text-center">Telepon</th>
                      <th className="text-center">Saldo</th>
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
      </section>
    );
  }
});

module.exports = DataNasabahIndividu;
