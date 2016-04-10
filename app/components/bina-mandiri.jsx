var React = require('react');
var ReactDom = require('react-dom');
var Content = require('./content');
var Sidebar = require('./sidebar');
var Header = require('./header');
var PageContainer = require('./page-container');

var ReactRedux = require('react-redux');
var Store = require('./store');

var BinaMandiri = React.createClass({
  render: function(){
    return (
      <ReactRedux.Provider store={Store}>
        <div className="skin-blue sidebar-mini">
          <div className="wrapper">
            <Header/>
            <Sidebar/>
            <PageContainer/>
          </div>
        </div>
      </ReactRedux.Provider>
    );
  }
});

ReactDom.render(
  <BinaMandiri />,
  document.getElementById('container')
);
