var React = require('react');

var DynamicForm = React.createClass({
  getInitialState: function(){
    return {
      childrenIds:[0],
      lastIndex: 0
    }
  },

  remove: function(childId){
    var component = this;
    return function(){
      console.log('remove child id:' + childId);
      var childrenIds = component.state.childrenIds;
      var childIndex = childrenIds.indexOf(childId);
      if(childId !== -1){
        childrenIds.splice(childIndex, 1);
      }
      component.setState({
        childrenIds: childrenIds
      });
    };
  },

  addRow: function(){
    var newLastIndex = this.state.lastIndex + 1;
    this.state.childrenIds.push(newLastIndex);

    this.setState({
      lastIndex: newLastIndex
    });
  },

  render: function(){
    var component = this;
    var rows = component.state.childrenIds.map(function(childId, index, arr){
      return component.props.element({
        onRemoveClick: component.remove(childId),
        key:childId
      });
    });

    return (
      <div>
        {component.props.header()}
        {rows}
        <div className='row'>
          <div className="col-xs-12">
            <button className="btn btn-block btn-default btn-sm"
              onClick={this.addRow}>
              <i className='fa fa-plus'/> Tambah
            </button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = DynamicForm;
