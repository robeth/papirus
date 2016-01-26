var React = require('react');
var Box = require('../box');
var Field = require('./fields/field');
var DateField = require('./fields/date-field');
var ReactSelectField = require('./fields/react-select-field');
var PembelianDetails = require('./pembelian-details');
var DynamicForm = require('./dynamic-form');
var Alert = require('../alert');
var Nasabah = window.Models.Nasabah;
var Pembelian = window.Models.Pembelian;
var PembelianStock = window.Models.PembelianStock;
var FormMixin = require('../mixins/form-mixin');
var Promise = require('bluebird');
var _ = require('lodash');

var PembelianForm = React.createClass({
  mixins: [FormMixin],
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']).isRequired,
    pembelianId: React.PropTypes.number,
    initialIsReadOnly: React.PropTypes.bool
  },

  getInitialState: function(){
    return {
      isReadOnly: this.props.initialIsReadOnly,
      nasabahInstances: [],
      pembelianInstance: {
        tanggal: null,
        nasabah_id: null,
        nota: null
      },
      pembelianStockInstances: null
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
    console.log(this.props)
    // Edit mode: Fetch pembelian instance
    if(this.props.mode === 'edit'){
      Pembelian
        .findById(this.props.pembelianId)
        .then(function onPembelianFound(pembelian){
          console.log('pembelian found');
          console.log(pembelian);
          component.setState({pembelianInstance: pembelian});
          return pembelian.getPembelianStocks();
        })
        .then(function onPembelianStocksFound(pembelianStocks){
          console.log('Pembelian stocks found');
          console.log(pembelianStocks);
          component.setState({pembelianStockInstances: pembelianStocks});
        })
        .catch(function onError(error){
          console.log('Failed to fetch pembelian ' + component.props.pembelianId);
          console.log(error);
        });
    }
  },

  save: function(){
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
        pembelianStockPromises = component.getChildrenForms().map(
          function(childForm, index, arr){
            childForm.component.save(pembelian);
          }
        );
        return Promise.all(pembelianStockPromises);
      })
      .then(function onPembelianStocksSaved(pembelianStocks){
        component.refs['add-success-alert'].show();
        component.resetFields();
        component.resetChildrenForms();
      })
      .catch(function onPembelianCreationError(error){
        console.log("Failed creating new pembelian...");
        console.log(error);
      });

  },

  saveChanges: function(){
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
    component.state.pembelianInstance
      .update(pembelianPayload)
      .then(function onPembelianCreationSuccess(pembelian){
        console.log("success updating pembelian!");
        console.log(pembelian);
        component.setState({pembelianInstance: pembelian});

        // Instruct child forms to save changes
        var childrenFormsPromise = component.getChildrenForms().map(
          function(childForm, index, arr){
            var childPromise = childForm.component.saveChanges(pembelian);
            console.log('Pembelian-childPromise:');
            console.log(childPromise);

            return childPromise;
          }
        );

        childrenFormsPromise = _.flatten(childrenFormsPromise, true);
        console.log('Pembelian-childrenPromise:');
        console.log(childrenFormsPromise);
        return Promise.all(childrenFormsPromise);
      })
      .then(function onAllChildrenFormsUpdated(pembelianStocks){
        console.log('PembelianStocks updated');
        console.log(pembelianStocks);
        component.refs['edit-success-alert'].show();
        component.resetFields();
        component.resetChildrenForms();
        component.setReadOnly(true);

        var newPembelianStocks = pembelianStocks.filter(function(s){
          return s.isNewRecord === false ;
        });

        console.log(newPembelianStocks);

        component.setState({
          pembelianStockInstances: newPembelianStocks
        });
      })
      .catch(function onPembelianCreationError(error){
        console.log("Failed to update pembelian...");
        console.log(error);
      });
  },

  resetAlert: function(){
    this.refs['add-success-alert'].hide();
    this.refs['edit-success-alert'].hide();
  },

  optionRenderer: function(option){
    return (
      <div>
        <span className='label label-info'> N{option.value}</span>
        {option.label}
      </div>
    );
  },

  onCancel: function(event){
    event.preventDefault();
    this.resetAlert();
    this.resetFields();
    this.resetChildrenForms();
    this.setReadOnly(true);
    this.getChildrenForms().map(function(childForm){
      childForm.component.reset();
    });
  },

  onEdit: function(event){
    event.preventDefault();
    this.resetAlert();
    this.setReadOnly(false);
  },

  formHandler: function(event){
    event.preventDefault();
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

    var buttons = null;

    if(this.props.mode === 'add'){
      buttons = (
        <button
          className="btn btn-success pull-right"
          onClick={this.save}>
          <i className="fa fa-save"></i> Simpan
        </button>
      );
    }
    else {
      if(this.state.isReadOnly){
        buttons = (
          <button
            className="btn btn-info pull-right"
            onClick={this.onEdit}>
            <i className="fa fa-save"></i> Edit
          </button>
        );
      } else {
        buttons = (
          <div>
            <button
              className="btn btn-danger pull-right"
              onClick={this.onCancel} >
              <i className="fa fa-undo"></i> Batal
            </button>
            <button
              className="btn btn-success pull-right"
              onClick={this.saveChanges}>
              <i className="fa fa-pencil"></i> Simpan
            </button>
          </div>
        );
      }
    }

    console.log('Render-Pembelian-instance:');
    console.log(this.state.pembelianInstance);
    console.log('Render-Pembelian-pembelianStockInstance:');
    console.log(this.state.pembelianStockInstances);
    return (
      <form role="form" className="form-horizontal" onSubmit={this.formHandler}>
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Pembelian Baru'/>
          <Box.Body>
            <div className="row">
              <div className="col-xs-12">
                <Alert
                  ref='add-success-alert'
                  type='success' show={false}
                  title={<div><i className='icon fa fa-check'/> Sukses!</div>}>
                  Pembelian baru berhasil dibuat!
                </Alert>
                <Alert
                  ref='edit-success-alert'
                  type='info' show={false}
                  title={<div><i className='icon fa fa-check'/> Sukses!</div>}>
                  Pembelian berhasil diubah!
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
                  htmlId='nasabah-id'
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
              header={PembelianDetails.Header}
              element={PembelianDetails.Element}
              ref='pembelian_stocks'
              mode={this.props.mode}
              instances={this.state.pembelianStockInstances}
              initialIsReadOnly={this.state.isReadOnly}
              />
          </Box.Body>
        </Box.Container>
        <div className="row">
          <div className="col-xs-12">
            {buttons}
          </div>
        </div>
      </form>
    );
  }
});

module.exports = PembelianForm;
