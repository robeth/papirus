var React = require('react');
var classNames = require('classnames');
var Validation = require('./validation');

var Field = React.createClass({
  propTypes: {
    inputColumn: React.PropTypes.number,
    htmlId: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    validation: React.PropTypes.arrayOf(React.PropTypes.string)
  },

  getInitialState: function(){
    return {
      status: 'neutral',
      errors: []
    };
  },

  value: function(){
    var value = this.refs['input'].value;

    // Never return blank string
    if(value){
      value = value.trim();
    }
    return  value || null;
  },

  validate: function(){
    var errors = this.props.validation
      ? Validation.check(this.props.validation, this.value())
      : [];

    this.setState({
      status: errors.length > 0 ? 'invalid' : 'valid',
      errors: errors
    });

    return errors;
  },

  render: function(){
    var labelColumn = 12 - this.props.inputColumn;
    var cssStatus = null;

    switch(this.state.status) {
      case 'valid':
        cssStatus = 'has-success';
        break;
      case 'invalid':
        cssStatus = 'has-error';
        break;
      case 'warning':
        cssStatus = 'has-warning';
        break;
    }

    return (
      <div className={classNames('form-group', cssStatus)}>
        <label
          htmlFor={this.props.htmlId}
          className={classNames('control-label', 'col-sm-'+labelColumn)}>
          {this.props.label}
        </label>
        <div className={'col-sm-' + this.props.inputColumn}>
          <input
            ref='input'
            type="text"
            className='form-control'
            placeholder={this.props.placeholder}/>
          {
            this.state.status === 'invalid'
            ? <span className="help-block">{this.state.errors[0]}</span>
            : ''
          }
        </div>
      </div>
    );
  }
});

module.exports = Field;
