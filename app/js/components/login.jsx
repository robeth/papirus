var React = require('react');
var ReactRedux = require('react-redux');
var Action = require('./actions');
var Tab = require('./tab');
var Sequelize = require('sequelize');
var Field = require('./forms/fields/field');
var ModelProxy = require('../models/proxy');
var DbConfig = require('../../electron_boilerplate/db_config');

var config = DbConfig.load();

var DbForm = React.createClass({
  render: function(){
    return (
      <div className="row">
        <form className="form-horizontal">
          <Field
            ref='db-user'
            label='Db User'
            inputColumn={6}
            htmlId='db-user'
            placeholder='DB Users'
            initialValue={config.username}/>
          <Field
            ref='db-password'
            type='password'
            label='DB Password'
            inputColumn={6}
            htmlId='db-password'
            placeholder='DB Password'
            initialValue={config.password}/>
          <Field
            ref='db-name'
            label='DB Name'
            inputColumn={6}
            htmlId='db-name'
            placeholder='DB Name'
            initialValue={config.name}/>
          <Field
            ref='db-host'
            label='DB Host'
            inputColumn={6}
            htmlId='db-host'
            placeholder='DB Host'
            initialValue={config.host}/>
        </form>
      </div>
    );
  },
  value: function(){
    return {
      username: this.refs['db-user'].value(),
      password: this.refs['db-password'].value(),
      name: this.refs['db-name'].value(),
      host: this.refs['db-host'].value()
    };
  }
});

var UserForm = React.createClass({
  render: function(){
    return (
      <div className="row">
        <form className="form-horizontal">
          <Field
            ref='username'
            label="User"
            inputColumn={6}
            htmlId='username'
            placeholder='Username'
            initialValue='Robeth'/>
          <Field
            ref='password'
            label="Password"
            type='password'
            inputColumn={6}
            htmlId='password'
            placeholder='Password'
            initialValue='cihui'/>
        </form>
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

var containerStyle = {
  marginTop: "20px",
  marginRight: "20px"
};

var Login = React.createClass({
  checkDatabase: function(){
    console.log("Database clicked!");
    var component = this;
    var dbValue = this.refs['db-form'].value();
    var payload = {
      name: dbValue.name,
      username: dbValue.username,
      password: dbValue.password,
      host: dbValue.host
    };
    DbConfig.save(payload);
    var promise = ModelProxy.connect(payload);

    promise
      .then(function(){
        console.log('Success');
        component.props.onLoginSuccess();
      })
      .catch(function(error){
        console.log('error');
      });
  },
  render: function(){
    return (
      <div className="row" style={containerStyle}>
        <div className="col-md-6 col-xs-12 well pull-right">
          <div className="row">
            <div className="col-md-6 col-xs-12">
              <h2>User</h2>
              <UserForm ref="user-form"/>
            </div>
            <div className="col-md-6 col-xs-12">
              <h2>Database</h2>
              <DbForm ref="db-form"/>
            </div>
          </div>
          <div className="row" style={{marginTop: "20px"}}>
            <button
              className="btn btn-block btn-primary pull-right"
              onClick={this.checkDatabase}>
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }
});

function mapDispatchToProps(dispatch, ownProps){
  return {
    onLoginSuccess: function(){
      dispatch(Action.changeSectionTo('main'));
    }
  };
}

var LoginContainer = ReactRedux.connect(null, mapDispatchToProps)(Login);

module.exports = LoginContainer;
