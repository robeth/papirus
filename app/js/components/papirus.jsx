var React = require('react');
var ReactRedux = require('react-redux');
var ReactDom = require('react-dom');

var SectionContainer = require('./section-container');
var Store = require('./store');

// TODO change application logo
var Papirus = React.createClass({
  render: function(){
    return (
      <ReactRedux.Provider store={Store}>
        <SectionContainer/>
      </ReactRedux.Provider>
    );
  }
});

ReactDom.render(
  <Papirus />,
  document.getElementById('container')
);
