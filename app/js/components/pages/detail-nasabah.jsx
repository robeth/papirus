var React = require('react');
var NasabahForm = require('../forms/nasabah');
var Box = require('../box.jsx');

var DetailNasabah = React.createClass({

  render: function(){
    /**
    * TODO Add Deposit history for an account
    * TODO Add withdrawal history for an account
    * TODO Add Stock deposit summary for an account
    */
    return (
      <section className="content">
        <Box.Container className="box-info">
          <Box.Header showBorder={true} title='Nasabah Baru'/>
          <Box.Body>
            <NasabahForm mode='edit' nasabahId={this.props.nasabahId}/>
          </Box.Body>
        </Box.Container>
      </section>
    );
  }
});

module.exports = DetailNasabah;
