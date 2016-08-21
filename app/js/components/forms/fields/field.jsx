var React = require('react');
var classNames = require('classnames');
var Validation = require('./validation');
var InputMixin = require('../../mixins/field-mixin');

var Field = React.createClass({
  mixins: [InputMixin],
  propTypes: {
    type: React.PropTypes.string,
    inputColumn: React.PropTypes.number,
    htmlId: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.node,
    validation: React.PropTypes.arrayOf(React.PropTypes.string),
    readOnly: React.PropTypes.bool,
    initialValue: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    prefixAddon: React.PropTypes.string,
    suffixAddon: React.PropTypes.string,
    onChange: React.PropTypes.func
  },

  getInitialState: function(){
    console.log('Field-CWRP-field InitialState:');
    return {
      value: this.props.initialValue,
      status: 'neutral',
      errors: []
    };
  },

  componentWillReceiveProps: function(nextProps){
    // console.log('Field-CWRP-field nextProps:');
    // console.log(this.props);
    // console.log(nextProps);
    if(this.props.initialValue !== nextProps.initialValue){
      console.log('Field-CWRP-field accept newProps');
      this.setState({
        value: nextProps.initialValue
      });
    }
  },

  handleValueChange: function(event){
    this.setState({
      value: event.target.value
    });

    if(this.props.onChange){
      this.props.onChange(event.target.value);
    }
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

  value: function(){
    var currentValue = this.state.value;

    // Never return blank/whitespace string
    // If blank/whitespace, return null instead
    if(currentValue){
      currentValue = currentValue.toString().trim();
    }
    console.log('Field value: ' + currentValue);
    return  currentValue || null;
  },

  reset: function(){
    console.log('Field-CWRP-field reset:');

    this.setState({
      value: this.props.initialValue,
      status: 'neutral',
      errors: []
    });

    if(this.props.onChange){
      this.props.onChange(this.props.initialValue);
    }
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

    var prefix
    var inputFieldWithAddon = (
      <div className='input-group'>
        {this.props.prefixAddon && (
          <span className="input-group-addon">{this.props.prefixAddon}</span>
        )}
        <input
          ref='input'
          type={this.props.type || 'text'}
          id={this.props.htmlId}
          className='form-control'
          onChange={this.handleValueChange}
          placeholder={this.props.placeholder}
          readOnly={this.props.readOnly}
          value={this.state.value}/>
        {this.props.suffixAddon && (
          <span className="input-group-addon">{this.props.suffixAddon}</span>
        )}
      </div>
    );

    var inputFieldWithoutAddon = (
      <input
        ref='input'
        type={this.props.type || 'text'}
        id={this.props.htmlId}
        className='form-control'
        onChange={this.handleValueChange}
        placeholder={this.props.placeholder}
        readOnly={this.props.readOnly}
        value={this.state.value}/>
    );

    var inputField = this.props.suffixAddon || this.props.prefixAddon
      ? inputFieldWithAddon
      : inputFieldWithoutAddon;

    var inputContainer = (
      <div className={classNames('col-xs-' + this.props.inputColumn, cssStatus)}>
        {inputField}
        {
          this.state.status === 'invalid'
          ? <span className="help-block">{this.state.errors[0]}</span>
          : ''
        }
      </div>
    );

    return this.props.label
      ? (
          <div className={classNames('form-group', cssStatus)}>
            <label
              htmlFor={this.props.htmlId}
              className={classNames('control-label', 'col-xs-'+labelColumn)}>
              {this.props.label}
            </label>
            {inputContainer}
          </div>
        )
      : inputContainer;
  }
});

module.exports = Field;
