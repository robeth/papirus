var React = require('react');
var Field = require('./field');

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
  propTypes: {
    kategoriInstances: React.PropTypes.array,
    onRemoveClick: React.PropTypes.func.isRequired
  },
  render: function(){
    return (
      <div className='row row-margin'>
        <div className="col-xs-3">
          <select className="form-control"></select>
        </div>
        <Field
          ref='jumlah'
          inputColumn={3}
          validation={['required']}
          suffixAddon='Kg'/>
        <Field
          ref='jumlah'
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
