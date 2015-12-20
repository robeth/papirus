var React = require('react');
var ReactDom = require('react-dom');
var Content = require('./content');
var Sidebar = require('./sidebar');
var Header = require('./header');
var PageContainer = require('./page-container');

var PAGE_DICTIONARY = require('./constants/page-dictionary');

var BinaMandiri = React.createClass({
  getInitialState: function(){
    return { currentPage: PAGE_DICTIONARY['data-nasabah-individu'] };
  },

  render: function(){
    return (
      <div className="skin-blue sidebar-mini">
        <div className="wrapper">
          <Header/>
          <Sidebar onItemClick={this._changePage}/>
          <PageContainer page={this.state.currentPage}/>
        </div>
      </div>
    );
  },

  _changePage: function(pageTitle){
    if(PAGE_DICTIONARY[pageTitle]){
      this.setState({ currentPage: PAGE_DICTIONARY[pageTitle] });
    }
  }
});

ReactDom.render(
  <BinaMandiri />,
  document.getElementById('container')
);
