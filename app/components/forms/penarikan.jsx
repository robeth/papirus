var React = require('react');
var Box = require('../box');
var Field = require('./fields/field');
var DateField = require('./fields/date-field');
var ReactSelectField = require('./fields/react-select-field');
var PenarikanDetailTable = require('./others/penarikan-detail-table');
var Alert = require('../alert');
var Nasabah = window.Models.Nasabah;
var Pembelian = window.Models.Pembelian;
var Penarikan = window.Models.Penarikan;
var FormMixin = require('../mixins/form-mixin');
var Promise = require('bluebird');
var _ = require('lodash');
var sequelize = window.Models.Kategori.sequelize;
var HiddenLink = require('../helpers/link-helper').Hidden;

var PenarikanForm = React.createClass({
  mixins: [FormMixin],
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']).isRequired,
    initialNasabahId: React.PropTypes.number,
    instanceId: React.PropTypes.number,
    initialIsReadOnly: React.PropTypes.bool
  },

  getInitialState: function(){
    return {
      isReadOnly: this.props.mode === 'edit',
      selectedNasabahId: 0,
      selectedAmount: 0,
      nasabahInstances: [],
      instance: {
        tanggal: null,
        nasabah_id: null,
        nota: null
      },
      penarikanDetailInstances: null
    };
  },

  componentWillMount: function(){
    var component = this;

    // Initialize nasabah selection
    Nasabah
      .findAll()
      .then(function onFound(nasabahInstances){
        console.log('All nasabah found');
        console.log(nasabahInstances);

        var diffState = {nasabahInstances: nasabahInstances};

        if(component.props.instanceId){
          // Instance provided: edit mode
          Penarikan
            .findAll({
              include: [ {model: Pembelian, as: 'Pembelians'}],
              where: {
                id: component.props.instanceId
              }
            })
            .then(function(results){
              console.log('Success retrieving penarikan instance');
              console.log(results);

              var penarikanInstance = results[0];
              penarikanInstance.total = penarikanInstance.Pembelians
                .map(function(pembelian){
                  return pembelian.PenarikanDetail.jumlah
                })
                .reduce(function(prevValue, current){
                  return prevValue + current
                }, 0);

              console.log(penarikanInstance);
              diffState.instance = penarikanInstance;
              diffState.selectedNasabahId = penarikanInstance.nasabah_id;
              component.setState(diffState);
            })
            .catch(function(error){
              console.log('Error retrieving penarikan instance');
              console.log(error);
            })
        } else if(component.props.initialNasabahId){
          // Initial nasabah id provided: form is accessed from report
          diffState.selectedNasabahId = component.props.initialNasabahId;
          component.setState(diffState);
        } else if(nasabahInstances.length > 0){
          // No important props provided: add mode
          diffState.selectedNasabahId = nasabahInstances[0].id;
          component.setState(diffState);
        }

      })
      .catch(function onError(error){
        console.log('error fetching all nasabah');
        console.log(error);
      });
    console.log(this.props);
  },

  save: function(){
    event.preventDefault();
    this.resetAlert();
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Penarikan form is invalid');
      console.log('Invalid: ');
      console.log(formErrors);
      return;
    }
    var penarikanPayload = this.collectPayload();
    // Fill total value manually to 0 (unused column)
    penarikanPayload.total = 0;

    var component = this;

    sequelize.transaction({
      isolationLevel: sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
    },function(t){
      return Penarikan
        .create(penarikanPayload, {
          transaction: t
        })
        .then(function onPenarikanCreationSuccess(penarikan){
          console.log("success creating new penarikan!");
          console.log(penarikan);

          // get penarikan details
          var penarikanDetailPayload = component.
            refs['penarikan-detail-table'].value();

          console.log(penarikanDetailPayload);

          // Save all penarikan details
          var penarikanDetailPromises = penarikanDetailPayload.map(
            function(pembelianCandidate){
              return penarikan.addPembelian(pembelianCandidate, {
                transaction: t,
                jumlah: pembelianCandidate.allocatedValue
              });
            }
          );

          return Promise.all(penarikanDetailPromises);
        })
        .then(function onPenarikanDetailsSaved(penarikanDetails){
          console.log('success creating penarikan details');
          console.log(penarikanDetails)
          component.refs['add-success-alert'].show();
          component.resetFields();
          component.resetChildrenForms();
        })
        .catch(function onPenarikanCreationError(error){
          console.log("Failed creating new penarikan...");
          console.log(error);

          throw "Rollback request";
        });
    })
    .then(function(){
      console.log('Penarikan-save: comitted');
    })
    .catch(function(error){
      console.log('Penarikan-save: rollback');
      console.log(error);
    });

  },

  resetAlert: function(){
    this.refs['add-success-alert'].hide();
    this.refs['edit-success-alert'].hide();
  },

  optionRenderer: function(option){
    return (
      <div>
        <span className='label label-info'>{ 'N' + option.value}</span>
        {option.label}
      </div>
    );
  },

  onNasabahSelectionChange: function(newNasabahId) {
    this.setState({selectedNasabahId: newNasabahId});
  },

  onSelectedAmountChange: function(newValue){
    var floatValue = parseFloat(newValue);
    if(isNaN(floatValue) || !isFinite(newValue) || floatValue < 0){
      floatValue = 0;
    }
    this.setState({selectedAmount: floatValue});
  },

  onDelete: function(){
    var component = this;
    var penarikanInstance = this.state.instance;

    penarikanInstance.setPembelians([])
      .then(function(){
        console.log('Success deleting PenarikanDetails');
        return penarikanInstance.destroy();
      })
      .then(function(){
        console.log('Success deleting penarikan');
        component.refs['hidden-link'].goTo();
      })
      .catch(function(error){
        console.log('Error deleting penarikan');
        console.log(error);
      });
  },

  render: function(){
    var nasabahOptions = this.state.nasabahInstances.map(
      function(nasabahInstance, index, arr){
        return {
          value: nasabahInstance.id,
          label: nasabahInstance.nama
        };
      }
    );

    var buttons = this.props.mode === 'add'
      ? (
          <button
            className="btn btn-success pull-right"
            onClick={this.save}>
            <i className="fa fa-save"></i> Simpan
          </button>
        )
      : (
          <button
            className="btn btn-danger pull-right"
            onClick={this.onDelete} >
            <i className="fa fa-trash"></i> Hapus
          </button>
        );

    var doNothingHandler = function(event){
      event.preventDefault();
    };

    var pembelianCandidateTable = this.state.selectedNasabahId
      ? (
          <div className="col-md-6 col-xs-12">
            <Box.Container className="box-info">
              <Box.Header showBorder={true} title='Daftar Pembelian'/>
              <Box.Body>
                <PenarikanDetailTable
                  ref='penarikan-detail-table'
                  mode={this.props.mode}
                  nasabahId={this.state.selectedNasabahId}
                  readOnly={this.state.isReadOnly}
                  penarikanInstance={this.state.instance}
                  selectedAmount={this.state.selectedAmount}
                  />
              </Box.Body>
            </Box.Container>
          </div>
        )
      : '';

    return (
      <form role="form" className="form-horizontal" onSubmit={doNothingHandler}>
        <HiddenLink
          ref='hidden-link'
          to='data-penarikan'/>
        <div className="row">
          <div className="col-xs-12">
            <Alert
              ref='add-success-alert'
              type='success' show={false}
              title={<div><i className='icon fa fa-check'/> Sukses!</div>}>
              Penarikan baru berhasil dibuat!
            </Alert>
            <Alert
              ref='edit-success-alert'
              type='info' show={false}
              title={<div><i className='icon fa fa-check'/> Sukses!</div>}>
              Penarikan berhasil diubah!
            </Alert>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-xs-12">
            <Box.Container className="box-info">
              <Box.Header showBorder={true} title='Penarikan Baru'/>
              <Box.Body>
                <div className="row">
                  <div className="col-xs-12">
                    <ReactSelectField
                      ref='nasabah_id'
                      inputColumn={10}
                      htmlId='nasabah-id'
                      label='Nasabah'
                      onChange={this.onNasabahSelectionChange}
                      optionRenderer={this.optionRenderer}
                      validation={['required']}
                      readOnly={this.state.isReadOnly}
                      options={nasabahOptions}
                      initialValue={this.state.instance.nasabah_id ||
                        this.state.selectedNasabahId
                      }/>
                    <DateField
                      ref='tanggal'
                      type='single'
                      inputColumn={10}
                      htmlId='penarikan-tanggal'
                      label='Tanggal'
                      validation={['required']}
                      readOnly={this.state.isReadOnly}
                      initialValue={this.state.instance.tanggal}/>
                    <Field
                      ref='nota'
                      inputColumn={10}
                      htmlId='penarikan-nota'
                      label='Nota'
                      readOnly={this.state.isReadOnly}
                      initialValue={this.state.instance.nota}/>
                    <Field
                      ref='jumlah'
                      inputColumn={10}
                      htmlId='penarikan-jumlah'
                      label='Jumlah'
                      onChange={this.onSelectedAmountChange}
                      validation={['isNumber']}
                      readOnly={this.state.isReadOnly}
                      initialValue={this.state.instance.total}/>
                  </div>
                </div>
              </Box.Body>
            </Box.Container>
          </div>
          {pembelianCandidateTable}
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

module.exports = PenarikanForm;
