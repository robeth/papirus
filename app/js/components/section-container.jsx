var React = require('react');
var ReactRedux = require('react-redux');
var ReactDom = require('react-dom');

var SectionDictionary = require('./constants/section-dictionary');

var Section = React.createClass({
  render: function(){
    return SectionDictionary[this.props.section] || <span/>;
  }
});

function mapStateToProps(state, ownProps){
  return {
    section: state.section
  };
}

var SectionContainer = ReactRedux.connect(mapStateToProps)(Section);

module.exports = SectionContainer;
