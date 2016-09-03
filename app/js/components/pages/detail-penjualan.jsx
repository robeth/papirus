var React = require('react');
var Box = require('../box.jsx');
var PenjualanForm = require('../forms/penjualan');

var PenjualanDetailPage = React.createClass({
  // TODO show stock source (Deposit or convertion) of a sale
  render: function(){
    return (
      <section className="content">
        <PenjualanForm
          mode='edit'
          instanceId={this.props.instanceId}
          initialIsReadOnly={true}/>
      </section>
    );
  }
});

module.exports = PenjualanDetailPage;
