var React = require('react');
var Content = require('./content');
var Sidebar = require('./sidebar');
var Header = require('./header');
var PageContainer = require('./page-container');

var BinaMandiri = React.createClass({
  render: function(){
    return (
      <div className="skin-blue sidebar-mini">
        <div className="wrapper">
          <Header/>
          <Sidebar/>
          <PageContainer/>
        </div>
      </div>
    );
  }
});

module.exports = BinaMandiri;
