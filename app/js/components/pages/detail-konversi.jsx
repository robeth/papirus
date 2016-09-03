var React = require('react');
var Box = require('../box.jsx');
var KonversiForm = require('../forms/konversi');

var KonversiDetailPage = React.createClass({
  // TODO trace convertion output to related sale or another convertion
  // TODO summary input stocks based on category
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
