var React = require('react');
var Helper = require('../helper');

function baseHandler(pageName, params){
  return function(){
    Helper.call('changePage',[ pageName, params]);
  };
}

function baseLink(pageId, params, labelClass, initial, id){
  var callback = baseHandler(pageId, params);
  return (
    <a onClick={callback}>
      <span className={"label label-" + labelClass}>
        { initial + id }
      </span>
    </a>
  );
}

function accountLink(nasabahId){
  return baseLink('detail-nasabah',
    {nasabahId: nasabahId},
    'info',
    'N',
    nasabahId
  );
}

function depositLink(depositId){
  return baseLink('detail-pembelian',
    {pembelianId: depositId},
    'primary',
    'B',
    depositId
  );
}

function withdrawalHandler(nasabahId){
  return baseHandler('form-penarikan', {initialNasabahId: nasabahId});
}
module.exports = {
  accountLink: accountLink,
  depositLink: depositLink,
  withdrawalHandler: withdrawalHandler
};
