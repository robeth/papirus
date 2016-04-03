var React = require('react');
var Box = require('../box.jsx');
var PenarikanForm = require('../forms/penarikan');

var FormPenarikanPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <PenarikanForm
          mode='add'
          initialNasabahId={this.props.initialNasabahId}/>
      </section>
    );
  }
});

module.exports = FormPenarikanPage;
