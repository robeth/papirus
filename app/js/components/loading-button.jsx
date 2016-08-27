var React = require('react');
var classnames = require('classnames');

var LoadingButton = React.createClass({
  propTypes: {
    label: React.PropTypes.string.isRequired,
    loadingLabel: React.PropTypes.string.isRequired,
    onLoading: React.PropTypes.func.isRequired,
    isBlock: React.PropTypes.bool,
    type: React.PropTypes.string
  },

  getDefaultProps: function(){
    return {
      isBlock: false,
      type: "primary"
    };
  },

  getInitialState: function(){
    return {
      isLoading: false
    };
  },

  finishLoading: function(){
    this.setState({isLoading: false});
  },

  startLoading: function(){
    if(this.state.isLoading){
      return;
    }

    this.setState({isLoading: true});
    this.props.onLoading(this.finishLoading);
  },

  render: function(){
    var text = this.state.isLoading
        ? this.props.loadingLabel
        : this.props.label;

    return (
      <button
        className={classnames(
          'btn',
          'btn-' + this.props.type,
          { "btn-block": this.props.isBlock }
        )}
        disabled={this.state.isLoading}
        onClick={this.startLoading}>
        {text}
      </button>
    );
  }
});

module.exports = LoadingButton;
