var React = require('react');
var Box = require('../box.jsx');
var PenarikanForm = require('../forms/penarikan');

var DetailPenarikanPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <PenarikanForm
          mode='edit'
          instanceId={this.props.instanceId}
          initialIsReadOnly={true}/>
      </section>
    );
  }
});

module.exports = DetailPenarikanPage;
