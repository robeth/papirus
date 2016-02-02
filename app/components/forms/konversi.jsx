var React = require('react');
var Box = require('../box');
var Field = require('./fields/field');
var DateField = require('./fields/date-field');
var ReactSelectField = require('./fields/react-select-field');
var KonversiInForm = require('./konversi-in-form');
var KonversiOutForm = require('./konversi-out-form');
var DynamicForm = require('./dynamic-form');
var Alert = require('../alert');
var Konversi = window.Models.Konversi;
var KonversiInStock = window.Models.KonversiInStock;
var KonversiOutStock = window.Models.KonversiOutStock;
var Kategori = window.Models.Kategori;
var FormMixin = require('../mixins/form-mixin');
var Promise = require('bluebird');
var _ = require('lodash');
var sequelize = window.Models.Kategori.sequelize;

var KonversiForm = React.createClass({
  mixins: [FormMixin],
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']).isRequired,
    instanceId: React.PropTypes.number,
    initialIsReadOnly: React.PropTypes.bool
  },

  getInitialState: function(){
    return {
      isReadOnly: this.props.initialIsReadOnly,
      availabilityInstances: [],
      konversiInstance: {
        tanggal: null,
        kode: null
      },
      konversiInStockInstances: null,
      konversiOutStockInstances: null,
      errorMessages: null
    };
  },

  componentDidMount: function(){
    var component = this;

    Kategori
    .getAvailability()
    .then(function onAvailibityFound(availabilityInstances){
      console.log('Availability calculated');
      console.log(availabilityInstances);
      categoryAvailabilityResult = availabilityInstances;

      component.setState({
        availabilityInstances: availabilityInstances
      });
    })
    .catch(function onError(error){
      console.log('error initializing penjualan form');
      console.log(error);
    });

    console.log(this.props)
    // Edit mode: Fetch konversi instance
    if(this.props.mode === 'edit'){
      var konversiInstance = null;
      Konversi
        .findById(this.props.instanceId)
        .then(function onKonversiFound(konversi){
          console.log('konversi found');
          console.log(konversi);
          konversiInstance = konversi;

          component.setState({konversiInstance: konversi});
          return konversi.getKonversiInStocks();
        })
        .then(function onKonversiInStocksFound(konversiInStocks){
          console.log('Konversi In stocks found');
          console.log(konversiInStocks);
          component.setState({konversiInStockInstances: konversiInStocks});

          return konversiInstance.getKonversiOutStocks();
        })
        .then(function onKonversiOutStocksFound(konversiOutStocks){
          console.log('Konversi Out stocks found');
          console.log(konversiOutStocks);
          component.setState({konversiOutStockInstances: konversiOutStocks});
        })
        .catch(function onError(error){
          console.log('Failed to fetch konversi ' + component.props.instanceId);
          console.log(error);
        });
    }
  },

  save: function(){
    event.preventDefault();
    this.resetAlert();
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Konversi form is invalid');
      console.log('Invalid: ');
      console.log(formErrors);
      return;
    }

    // Prepare stock for penjualan-details
    var konversiInForms = this.refs['konversi_in_form_group']
      .getChildrenForms()
      .map(function(form){
        return form.component;
      });

    var component = this;
    var newKonversiInstance = null;

    var konversiInFormGroup = component.refs['konversi_in_form_group'];
    var konversiOutFormGroup = component.refs['konversi_out_form_group'];

    sequelize.transaction({
      isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
    },function(t){
      var preparationPromise = component.prepareKonversiInForms(konversiInForms, t);
      return preparationPromise
        .then(function(){
          var konversiPayload = component.collectPayload();
          return Konversi.create(konversiPayload, {
            transaction: t
          });
        })
        .then(function onKonversiCreationSuccess(konversi){
          console.log("success creating new konversi!");
          console.log(konversi);
          newKonversiInstance = konversi;

          // Instruct child forms to save
          var konversiInStockPromises = konversiInFormGroup.save({
            konversi: konversi,
            transaction: t
          });

          return Promise.all(_.flatten(konversiInStockPromises, true));
        })
        .then(function onKonversiInStocksSaved(konversiInStocks){
          console.log('Konversi in stocks saved!');
          console.log(konversiInStocks);

          return component.calculateKonversiValue(konversiInStocks);
        })
        .then(function onKonversiValueCalculated(konversiValue){
          console.log('Konversi value calculated!');
          console.log(konversiValue);

          var outputQuantity =  component.calculateResultQuantity();
          var konversiOutStockPromises = konversiOutFormGroup.save({
            konversi: newKonversiInstance,
            price: konversiValue/outputQuantity,
            transaction: t
          });

          return Promise.all(konversiOutStockPromises);
        })
        .then(function onKonversiOutStocksSaved(konversiOutStocks){
          console.log(konversiOutStocks);
          component.refs['add-success-alert'].show();
          component.resetFields();
          component.resetChildrenForms();
          return Kategori.getAvailability();
        })
        .then(function onAvailibityFound(availabilityInstances){
          console.log('Availability calculated');
          console.log(availabilityInstances);

          component.setState({
            availabilityInstances: availabilityInstances
          });
        })
        .catch(function onKonversiCreationError(error){
          console.log("Failed creating new konversi...");
          console.log(error);

          component.setState({errorMessages: [error.message]});
          component.refs['error-alert'].show();

          throw error;
        });
    })
    .then(function(){
      console.log('Konversi-save: committed');
    })
    .catch(function(error){
      console.log('Konversi-save: rollback');
      console.log(error);
    });

  },

  saveChanges: function(){
    event.preventDefault();
    this.resetAlert();
    var formErrors = this.validate({ignoreAdditionalValidation: true});

    if(formErrors.length > 0){
      console.log('Konversi form is invalid');
      console.log('Invalid: ');
      console.log(formErrors);
      throw new Error('Invalid!');
    }
    var component = this;
    var editedKonversi = null;
    var konversiInFormGroup = component.refs['konversi_in_form_group'];
    var konversiOutFormGroup = component.refs['konversi_out_form_group'];

    sequelize.transaction({
      isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
    },function(t){
      var konversiInForms = component.refs['konversi_in_form_group']
        .getEditedForms();

      var deleteChildPromises = konversiInForms.map(function(form){
        return form.component.delete({transaction: t});
      });

      var childPromises = Promise.all(_.flatten(deleteChildPromises, true));
      return childPromises
        .then(function onDeleteOldDetailSucess(){
          // Prepare stock for penjualan-details
          var newKonversiInForms = konversiInFormGroup.getNewForms();
          var editedKonversiInForms = konversiInFormGroup.getEditedForms();

          var konversiInForms = newKonversiInForms
            .concat(editedKonversiInForms)
            .map(function(form){
              return form.component;
            });

          return component.prepareKonversiInForms(konversiInForms, t);
        })
        .then(function onStockAllocationSuccess(){
          var konversiPayload = component.collectPayload();
          return component.state.konversiInstance.update(konversiPayload,{
            transaction: t
          });
        })
        .then(function onKonversiUpdateSuccess(konversi){
          console.log("success updating new konversi!");
          console.log(konversi);
          editedKonversi = konversi;

          // Instruct child forms to save changes
          var konversiInStockPromises = konversiInFormGroup.saveChanges({
            konversi: konversi,
            transaction: t
          });

          return Promise.all(_.flatten(konversiInStockPromises, true));
        })
        .then(function onKonversiInStocksUpdated(konversiInStocks){
          console.log('Konversi in stocks updated!');
          console.log(konversiInStocks);

          var newKonversiStocks = konversiInStocks.filter(function(s){
            return s && s.isNewRecord === false ;
          });

          console.log(newKonversiStocks);

          component.setState({
            konversiInStockInstances: newKonversiStocks
          });

          return component.calculateKonversiValue(konversiInStocks);
        })
        .then(function onKonversiValueCalculated(konversiValue){
          console.log('Konversi value calculated!');
          console.log(konversiValue);

          var outputQuantity =  component.calculateResultQuantity();
          var konversiOutStockPromises = konversiOutFormGroup.saveChanges({
            konversi: editedKonversi,
            price: konversiValue/outputQuantity,
            transaction: t
          });

          return Promise.all(_.flatten(konversiOutStockPromises, true));
        })
        .then(function onKonversiOutStocksUpdated(konversiOutStocks){
          console.log('success updating konversi out stocks!');
          console.log(konversiOutStocks);
          component.refs['edit-success-alert'].show();
          component.resetFields();
          component.resetChildrenForms();
          component.setReadOnly(true);

          var newKonversiOutStocks = konversiOutStocks.filter(function(s){
            return s && s.isNewRecord === false ;
          });

          console.log(newKonversiOutStocks);

          component.setState({
            konversiOutStockInstances: newKonversiOutStocks
          });

          return Kategori.getAvailability();
        })
        .then(function onAvailibityFound(availabilityInstances){
          console.log('Availability calculated');
          console.log(availabilityInstances);

          component.setState({
            availabilityInstances: availabilityInstances
          });
        })
        .catch(function onUpdateProcessError(error){
          console.log("Failed creating new konversi...");
          console.log(error);

          component.setState({errorMessages: [error.message]});
          component.refs['error-alert'].show();

          throw new Error('Invalid transaction!');
        });
    })
    .then(function(){
      console.log('Konversi-saveChanges: committed');
    })
    .catch(function(error){
      console.log('Konversi-saveChanges: rollback');
      console.log(error);
    });

  },

  prepareKonversiInForms: function(konversiInForms, transaction){
    var categoryIdSet = new Set();
    for(var i = 0, n = konversiInForms.length; i < n; i++){
      console.log(konversiInForms[i]);
      var payload = konversiInForms[i].collectPayload();
      categoryIdSet.add(payload['kategori_id']);
    }

    var categoryIds = [];
    categoryIdSet.forEach(function(categoryId){
      categoryIds.push(categoryId);
    });

    var assignmentPromise = this.getAvailability(categoryIds, transaction)
      .then(function(results){
        for(var i = 0, n = konversiInForms.length; i < n; i++){
          var payload = konversiInForms[i].collectPayload();
          var expectedAmount = parseFloat(payload.jumlah);
          console.log('Candidate ' + i + ' : ' + expectedAmount);
          var categoryId = payload.kategori_id;
          var candidates = [];

          for(var j = 0, m = results[categoryId].length; j < m;){
            // 1st loop control: expectedAmount is satisfied
            console.log('Stock ' + i + ' : available ' + results[categoryId][j].sisa);
            if(expectedAmount <= 0){
              break;
            }

            var candidate = results[categoryId][j];
            if(candidate.sisa > 0) {
              var currentAmount = Math.min(expectedAmount, candidate.sisa);
              candidate.sisa -= currentAmount;
              expectedAmount -= currentAmount;
              candidates.push({
                stockId: candidate.id,
                amount: currentAmount
              });
            }
            // 2nd loop control: iterate through candidates
            if(candidate.sisa === 0){
              j++;
            }
          }

          if(expectedAmount !== 0) {
            throw new Error('Insufficient amount of '
              + categoryId + ': -' + expectedAmount);
          }

          konversiInForms[i].setCandidates(candidates);
        }
      });

    return assignmentPromise;
  },

  getAvailability: function(categoryIds, transaction){
    var queryPromises = [];
    categoryIds.map(function(categoryId){
      var queryPromise = Kategori.getRemainingStocks(categoryId, transaction)
        .then(function(availabilities){
          return {categoryId: categoryId, data: availabilities};
        });
      queryPromises.push(queryPromise);
    });

    return Promise.all(queryPromises)
      .then(function(results){
        console.log('Availabilities result:');
        console.log(results);
        var availabilities = {};
        results.map(function(result){
          availabilities[result.categoryId] = result.data;
        });
        return availabilities;
      });
  },

  calculateKonversiValue: function(inStocks){
    var stockPromises = inStocks.map(function(inStock){
      return inStock.getStock();
    });

    var allStockPromises = Promise.all(_.flatten(stockPromises, true));
    var totalValue = 0

    return allStockPromises
      .then(function onStocksRetrieved(stocks){
        console.log('Success retrieving stocks');
        console.log(stocks);

        inStocks.forEach(function(inStock){
          for(var i = 0; i < stocks.length; i++){
            if(inStock.stok_id === stocks[i].id){
              totalValue += inStock.jumlah * stocks[i].harga;
              continue;
            }
          }
        });

        return totalValue;
      });
  },

  calculateResultQuantity: function(){
    var konversiOutFormGroup = this.refs['konversi_out_form_group'];
    var editedForm = konversiOutFormGroup.getEditedForms();
    var newForm = konversiOutFormGroup.getNewForms();

    var quantity = editedForm.concat(newForm).reduce(function(previousValue, form){
      var payload = form.component.collectPayload();
      return previousValue + parseFloat(payload.jumlah);
    }, 0);

    console.log(quantity);

    return quantity;
  },

  resetAlert: function(){
    this.refs['add-success-alert'].hide();
    this.refs['edit-success-alert'].hide();
    this.refs['error-alert'].hide();
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

    console.log('Render-Konversi-instance:');
    console.log(this.state.konversiInstance);
    console.log('Render-Konversi-konversiInStockInstances:');
    console.log(this.state.konversiInStockInstances);
    return (
      <form role="form" className="form-horizontal" onSubmit={this.formHandler}>
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Konversi Baru'/>
          <Box.Body>
            <div className="row">
              <div className="col-xs-12">
                <Alert
                  ref='add-success-alert'
                  type='success' show={false}
                  title={<div><i className='icon fa fa-check'/> Sukses!</div>}>
                  Konversi baru berhasil dibuat!
                </Alert>
                <Alert
                  ref='edit-success-alert'
                  type='info' show={false}
                  title={<div><i className='icon fa fa-check'/> Sukses!</div>}>
                  Konversi berhasil diubah!
                </Alert>
                <Alert
                  ref='error-alert'
                  type='danger'
                  show={false}
                  title={
                    <div><i className='icon fa fa-bug'/>
                      Unexpected Error!
                    </div>
                  }>
                  <ul>
                    { this.state.errorMessages
                      && this.state.errorMessages.map(function(message){
                        return <li>{message}</li>
                      })
                    }
                  </ul>
                </Alert>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <DateField ref='tanggal'
                  type='single'
                  inputColumn={10}
                  htmlId='konversi-tanggal'
                  label='Tanggal'
                  validation={['required']}
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.konversiInstance.tanggal}/>
                <Field
                  ref='kode'
                  inputColumn={10}
                  htmlId='konversi-kode'
                  label='Nota'
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.konversiInstance.kode}/>
                <hr/>
              </div>
            </div>
          </Box.Body>
        </Box.Container>
        <div className="row">
          <div className="col-md-6 col-xs-12">
            <Box.Container className="box-danger">
              <Box.Header showBorder={true} title='Daftar Input Konversi'/>
              <Box.Body>
                <DynamicForm
                  header={KonversiInForm.Header}
                  element={KonversiInForm.Element}
                  ref='konversi_in_form_group'
                  mode={this.props.mode}
                  instances={this.state.konversiInStockInstances}
                  initialIsReadOnly={this.state.isReadOnly}
                  childFormParams={{
                    availabilityInstances: this.state.availabilityInstances
                  }}
                  />
              </Box.Body>
            </Box.Container>
          </div>
          <div className="col-md-6 col-xs-12">
            <Box.Container className="box-success">
              <Box.Header showBorder={true} title='Daftar Output Konversi'/>
              <Box.Body>
                <DynamicForm
                  header={KonversiOutForm.Header}
                  element={KonversiOutForm.Element}
                  ref='konversi_out_form_group'
                  mode={this.props.mode}
                  instances={this.state.konversiOutStockInstances}
                  initialIsReadOnly={this.state.isReadOnly}
                  childFormParams={{
                    availabilityInstances: this.state.availabilityInstances
                  }}
                  />
              </Box.Body>
            </Box.Container>
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

module.exports = KonversiForm;
