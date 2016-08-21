var React = require('react');
var Field = require('./fields/field');
var ReactSelectField = require('./fields/react-select-field');
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
      return instance.destroy().then(function(){
        console.log('Konversi In Stock successfully deleted');
      });
    }
  },
  propTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']),
    instance: React.PropTypes.object,
    onRemoveClick: React.PropTypes.func.isRequired,
    initialIsReadOnly: React.PropTypes.bool,
    params: React.PropTypes.object
  },

  getInitialState: function(){
    console.log('KonversiInForm-INITIAL_STATE');
    console.log(this.props);

    return {
      isReadOnly: this.props.initialIsReadOnly,
      currentCategoryId: this.getCurrentCategoryId(),
      instance: {
        id: null,
        jumlah: null,
        stock: {
          kategori_id: null
        }
      },
      konversiInStockInstance: null,
      candidates: null,
      errorMessage: null
    };
  },

  componentDidMount: function(){
    var component = this;

    if(component.props.instance){
      var instance = component.props.instance;
      instance.getStock()
        .then(function(stock){
          if(component.isMounted()){
            component.setState({
              instance: {
                id: instance.id,
                jumlah: instance.jumlah,
                stock: stock
              },
              konversiInStockInstance: instance
            });
          }
        });
    }
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('CWRP-KonversiInForm-nextProps');
    console.log(nextProps);
    if(nextProps.instance
      && nextProps.instance !== this.props.instance){
      // Update instance
      this.updateState(nextProps.instance);
    }

    // Update selected category
    this.setState({
      currentCategoryId: this.getCurrentCategoryId(nextProps)
    });
  },

  updateState: function(konversiInStock){
    if(konversiInStock){
      var component = this;
      konversiInStock.getStock()
        .then(function onStockFound(stock){
          component.setState({
            instance: {
              id: konversiInStock.id,
              jumlah: konversiInStock.jumlah,
              stock: stock
            },
            konversiInStockInstance: konversiInStock
          });
        })
        .catch(function onRetrieveStockError(error){
          console.log(error);
        });
    }
  },

  getCurrentCategoryId: function(newProps){
    var props = newProps || this.props;

    // Cases:
    // No instance. No selected. No availability = null
    // No instance. No selected. available  = first_element.id
    // Instance. No selected = instance.kategory.id
    // Instance. Selected = selected.id
    // 1st priority: selected cateory
    if(this.state
      && this.state.currentCategoryId) {
      return this.state.currentCategoryId;
    }
    // 2nd priority: instance kategori_id
    else if(this.state
      && this.state.instance
      && this.state.instance.stock.kategori_id){
      return this.state.instance.stock.kategori_id;
    }
    // 3rd priority: first element of stock availability
    else{
      if(props.params
        && props.params.availabilityInstances
        && props.params.availabilityInstances.length > 0){
        return props.params.availabilityInstances[0].id;
      } else {
        return null;
      }
    }
  },

  setCandidates: function(candidates){
    console.log(candidates);
    this.setState({candidates: candidates});
  },

  save: function(args){
    var component = this;

    // Assign candidates
    var konversiInStockPayloads = [];
    var promises = this.state.candidates.map(function(candidate){
      var formPayload = component.collectPayload();
      var payload = {
        konversi_id: args.konversi.id,
        stok_id: candidate.stockId,
        jumlah: candidate.amount
      };
      return KonversiInStock.create(payload, {
        transaction: args.transaction
      });
    });
    var konversiInStockPromises = Promise.all(promises);

    konversiInStockPromises
      .then(function(konversiInStocks){
        console.log('success. new konversi stocks');
        console.log(konversiInStocks);
        // component.resetFields();
      })
      .catch(function(error){
        console.error(error);
      });

    return promises;
  },

  saveChanges: function(args){
    return this.save(args);
  },

  delete: function(args){
    return this.state.konversiInStockInstance.destroy({
      transaction: args.transaction
    });
  },

  optionRenderer: function(option){
    return (
      <div>
        <code>{option.code}</code>
        {option.label}
      </div>
    );
  },

  handleNewCategory: function(newCategoryId){
    console.log('newCategoryId:');
    console.log(newCategoryId);
    this.setState({currentCategoryId: newCategoryId});
  },

  getCategory: function(categoryId){
    console.log(this.props.params)
    if(categoryId === null ||
      !this.props.params ||
      !this.props.params.availabilityInstances) {
      console.log('invalidCategoryId:' + categoryId);
      return {};
    }

    var results = this.props.params.availabilityInstances.filter(function(instance){
      return instance.id === categoryId;
    });
    console.log('results:');
    console.log(results);

    return results.length > 0 ? results[0] : [];
  },

  additionalValidation: function(){
    var payload = this.collectPayload();
    var currentCategory = this.getCategory(this.state.currentCategoryId);
    var validationResult = null;

    if(payload.jumlah > currentCategory.sisa){
      validationResult = {
        ref: 'konversi-in-stocks',
        errors : ['Jumlah > Sisa']
      }
    }

    this.setState({
      errorMessage: validationResult && validationResult.errors[0]
    });

    return [validationResult];
  },

  reset: function(){
    console.log('KonversiInForm reset');
    this.resetFields();
    this.setState({errorMessage: null});
  },

  render: function(){
    // console.log('PembelianDetails-Render:');
    // console.log(this.state);
    var currentCategory = this.getCategory(this.state.currentCategoryId);

    var kategoriOptions = this.props.params &&
    (this.props.params.availabilityInstances || []).map(
        function(availabilityInstance, index, arr){
          return {
            value: availabilityInstance.id,
            code: availabilityInstance.kode,
            label: availabilityInstance.nama
          };
        }
      );

    return (
      <div className='row row-margin'>
        <ReactSelectField
          ref='kategori_id'
          inputColumn={6}
          options={kategoriOptions}
          initialValue={this.state.instance.stock.kategori_id}
          readOnly={this.state.isReadOnly}
          validation={['required']}
          optionRenderer={this.optionRenderer}
          onChange={this.handleNewCategory}>
        </ReactSelectField>
        <Field
          ref='jumlah'
          inputColumn={4}
          initialValue={this.state.instance.jumlah}
          readOnly={this.state.isReadOnly}
          validation={['required', 'isNumber']}
          suffixAddon={currentCategory ? currentCategory.satuan : '-'}
          placeholder={'Tersisa: ' + currentCategory.sisa}
          dataType='number'/>
        <div className="col-xs-2">
        {!this.state.isReadOnly && (
            <button
              className='btn btn-danger btn-xs'
              onClick={this.props.onRemoveClick}>
              <i className='fa fa-trash'/>
            </button>
        )}
        {
          this.state.errorMessage && (<code>{this.state.errorMessage}</code>)
        }
        </div>
      </div>
    );
  }
});

module.exports = {
  Header: Header,
  Element: Element
};
