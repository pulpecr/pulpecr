var googleSheetId = '1REYIbaAx3SMldlbLK_fvhXV9CdXSXdIbKHWTRDSZZRQ';
var googleSeetUrl = 'https://spreadsheets.google.com/feeds/list/' + googleSheetId + '/1/public/values?alt=json';

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ''); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
  var to   = "aaaaaeeeeeiiiiooooouuuunc------";
  for (var i=0, l=from.length ; i<l ; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  return str;
}

function isMenuItem(menuItem) {
  return menuItem.gsx$_cn6ca.$t === 'Item';
}

function isMenuSubTitlle(menuItem) {
  return menuItem.gsx$_cn6ca.$t === 'Subtitle';
}

function isMenuTitle(menuItem) {
  return menuItem.gsx$_cn6ca.$t === 'Title';
}

function getMenuItemTemplate(menuItem) {
  return [
    '<div class="menu-item">',
      '<span class="item-name">' + menuItem.gsx$_cokwr.$t + '</span>',
      '<span class="item-price">' + menuItem.gsx$_cpzh4.$t + '</span>',
    '</div>'
  ].join('');
}


function getMenuSubtitle(menuItem) {
  return [
    '<h4 class="menu-subtitle">' + menuItem.gsx$_cokwr.$t + '</h4>'
  ].join('');
}

function getMenuTitleTemplate(menuItem) {
  var tabName = slugify(menuItem.gsx$_cokwr.$t);
  var tabTitle = menuItem.gsx$_cokwr.$t === 'Comida Rápida' ? 'Rápida' : menuItem.gsx$_cokwr.$t;
  return '<a href="#" id="menuTabsLink_' + tabName + '" class="menu-tab ' + tabName + '"><span>' + tabTitle + '</span></a>'
}

function changeMenuTab(e) {
  var id = e.target.id.split('_')[1];
  $('.menu-tabs-panel.active, #menu-tabs a.active').removeClass('active');
  var panel = '#menuTabsPanel_' + id;
  var tab = '#menuTabsLink_' + id;
  $(panel + ', ' + tab).addClass('active');
  return false;
}

function buildMenu(data) {
  var currentSection;
  var menuData = data.feed.entry;
  var sections = [];
  var tabs = ['<div id="menu-tabs" class="menu-tabs">'];
  for (var i = 0; i < menuData.length; i++) {
    var menuItem = menuData[i];
    if (isMenuTitle(menuItem)) {
      currentSection = slugify(menuItem.gsx$_cokwr.$t);
      tabs.push(getMenuTitleTemplate(menuItem));

      if (sections.length) {
        sections.push('</div>');
      }
    } else if (isMenuSubTitlle(menuItem)) {
      sections.push('<div id="menuTabsPanel_' + currentSection + '" class="menu-tabs-panel ' + currentSection + (i === 1 ? ' active' : '') + '">');
      sections.push(getMenuSubtitle(menuItem));
    } else if (isMenuItem(menuItem)) {
      sections.push(getMenuItemTemplate(menuItem));
    }
  }
  tabs.push('</div>');
  sections.unshift('<div class="menu-tabs-sections">');
  sections.push('</div>');

  var results = tabs.join('') + sections.join('');
  $('#menu').append(results);
  var $tabs = $('#menu-tabs a');
  $($tabs[0]).addClass('active');
  $tabs.on('click', changeMenuTab);
}

function doNavigation(e) {
  var goTo = $(e.target).attr('href');
  $('html, body').animate({
    scrollTop: $(goTo).offset().top
  }, 500);
}

$(function() {
  $.ajax({
    url: googleSeetUrl
  }).done(buildMenu);

  $('#nav a').on('click', doNavigation)
});
