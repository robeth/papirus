var React = require('react');
var Box = require('../box.jsx');
var PembelianForm = require('../forms/pembelian');

var DetailPembelianPage = React.createClass({
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
