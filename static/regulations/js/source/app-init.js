// Module called on app load, once doc.ready


const $ = require('jquery');
const Backbone = require('backbone');
const queryString = require('query-string');
const MainView = require('./views/main/main-view');
const Router = require('./router');
const SidebarView = require('./views/sidebar/sidebar-view');
const HeaderView = require('./views/header/header-view');
const DrawerView = require('./views/drawer/drawer-view');
const AnalyticsHandler = require('./views/analytics-handler-view');
const PrintSectionView = require('./views/sidebar/printSection-view');
const ExplosivesCalcView = require('./views/sidebar/explosivesCalc-view');
const DiffOnlyView = require('./views/sidebar/diffOnly-view');
const CitationFix = require('./views/main/citationFix-view');
const Tutorial = require('./views/main/tutorial-view');

Backbone.$ = $;

module.exports = {
    // Purgatory for DOM event bindings that should happen in a View
  bindEvents: function bindEvents() {
        // disable/hide an alert
    $('.disable-link').on('click', function click(e) {
      e.preventDefault();
      $(this).closest('.displayed').addClass('disabled');
    });
  },

  init: function init() {
    const regs = window.regs || {};
    const queryParams = queryString.parse(location.search);

    Router.start();
    this.bindEvents();
    // Can we avoid `new`s here?
    /* eslint-disable no-new */
    new AnalyticsHandler();
    new HeaderView();  // Header before Drawer as Drawer sends Header events
    new DrawerView({ forceOpen: regs.drawer && regs.drawer.forceOpen });
    new MainView();
    new SidebarView();
    new PrintSectionView();
    new DiffOnlyView();
    new ExplosivesCalcView();
    new CitationFix();
    new Tutorial();
    
    /* eslint-enable */

    if (queryParams.print === 'true') {
      $("#print_section").hide();
      setTimeout(()=>{
        window.print();
      }, 300);
    };

    setTimeout(() => {
      $('html').addClass('selenium-start');
    }, 5000);
  },
};
