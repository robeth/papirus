var React = require('react');
var ReactRedux = require('react-redux');
var Action = require('./actions');

function mapDispatchToProps(dispatch, ownProps){
  return {
    onClick: function(){
      dispatch(Action.changePageTo({
        name: ownProps.to,
        properties: undefined
      }));
    }
  };
}

var Link = React.createClass({
  render: function(){
    return (
      <a href="#" onClick={this.props.onClick}>{this.props.children}</a>
    );
  }
});

var PageLink = ReactRedux.connect(undefined, mapDispatchToProps)(Link);

module.exports = PageLink;
