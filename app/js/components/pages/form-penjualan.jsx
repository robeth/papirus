var React = require('react');
var Box = require('../box.jsx');
var PenjualanForm = require('../forms/penjualan');

var PenjualanFormPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <PenjualanForm mode='add'/>
      </section>
    );
  }
});

module.exports = PenjualanFormPage;
