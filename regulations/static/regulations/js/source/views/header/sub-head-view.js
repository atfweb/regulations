

const $ = require('jquery');
const Backbone = require('backbone');
const HeaderEvents = require('../../events/header-events');

Backbone.$ = $;

const SubHeadView = Backbone.View.extend({
  el: '#content-header',

  events: {
    'click .side_by_side_btn': 'sideBySide',
  },

  initialize: function initialize() {
    this.listenTo(HeaderEvents, 'section:open', this.changeTitle);
    this.listenTo(HeaderEvents, 'search-results:open', this.displayCount);
    this.listenTo(HeaderEvents, 'search-results:open', this.changeDate);
    this.listenTo(HeaderEvents, 'search-results:open', this.removeSubpart);
    this.listenTo(HeaderEvents, 'clear', this.reset);
    this.listenTo(HeaderEvents, 'subpart:present', this.renderSubpart);
    this.listenTo(HeaderEvents, 'subpart:absent', this.removeSubpart);

        // cache inner title DOM node for frequent reference
    this.$activeTitle = this.$el.find('.header-label');

        // same for subpart label
    this.$subpartLabel = this.$el.find('.subpart');

    this.enableSideBySide();
  },

    // populates subhead (.header-label) with new title depending on viewport location
    // ex: §478.1(a) to §478.1(b)
  changeTitle: function changeTitle(label) {
    this.$activeTitle.html(label);
    if($('.effective-date').text().indexOf('present') !== -1){
      $('.help-tip').show();
    }else{
      $('.help-tip').hide();
    }
  },

  displayCount: function displayCount(resultCount) {
    this.$activeTitle.html(`<span class="subpart">Search results</span> ${resultCount}`);
  },

  changeDate: function changeDate() {
    this.version = $('section[data-base-version]').data('base-version');
    if (this.version) {
      this.displayDate = $(`select[name="version"] option[value="${this.version}"]`).text();
      $('.effective-date').html(`<strong>Effective date:</strong> ${this.displayDate}`);
    } else {
      $('.effective-date').html('');
    }
  },

  renderSubpart: function renderSubpart(label) {
    this.$subpartLabel.text(label).show();
    this.$activeTitle.addClass('with-subpart');
  },

  removeSubpart: function removeSubpart() {
    this.$subpartLabel.text('').hide();
    this.$activeTitle.removeClass('with-subpart');
  },

  reset: function reset() {
    this.$activeTitle.html('');
  },

  sideBySide: function sideBySide(){
    $("#panel-link").click();
    $( "#help" ).toggle();
    $(".toc-head").toggle();
    $("#menu").toggle();
    $("#view_diff_only").toggle();
    var clonedRegulation = $("#content-body").clone();
    var fontsize = $("content-body").css('font-size');
    $("#sidebar-content").toggle();
    $("#sidebar").toggleClass('secondary-content-sbs');
    $("#content-body").toggleClass('main-content-sbs');
    clonedRegulation.addClass('cloned-regulation');
    $("#sidebar").append(clonedRegulation);
    $("#sidebar").css({'font-size': fontsize})
    if($("#sidebar").hasClass('secondary-content-sbs')){
      $("#sbs_btn").text("View full document");
      $('#sidebar').find('#content-body').each(function(){
        if($("#active-title").text().length > 4){
          var thisSection = $("#active-title").text().slice(2);
          $("#sidebar").find("#content-body").each(function(){
            if($(this).find('#' + thisSection)){
              $('#' + thisSection).show();
            }else{
              $('#' + thisSection).hide();
            }
          })
        }
      });
    }else{
      $('#sidebar #content-body').hide();
      $("#sbs_btn").text("Side by side");
    };



    $("#sidebar").find('p').each(function(){
      $(this).find('ins').each(function(){
        $(this).hide();
      });
    });
    $("#content-body").first().find('p').each(function(){
      $(this).find('del').each(function(){
        $(this).toggle();
      });
    });
  },

  enableSideBySide: function enableSideBySide(){
    var windowWidth = $(window).width();
    if(windowWidth<900){
      $("#sbs_btn").hide();
    };

    $(window).on('resize', function(){
      windowWidth = $(window).width();
      if(windowWidth < 900){
        $("#sbs_btn").hide();
      }else{
        $("#sbs_btn").show();
      }
    });
  },

});

module.exports = SubHeadView;
