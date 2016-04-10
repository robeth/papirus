var React = require('react');
var ReactRedux = require('react-redux');
var Action = require('../actions');

function mapDispatchToProps(dispatch, ownProps){
  return {
    onClick: function(){
      dispatch(Action.changePageTo({
        name: ownProps.to,
        properties: ownProps.properties
      }));
    }
  };
}

var Base = React.createClass({
  goTo: function(){
    this.props.onClick();
  },
  render: function(){
    var content = this.props.children || (
      <span className={"label label-" + this.props.labelClass}>
        { this.props.initial + this.props.id }
      </span>
    );

    return this.props.hidden ? null : (
      <a onClick={this.props.onClick}>
        {content}
      </a>
    );
  }
});

var BaseContainer = ReactRedux.connect(null, mapDispatchToProps)(Base);

var Hidden = React.createClass({
  goTo: function(){ this.refs['base'].mergedProps.onClick(); },
  render: function(){
    return (
      <BaseContainer
        ref='base'
        hidden={true}
        to={this.props.to}
        properties={this.props.properties}/>
    );
  }
});

var Deposit = React.createClass({
  render: function(){
    var properties = {pembelianId: this.props.depositId};
    return (
      <BaseContainer
        id={this.props.depositId}
        to='detail-pembelian'
        labelClass='primary'
        initial='B'
        properties={properties}/>
    );
  }
});

var Customer = React.createClass({
  render: function(){
    var properties = {nasabahId: this.props.customerId};
    return (
      <BaseContainer
        id={this.props.customerId}
        to='detail-nasabah'
        labelClass='info'
        initial='N'
        properties={properties}/>
    );
  }
});

var Convertion = React.createClass({
  render: function(){
    var properties = {instanceId: this.props.convertionId};
    return (
      <BaseContainer
        id={this.props.convertionId}
        to='detail-konversi'
        labelClass='warning'
        initial='K'
        properties={properties}/>
    );
  }
});

var Withdrawal = React.createClass({
  render: function(){
    var properties = {instanceId: this.props.withdrawalId};
    return (
      <BaseContainer
        id={this.props.withdrawalId}
        to='detail-penarikan'
        labelClass='primary'
        initial='T'
        properties={properties}/>
    );
  }
});

var Sale = React.createClass({
  render: function(){
    var properties = {instanceId: this.props.saleId};
    return (
      <BaseContainer
        id={this.props.saleId}
        to='detail-penjualan'
        labelClass='success'
        initial='J'
        properties={properties}/>
    );
  }
});

var Vendor = React.createClass({
  render: function(){
    var properties = {instanceId: this.props.vendorId};
    return (
      <BaseContainer
        id={this.props.vendorId}
        to='detail-vendor'
        labelClass='warning'
        initial='V'
        properties={properties}/>
    );
  }
});

var Category = React.createClass({
  render: function(){
    var properties = {instanceId: this.props.categoryId};
    return (
      <BaseContainer
        to='detail-barang'
        properties={properties}>
        <code>{this.props.categoryCode}</code>
      </BaseContainer>
    );
  }
});

module.exports = {
  Deposit,
  Customer,
  Convertion,
  Category,
  Withdrawal,
  Sale,
  Vendor,
  Hidden
};
