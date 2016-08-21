var React = require('react');
var Box = require('../box.jsx');
var PembelianForm = require('../forms/pembelian');

var FormPembelianPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <PembelianForm mode='add'/>
      </section>
    );
  }
});

module.exports = FormPembelianPage;
