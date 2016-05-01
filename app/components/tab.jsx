var React = require('react');
var classNames = require('classnames');

var Item = React.createClass({
  render: function(){
    return (
      <ul className="nav nav-tabs">
        {this.props.children}
      </ul>
    );
  }
});

var Container = React.createClass({
  getInitialState: function(){
    return {index: 0};
  },
  generateTabClickListener: function(index){
    var component = this;
    return function(){
      component.setState({index});
    };
  },
  render: function(){
    var component = this;
    var headers = this.props.children.map(function(child,index){
      return (
        <li key={index} className={classNames({active: index === component.state.index})}>
          <a onClick={component.generateTabClickListener(index)}>
            {child.props.header}
          </a>
        </li>
      );
    });

    var contents = this.props.children.map(function(child, index){
      return (
        <div key={index} className={classNames('tab-pane',{active: index === component.state.index})}>
          {child.props.content}
        </div>
      );
    });

    return (
      <div className="nav-tabs-custom">
        <ul key={0} className="nav nav-tabs">
          {headers}
        </ul>
        <div key={1} className="tab-content">
          {contents}
        </div>
      </div>
    );
  }
});

module.exports = { Container, Item };
