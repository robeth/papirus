var React = require('react');
var DataNasabah = require('./data-nasabah');

var DataNasabahIndividu = React.createClass({
  render: function(){
    return <DataNasabah type='individu'/>
  }
});

module.exports = DataNasabahIndividu;
