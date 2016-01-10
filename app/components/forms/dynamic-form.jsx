var React = require('react');
var FormMixin = require('../mixins/form-mixin');
var Promise = require('bluebird');
var _ = require('lodash');

var DynamicForm = React.createClass({
  mixins: [FormMixin],
  getPropTypes: {
    mode: React.PropTypes.oneOf(['add', 'edit']),
    refLabel: React.PropTypes.string,
    instances: React.PropTypes.array,
    initialIsReadOnly: React.PropTypes.bool,
    childFormParams: React.PropTypes.object
  },

  getInitialState: function(){
    console.log('DF-gis:' + this.props.initialIsReadOnly);
    return {
      isReadOnly: this.props.initialIsReadOnly,
      childrenIds: this.props.mode === 'add' ? [0] : [],
      editedIds: [],
      lastIndex: 0,
      instances: this.props.instances,
      instanceDictionary: {},
      headerFactory: React.createFactory(this.props.header),
      elementFactory: React.createFactory(this.props.element)
    }
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('DynamicForm-CWRP-nextProps:');
    console.log(nextProps);
    if(nextProps.mode === 'edit' &&
      nextProps.instances &&
      nextProps.instances !== this.props.instances){
      this.updateInstances(nextProps.instances);
    }
  },

  updateInstances: function(newInstances){
    var currentLastIndex = this.state.lastIndex;
    var instanceDictionary = {};
    var newIds = newInstances.map(
      function(instance, index){
        var currentIndex = currentLastIndex + index + 1;
        instanceDictionary[currentIndex] = instance;
        return currentIndex;
      });
    var newLastIndex = currentLastIndex + newIds.length + 1;
    console.log('DynamicForm-updateInstances: ids-instances-dictionary');
    console.log(newIds);
    console.log(newInstances);
    console.log(instanceDictionary);
    this.setState({
      childrenIds: newIds.slice(),
      editedIds: newIds.slice(),
      lastIndex: newLastIndex,
      instances: newInstances,
      instanceDictionary: instanceDictionary
    });
  },

  getMode: function(childId){
    return this.state.editedIds.indexOf(childId) !== -1 ? 'edit' : 'add';
  },

  reset: function(){
    console.log('DF-reset: state');
    console.log(this.state);
    var newLastIndex = this.state.lastIndex + 1;
    var initialChildrenIds = this.props.mode === 'edit'
      ? this.state.editedIds
      : [newLastIndex];

    this.setState({
      childrenIds: initialChildrenIds,
      lastIndex: newLastIndex
    });

    this.getChildrenForms().map(function(childrenForm){
      childrenForm.component.reset();
    });
  },

  removeRow: function(childId){
    var component = this;
    return function(event){
      event.preventDefault();
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

  addRow: function(event){
    event.preventDefault();
    var newLastIndex = this.state.lastIndex + 1;
    this.state.childrenIds.push(newLastIndex);

    this.setState({
      lastIndex: newLastIndex
    });
  },

  save: function(args){
    var childPromises = this.getNewForms().map(function(childForm, index, arr){
      return childForm.component.save(args);
    });

    return Promise.all(childPromises);
  },

  getRefsFromIds: function(childIds){
    var component = this;
    return childIds.map(function(childId){
      var childRef = component.generateRef(childId);
      return {
        ref: childRef,
        component: component.refs[childRef]
      };
    });
  },

  getEditedForms: function(){
    var editedIds = _.intersection(
      this.state.editedIds,
      this.state.childrenIds);
    console.log('editedIds:');
    console.log(editedIds);
    return this.getRefsFromIds(editedIds);
  },

  getNewForms: function(){
    var newIds = _.difference(
      this.state.childrenIds,
      this.state.editedIds);
    console.log('newIds:');
    console.log(newIds);
    return this.getRefsFromIds(newIds);
  },

  getDeletedIds: function(){
    var allIds = this.state.childrenIds;
    var editedIds = this.state.editedIds;
    return _.difference(
      this.state.editedIds,
      this.state.childrenIds);
  },

  saveChanges: function(args){
    console.log('DF-saveChanges');
    var component = this;

    var editedPromises =  this.getEditedForms().map(
      function(childForm, index, arr){
        return childForm.component.saveChanges(args);
      }
    );

    var newPromises = this.getNewForms().map(
      function(childForm, index, arr){
        return childForm.component.save(args);
      }
    );

    var deletedPromises = this.getDeletedIds().map(
      function(deletedId, index, arr){
        console.log('DF-delete:');
        console.log(component.props.element.destroy);
        return component.props.element.destroy(
          component.state.instanceDictionary[deletedId]
        );
      }
    );

    return editedPromises.concat(newPromises, deletedPromises);
  },

  generateRef: function(index){
    return (this.props.refLabel || 'dynamic-form-') + index;
  },

  render: function(){
    var component = this;
    var rows = component.state.childrenIds.map(function(childId, index, arr){
      console.log('DynamicForm-render-map: instance');
      console.log(component.state.instanceDictionary[childId]);
      return component.state.elementFactory({
        onRemoveClick: component.removeRow(childId),
        key: childId,
        ref: component.generateRef(childId),
        mode: component.getMode(childId),
        instance: component.state.instanceDictionary[childId],
        initialIsReadOnly: component.state.isReadOnly,
        params: component.props.childFormParams
      });
    });

    return (
      <div>
        {component.state.headerFactory()}
        {rows}
        {!this.state.isReadOnly &&
          (
            <div className='row'>
              <div className="col-xs-12">
                <button className="btn btn-block btn-default btn-sm"
                  onClick={this.addRow}>
                  <i className='fa fa-plus'/> Tambah
                  </button>
                </div>
              </div>
          )
        }
      </div>
    );
  }
});

module.exports = DynamicForm;
