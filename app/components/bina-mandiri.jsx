var React = require('react');
var ReactDom = require('react-dom');
var Content = require('./content');
var Sidebar = require('./sidebar');
var Header = require('./header');
var PageContainer = require('./page-container');

var PAGE_DICTIONARY = require('./constants/page-dictionary');

var BinaMandiri = React.createClass({
  getInitialState: function(){
    return {
      currentPage: PAGE_DICTIONARY['form-nasabah'],
      properties: null
    };
  },

  render: function(){
    return (
      <div className="skin-blue sidebar-mini">
        <div className="wrapper">
          <Header/>
          <Sidebar onItemClick={this.changePage}/>
          <PageContainer
            title={this.state.currentPage.title}
            path={this.state.currentPage.path}>
            {this.state.currentPage.element(this.getProperties())}
          </PageContainer>
        </div>
      </div>
    );
  },

  changePage: function(pageTitle, properties){
    if(PAGE_DICTIONARY[pageTitle]){
      this.setState({
        currentPage: PAGE_DICTIONARY[pageTitle],
        properties: properties
      });
    }
  },

  getProperties: function(){
    var suppliedProperties = this.state.properties || {};
    suppliedProperties.changePage = this.changePage;
    return suppliedProperties;
  }
});

ReactDom.render(
  <BinaMandiri />,
  document.getElementById('container')
);
