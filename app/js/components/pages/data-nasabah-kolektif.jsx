var React = require('react');
var DataNasabah = require('./data-nasabah');

var DataNasabahKolektif = React.createClass({
  render: function(){
    return <DataNasabah type='kolektif'/>
  }
});

module.exports = DataNasabahKolektif;
