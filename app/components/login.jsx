var React = require('react');
var ReactRedux = require('react-redux');
var Action = require('./actions');

var Login = React.createClass({
  render: function(){
    return (
      <div className="row">
        <div className="col-md-6">
          <div className="col-xs-12">
            <h1>Papirus</h1>
            <button onClick={this.props.onClick}>Login</button>
          </div>
        </div>
      </div>
    );
  }
});

function mapDispatchToProps(dispatch, ownProps){
  return {
    onClick: function(){
      dispatch(Action.changeSectionTo('main'));
    }
  };
}

var LoginContainer = ReactRedux.connect(null, mapDispatchToProps)(Login);

module.exports = LoginContainer;
