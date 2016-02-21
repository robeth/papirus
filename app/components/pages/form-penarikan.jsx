var React = require('react');
var Box = require('../box.jsx');
var PenarikanForm = require('../forms/penarikan');

var FormPenarikanPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <PenarikanForm mode='add'/>
      </section>
    );
  }
});

module.exports = FormPenarikanPage;
