var React = require('react');
var ReactRedux = require('react-redux');
var ReactDom = require('react-dom');

var Login = require('./login');
var Main = require('./main');

var Section = React.createClass({
  render: function(){
    return this.props.section == 'LOGIN' ? <Login/> : <Main/>;
  }
});

function mapStateToProps(state, ownProps){
  return {
    section: state.section
  };
}

var SectionContainer = ReactRedux.connect(mapStateToProps)(Section);

module.exports = SectionContainer;
