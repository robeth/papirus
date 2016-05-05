var React = require('react');
var Field = require('./fields/field');
var ReactSelectField = require('./fields/react-select-field');
var ModelProxy = require('../../models/proxy');
var FormMixin = require('../mixins/form-mixin');

var Header = React.createClass({
  render: function(){
    return (
      <div className="row row-margin">
        <div className="col-xs-6 text-center">Kategori</div>
        <div className="col-xs-4 text-center">Unit</div>
        <div className="col-xs-2 text-center"></div>
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
          return ModelProxy.get('Stock').destroy({
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
    console.log('KonversiOutForm-INITIAL_STATE');
    console.log(this.props);
    return {
      isReadOnly: this.props.initialIsReadOnly,
      instance: {
        id: null,
        stock: {
          id: null,
          kategori_id: null,
          jumlah: null,
        }
      },
      konversiOutStockInstance: null,
      kategoriInstances: []
    };
  },

  componentDidMount: function(){
    var component = this;

    // Initialize kategori for detail konversi forms
    ModelProxy.get('Kategori')
      .findAll()
      .then(function onFound(kategoriInstances){
        if(component.isMounted()){
          component.setState({kategoriInstances: kategoriInstances});
        }
      });
    this.updateState(this.props.instance);
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('KonversiOutForm-CWRP-nextProps:');
    console.log(nextProps);
    if(nextProps.mode === 'edit' &&
      nextProps.instance &&
      nextProps.instance !== this.props.instance){
      this.updateState(nextProps.instance);
    }
  },

  updateState: function(konversiOutStock){
    console.log('KonversiOutForm-Update-state');
    if(konversiOutStock){
      var component = this;
      konversiOutStock.getStock()
        .then(function onStockFound(stock){
          console.log('KonversiOutForm-Update-state-stock');
          console.log(stock);
          if(component.isMounted()){
            component.setState({
              instance: {
                id: konversiOutStock.id,
                stock: stock
              },
              konversiOutStockInstance: konversiOutStock
            });
          }
        })
        .catch(function onRetrieveStockError(error){
          console.log(error);
        });
    }
  },

  save: function(args){
    var stockPayload = this.collectPayload();
    stockPayload.tanggal = args.konversi.tanggal;
    stockPayload.harga = args.price;
    var component = this;

    var newKonversiOutStockPromise = ModelProxy.get('Stock')
      .create(stockPayload, {
        transaction: args.transaction
      })
      .then(function(stok){
        console.log('success. new stok');
        console.log(stok);
        var konversiInStockPayload = {
          stok_id: stok.id,
          konversi_id: args.konversi.id
        };

        return ModelProxy.get('KonversiOutStock').create(konversiInStockPayload,{
          transaction: args.transaction
        });
      });

    newKonversiOutStockPromise
      .then(function(konversiInStock){
        console.log('success. new stok konversi');
        console.log(konversiInStock);
        // component.resetFields();
      })
      .catch(function(error){
        console.error(error);
      });

    return newKonversiOutStockPromise;
  },

  saveChanges: function(args){
    var stockPayload = this.collectPayload();
    console.log('KonversiOutForm-saveChanges-prevStock:');
    console.log(this.state.instance);
    console.log('KonversiOutForm-saveChanges-payload:')
    stockPayload.tanggal = args.konversi.tanggal;
    stockPayload.harga = args.price;
    console.log(stockPayload);
    var component = this;
    var updatePromise = component.state.instance.stock.update(stockPayload, {
      transaction: args.transaction
    });
    var updateKonversiOutStockPromise = updatePromise
      .then(function(stock){
        return component.state.konversiOutStockInstance;
      });

    updatePromise
      .then(function(stock){
        console.log('Sucess update stock ' + stock.id);
        console.log(stock);
        var updatedInstance = component.state.instance;
        updatedInstance.stock = stock;
        component.setState({
          instance: updatedInstance
        });
        // component.resetFields();
      })
      .catch(function(error){
        console.error(error);
      });

    return updateKonversiOutStockPromise;
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
    console.log('KonversiOutForm reset');
    this.resetFields();
  },

  render: function(){
    // console.log('KonversiOutForm-Render:');
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
          htmlId={'konversi-stock-kategori-id-' + this.props.index}
          inputColumn={6}
          options={kategoriOptions}
          initialValue={this.state.instance.stock.kategori_id}
          readOnly={this.state.isReadOnly}
          validation={['required']}
          optionRenderer={this.optionRenderer}>
        </ReactSelectField>
        <Field
          ref='jumlah'
          htmlId={'konversi-stock-jumlah-' + this.props.index}
          inputColumn={4}
          initialValue={this.state.instance.stock.jumlah}
          readOnly={this.state.isReadOnly}
          validation={['required', 'isNumber']}
          suffixAddon='Kg'/>
        {!this.state.isReadOnly && (
          <div className="col-xs-2">
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
