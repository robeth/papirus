var CHANGE_PAGE = 'CHANGE_PAGE';
var CHANGE_SECTION = 'CHANGE_SECTION';
var DASHBOARD_SIDEBAR_TOGGLE = 'DASHBOARD_SIDEBAR_TOGGLE';

function changePageTo(page){
  return { type: CHANGE_PAGE, page };
}

function changeSectionTo(section){
  return { type: CHANGE_SECTION, section };
}

function dashboardSidebarToggle(){
  return { type: DASHBOARD_SIDEBAR_TOGGLE };
}

module.exports = {
  CHANGE_PAGE,
  CHANGE_SECTION,
  DASHBOARD_SIDEBAR_TOGGLE,
  changePageTo,
  changeSectionTo,
  dashboardSidebarToggle
};
