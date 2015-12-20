var React = require('react');
var Breadcrumbs = require('./breadcrumbs');
var Dashboard = require('./pages/dashboard');

var PageContainer = React.createClass({
  render: function(){
    return(
      <div className="content-wrapper">
        <section className="content-header">
          <h1>
            {this.props.page.title}
          </h1>
          <Breadcrumbs path={this.props.page.path}/>
        </section>
        {this.props.page.element}
      </div>
    );
  }
});

module.exports = PageContainer;
