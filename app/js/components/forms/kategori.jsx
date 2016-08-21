var React = require('react');
var Box = require('../box');
var Field = require('./fields/field');
var ReactSelectField = require('./fields/react-select-field');
var Alert = require('../alert');
var ModelProxy = require('../../models/proxy');
var FormMixin = require('../mixins/form-mixin');

var CategoryForm = React.createClass({
  mixins: [FormMixin],
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']).isRequired,
    instanceId: React.PropTypes.number,
    initialIsReadOnly: React.PropTypes.bool
  },

  getInitialState: function(){
    return {
      isReadOnly: this.props.initialIsReadOnly,
      reportCategoryInstances: [],
      instance: {
        id: null,
        nama: null,
        kode: null,
        stabil: null,
        fluktuatif: null,
        satuan: null,
        report_kategori_id: null
      }
    };
  },

  componentDidMount: function(){
    var component = this;

    // Initialize report catgory selection
    ModelProxy.get('ReportKategori')
    .findAll()
    .then(function onFound(reportCategoryInstances){
      console.log('All report categories found');
      console.log(reportCategoryInstances);
      component.setState({reportCategoryInstances: reportCategoryInstances});
    })
    .catch(function onError(error){
      console.log('error fetching all report categories');
      console.log(error);
    });
    console.log(this.props);

    // Edit mode: Fetch category instance
    if(this.props.mode === 'edit'){
      ModelProxy.get('Kategori')
        .findById(this.props.instanceId)
        .then(function onCategoryFound(category){
          console.log('category found');
          console.log(category);
          component.setState({instance: category});
        })
        .catch(function onError(error){
          console.log('Failed to fetch category ' + component.props.instanceId);
          console.log(error);
        });
    }
  },

  save: function(){
    event.preventDefault();
    this.resetAlert();
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Category form is invalid');
      console.log('Invalid: ');
      console.log(formErrors);
      return;
    }

    var payload = this.collectPayload();
    var component = this;
    ModelProxy.get('Kategori')
      .create(payload)
      .then(function onCategoryCreationSuccess(category){
        console.log("success creating new category!");
        console.log(category);

        component.refs['add-success-alert'].show();
        component.resetFields();
        component.resetChildrenForms();
      })
      .catch(function onCategoryCreationError(error){
        console.log("Failed creating new category...");
        console.log(error);
      });
  },

  saveChanges: function(){
    event.preventDefault();
    this.resetAlert();
    var formErrors = this.validate();

    if(formErrors.length > 0){
      console.log('Category form is invalid');
      console.log('Invalid: ');
      console.log(formErrors);
      return;
    }
    var payload = this.collectPayload();
    var component = this;
    component.state.instance
      .update(payload)
      .then(function onCategoryUpdateSuccess(category){
        console.log("success updating category!");
        console.log(category);
        component.setState({instance: category});
        component.refs['edit-success-alert'].show();
        component.resetFields();
        component.resetChildrenForms();
        component.setReadOnly(true);

        component.setState({
          instance: category
        });
      })
      .catch(function onCategoryUpdateError(error){
        console.log("Failed to update category...");
        console.log(error);
      });
  },

  resetAlert: function(){
    this.refs['add-success-alert'].hide();
    this.refs['edit-success-alert'].hide();
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
    var reportCategoryOptions = this.state.reportCategoryInstances.map(
      function(reportCategoryInstance){
        return {
          value: reportCategoryInstance.id,
          label: reportCategoryInstance.nama
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

    return (
      <form role="form" className="form-horizontal" onSubmit={this.formHandler}>
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Pembelian Baru'/>
          <Box.Body>
            <div className="row">
              <div className="col-xs-12">
                <Alert
                  ref='add-success-alert'
                  type='success' show={false}
                  title={<div><i className='icon fa fa-check'/> Sukses!</div>}>
                  Data kategori barang berhasil dibuat!
                </Alert>
                <Alert
                  ref='edit-success-alert'
                  type='info' show={false}
                  title={<div><i className='icon fa fa-check'/> Sukses!</div>}>
                  Data kategori barang berhasil diubah!
                </Alert>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <Field
                  ref='nama'
                  inputColumn={10}
                  htmlId='kategori-nama'
                  label='Nama'
                  validation={['required']}
                  placeholder='nama barang'
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.instance.nama}/>
                <Field
                  ref='kode'
                  inputColumn={10}
                  htmlId='kategori-kode'
                  label='Kode'
                  validation={['required']}
                  placeholder='Si-2'
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.instance.kode}/>
                <ReactSelectField
                  ref='report_kategori_id'
                  inputColumn={10}
                  htmlId='kategori-report-kategori-id'
                  label='Jenis'
                  validation={['required']}
                  readOnly={this.state.isReadOnly}
                  options={reportCategoryOptions}
                  initialValue={this.state.instance.report_kategori_id}>
                </ReactSelectField>
                <Field
                  ref='deskripsi'
                  inputColumn={10}
                  htmlId='kategori-deskripsi'
                  label='Deskripsi'
                  validation={['required']}
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.instance.deskripsi}/>
                <Field
                  ref='satuan'
                  inputColumn={10}
                  htmlId='kategori-satuan'
                  label='Satuan'
                  validation={['required']}
                  placeholder='Kg'
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.instance.satuan}/>
                <Field
                  ref='stabil'
                  inputColumn={10}
                  htmlId='kategori-stabil'
                  label='Harga Stabil'
                  validation={['required', 'isNumber']}
                  placeholder='2000'
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.instance.stabil}/>
                <Field
                  ref='fluktuatif'
                  inputColumn={10}
                  htmlId='kategori-fluktuatif'
                  label='Fluktuatif'
                  validation={['required', 'isNumber']}
                  placeholder='2200'
                  readOnly={this.state.isReadOnly}
                  initialValue={this.state.instance.fluktuatif}/>
                <hr/>
              </div>
            </div>
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

module.exports = CategoryForm;
