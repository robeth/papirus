var React = require('react');
var Field = require('../forms/field');
var DateField = require('../forms/date-field');
var SelectField = require('../forms/select-field');
var Nasabah = window.Models.Nasabah;

var FormNasabah = React.createClass({
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']),
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
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Form is invalid');
      return;
    }

    var type = this.refs['nasabah-type'].value();
    var nama = this.refs['nasabah-nama'].value();
    var ktp = this.refs['nasabah-ktp'].value();
    var alamat = this.refs['nasabah-alamat'].value();
    var pj = this.refs['nasabah-pj'].value();
    var noInduk = this.refs['nasabah-no-induk'].value();
    var telepon = this.refs['nasabah-telepon'].value();
    var tanggalLahir = this.refs['nasabah-tanggal-lahir'].value();
    var email = this.refs['nasabah-email'].value();

    Nasabah
      .create({
        jenis: type,
        nama: nama,
        ktp: ktp,
        alamat: alamat,
        nama_pj: pj,
        no_induk: noInduk,
        telepon: telepon,
        tanggal_lahir: tanggalLahir,
        email: email,
        tanggal_daftar: new Date(),
      })
      .then(function onNasabahCreationSuccess(nasabah){
        console.log("success creating new nasabah!");
        console.log(nasabah);
      })
      .catch(function onNasabahCreationError(error){
        console.log("Failed creating new nasabah...");
        console.log(error);
      });
  },

  validate: function(){
    var fields = [];
    var formErrors = [];

    for(var key in this.refs){
      fields.push({component: this.refs[key], key: key});
    }

    for(var i = 0; i < fields.length; i++){
      var fieldErrors = fields[i].component.validate();
      if(fieldErrors.length > 0){
        formErrors.push({ref: fields[i].key, errors: fieldErrors});
      }
    }

    return formErrors;
  },

  onCancel: function(event){
    event.preventDefault();
    this.setState({isReadOnly: true});
  },

  onEdit: function(event){
    console.log("onEdit");
    console.log(this.state);
    event.preventDefault();
    this.setState({isReadOnly: false});
  },

  render: function(){
    var formHandler = this.props.mode === 'add'
      ? this.onNewFormSubmit
      : this.onEditFormSubmit;

    var buttons = null;
    if(this.props.mode === 'add'){
      buttons = <button className="btn btn-info pull-right" ><i className="fa fa-save"></i> Simpan</button>
    }
    else {
      if(this.state.isReadOnly){
        buttons = <button className="btn btn-info pull-right" onClick={this.onEdit}><i className="fa fa-save"></i> Edit</button>
      } else {
        buttons = (
          <div>
            <button className="btn btn-info pull-right" onClick={this.onCancel} ><i className="fa fa-save"></i> Cancel</button>
            <button className="btn btn-info pull-right" ><i className="fa fa-save"></i> Simpan</button>
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
          <div className="col-xs-6">
            <SelectField
              ref='nasabah-type'
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
              ref='nasabah-ktp'
              inputColumn={10}
              htmlId='nasabah-ktp'
              label='KTP'
              validation={['required']}
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.ktp}/>
            <Field
              ref='nasabah-nama'
              inputColumn={10}
              htmlId='nasabah-nama'
              label='Nama'
              validation={['required']}
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.nama}/>
            <Field
              ref='nasabah-alamat'
              inputColumn={10}
              htmlId='nasabah-alamat'
              label='Alamat'
              validation={['required']}
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.alamat}/>
          </div>
          <div className="col-xs-6">
            <Field
            ref='nasabah-pj'
            inputColumn={10}
            htmlId='nasabah-pj'
            label='Nama PJ'
            readOnly={this.state.isReadOnly}
            initialValue={this.state.nasabahInstance.nama_pj}/>
            <Field
              ref='nasabah-no-induk'
              inputColumn={10}
              htmlId='nasabah-ktp'
              label='No Induk'
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.no_induk}/>
            <Field
              ref='nasabah-telepon'
              inputColumn={10}
              htmlId='nasabah-telepon'
              label='Telepon'
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.telepon}/>
            <DateField ref='nasabah-tanggal-lahir'
              type='single'
              inputColumn={10}
              htmlId='nasabah-tanggal-lahir'
              label='Tanggal Lahir'
              readOnly={this.state.isReadOnly}
              initialValue={this.state.nasabahInstance.tanggal_lahir}/>
            <Field
              ref='nasabah-email'
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
