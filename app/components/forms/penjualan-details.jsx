var React = require('react');
var Field = require('./fields/field');
var ReactSelectField = require('./fields/react-select-field');
var Kategori = window.Models.Kategori;
var Stock = window.Models.Stock;
var PenjualanStock = window.Models.PenjualanStock;
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
      return instance.destroy();
    }
  },
  propTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']),
    instance: React.PropTypes.object,
    onRemoveClick: React.PropTypes.func.isRequired,
    initialIsReadOnly: React.PropTypes.bool
  },

  getInitialState: function(){
    console.log('PenjualanDetails-INITIAL_STATE');
    console.log(this.props);
    return {
      isReadOnly: this.props.initialIsReadOnly,
      instance: {
        id: null,
        jumlah: null,
        harga: null
      },
      penjualanStockInstance: null,
      kategoriInstances: []
    };
  },

  componentDidMount: function(){
    var component = this;

    // Initialize kategori for detail penjualan forms
    Kategori
      .findAll()
      .then(function onFound(kategoriInstances){
        component.setState({kategoriInstances: kategoriInstances});
      });
    this.updateState(this.props.instance);
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('PenjualanDetails-CWRP-nextProps:');
    console.log(nextProps);
    if(nextProps.mode === 'edit' &&
      nextProps.instance &&
      nextProps.instance !== this.props.instance){
      this.updateState(nextProps.instance);
    }
  },

  updateState: function(penjualanStock){
    console.log('PenjualanDetails-Update-state');
    if(penjualanStock){
      var component = this;
      penjualanStock.getStock()
        .then(function onStockFound(stock){
          console.log('PenjualanDetails-Update-state-stock');
          console.log(stock);
          component.setState({
            instance: {
              id: penjualanStock.id,
              stock: stock
            },
            penjualanStockInstance: penjualanStock
          });
        })
        .catch(function onRetrieveStockError(error){
          console.log(error);
        });
    }
  },

  save: function(args){
    var penjualanStockPayload = this.collectPayload();
    // TODO: find valid stok id (available & FIFO)
    penjualanStockPayload.stok_id = 1;
    penjualanStockPayload.penjualan_id = args.id;
    var component = this;

    var newPenjualanStockPromise = PenjualanStock.create(penjualanStockPayload);

    newPenjualanStockPromise
      .then(function(penjualanStock){
        console.log('success. new penjualan stock');
        console.log(penjualanStock);
        // component.resetFields();
      })
      .catch(function(error){
        console.error(error);
      });

    return newPenjualanStockPromise;
  },

  saveChanges: function(args){
    // var stokPayload = this.collectPayload();
    // console.log('PembelianDetails-saveChanges-prevStock:');
    // console.log(this.state.instance);
    // console.log('PembelianDetails-saveChanges-payload:')
    // stokPayload.tanggal = args.tanggal;
    // console.log(stokPayload);
    // var component = this;
    // var updatePromise = component.state.instance.stock.update(stokPayload);
    // var updatePembelianStockPromise = updatePromise
    //   .then(function(stock){
    //     return component.state.pembelianStockInstance;
    //   });
    //
    // updatePromise
    //   .then(function(stok){
    //     console.log('Sucess update stock ' + stok.id);
    //     console.log(stok);
    //     var updatedInstance = component.state.instance;
    //     updatedInstance.stock = stok;
    //     component.setState({
    //       instance: updatedInstance
    //     });
    //     // component.resetFields();
    //   })
    //   .catch(function(error){
    //     console.error(error);
    //   });

    // return updatePembelianStockPromise;
    throw "Unimplemented Error";
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
    console.log('PenjualanDetails reset');
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
          initialValue={this.state.instance.kategori_id}
          readOnly={this.state.isReadOnly}
          validation={['required']}
          optionRenderer={this.optionRenderer}>
        </ReactSelectField>
        <Field
          ref='jumlah'
          inputColumn={3}
          initialValue={this.state.instance.jumlah}
          readOnly={this.state.isReadOnly}
          validation={['required']}
          suffixAddon='Kg'/>
        <Field
          ref='harga'
          inputColumn={3}
          initialValue={this.state.instance.harga}
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
