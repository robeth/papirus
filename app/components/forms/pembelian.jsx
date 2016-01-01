var React = require('react');
var Box = require('../box');
var Field = require('./field');
var DateField = require('./date-field');
var ReactSelectField = require('./react-select-field');
var PembelianDetails = require('./pembelian-details');
var DynamicForm = require('./dynamic-form');
var Alert = require('../alert');
var Nasabah = window.Models.Nasabah;
var Pembelian = window.Models.Pembelian;

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
        tanggal: null,
        nasabah_id: null,
        nota: null
      }
    };
  },

  componentDidMount: function(){
    var component = this;

    // Initialize nasabah selection
    Nasabah
    .findAll()
    .then(function onFound(nasabahInstances){
      console.log('All nasabah found');
      console.log(nasabahInstances);
      component.setState({nasabahInstances: nasabahInstances});
    })
    .catch(function onError(error){
      console.log('error fetching all nasabah');
      console.log(error);
    });
  },

  validate: function(){
    function validateInput(input){
      var fieldErrors = input.component.validate();
      return fieldErrors.length > 0
        ? {ref: input.key, errors: fieldErrors}
        : null;
    }

    return this.mapInputRefs(validateInput);
  },

  onNewFormSubmit: function(event){
    event.preventDefault();
    this.resetAlert();
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Pembelian form is invalid');
      console.log('Invalid: ');
      console.log(formErrors);
      return;
    }
    var pembelianPayload = this.collectPayload();
    var component = this;
    Pembelian
      .create(pembelianPayload)
      .then(function onPembelianCreationSuccess(pembelian){
        console.log("success creating new pembelian!");
        console.log(pembelian);

        // Instruct child forms to save
        component.getChildrenForms().map(function(childForm, index, arr){
          childForm.save(pembelian);
        });
        component.refs['add-success-alert'].show();
        component.resetFields();
      })
      .catch(function onPembelianCreationError(error){
        console.log("Failed creating new pembelian...");
        console.log(error);
      });

  },

  resetAlert: function(){
    this.refs['add-success-alert'].hide();
    this.refs['edit-success-alert'].hide();
  },

  resetFields: function(){
    this.mapInputRefs(function resetField(input){
      input.component.reset();
    });
  },

  collectPayload: function(){
    var tanggal = this.refs['tanggal'].value();
    var nasabah_id = this.refs['nasabah_id'].value();
    var nota = this.refs['nota'].value();

    return {
      tanggal: tanggal,
      nasabah_id: nasabah_id,
      nota: nota
    };
  },

  mapInputRefs: function(callback){
    var fields = [];
    var results = [];

    for(var key in this.refs){
      if(this.refs[key].validate){
        fields.push({component: this.refs[key], key: key});
      }
    }

    for(var i = 0; i < fields.length; i++){
      if(fields[i].component.validate){
        var result = callback(fields[i]);
        if(result){
          results.push(result);
        }
      }
    }

    return results;
  },

  getChildrenForms: function(){
    var childrenForms = [];

    for(var key in this.refs){
      if(this.refs[key].save){
        childrenForms.push(this.refs[key]);
      }
    }

    return childrenForms;
  },

  optionRenderer: function(option){
    return (
      <div>
        <span className='label label-info'> N{option.value}</span>
        {option.label}
      </div>
    );
  },

  render: function(){
    var nasabahOptions = this.state.nasabahInstances.map(
      function(nasabahInstance, index, arr){
        return {
          value: nasabahInstance.id,
          label: nasabahInstance.nama
        };
      }
    );

    return (
      <form role="form" className="form-horizontal" onSubmit={this.onNewFormSubmit}>
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
                <ReactSelectField
                  ref='nasabah_id'
                  inputColumn={10}
                  htmlId='nasabah-type'
                  label='Nasabah'
                  optionRenderer={this.optionRenderer}
                  validation={['required']}
                  readOnly={this.state.isReadOnly}
                  options={nasabahOptions}
                  initialValue={this.state.pembelianInstance.nasabah_id}>
                </ReactSelectField>
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
              ref='pembelian_stocks'
              />
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
