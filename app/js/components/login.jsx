var React = require('react');
var ReactRedux = require('react-redux');
var Action = require('./actions');
var Tab = require('./tab');
var Sequelize = require('sequelize');
var Field = require('./forms/fields/field');
var LoadingButton = require('./loading-button');
var ModelProxy = require('../models/proxy');
var DbConfig = require('../../electron_boilerplate/db_config');
var Migration = window.originalRequire('./migrations');

var config = DbConfig.load();

var DbForm = React.createClass({
  render: function(){
    return (
      <div className="row">
        <form className="form-horizontal">
          <Field
            ref='db-user'
            label='Db User'
            inputColumn={9}
            htmlId='db-user'
            placeholder='DB Users'
            initialValue={config.username}/>
          <Field
            ref='db-password'
            type='password'
            label='DB Password'
            inputColumn={9}
            htmlId='db-password'
            placeholder='DB Password'
            initialValue={config.password}/>
          <Field
            ref='db-name'
            label='DB Name'
            inputColumn={9}
            htmlId='db-name'
            placeholder='DB Name'
            initialValue={config.name}/>
          <Field
            ref='db-host'
            label='DB Host'
            inputColumn={9}
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

var containerStyle = {
  marginTop: "20px"
};

var Login = React.createClass({
  checkDatabase: function(finishCallback){
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
        Migration.setup(DbConfig.load());
        return Migration.up();
      })
      .then(function(){
        finishCallback();
        component.props.onLoginSuccess();
      })
      .catch(function(error){
        finishCallback();
        console.log(error);
      });
  },
  render: function(){
    return (
      <div className="row" style={containerStyle}>
        <div className="col-md-offset-3 col-md-6 col-xs-12">
          <h2>Welcome</h2>
          <DbForm ref="db-form"/>
          <LoadingButton
            className="btn btn-block btn-primary pull-right"
            label="Login"
            loadingLabel="Please wait..."
            type="primary"
            isBlock={true}
            onLoading={this.checkDatabase}/>
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
