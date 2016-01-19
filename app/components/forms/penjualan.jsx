var React = require('react');
var Box = require('../box');
var Field = require('./fields/field');
var DateField = require('./fields/date-field');
var ReactSelectField = require('./fields/react-select-field');
var PenjualanDetails = require('./penjualan-details');
var DynamicForm = require('./dynamic-form');
var Alert = require('../alert');
var Vendor = window.Models.Vendor;
var Penjualan = window.Models.Penjualan;
var PenjualanStock = window.Models.PenjualanStock;
var Kategori = window.Models.Kategori;
var FormMixin = require('../mixins/form-mixin');
var Promise = require('bluebird');
var _ = require('lodash');
var sequelize = window.Models.Kategori.sequelize;

var PenjualanForm = React.createClass({
  mixins: [FormMixin],
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']).isRequired,
    instanceId: React.PropTypes.number,
    initialIsReadOnly: React.PropTypes.bool
  },

  getInitialState: function(){
    return {
      isReadOnly: this.props.initialIsReadOnly,
      vendorInstances: [],
      availabilityInstances: [],
      penjualanInstance: {
        tanggal: null,
        vendor_id: null,
        nota: null
      },
      penjualanStockInstances: null,
      errorMessages: null
    };
  },

  componentDidMount: function(){
    var component = this;
    var vendorInstancesResult = null;
    var categoryAvailabilityResult = null;

    // Initialize vendor selection
    Vendor
    .findAll()
    .then(function onVendorFound(vendorInstances){
      console.log('All vendor found');
      console.log(vendorInstances);
      vendorInstancesResult = vendorInstances;
      return Kategori.getAvailability();
    })
    .then(function onAvailibityFound(availabilityInstances){
      console.log('Availability calculated');
      console.log(availabilityInstances);
      categoryAvailabilityResult = availabilityInstances;

      component.setState({
        vendorInstances: vendorInstancesResult,
        availabilityInstances: categoryAvailabilityResult
      });
    })
    .catch(function onError(error){
      console.log('error initializing penjualan form');
      console.log(error);
    });
    console.log(this.props)
    // Edit mode: Fetch penjualan instance
    if(this.props.mode === 'edit'){
      Penjualan
        .findById(this.props.instanceId)
        .then(function onPenjualanFound(penjualan){
          console.log('penjualan found');
          console.log(penjualan);
          component.setState({penjualanInstance: penjualan});
          return penjualan.getPenjualanStocks();
        })
        .then(function onPenjualanStocksFound(penjualanStocks){
          console.log('Pembelian stocks found');
          console.log(penjualanStocks);
          component.setState({penjualanStockInstances: penjualanStocks});
        })
        .catch(function onError(error){
          console.log('Failed to fetch penjualan ' + component.props.instanceId);
          console.log(error);
        });
    }
  },

  save: function(){
    event.preventDefault();
    this.resetAlert();
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Penjualan form is invalid');
      console.log('Invalid: ');
      console.log(formErrors);
      return;
    }

    // Prepare stock for penjualan-details
    var penjualanDetailForms = this.refs['penjualan_stocks']
      .getChildrenForms()
      .map(function(form){
        return form.component;
      });

    var preparationPromise = this.preparePenjualanDetailForms(penjualanDetailForms);
    var component = this;

    preparationPromise
      .then(function(){
        var penjualanPayload = component.collectPayload();
        return Penjualan.create(penjualanPayload);
      })
      .then(function onPenjualanCreationSuccess(penjualan){
        console.log("success creating new penjualan!");
        console.log(penjualan);

        // Instruct child forms to save
        var penjualanStockPromises = component.getChildrenForms().map(
          function(childForm, index, arr){
            return childForm.component.save({
                penjualan: penjualan
              });
          }
        );
        return Promise.all(penjualanStockPromises);
      })
      .then(function onPenjualanStocksSaved(penjualanStocks){
        console.log(penjualanStocks);
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
      .catch(function onPenjualanCreationError(error){
        console.log("Failed creating new penjualan...");
        console.log(error);

        component.setState({errorMessages: [error.message]});
        component.refs['error-alert'].show();
      });

  },

  saveChanges: function(){
    event.preventDefault();
    this.resetAlert();
    var formErrors = this.validate({ignoreAdditionalValidation: true});

    if(formErrors.length > 0){
      console.log('Penjualan form is invalid');
      console.log('Invalid: ');
      console.log(formErrors);
      throw new Error('Invalid!');
    }
    var component = this;

    sequelize.transaction({
      isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
    },function(t){
      var editedPenjualanDetails = component.refs['penjualan_stocks']
        .getEditedForms();

      var deleteChildPromises = editedPenjualanDetails.map(function(form){
        return form.component.delete({transaction: t});
      });

      var childPromises = Promise.all(_.flatten(deleteChildPromises, true));
      return childPromises
        .then(function onDeleteOldDetailSucess(){
          // Prepare stock for penjualan-details
          var newPenjualanDetailForms = component.refs['penjualan_stocks']
            .getNewForms();
          var editedPenjualanDetailForms = component.refs['penjualan_stocks']
            .getEditedForms();

          var penjualanDetailForms = newPenjualanDetailForms
            .concat(editedPenjualanDetailForms)
            .map(function(form){
              return form.component;
            });

          return component.preparePenjualanDetailForms(penjualanDetailForms, t);
        })
        .then(function onStockAllocationSuccess(){
          var penjualanPayload = component.collectPayload();
          return component.state.penjualanInstance.update(penjualanPayload,{
            transaction: t
          });
        })
        .then(function onPenjualanUpdateSuccess(penjualan){
          console.log("success updating new penjualan!");
          console.log(penjualan);

          // Instruct child forms to save changes
          var penjualanStockPromises = component.getChildrenForms().map(
            function(childForm, index, arr){
              return childForm.component.saveChanges({
                  penjualan: penjualan,
                  transaction: t
                });
            }
          );
          return Promise.all(_.flatten(penjualanStockPromises, true));
        })
        .then(function onPenjualanStocksUpdated(penjualanStocks){
          console.log('success updating penjualan stocks!');
          console.log(penjualanStocks);
          component.refs['edit-success-alert'].show();
          component.resetFields();
          component.resetChildrenForms();
          component.setReadOnly(true);

          var newPenjualanStocks = penjualanStocks.filter(function(s){
            return s && s.isNewRecord === false ;
          });

          console.log(newPenjualanStocks);

          component.setState({
            penjualanStockInstances: newPenjualanStocks
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
          console.log("Failed creating new penjualan...");
          console.log(error);

          component.setState({errorMessages: [error.message]});
          component.refs['error-alert'].show();

          throw new Error('Invalid transaction!');
        });
    })
    .then(function(){
      console.log('Penjualan-saveChanges: committed');
    })
    .catch(function(error){
      console.log('Penjualan-saveChanges: rollback');
      console.log(error);
    });


    // var penjualanPayload = this.collectPayload();
    // component.state.penjualanInstance
    //   .update(penjualanPayload)
    //   .then(function onPenjualanCreationSuccess(penjualan){
    //     console.log("success updating penjualan!");
    //     console.log(penjualan);
    //     component.setState({penjualanInstance: penjualan});
    //
    //     // Instruct child forms to save changes
    //     var childrenFormsPromise = component.getChildrenForms().map(
    //       function(childForm, index, arr){
    //         var childPromise = childForm.component.saveChanges(penjualan);
    //         console.log('Penjualan-childPromise:');
    //         console.log(childPromise);
    //
    //         return childPromise;
    //       }
    //     );
    //
    //     childrenFormsPromise = _.flatten(childrenFormsPromise, true);
    //     console.log('Penjualan-childrenPromise:');
    //     console.log(childrenFormsPromise);
    //     return Promise.all(childrenFormsPromise);
    //   })
    //   .then(function onAllChildrenFormsUpdated(penjualanStocks){
    //     console.log('PenjualanStocks updated');
    //     console.log(penjualanStocks);
    //     component.refs['edit-success-alert'].show();
    //     component.resetFields();
    //     component.resetChildrenForms();
    //     component.setReadOnly(true);
    //
    //     var newPenjualanStocks = penjualanStocks.filter(function(s){
    //       return s.isNewRecord === false ;
    //     });
    //
    //     console.log(newPenjualanStocks);
    //
    //     component.setState({
    //       penjualanStockInstances: newPenjualanStocks
    //     });
    //   })
    //   .catch(function onPenjualanCreationError(error){
    //     console.log("Failed to update penjualan...");
    //     console.log(error);
    //   });
  },

  preparePenjualanDetailForms: function(penjualanDetailForms, transaction){
    var categoryIdSet = new Set();
    for(var i = 0, n = penjualanDetailForms.length; i < n; i++){
      console.log(penjualanDetailForms[i]);
      var payload = penjualanDetailForms[i].collectPayload();
      categoryIdSet.add(payload['kategori_id']);
    }

    var categoryIds = [];
    categoryIdSet.forEach(function(categoryId){
      categoryIds.push(categoryId);
    });

    var assignmentPromise = this.getAvailability(categoryIds, transaction)
      .then(function(results){
        for(var i = 0, n = penjualanDetailForms.length; i < n; i++){
          var payload = penjualanDetailForms[i].collectPayload();
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

          penjualanDetailForms[i].setCandidates(candidates);
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

  resetAlert: function(){
    this.refs['add-success-alert'].hide();
    this.refs['edit-success-alert'].hide();
    this.refs['error-alert'].hide();
  },

  optionRenderer: function(option){
    return (
      <div>
        <span className='label label-warning'> V{option.value}</span>
        {option.label}
      </div>
    );
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
    var vendorOptions = this.state.vendorInstances.map(
      function(vendorInstance, index, arr){
        return {
          value: vendorInstance.id,
          label: vendorInstance.nama
        };
      }
    );

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

    console.log('Render-Penjualan-instance:');
    console.log(this.state.penjualanInstance);
    console.log('Render-Penjualan-pembelianStockInstance:');
    console.log(this.state.penjualanStockInstances);
    return (
      <form role="form" className="form-horizontal" onSubmit={this.formHandler}>
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Penjualan Baru'/>
          <Box.Body>
            <div className="row">
              <div className="col-xs-12">
                <Alert
                  ref='add-success-alert'
                  type='success' show={false}
                  title={<div><i className='icon fa fa-check'/> Success!</div>}>
                  Penjualan successfully added
                </Alert>
                <Alert
                  ref='edit-success-alert'
                  type='info' show={false}
                  title={<div><i className='icon fa fa-check'/> Success!</div>}>
                  Penjualan successfully updated
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
                  htmlId='tanggal'
                  label='Tanggal'
                  validation={['required']}
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.penjualanInstance.tanggal}/>
                <Field
                  ref='nota'
                  inputColumn={10}
                  htmlId='pembelian-nota'
                  label='Nota'
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.penjualanInstance.nota}/>
                <ReactSelectField
                  ref='vendor_id'
                  inputColumn={10}
                  htmlId='vendor_id'
                  label='Vendor'
                  optionRenderer={this.optionRenderer}
                  validation={['required']}
                  readOnly={this.state.isReadOnly}
                  options={vendorOptions}
                  initialValue={this.state.penjualanInstance.vendor_id}>
                </ReactSelectField>
                <hr/>
              </div>
            </div>
          </Box.Body>
        </Box.Container>
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Daftar Barang'/>
          <Box.Body>
            <DynamicForm
              header={PenjualanDetails.Header}
              element={PenjualanDetails.Element}
              ref='penjualan_stocks'
              mode={this.props.mode}
              instances={this.state.penjualanStockInstances}
              initialIsReadOnly={this.state.isReadOnly}
              childFormParams={{
                availabilityInstances: this.state.availabilityInstances
              }}
              />
          </Box.Body>
        </Box.Container>
        <div className="row">
          <div className="col-xs-12">
            {buttons}
          </div>
        </div>
      </form>
    );
  }
});

module.exports = PenjualanForm;
