var React = require('react');
var ReactRedux = require('react-redux');
var Action = require('./actions');
var Tab = require('./tab');
var Sequelize = require('sequelize');
var Field = require('./forms/fields/field');

var DbForm = React.createClass({
  render: function(){
    return (
      <div className="row">
        <Field
          ref='db-user'
          inputColumn={10}
          htmlId='db-user'
          placeholder='DB User'
          initialValue='root'/>
        <Field
          ref='db-password'
          inputColumn={10}
          htmlId='db-password'
          placeholder='DB Password'
          initialValue='root'/>
      </div>
    );
  },
  value: function(){
    return {
      username: this.refs['db-user'].value(),
      password: this.refs['db-password'].value()
    };
  }
});

var UserForm = React.createClass({
  render: function(){
    return (
      <div className="row">
        <Field
          ref='username'
          inputColumn={10}
          htmlId='username'
          placeholder='Username'
          initialValue='Robeth'/>
        <Field
          ref='password'
          inputColumn={10}
          htmlId='password'
          placeholder='Password'
          initialValue='cihui'/>
      </div>
    );
  },
  value: function(){
    return {
      username: this.refs['username'].value(),
      password: this.refs['password'].value()
    };
  }
});

var Login = React.createClass({
  checkDatabase: function(){
    var dbValue = this.refs['db-form'].value();

    console.log(window.dbConnect(dbValue.username, dbValue.password));
  },
  render: function(){
    return (
      <div className="row">
        <div className="col-md-6">
          <div className="col-xs-12">
            <h1>Papirus</h1>
            <Tab.Container>
              <Tab.Item
                header={ <span>User</span> }
                content={ <UserForm/>}
              />
              <Tab.Item
                header={ <span>Database</span> }
                content={<DbForm ref="db-form"/>}
              />
            </Tab.Container>
            <button onClick={this.checkDatabase}>Login</button>
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
