var React = require('react');
var Box = require('../box.jsx');
var CategoryForm = require('../forms/kategori');

var CategoryFormPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <CategoryForm mode='add'/>
      </section>
    );
  }
});

module.exports = CategoryFormPage;
