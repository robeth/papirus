var React = require('react');
var Box = require('../box.jsx');
var PembelianForm = require('../forms/pembelian');

var DetailPembelianPage = React.createClass({
  // TODO trace Deposit stock history (related to Sale or Convertion)
  render: function(){
    return (
      <section className="content">
        <PembelianForm
          mode='edit'
          pembelianId={this.props.pembelianId}
          initialIsReadOnly={true}/>
      </section>
    );
  }
});

module.exports = DetailPembelianPage;
