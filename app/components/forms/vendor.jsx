var React = require('react');
var Field = require('./fields/field');
var Alert = require('../alert');
var FormMixin = require('../mixins/form-mixin');
var Vendor = window.Models.Vendor;

var VendorForm = React.createClass({
  mixins: [FormMixin],
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']).isRequired,
    instanceId: React.PropTypes.number
  },

  getInitialState: function(){
    return {
      isReadOnly: this.props.mode === 'edit',
      instance: {
        nama: '',
        alamat: '',
        telepon: '',
        email: '',
        tanggal_daftar: ''
      }
    };
  },

  componentDidMount: function(){
    if(this.props.mode === 'add'){
      return;
    }

    var component = this;
    console.log('instanceId: ' + this.props.instanceId);
    Vendor
    .findById(this.props.instanceId)
    .then(function onFound(vendor){
      console.log('vendor found');
      console.log(vendor);
      component.setState({instance: vendor});
    })
    .catch(function onError(error){
      console.log('error fetching vendor');
      console.log(error);
    });
  },

  onNewFormSubmit: function(event){
    event.preventDefault();
    this.resetAlert();
    var component = this;
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Form is invalid');
      return;
    }

    var vendorPayload = this.collectPayload();
    vendorPayload['tanggal_daftar'] = new Date();

    Vendor
      .create(vendorPayload)
      .then(function onVendorCreationSuccess(vendor){
        console.log("success creating new vendor!");
        console.log(vendor);
        component.refs['add-success-alert'].show();
        component.resetFields();
      })
      .catch(function onVendorCreationError(error){
        console.log("Failed creating new vendor...");
        console.log(error);
      });
  },

  onCancel: function(event){
    event.preventDefault();
    this.resetFields();
    this.resetAlert();
    this.setState({isReadOnly: true});
  },

  onEdit: function(event){
    event.preventDefault();
    this.resetAlert();
    this.setState({isReadOnly: false});
  },

  onEditFormSubmit: function(event){
    event.preventDefault();
    this.resetAlert();
    var component = this;
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Form is invalid');
      return;
    }

    var vendorPayload = this.collectPayload();

    this.state.instance
      .update(vendorPayload)
      .then(function onVendorModificationSuccess(vendor){
        console.log("success update vendor!");
        console.log(vendor);
        component.refs['edit-success-alert'].show();
        component.setState({isReadOnly: true, instance: vendor});
        component.resetFields();
      })
      .catch(function onVendorModificationError(error){
        console.log("Failed updating vendor...");
        console.log(error);
      });

  },

  resetAlert: function(){
    this.refs['add-success-alert'].hide();
    this.refs['edit-success-alert'].hide();
  },

  render: function(){
    var formHandler = function(event){
      event.preventDefault();
    };

    var buttons = null;
    if(this.props.mode === 'add'){
      buttons = <button className="btn btn-success pull-right" onClick={this.onNewFormSubmit} ><i className="fa fa-save"></i> Simpan</button>
    }
    else {
      if(this.state.isReadOnly){
        buttons = <button className="btn btn-info pull-right" onClick={this.onEdit}><i className="fa fa-save"></i> Edit</button>
      } else {
        buttons = (
          <div>
            <button className="btn btn-danger pull-right" onClick={this.onCancel} ><i className="fa fa-undo"></i> Batal</button>
            <button className="btn btn-success pull-right" onClick={this.onEditFormSubmit}><i className="fa fa-pencil"></i> Simpan</button>
          </div>
        );
      }
    }

    if(this.props.mode === 'edit' && !this.state.instance){
      return <div/>;
    }

    return (
      <form role="form" className="form-horizontal" onSubmit={formHandler}>
        <div className="row">
          <div className="col-xs-12">
            <Alert
              ref='add-success-alert'
              type='success' show={false}
              title={<div><i className='icon fa fa-check'/> Sukses!</div>}>
              Data vendor berhasil dibuat!
            </Alert>
            <Alert
              ref='edit-success-alert'
              type='info' show={false}
              title={<div><i className='icon fa fa-check'/> Sukses!</div>}>
              Data vendor berhasil diubah!
            </Alert>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <Field
              ref='nama'
              inputColumn={10}
              htmlId='nama'
              label='Nama'
              validation={['required']}
              readOnly={this.state.isReadOnly}
              initialValue={this.state.instance.nama}/>
            <Field
              ref='alamat'
              inputColumn={10}
              htmlId='alamat'
              label='Alamat'
              validation={['required']}
              readOnly={this.state.isReadOnly}
              initialValue={this.state.instance.alamat}/>
            <Field
              ref='telepon'
              inputColumn={10}
              htmlId='telepon'
              label='Telepon'
              readOnly={this.state.isReadOnly}
              initialValue={this.state.instance.telepon}/>
            <Field
              ref='email'
              inputColumn={10}
              htmlId='email'
              label='Email'
              readOnly={this.state.isReadOnly}
              initialValue={this.state.instance.email}/>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            {buttons}
          </div>
        </div>
      </form>

    );
  }
});

module.exports = VendorForm;
