var React = require('react');
var Box = require('../box.jsx');
var NasabahForm = require('../forms/nasabah');

var NasabahFormPage = React.createClass({
  render: function(){
    return (
      <section className="content">
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Nasabah Baru'/>
          <Box.Body>
            <NasabahForm mode='add'/>
          </Box.Body>
        </Box.Container>
      </section>
    );
  }
});

module.exports = NasabahFormPage;
