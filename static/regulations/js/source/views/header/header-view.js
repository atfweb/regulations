

const $ = require('jquery');
const Backbone = require('backbone');
const SubHead = require('./sub-head-view');

Backbone.$ = $;

const HeaderView = Backbone.View.extend({
  el: '.reg-header',

  initialize: function initialize() {
    this.subHeadView = new SubHead();
    this.partswitcherInit()
  },

  events: {
    'click .mobile-nav-trigger': 'toggleNav',
    'click .help-tip' : 'showHelptip',
    'click .part-switcher' : 'partSwitcher',
    'click .part-switcher-link' : 'partSwitcher',
  },

  toggleNav: function toggleNav(e) {
    e.preventDefault();
    $('.app-nav-list, .mobile-nav-trigger').toggleClass('open');
  },

  contextMap: {
    changeSubHeadText: '_updateSubHead',
  },

  ask: function ask(message, context) {
    if (typeof this.contextMap[message] !== 'undefined') {
      this.contextMap[message].apply(context);
    }
  },

    // type = wayfinding or search
    // content = new content
  _updateSubHead: function _updateSubHead(context) {
    this.subHeadView.change(
            context.type,
            context.content,
        );
  },

  showHelptip: function showHelptip(){
    this.$el.find(".help-tip p").fadeToggle();
  },

  partSwitcher: function partSwitcher(e){
    e.stopPropagation();
    $('.part-switcher-nav').slideToggle("fast");
  },

  partswitcherInit: function partswitcherInit(){
    $(document).click(function(e){
      if(!($(e.target).is('.part-switcher-nav')))
      if($('.part-switcher-nav').is(':visible')){
        $('.part-switcher-nav').hide();
      }
    })
  },
});

module.exports = HeaderView;
