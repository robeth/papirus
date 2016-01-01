var React = require('react');
var Field = require('./field');
var SelectField = require('./select-field');
var Kategori = window.Models.Kategori;
var Stok = window.Models.Stok;
var StokPembelian = window.Models.StokPembelian;

var Header = React.createClass({
  render: function(){
    return (
      <div className="row row-margin">
        <div className="col-xs-3 text-center">Kategori</div>
        <div className="col-xs-3 text-center">Unit</div>
        <div className="col-xs-3 text-center">Harga per Unit</div>
        <div className="col-xs-3 text-center"></div>
      </div>
    );
  }
});

var Element = React.createClass({
  getInitialState: function(){
    return {
      kategoriInstances: []
    };
  },

  propTypes: {
    onRemoveClick: React.PropTypes.func.isRequired
  },

  componentDidMount: function(){
    var component = this;

    // Initialize kategori for detail pembelian forms
    Kategori
      .findAll()
      .then(function onFound(kategoriInstances){
        component.setState({kategoriInstances: kategoriInstances});
      });
  },

  collectPayload: function(){
    var kategori_id = this.refs['kategori_id'].value();
    var jumlah = this.refs['jumlah'].value();
    var harga = this.refs['harga'].value();

    return {
      kategori_id: kategori_id,
      jumlah: jumlah,
      harga: harga
    };
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

  save: function(args){
    var stokPayload = this.collectPayload();
    stokPayload.tanggal = args.tanggal;
    var component = this;
    Stok
      .create(stokPayload)
      .then(function(stok){
        console.log('success. new stok');
        console.log(stok);
        var stokPembelianPayload = {
          stok_id: stok.id,
          pembelian_id: args.id
        };

        return StokPembelian.create(stokPembelianPayload);
      })
      .then(function(stokPembelian){
        console.log('success. new stok pembelian');
        console.log(stokPembelian);
        component.resetFields();
      })
      .catch(function(error){
        console.error(error);
      });
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

  formatKategoriOption: function(state){
    return $('<div><code>' + this.findCodeByKategoriId(state.id) + '</code> ' + state.text + '</div>');
  },

  findCodeByKategoriId: function(id){
    var needles = this.state.kategoriInstances.filter(
      function(kategoriInstance, index, arr){
        return kategoriInstance.id == id;
      }
    );

    return needles.length > 0 ? needles[0].kode : null;
  },

  resetFields: function(){
    this.mapInputRefs(function resetField(input){
      input.component.reset();
    });
  },

  render: function(){
    var kategoriOptions = this.state.kategoriInstances.map(
      function(kategoriInstance, index, arr){
        return (
          <option key={index} value={kategoriInstance.id}>
            {kategoriInstance.nama}
          </option>
        );
      }
    );

    return (
      <div className='row row-margin'>
        <SelectField
          ref='kategori_id'
          inputColumn={3}
          select2={true}
          formatOption={this.formatKategoriOption}
          validation={['required']}>
          {kategoriOptions}
        </SelectField>
        <Field
          ref='jumlah'
          inputColumn={3}
          validation={['required']}
          suffixAddon='Kg'/>
        <Field
          ref='harga'
          inputColumn={3}
          validation={['required']}
          prefixAddon='Rp'
          placeholder='@unit'/>
        <div className="col-xs-3">
          <button
            className='btn btn-danger btn-xs'
            onClick={this.props.onRemoveClick}>
            <i className='fa fa-trash'/>
          </button>
        </div>
      </div>
    );
  }
});

module.exports = {
  Header: Header,
  Element: Element
};
