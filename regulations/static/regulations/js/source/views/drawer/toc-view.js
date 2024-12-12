import storage from '../../redux/storage';
import { locationActiveEvt } from '../../redux/locationReduce';
import { activeSection } from '../../redux/reducers';

const $ = require('jquery');
const Backbone = require('backbone');
const Helpers = require('../../helpers');
const Router = require('../../router');
const MainEvents = require('../../events/main-events');
const HeaderEvents = require('../../events/header-events');
const Resources = require('../../resources.js');

Backbone.$ = $;

const TOCView = Backbone.View.extend({
  el: '#table-of-contents',

  events: {
    'click a.diff[data-section-id]': 'sendDiffClickEvent',
    'click a[data-section-id]:not(.diff)': 'sendClickEvent',
    'click #search_toc_btn' : 'searchClickEvent',
    'click #search_diff_toc_btn' : 'searchDiffClickEvent',
  },

  initialize: function initialize() {
    const openSection = $('section[data-page-type]').attr('id');

    storage().subscribe(this.updateFromRedux.bind(this));

    if (openSection) {
      this.setActive(openSection);
    }

        // **TODO** need to work out a bug where it scrolls the content section
        // $('#menu-link:not(.active)').on('click', this.scrollToActive);

        // if the browser doesn't support pushState, don't
        // trigger click events for links
    if (Router.hasPushState === false) {
      this.events = {};
    }
  },

  // update active classes, find new active based on the reg entity id in the anchor
  setActive: function setActive(tocId) {
    const newActiveLink = this.$el.find(`a[data-section-id="${tocId}"]`);
    const subpart = newActiveLink
                    .parent()
                    .prevAll('li[data-subpart-heading]')
                    .first()
                    .find('.toc-nav__divider')
                    .attr('data-section-id');

    this.$el.find('.current').removeClass('current');
    newActiveLink.addClass('current');

    if (subpart && subpart.length > 0) {
      HeaderEvents.trigger('subpart:present', Helpers.formatSubpartLabel(subpart));
    } else {
      HeaderEvents.trigger('subpart:absent');
    }

    return this;
  },

  updateFromRedux: function updateFromRedux() {
    this.setActive(activeSection(storage()));
  },

    // **Event trigger**
    // when a TOC link is clicked, send an event along with the href of the clicked link
  sendClickEvent: function sendClickEvent(e) {
    e.preventDefault();

    const sectionId = $(e.currentTarget).data('section-id');
    const type = this.$el.closest('.panel').data('page-type');
    storage().dispatch(locationActiveEvt(sectionId));
    MainEvents.trigger('section:open', sectionId, {}, type);
  },

  sendDiffClickEvent: function sendDiffClickEvent(e) {
    e.preventDefault();

    const $link = $(e.currentTarget);
    const sectionId = $link.data('section-id');
    const config = {};
    config.newerVersion = Helpers.findDiffVersion(Resources.versionElements);
    config.baseVersion = Helpers.findVersion(Resources.versionElements);
    storage().dispatch(locationActiveEvt(sectionId));
    MainEvents.trigger('diff:open', sectionId, config, 'diff');
  },

  //uses toc search to find a specific regulation by section number.
  searchClickEvent: function searchClickEvent(e) {
    e.preventDefault();

    var allSections = [];
    this.$el.find('li').each(function(){
      var sectionText = $(this).text();
      allSections.push(sectionText);
    });
    allSections = allSections.join();

    var hasSubheader = $('#toc').find('li').each(function(){
      var attr = $(this).attr('data-subpart-heading');
      if(typeof attr !== typeof undefined && attr !== false){
        $('.toggle-tocmenu-sections').hide();
      }
    });
    $('li').removeClass('toc-heading-background');

    const partId = this.$el.find('input').attr('data-part-id');
    const sectId = this.$el.find('#search_section_id').val();
    const sectionId = partId + '-' + sectId;
    const tocSectionId = partId + '.' + sectId;
    var searchSectionHeight = this.$el.find('.toc-search').outerHeight(true) + this.$el.find('#search_section_id').outerHeight(true) + 20;

    if(allSections.indexOf(tocSectionId + ' ') !== -1 && sectId.length < 4){
      $('.null_value, .wrong_value').remove();   
      this.$el.find('ol').css('margin-top', searchSectionHeight);
      if(this.$el.find('a').hasClass('diff')){
        const config = {};
        config.newerVersion = Helpers.findDiffVersion(Resources.versionElements);
        config.baseVersion = Helpers.findVersion(Resources.versionElements);
        storage().dispatch(locationActiveEvt(sectionId));
        MainEvents.trigger('diff:open', sectionId, config, 'diff');
      }else{
        const type = this.$el.closest('.panel').data('page-type');
        storage().dispatch(locationActiveEvt(sectionId));
        MainEvents.trigger('section:open', sectionId, {}, type);
        var thisSubgroup = $('li:contains("' + tocSectionId + ' ")').attr("class").split(/\s+/)[0];
        if(thisSubgroup !== undefined){
          var subgroupNum = thisSubgroup.match(/\d+/)[0];
          $('.subgroup-' + subgroupNum).show('slow');
          $('.subgroup-heading-' + subgroupNum).addClass('toc-heading-background');
        }      
      }
    }else if(sectId.length == 0){
      $('.null_value, .wrong_value').remove();
      this.$el.find('#search_toc_btn').after('<p class="null_value" style="color: red; padding-left: 15px;"> Enter a value. </p>');
      var searchErrorHeight = this.$el.find('.search_toc').outerHeight(true);
      this.$el.find('ol').css('margin-top', searchErrorHeight);
    }else{
      $('.null_value, .wrong_value').remove();
      this.$el.find('#search_toc_btn').after('<p class="wrong_value" style="color: red; padding-left: 15px;"> Section not found. </p>');
      var searchErrorHeight = this.$el.find('.search_toc').outerHeight(true);
      this.$el.find('ol').css('margin-top', searchErrorHeight);
    }   
  },

  searchDiffClickEvent: function searchDiffClickEvent(e){
    e.preventDefault();

    const partId = this.$el.find('input').attr('data-part-id');
    const sectId = this.$el.find('#search_section_id').val();
    const sectionId = partId + '-' + sectId;
    
    var urlBase = window.location.hostname;
    console.log(urlBase);

    if(window.location.port){
      var urlPort = ':' + window.location.port;
      var urlLocation = 'http://' + urlBase + urlPort + '/' + sectionId;
    }else{
      var urlLocation = 'https://' + urlBase + '/' + sectionId;
    }
    
    console.log(urlLocation);
    $(location).attr('href', urlLocation);
  },


    // **Inactive**
    // Intended to keep the active link in view as the user moves around the doc
  scrollToActive: function scrollToActive() {
    const activeLink = document.querySelectorAll('#table-of-contents .current');

    if (activeLink[0]) {
      activeLink[0].scrollIntoView();
    }
  },
});

module.exports = TOCView;
