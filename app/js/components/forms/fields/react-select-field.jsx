var React = require('react');
var classNames = require('classnames');
var Validation = require('./validation');
var Select = require('react-select');
var InputMixin = require('../../mixins/field-mixin');

var ReactSelectField = React.createClass({
  mixins: [InputMixin],
  propTypes: {
    inputColumn: React.PropTypes.number,
    htmlId: React.PropTypes.string,
    label: React.PropTypes.string,
    onSelectChange: React.PropTypes.func,
    validation: React.PropTypes.arrayOf(React.PropTypes.string),
    readOnly: React.PropTypes.bool,
    initialValue: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]),
    optionRenderer: React.PropTypes.func,
    options: React.PropTypes.array
  },

  getInitialState: function(){
    var initialValue = null;

    initialValue = this.props.initialValue;
    if(!initialValue
      && this.props.options
      && this.props.options.length > 0){
      initialValue = this.props.options[0].value;
    }

    return {
      value: initialValue,
      status: 'neutral',
      errors: []
    };
  },

  componentWillReceiveProps: function(nextProps){
    console.log('ReactSelectField new props: ');
    console.log(nextProps);

    if(this.props.initialValue !== nextProps.initialValue){
      console.log('ReactSelectField update state from initialValue: ' + nextProps.initialValue )
      this.setState({
        value: nextProps.initialValue
      });
    }

    // Both are not initialized
    // Auto select first option in next props if possible
    else if(!nextProps.initialValue &&
      this.props.options.length !== nextProps.options.length &&
      nextProps.options.length > 0){
      this.setState({
        value: nextProps.options[0].value
      });
    }
  },

  value: function(){
    return this.state.value;
  },

  handleValueChange: function(newValue){
    this.setState({
      value: newValue
    });
    if(this.props.onChange){
      this.props.onChange(newValue);
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

  reset: function(){
    this.setState({
      value: this.props.initialValue,
      status: 'neutral',
      errors: []
    });
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

    var selectInputField = (
      <div
        id={this.props.htmlId}
        className={classNames('col-xs-' + this.props.inputColumn, cssStatus)}>
        <Select
          value={this.state.value}
          onChange={this.handleValueChange}
          options={this.props.options}
          optionRenderer={this.props.optionRenderer}
          valueRenderer={this.props.optionRenderer}
          disabled={this.props.readOnly}/>
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
            className={classNames('control-label', 'col-sm-'+labelColumn)}>
            {this.props.label}
          </label>
          {selectInputField}
        </div>
        )
      : selectInputField;
  }
});

module.exports = ReactSelectField;
