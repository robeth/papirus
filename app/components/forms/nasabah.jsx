var React = require('react');
var Field = require('./fields/field');
var DateField = require('./fields/date-field');
var SelectField = require('./fields/select-field');
var Alert = require('../alert');
var FormMixin = require('../mixins/form-mixin');
var Nasabah = window.Models.Nasabah;

var FormNasabah = React.createClass({
  mixins: [FormMixin],
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']).isRequired,
    nasabahId: React.PropTypes.number
  },

  getInitialState: function(){
    return {
      isReadOnly: this.props.mode === 'edit',
      nasabahInstance: {
        jenis: '',
        nama: '',
        ktp: '',
        alamat: '',
        nama_pj: '',
        no_induk: '',
        telepon: '',
        tanggal_lahir: '',
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
    console.log('nasabahId: ' + this.props.nasabahId);
    Nasabah
    .findById(this.props.nasabahId)
    .then(function onFound(nasabah){
      console.log('nasabah found');
      console.log(nasabah);
      component.setState({nasabahInstance: nasabah});
    })
    .catch(function onError(error){
      console.log('error fetching nasabah');
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

    var nasabahPayload = this.collectPayload();
    nasabahPayload['tanggal_daftar'] = new Date();

    Nasabah
      .create(nasabahPayload)
      .then(function onNasabahCreationSuccess(nasabah){
        console.log("success creating new nasabah!");
        console.log(nasabah);
        component.refs['add-success-alert'].show();
        component.resetFields();
      })
      .catch(function onNasabahCreationError(error){
        console.log("Failed creating new nasabah...");
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

    var nasabahPayload = this.collectPayload();

    this.state.nasabahInstance
      .update(nasabahPayload)
      .then(function onNasabahCreationSuccess(nasabah){
        console.log("success update nasabah!");
        console.log(nasabah);
        component.refs['edit-success-alert'].show();
        component.setState({isReadOnly: true, nasabahInstance: nasabah});
        component.resetFields();
      })
      .catch(function onNasabahCreationError(error){
        console.log("Failed updating nasabah...");
        console.log(error);
      });

  },

  resetAlert: function(){
    this.refs['add-success-alert'].hide();
    this.refs['edit-success-alert'].hide();
  },

  render: function(){
    var formHandler = this.props.mode === 'add'
      ? this.onNewFormSubmit
      : this.onEditFormSubmit;

    var buttons = null;
    if(this.props.mode === 'add'){
      buttons = <button className="btn btn-success pull-right" ><i className="fa fa-save"></i> Simpan</button>
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

    if(this.props.mode === 'edit' && !this.state.nasabahInstance){
      return <div/>;
    }

    return (
      <form role="form" className="form-horizontal" onSubmit={formHandler}>
        <div className="row">
          <div className="col-xs-12">
            <Alert
              ref='add-success-alert'
              type='success' show={false}
              title={<div><i className='icon fa fa-check'/> Success!</div>}>
              Nasabah successfully added
            </Alert>
            <Alert
              ref='edit-success-alert'
              type='info' show={false}
              title={<div><i className='icon fa fa-check'/> Success!</div>}>
              Nasabah successfully updated
            </Alert>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <SelectField
              ref='jenis'
              inputColumn={10}
              htmlId='nasabah-type'
              label='Jenis'
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.jenis}
              onSelectChange={this.handleNasabahTypeChange}>
              <option value="individu">Individu</option>
              <option value="kolektif">Kolektif</option>
            </SelectField>
            <Field
              ref='ktp'
              inputColumn={10}
              htmlId='nasabah-ktp'
              label='KTP'
              validation={['required']}
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.ktp}/>
            <Field
              ref='nama'
              inputColumn={10}
              htmlId='nasabah-nama'
              label='Nama'
              validation={['required']}
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.nama}/>
            <Field
              ref='alamat'
              inputColumn={10}
              htmlId='nasabah-alamat'
              label='Alamat'
              validation={['required']}
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.alamat}/>
          </div>
          <div className="col-xs-6">
            <Field
            ref='nama_pj'
            inputColumn={10}
            htmlId='nasabah-pj'
            label='Nama PJ'
            readOnly={this.state.isReadOnly}
            initialValue={this.state.nasabahInstance.nama_pj}/>
            <Field
              ref='no_induk'
              inputColumn={10}
              htmlId='nasabah-ktp'
              label='No Induk'
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.no_induk}/>
            <Field
              ref='telepon'
              inputColumn={10}
              htmlId='nasabah-telepon'
              label='Telepon'
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.telepon}/>
            <DateField ref='tanggal_lahir'
              type='single'
              inputColumn={10}
              htmlId='nasabah-tanggal-lahir'
              label='Tanggal Lahir'
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.tanggal_lahir}/>
            <Field
              ref='email'
              inputColumn={10}
              htmlId='nasabah-email'
              label='Email'
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.email}/>
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

module.exports = FormNasabah;
