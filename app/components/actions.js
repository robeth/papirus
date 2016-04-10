var CHANGE_PAGE = 'CHANGE_PAGE';
var CHANGE_SECTION = 'CHANGE_SECTION';

function changePageTo(page){
  return { type: CHANGE_PAGE, page };
}

function changeSectionTo(section){
  return { type: CHANGE_SECTION, section };
}

module.exports = {
  CHANGE_PAGE,
  CHANGE_SECTION,
  changePageTo,
  changeSectionTo
};
