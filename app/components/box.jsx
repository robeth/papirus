var React = require('react');
var classNames = require('classnames');

var BoxContainer = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },
  render: function(){
    return(
      <div className={classNames('box', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
});

var BoxHeader = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    showBorder: React.PropTypes.bool,
    className: React.PropTypes.string
  },
  render: function(){
    return (
      <div className={classNames('box-header',
                                {'with-border': this.props.showBorder})}>
        <h3 className="box-title">{this.props.title}</h3>
        {this.props.children}
      </div>
    );
  }
});

var BoxBody = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },
  render: function(){
    return (
      <div className={classNames('box-body', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = {
  Container: BoxContainer,
  Header: BoxHeader,
  Body: BoxBody
};
