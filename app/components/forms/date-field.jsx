var React = require('react');
var classNames = require('classnames');
var Validation = require('./validation');

var DateField = React.createClass({
  propTypes: {
    inputColumn: React.PropTypes.number,
    htmlId: React.PropTypes.string,
    label: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    type: React.PropTypes.oneOf(['single', 'range']),
    validation: React.PropTypes.arrayOf(React.PropTypes.string),
    readOnly: React.PropTypes.bool,
    initialValue: React.PropTypes.string
  },

  getInitialState: function(){
    return {
      value: this.props.initialValue,
      status: 'neutral',
      errors: []
    };
  },

  componentWillReceiveProps: function(nextProps){
    this.setState({value: nextProps.initialValue});
  },

  componentDidMount: function(){
    $(this.refs['input']).daterangepicker({
      singleDatePicker: this.props.type === 'single',
      showDropdowns: true,
      locale: {
        format: 'YYYY-MM-DD'
      },
      startDate: '1980-01-01'
    });
    this.refs['input'].value='';
  },

  value: function(){
    var value = this.state.value;

    // Never return blank string
    if(value){
      value = value.trim();
    }
    return  value || null;
  },

  handleValueChange: function(event){
    this.setState({
      value: event.target.value
    });
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
            onChange={this.handleValueChange}
            placeholder={this.props.placeholder}
            value={this.state.value}
            readOnly={this.props.readOnly}/>
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

module.exports = DateField;
