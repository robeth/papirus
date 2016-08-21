var React = require('react');
var Box = require('../box.jsx');
var CategoryForm = require('../forms/kategori');

var CategoryDetailPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <CategoryForm
          mode='edit'
          instanceId={this.props.instanceId}
          initialIsReadOnly={true}/>
      </section>
    );
  }
});

module.exports = CategoryDetailPage;
