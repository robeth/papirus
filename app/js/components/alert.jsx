var React = require('react');
var classNames = require('classnames');

var Alert = React.createClass({
  propTypes: {
    type: React.PropTypes.oneOf(['danger', 'info', 'warning', 'success']),
    dismissable: React.PropTypes.bool,
    title: React.PropTypes.node,
    show: React.PropTypes.bool
  },

  getInitialState: function(){
    return {
      show: this.props.show
    };
  },

  hide: function(){
    this.setState({show: false});
  },

  show: function(){
    this.setState({show: true});
  },

  handleCloseButton: function(event){
    event.preventDefault();
    this.hide();
  },

  render: function(){
    var alertClass = classNames(
      'alert',
      {
        'alert-danger': this.props.type === 'danger',
        'alert-info': this.props.type === 'info',
        'alert-warning': this.props.type === 'warning',
        'alert-success': this.props.type === 'success',
        'hide': !this.state.show
      }
    );

    return (
      <div className={alertClass}>
        <button className='close' onClick={this.handleCloseButton}>×</button>
        <h4>{this.props.title}</h4>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Alert;
