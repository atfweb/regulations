import storage from '../../redux/storage';
import { activePane } from '../../redux/reducers';

const $ = require('jquery');
const Backbone = require('backbone');
const TOCView = require('./toc-view');
const HistoryView = require('./history-view');
const SearchView = require('./search-view');
const DrawerTabs = require('./drawer-tabs-view');

Backbone.$ = $;

const DrawerView = Backbone.View.extend({
  el: '#menu',

  initialize: function initialize(options) {
    storage().subscribe(this.handleReduxUpdate.bind(this));

    this.$label = $('.toc-type');
    this.$children = $('.toc-container');

    this.childViews = {};
    this.childViews['table-of-contents'] = new TOCView();
    this.childViews.timeline = new HistoryView();
    this.childViews.search = new SearchView();
    this.childViews['drawer-tabs'] = new DrawerTabs({ forceOpen: options.forceOpen });
    this.subheadRange = [];

    const $tocSecondary = $('#table-of-contents-secondary');
    if ($tocSecondary.length) {
      this.childViews['table-of-contents-secondary'] = new TOCView({ el: $tocSecondary });
    }

    this.setActivePane('table-of-contents');

    this.setSearchOffset();
    this.toggleSections();
    this.closeSections();
    this.addSubheadRange();
  },

    // page types are more diverse and are named differently for
    // semantic reasons, so we need to associate page types
    // with the drawer panes they should be associated with
  pageTypeMap: {
    diff: 'timeline',
    'reg-section': 'table-of-contents',
    error: 'table-of-contents',
    'search-results': 'search',
  },

  handleReduxUpdate: function handleReduxUpdate() {
    this.setActivePane(activePane(storage()));
  },

  // selectedId = page type or child view type
  setActivePane: function setActivePane(selectedId) {
    let activeId = selectedId;
    if (typeof this.childViews[activeId] === 'undefined') {
      activeId = this.pageTypeMap[activeId];
    }

    // hide the content of all drawer sections
    this.$children.addClass('hidden');

    // remove the 'hidden' class from the active drawer section
    this.childViews[activeId].$el.removeClass('hidden');
  },

  //collapses toc and adds toggle functionality to show/hide sections
  toggleSections: function toggleSections() {
    var tableOfContents = $("#toc").find('li');
    var count = 0;
    var subgroupNumArray = [];
    var sectionNumArray = [];
    tableOfContents = tableOfContents.each(function(){
      var attr = $(this).attr('data-subpart-heading');
      var tocheader = $(this).children('h3').hasClass('toc-nav__divider');  
      if(typeof attr !== typeof undefined && attr !== false){
        count++;
        subgroupNumArray = [];
        sectionNumArray.push(subgroupNumArray);
        const thisli = $(this);
        $(this).addClass('subgroup-heading-' + count);
        $(this).css('cursor', 'pointer');
        $(this).addClass('section-subgroup');
        $(this).attr('tabindex', 0);
        $(this).on("click", function(){
          $(this).css("pointer-events", "none");
          var subgroupNum = $(this).attr("class").match(/\d+/)[0];
          $('#toc').find('li').each(function(){
            if($(this).hasClass('subgroup-' + subgroupNum) === false && $(this).hasClass('toggle-tocmenu-sections') === true){
              $(this).hide();
            }else if($(this).hasClass('subgroup-heading-' + subgroupNum) === false){
              $(this).removeClass('toc-heading-background');
            }
          })
          $('.subgroup-' + subgroupNum).toggle('slow');
          $('.subgroup-heading-' + subgroupNum).toggleClass('toc-heading-background');
          var self = $(this);
          setTimeout(function(){
            self.css("pointer-events", "auto");
          },1000);
        });
        $(this).on("keypress", function(e){
          if(e.which == 13){
            thisli.on("click");
          }
        })
      }else if(tocheader === true){
        $(this).css({
          'background-color': '#50627A', 
          'color' : 'white',
        });
        $(this).addClass('subgroup-' + count);
        $(this).addClass('toggle-tocmenu-sections');
        var stopWords = ['of', 'not', 'the', 'to', 'a', 'an', 'and', 'or', 'on', 'at', 'but', 'so', 'up', 'by', 'in', 'nor', 'yet', 'for'];
        var new_str = $(this).find('h3').text().toLowerCase().split(' ');
        for(var aword in new_str){  
          if(!(stopWords.indexOf(new_str[aword]) !== -1)){
            new_str[aword] = new_str[aword].replace(/\b[a-z]/g, function(txtVal) {
                return txtVal.toUpperCase(); 
            });
          }      
        }
        new_str[0] = new_str[0].replace(/\b[a-z]/g, function(txtVal) {
          return txtVal.toUpperCase(); 
      });
        new_str = new_str.join(" ");
        $(this).find('h3').text(new_str);
      }else{
        var thisSectionNum = $(this).find('a')[0].hash;
        thisSectionNum = thisSectionNum.replace('-','.').replace('#','');
        if(subgroupNumArray.length == 0){
          subgroupNumArray.push(thisSectionNum);
        }else{
          subgroupNumArray[1] = thisSectionNum;
        }
        $(this).addClass('subgroup-' + count);
        $(this).addClass('toggle-tocmenu-sections');
      }
    });
    this.subheadRange = sectionNumArray;
  },

  addSubheadRange: function addSubheadRange(){
    var rangecount = 0;
    var thisRange = this.subheadRange;
    var rangeSetter = $('#toc').find('.section-subgroup').each(function(){
      var currentSubhead = thisRange[rangecount];
      if(currentSubhead.length == 1){
        $(this).find('h3').append('<p class="subhead-range">' + currentSubhead[0] + '</p>'); 
      }else{
        $(this).find('h3').append('<p class="subhead-range">' + currentSubhead[0] + ' - ' + currentSubhead[1]+ '</p>'); 
      }
      rangecount++;
    }) 
  },

  //hides all sections when page initially loads if subheaders exist and shows the current subheader content
  closeSections: function closeSections() {
    var hasSubheader = $('#toc').find('li').each(function(){
      var attr = $(this).attr('data-subpart-heading');
      if(typeof attr !== typeof undefined && attr !== false){
        $('.toggle-tocmenu-sections').hide();
      }
    });
    var tocCurrentSection = $('#toc').find('.current').parent().attr('class');
    if(tocCurrentSection === undefined || tocCurrentSection === null){
      console.log('');
    }else{
      var subgroupNum = tocCurrentSection.match(/\d+/)[0];
      $('.subgroup-' + subgroupNum).show('slow');
      $('.subgroup-heading-' + subgroupNum).addClass('toc-heading-background');
    } 
  },

  setSearchOffset: function setSearchOffset(){
    var searchSectionHeight = this.$el.find('.search_toc').outerHeight(true);
    this.$el.find('ol').css('margin-top', searchSectionHeight);
  },
});

module.exports = DrawerView;
