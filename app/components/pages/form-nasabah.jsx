var React = require('react');
var Field = require('../forms/field');
var DateField = require('../forms/date-field');
var SelectField = require('../forms/select-field');
var Box = require('../box.jsx');
var Nasabah = window.Models.Nasabah;

var FormNasabah = React.createClass({
  getInitialState: function(){
    return { nasabahType: 'individu' };
  },

  onFormSubmit: function(event){
    event.preventDefault();
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Form is invalid');
      return;
    }
    console.log('Submitting form...');
    console.log(Nasabah);
    var type = this.refs['nasabah-type'].value();
    var nama = this.refs['nasabah-nama'].value();
    var ktp = this.refs['nasabah-ktp'].value();
    var alamat = this.refs['nasabah-alamat'].value();
    var pj = this.state.nasabahType === 'kolektif'
      ? this.refs['nasabah-pj'].value()
      : null;
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

  handleNasabahTypeChange: function(event){
    console.log('Select new item: ' + event.target.value);
    this.setState({nasabahType: event.target.value});
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
    console.log(formErrors);
    return formErrors;
  },

  render: function(){
    return (
      <section className="content">
        <div className="row">
          <form role="form" className="form-horizontal" onSubmit={this.onFormSubmit}>
            <div className="col-xs-6">
              <Box.Container className="box-info">
                <Box.Header showBorder={true} title='Informasi Umum'/>
                <Box.Body>
                  <SelectField
                    ref='nasabah-type'
                    inputColumn={10}
                    htmlId='nasabah-type'
                    label='Jenis'
                    onSelectChange={this.handleNasabahTypeChange}>
                    <option value="individu">Individu</option>
                    <option value="kolektif">Kolektif</option>
                  </SelectField>
                  <Field ref='nasabah-ktp' inputColumn={10} htmlId='nasabah-ktp' label='KTP' validation={['required']}/>
                  <Field ref='nasabah-nama' inputColumn={10} htmlId='nasabah-nama' label='Nama' validation={['required']}/>
                  <Field ref='nasabah-alamat' inputColumn={10} htmlId='nasabah-alamat' label='Alamat' validation={['required']}/>
                </Box.Body>
              </Box.Container>
            </div>

            <div className="col-xs-6">
              <Box.Container className="box-info">
                <Box.Header showBorder={true} title='Informasi Tambahan'/>
                <Box.Body>
                  {
                    this.state.nasabahType === 'kolektif'
                      ? <Field ref='nasabah-pj' inputColumn={10} htmlId='nasabah-pj' label='Nama PJ'/>
                      : ''
                  }
                  <Field ref='nasabah-no-induk' inputColumn={10} htmlId='nasabah-ktp' label='No Induk'/>
                  <Field ref='nasabah-telepon' inputColumn={10} htmlId='nasabah-telepon' label='Telepon'/>
                  <DateField ref='nasabah-tanggal-lahir' type='single' inputColumn={10} htmlId='nasabah-tanggal-lahir' label='Tanggal Lahir'/>
                  <Field ref='nasabah-email' inputColumn={10} htmlId='nasabah-email' label='Email'/>
                </Box.Body>
              </Box.Container>
            </div>

            <div className="col-xs-12"><button className="btn btn-info btn-lg pull-right" ><i className="fa fa-save"></i> Selesai</button></div>
          </form>
        </div>
      </section>
    );
  }
});

module.exports = FormNasabah;
