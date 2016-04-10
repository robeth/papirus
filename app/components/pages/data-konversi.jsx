var React = require('react');
var Konversi = window.Models.Konversi;
var LinkHelper = require('../helpers/link-helper');

var KonversiRow = React.createClass({
  propTypes:{
    index: React.PropTypes.number.isRequired,
    konversi: React.PropTypes.object.isRequired
  },

  getInitialState: function(){
    return {
      id: this.props.konversi.id,
      tanggal: this.props.konversi.tanggal,
      nota: this.props.konversi.nota,
      value: null,
      inputWeight: null,
      outputWeight: null
    };
  },

  componentDidMount: function() {
    var component = this;

    component.props.konversi.getValue()
      .then(function(value){
        console.log('Konversi (' + component.props.konversi.id + ') value : ' + value);
        component.setState({value: value});
      })
      .catch(function(error){
        console.log('Error fetching value of Konversi (' + component.props.konversi.id + ')');
      });

    component.props.konversi.getInputWeight()
      .then(function(inputWeight){
        console.log('Konversi (' + component.props.konversi.id + ') input weight : ' + inputWeight);
        component.setState({inputWeight: inputWeight});
      })
      .catch(function(error){
        console.log('Error fetching input weight of Konversi (' + component.props.konversi.id + ')');
      });

    component.props.konversi.getOutputWeight()
      .then(function(outputWeight){
        console.log('Konversi (' + component.props.konversi.id + ') output weight : ' + outputWeight);
        component.setState({outputWeight: outputWeight});
      })
      .catch(function(error){
        console.log('Error fetching output weight of Konversi (' + component.props.konversi.id + ')');
      });
  },

  render: function(){
    return (
      <tr>
        <td className="text-center">{this.props.index}</td>
        <td className="text-center">
          <LinkHelper.Convertion convertionId={this.state.id} />
        </td>
        <td className="text-center">{this.state.nota}</td>
        <td className="text-center">{this.state.tanggal.toString()}</td>
        <td className="text-right">{this.state.value}</td>
        <td className="text-right">{this.state.inputWeight}</td>
        <td className="text-right">{this.state.outputWeight}</td>
      </tr>
    );
  }
});

var DataKonversi = React.createClass({
  getInitialState: function(){
    return {konversiInstances: []};
  },
  componentDidMount: function(){
    var instance = this;
    Konversi
      .findAll()
      .then(function onKonversisRetrieveSuccess(konversis){
        console.log('Retrieve all konversis data success!');
        console.log(konversis);
        instance.setState({konversiInstances: konversis});
      })
      .catch(function onKonversisRetrieveFailed(error){
        console.log('Retrieving konversis failed...');
        console.log(error);
      });
  },

  render: function(){
    var component = this;
    var rows = this.state.konversiInstances.map(function(konversi, index){
      return <KonversiRow key={konversi.id} index={index} konversi={konversi}/>;
    });

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
                      <th className="text-center">Nota</th>
                      <th className="text-center">Tanggal</th>
                      <th className="text-center">Nilai</th>
                      <th className="text-center">Tonase In</th>
                      <th className="text-center">Tonase Out</th>
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

module.exports = DataKonversi;
