var React = require('react');
var Box = require('../box.jsx');
var PenjualanForm = require('../forms/penjualan');

var PenjualanDetailPage = React.createClass({
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
