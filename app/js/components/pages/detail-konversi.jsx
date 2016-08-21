var React = require('react');
var Box = require('../box.jsx');
var KonversiForm = require('../forms/konversi');

var KonversiDetailPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <KonversiForm
          mode='edit'
          instanceId={this.props.instanceId}
          initialIsReadOnly={true} />
      </section>
    );
  }
});

module.exports = KonversiDetailPage;
