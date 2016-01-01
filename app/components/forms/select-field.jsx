var React = require('react');
var classNames = require('classnames');
var Validation = require('./validation');

var SelectField = React.createClass({
  propTypes: {
    inputColumn: React.PropTypes.number,
    htmlId: React.PropTypes.string,
    label: React.PropTypes.string,
    onSelectChange: React.PropTypes.func,
    validation: React.PropTypes.arrayOf(React.PropTypes.string),
    readOnly: React.PropTypes.bool,
    initialValue: React.PropTypes.string,
    select2: React.PropTypes.bool,
    formatSelection: React.PropTypes.func,
    formatOption: React.PropTypes.func
  },

  getInitialState: function(){
    return {
      value: this.props.initialValue,
      status: 'neutral',
      errors: []
    };
  },

  componentDidMount: function(){
    console.log('mount');
    if(this.props.select2){
      this.formatSelection();
    }
  },

  componentWillReceiveProps: function(nextProps){
    if(this.props.initialValue !== nextProps.initialValue){
      this.setState({
        value: nextProps.initialValue
      });
    }
    if(this.props.select2){
      console.log('select2 new props: ');
      console.log(nextProps.children.length > 0 ? nextProps.children[0].props.value : null);
      this.setState({
        value: nextProps.children.length > 0 ? nextProps.children[0].props.value : null
      });
      $(this.refs['input']).trigger('change');
    }
  },

  value: function(){
    return this.state.value;
  },

  handleValueChange: function(event){
    console.log('Change value: ' + event.target.value);
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

  reset: function(){
    this.setState({
      value: this.props.initialValue,
      status: 'neutral',
      errors: []
    });
  },

  formatSelection: function(){
    var component = this;
    $(component.refs['input']).select2({
      templateResult: component.props.formatOption,
      templateSelection: component.props.formatOption
    });

    $(component.refs['input']).on('change', function(event){
      component.setState({value: event.target.value});
    });
  },

  render: function(){
    var labelColumn = 12 - this.props.inputColumn;
    var cssStatus = null;
    console.log('select options: ' + this.props.children.length +'--- select value: ' + this.state.value);
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
      <div className={classNames('col-xs-' + this.props.inputColumn, cssStatus)}>
        <select
          ref='input'
          className='form-control'
          disabled={this.props.readOnly}
          onChange={this.handleValueChange}
          value={this.state.value}>
          {this.props.children}
        </select>
        {
          this.state.status === 'invalid'
          // ? <span className="help-block">{this.state.errors[0]}</span>
          ? ''
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

module.exports = SelectField;
