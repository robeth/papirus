var React = require('react');
var ReactRedux = require('react-redux');
var Action = require('./actions');

function mapDispatchToProps(dispatch, ownProps){
  return {
    onClick: function(){
      console.log(ownProps);
      dispatch(Action.changeSectionTo(ownProps.to));
    }
  };
}

var SectionLink = React.createClass({
  render: function(){
    return (
      <a href="#" onClick={this.props.onClick}>{this.props.children}</a>
    );
  }
});

var SectionLinkContainer = ReactRedux.connect(undefined, mapDispatchToProps)(SectionLink);

module.exports = SectionLinkContainer;
