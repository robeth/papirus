var React = require('react');
var Field = require('./fields/field');
var ReactSelectField = require('./fields/react-select-field');
var Kategori = window.Models.Kategori;
var Stock = window.Models.Stock;
var PembelianStock = window.Models.PembelianStock;
var FormMixin = require('../mixins/form-mixin');

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
  mixins: [FormMixin],
  statics: {
    destroy: function(instance){
      var stockId = instance.stok_id;
      return instance
        .destroy()
        .then(function(){
          return Stock.destroy({
            where: {
              id: stockId
            }
          });
        })
    }
  },
  propTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']),
    instance: React.PropTypes.object,
    onRemoveClick: React.PropTypes.func.isRequired,
    initialIsReadOnly: React.PropTypes.bool
  },

  getInitialState: function(){
    console.log('PembelianDetails-INITIAL_STATE');
    console.log(this.props);
    return {
      isReadOnly: this.props.initialIsReadOnly,
      instance: {
        id: null,
        stock: {
          id: null,
          kategori_id: null,
          jumlah: null,
          harga: null
        }
      },
      pembelianStockInstance: null,
      kategoriInstances: []
    };
  },

  componentDidMount: function(){
    var component = this;

    // Initialize kategori for detail pembelian forms
    Kategori
      .findAll()
      .then(function onFound(kategoriInstances){
        if(component.isMounted()){
          component.setState({kategoriInstances: kategoriInstances});
        }
      });
    this.updateState(this.props.instance);
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('PembelianDetails-CWRP-nextProps:');
    console.log(nextProps);
    if(nextProps.mode === 'edit' &&
      nextProps.instance &&
      nextProps.instance !== this.props.instance){
      this.updateState(nextProps.instance);
    }
  },

  updateState: function(pembelianStock){
    console.log('PembelianDetails-Update-state');
    if(pembelianStock){
      var component = this;
      pembelianStock.getStock()
        .then(function onStockFound(stock){
          console.log('PembelianDetails-Update-state-stock');
          console.log(stock);
          if(component.isMounted()){
            component.setState({
              instance: {
                id: pembelianStock.id,
                stock: stock
              },
              pembelianStockInstance: pembelianStock
            });
          }
        })
        .catch(function onRetrieveStockError(error){
          console.log(error);
        });
    }
  },

  save: function(args){
    var stokPayload = this.collectPayload();
    stokPayload.tanggal = args.tanggal;
    var component = this;

    var newPembelianStockPromise = Stock
      .create(stokPayload)
      .then(function(stok){
        console.log('success. new stok');
        console.log(stok);
        var stokPembelianPayload = {
          stok_id: stok.id,
          pembelian_id: args.id
        };

        return PembelianStock.create(stokPembelianPayload);
      });

    newPembelianStockPromise
      .then(function(stokPembelian){
        console.log('success. new stok pembelian');
        console.log(stokPembelian);
        // component.resetFields();
      })
      .catch(function(error){
        console.error(error);
      });

    return newPembelianStockPromise;
  },

  saveChanges: function(args){
    var stokPayload = this.collectPayload();
    console.log('PembelianDetails-saveChanges-prevStock:');
    console.log(this.state.instance);
    console.log('PembelianDetails-saveChanges-payload:')
    stokPayload.tanggal = args.tanggal;
    console.log(stokPayload);
    var component = this;
    var updatePromise = component.state.instance.stock.update(stokPayload);
    var updatePembelianStockPromise = updatePromise
      .then(function(stock){
        return component.state.pembelianStockInstance;
      });

    updatePromise
      .then(function(stok){
        console.log('Sucess update stock ' + stok.id);
        console.log(stok);
        var updatedInstance = component.state.instance;
        updatedInstance.stock = stok;
        component.setState({
          instance: updatedInstance
        });
        // component.resetFields();
      })
      .catch(function(error){
        console.error(error);
      });

    return updatePembelianStockPromise;
  },

  optionRenderer: function(option){
    return (
      <div>
        <code>{option.code}</code>
        {option.label}
      </div>
    );
  },

  reset: function(){
    console.log('PembelianDetails reset');
    this.resetFields();
  },

  render: function(){
    // console.log('PembelianDetails-Render:');
    // console.log(this.state);

    var kategoriOptions = this.state.kategoriInstances.map(
      function(kategoriInstance, index, arr){
        return {
          value: kategoriInstance.id,
          code: kategoriInstance.kode,
          label: kategoriInstance.nama
        };
      }
    );

    return (
      <div className='row row-margin'>
        <ReactSelectField
          ref='kategori_id'
          inputColumn={3}
          options={kategoriOptions}
          initialValue={this.state.instance.stock.kategori_id}
          readOnly={this.state.isReadOnly}
          validation={['required']}
          optionRenderer={this.optionRenderer}>
        </ReactSelectField>
        <Field
          ref='jumlah'
          inputColumn={3}
          initialValue={this.state.instance.stock.jumlah}
          readOnly={this.state.isReadOnly}
          validation={['required']}
          suffixAddon='Kg'/>
        <Field
          ref='harga'
          inputColumn={3}
          initialValue={this.state.instance.stock.harga}
          readOnly={this.state.isReadOnly}
          validation={['required']}
          prefixAddon='Rp'
          placeholder='@unit'/>
        {!this.state.isReadOnly && (
          <div className="col-xs-3">
            <button
              className='btn btn-danger btn-xs'
              onClick={this.props.onRemoveClick}>
              <i className='fa fa-trash'/>
            </button>
          </div>
        )}
      </div>
    );
  }
});

module.exports = {
  Header: Header,
  Element: Element
};
