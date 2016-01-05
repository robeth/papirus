var React = require('react');
var Box = require('../box');
var Field = require('./fields/field');
var DateField = require('./fields/date-field');
var ReactSelectField = require('./fields/react-select-field');
var PenjualanDetails = require('./penjualan-details');
var DynamicForm = require('./dynamic-form');
var Alert = require('../alert');
var Vendor = window.Models.Vendor;
var Penjualan = window.Models.Penjualan;
var PenjualanStock = window.Models.PenjualanStock;
var FormMixin = require('../mixins/form-mixin');
var Promise = require('bluebird');
var _ = require('lodash');

var PenjualanForm = React.createClass({
  mixins: [FormMixin],
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']).isRequired,
    instanceId: React.PropTypes.number,
    initialIsReadOnly: React.PropTypes.bool
  },

  getInitialState: function(){
    return {
      isReadOnly: this.props.initialIsReadOnly,
      vendorInstances: [],
      penjualanInstance: {
        tanggal: null,
        vendor_id: null,
        nota: null
      },
      penjualanStockInstances: null
    };
  },

  componentDidMount: function(){
    var component = this;

    // Initialize vendor selection
    Vendor
    .findAll()
    .then(function onFound(vendorInstances){
      console.log('All vendor found');
      console.log(vendorInstances);
      component.setState({vendorInstances: vendorInstances});
    })
    .catch(function onError(error){
      console.log('error fetching all vendor');
      console.log(error);
    });
    console.log(this.props)
    // Edit mode: Fetch penjualan instance
    if(this.props.mode === 'edit'){
      Penjualan
        .findById(this.props.instanceId)
        .then(function onPenjualanFound(penjualan){
          console.log('penjualan found');
          console.log(penjualan);
          component.setState({penjualanInstance: penjualan});
          return penjualan.getPenjualanStocks();
        })
        .then(function onPenjualanStocksFound(penjualanStocks){
          console.log('Pembelian stocks found');
          console.log(penjualanStocks);
          component.setState({penjualanStockInstances: penjualanStocks});
        })
        .catch(function onError(error){
          console.log('Failed to fetch penjualan ' + component.props.instanceId);
          console.log(error);
        });
    }
  },

  save: function(){
    event.preventDefault();
    this.resetAlert();
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Penjualan form is invalid');
      console.log('Invalid: ');
      console.log(formErrors);
      return;
    }
    var penjualanPayload = this.collectPayload();
    var component = this;
    Penjualan
      .create(penjualanPayload)
      .then(function onPenjualanCreationSuccess(penjualan){
        console.log("success creating new penjualan!");
        console.log(penjualan);

        // Instruct child forms to save
        penjualanStockPromises = component.getChildrenForms().map(
          function(childForm, index, arr){
            childForm.component.save(penjualan);
          }
        );
        return Promise.all(penjualanStockPromises);
      })
      .then(function onPenjualanStocksSaved(penjualanStocks){
        component.refs['add-success-alert'].show();
        component.resetFields();
        component.resetChildrenForms();
      })
      .catch(function onPenjualanCreationError(error){
        console.log("Failed creating new penjualan...");
        console.log(error);
      });

  },

  saveChanges: function(){
    event.preventDefault();
    this.resetAlert();
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Penjualan form is invalid');
      console.log('Invalid: ');
      console.log(formErrors);
      return;
    }
    var penjualanPayload = this.collectPayload();
    var component = this;
    component.state.penjualanInstance
      .update(penjualanPayload)
      .then(function onPenjualanCreationSuccess(penjualan){
        console.log("success updating penjualan!");
        console.log(penjualan);
        component.setState({penjualanInstance: penjualan});

        // Instruct child forms to save changes
        var childrenFormsPromise = component.getChildrenForms().map(
          function(childForm, index, arr){
            var childPromise = childForm.component.saveChanges(penjualan);
            console.log('Penjualan-childPromise:');
            console.log(childPromise);

            return childPromise;
          }
        );

        childrenFormsPromise = _.flatten(childrenFormsPromise, true);
        console.log('Penjualan-childrenPromise:');
        console.log(childrenFormsPromise);
        return Promise.all(childrenFormsPromise);
      })
      .then(function onAllChildrenFormsUpdated(penjualanStocks){
        console.log('PenjualanStocks updated');
        console.log(penjualanStocks);
        component.refs['edit-success-alert'].show();
        component.resetFields();
        component.resetChildrenForms();
        component.setReadOnly(true);

        var newPenjualanStocks = penjualanStocks.filter(function(s){
          return s.isNewRecord === false ;
        });

        console.log(newPenjualanStocks);

        component.setState({
          penjualanStockInstances: newPenjualanStocks
        });
      })
      .catch(function onPenjualanCreationError(error){
        console.log("Failed to update penjualan...");
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
        <span className='label label-warning'> V{option.value}</span>
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
    var vendorOptions = this.state.vendorInstances.map(
      function(vendorInstance, index, arr){
        return {
          value: vendorInstance.id,
          label: vendorInstance.nama
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

    console.log('Render-Penjualan-instance:');
    console.log(this.state.penjualanInstance);
    console.log('Render-Penjualan-pembelianStockInstance:');
    console.log(this.state.penjualanStockInstances);
    return (
      <form role="form" className="form-horizontal" onSubmit={this.formHandler}>
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Penjualan Baru'/>
          <Box.Body>
            <div className="row">
              <div className="col-xs-12">
                <Alert
                  ref='add-success-alert'
                  type='success' show={false}
                  title={<div><i className='icon fa fa-check'/> Success!</div>}>
                  Penjualan successfully added
                </Alert>
                <Alert
                  ref='edit-success-alert'
                  type='info' show={false}
                  title={<div><i className='icon fa fa-check'/> Success!</div>}>
                  Penjualan successfully updated
                </Alert>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <DateField ref='tanggal'
                  type='single'
                  inputColumn={10}
                  htmlId='tanggal'
                  label='Tanggal'
                  validation={['required']}
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.penjualanInstance.tanggal}/>
                <Field
                  ref='nota'
                  inputColumn={10}
                  htmlId='pembelian-nota'
                  label='Nota'
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.penjualanInstance.nota}/>
                <ReactSelectField
                  ref='vendor_id'
                  inputColumn={10}
                  htmlId='vendor_id'
                  label='Vendor'
                  optionRenderer={this.optionRenderer}
                  validation={['required']}
                  readOnly={this.state.isReadOnly}
                  options={vendorOptions}
                  initialValue={this.state.penjualanInstance.vendor_id}>
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
              header={PenjualanDetails.Header}
              element={PenjualanDetails.Element}
              ref='pembelian_stocks'
              mode={this.props.mode}
              instances={this.state.penjualanStockInstances}
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

module.exports = PenjualanForm;
