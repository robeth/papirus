var React = require('react');
var Box = require('../box');
var Field = require('./field');
var DateField = require('./date-field');
var SelectField = require('./select-field');
var PembelianDetails = require('./pembelian-details');
var DynamicForm = require('./dynamic-form');
var Alert = require('../alert');
var Nasabah = window.Models.Nasabah;

var PembelianForm = React.createClass({
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']),
    pembelianId: React.PropTypes.number
  },

  getInitialState: function(){
    return {
      isReadOnly: this.props.mode === 'edit',
      nasabahInstances: [],
      pembelianInstance: {
        tanggal: '',
        nasabah_id: '',
        nota: ''
      }
    };
  },

  componentDidMount: function(){
    var component = this;
    Nasabah
    .findAll()
    .then(function onFound(nasabahInstances){
      console.log('All nasabah found');
      console.log(nasabahInstances);
      component.setState({nasabahInstances: nasabahInstances});
      component.formatNasabahSelection();
    })
    .catch(function onError(error){
      console.log('error fetching all nasabah');
      console.log(error);
    });
  },

  formatNasabahOption: function (state){
    return $('<div><span class="label label-info">N' + state.id + '</span> ' + state.text + '</div>');
  },

  formatNasabahSelection: function(){
    var component = this;
    $(component.refs['nasabah_id'].refs['input']).select2({
      templateResult: component.formatNasabahOption,
      templateSelection: component.formatNasabahOption
    });
  },

  render: function(){
    var formHandler = function(event){
      event.preventDefault();
    };
    var nasabahOptions = this.state.nasabahInstances.map(
      function(nasabahInstance, index, arr){
        return (
          <option
            key={index}
            value={nasabahInstance.id}>
            {nasabahInstance.nama}
          </option>
        );
      }
    );

    return (
      <form role="form" className="form-horizontal" onSubmit={formHandler}>
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Pembelian Baru'/>
          <Box.Body>
            <div className="row">
              <div className="col-xs-12">
                <Alert
                  ref='add-success-alert'
                  type='success' show={false}
                  title={<div><i className='icon fa fa-check'/> Success!</div>}>
                  Pembelian successfully added
                </Alert>
                <Alert
                  ref='edit-success-alert'
                  type='info' show={false}
                  title={<div><i className='icon fa fa-check'/> Success!</div>}>
                  Pembelian successfully updated
                </Alert>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <DateField ref='tanggal'
                  type='single'
                  inputColumn={10}
                  htmlId='pembelian-tanggal'
                  label='Tanggal'
                  validation={['required']}
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.pembelianInstance.tanggal}/>
                <Field
                  ref='nota'
                  inputColumn={10}
                  htmlId='pembelian-nota'
                  label='Nota'
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.pembelianInstance.nota}/>
                <SelectField
                  ref='nasabah_id'
                  inputColumn={10}
                  htmlId='nasabah-type'
                  label='Jenis'
                  validation={['required']}
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.pembelianInstance.nasabah_id}>
                  {nasabahOptions}
                </SelectField>
                <hr/>
              </div>
            </div>
          </Box.Body>
        </Box.Container>
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Daftar Barang'/>
          <Box.Body>
            <DynamicForm
              header={React.createFactory(PembelianDetails.Header)}
              element={React.createFactory(PembelianDetails.Element)}
              />
            <div className="row">
              <div className="col-xs-12">
                <Alert
                  ref='add-success-alert'
                  type='success' show={false}
                  title={<div><i className='icon fa fa-check'/> Success!</div>}>
                  Pembelian successfully added
                </Alert>
                <Alert
                  ref='edit-success-alert'
                  type='info' show={false}
                  title={<div><i className='icon fa fa-check'/> Success!</div>}>
                  Pembelian successfully updated
                </Alert>
              </div>
            </div>
          </Box.Body>
        </Box.Container>
        <div className="row">
          <div className="col-xs-12">
            <button
              className="btn btn-success pull-right">
              <i className="fa fa-save"></i> Simpan
            </button>
          </div>
        </div>
      </form>
    );
  }
});

module.exports = PembelianForm;
