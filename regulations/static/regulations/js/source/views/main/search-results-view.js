import storage from '../../redux/storage';
import { paneActiveEvt } from '../../redux/paneReduce';

const $ = require('jquery');
const Backbone = require('backbone');
const Router = require('../../router');
const HeaderEvents = require('../../events/header-events');
const MainEvents = require('../../events/main-events');
const ChildView = require('./child-view');

Backbone.$ = $;

const SearchResultsView = ChildView.extend({
  events: {
    'click .search-nav a': 'paginate',
    'click h3 .internal': 'openResult',
    'click button' : 'toggleRelatedDocs',
  },

  initialize: function initialize(options, ...args) {
    this.options = options;
    if (!this.options.id && this.options.docId) {
      this.options.id = this.options.docId.toString();
    }
    this.options.id = this.options.id || '';
    this.query = this.options.query;
    // the TOC may link to a different reg version than this.options.resultsRegVersion
    // because the user can select a different version to pull search results from
    this.resultsRegVersion = this.options.regVersion;
    this.page = parseInt(this.options.page, 10) || 0;
    this.title = `Search of ${this.options.docId} for ${this.query} | eRegulations`;

    // if the browser doesn't support pushState, don't
    // trigger click events for links
    if (Router.hasPushState === false) {
      this.events = {};
    }

    storage().dispatch(paneActiveEvt('search'));

    // if the site wasn't loaded on the search results page
    if (this.options.render) {
      this.url = `search/${this.model.assembleSearchURL(this.options)}`;
      ChildView.prototype.initialize.apply(this, [options].concat(args));
    } else {
      this.options.docType = this.$el.data('doc-type');
    }

    this.highlightQuery(this.query);
    this.showRelatedDocuments();
  },

  setElement: function setElement() {
    Backbone.View.prototype.setElement.call(this, '#content-wrapper.search-results');
  },

  render: function render() {
    const $results = this.$el.find('#result-count');

        // if the results were ajaxed in, update header
    if ($results.text().length > 0) {
      HeaderEvents.trigger('search-results:open', $results.text());
      $results.remove();
    }

    if (Router.hasPushState) {
      if (typeof this.options.id !== 'undefined') {
        Router.navigate(this.url);
      }
    }
  },

  paginate: function paginate(e) {
    e.preventDefault();

    const options = {
      query: this.options.query,
      docType: this.options.docType,
      regVersion: this.options.regVersion,
      page: this.page + ($(e.target).hasClass('previous') ? -1 : 1),
    };

    MainEvents.trigger('search-results:open', null, options, 'search-results');
  },

  openResult: function openResult(e) {
        // TOC version retains the version the reg was loaded on whereas the content base section
        // changes to match the search results
        // page should reload if the TOC version doesn't match the searched version
    if (!this.resultsRegVersion || this.resultsRegVersion === $('nav#toc').attr('data-toc-version')) {
      e.preventDefault();
      const $resultLink = $(e.target);
      const pageType = this.options.docType === 'cfr' ? 'reg-section' : 'preamble-section';
      const options = {
        regVersion: $resultLink.data('linked-version'),
        scrollToId: $resultLink.data('linked-subsection'),
      };

      storage().dispatch(paneActiveEvt('table-of-contents'));
      MainEvents.trigger('section:open', $resultLink.data('linked-section'), options, pageType);
    }
  },

  highlightQuery: function highlightQuery(query){
    var queryString = String(query);
    var queryList = queryString.split(' '); 
    var queryResults = [];
    for(var i in queryList){
      var re = new RegExp(queryList[i], "gi");
      queryResults.push(re);
    } 
    var results = this.$el.find('li', '.result-list');
    results = results.each(function(){
      for(var j=0; j<queryResults.length; j++){
        var highlighted = '<span class="highlighted">' + queryList[j] + '</span>';
        var queryReplace = $('p', this).html().replace(queryResults[j], highlighted);
        $('p', this).html(queryReplace);
      }
    });
  },

  showRelatedDocuments: function showRelatedDocuments(){
    var query = this.options.query;
    var part = this.options.id;
    var version = this.options.regVersion
    return $.ajax({
        type: "GET",
        url: "/landing_related_documents",
        contentType:"application/json; charset=utf-8",
        data: {'query': query, 'part': part, 'version': version},
        dataType: "json",
        async: true,
        success: function(json){
          $('.result-list').find('li').each(function(){
            var section = $(this).find('a').attr('data-linked-section');
            var self = $(this)
            jQuery.each( json['results'], function( i, val ) {
              var doc_types = val['related_document_types'];
              var docs = val['related_documents'];
              var label_string = val['label_string'];
              if(section == label_string){
                var doc_buttons = []
                for(var i=0; i<doc_types.length; i++){
                  if(doc_types[i] == "QA"){
                    var doc_button = '<button id="' + doc_types[i] + '_' + section + '" class="rd_button" >Q&As</button>';
                    self.append(doc_button);
                  }else if(doc_types[i] == "OpenLetter"){
                    var doc_button = '<button id="' + doc_types[i] + '_' + section + '" class="rd_button" >Open Letters</button>';
                    self.append(doc_button);
                  }else{
                    var doc_button = '<button id="' + doc_types[i] + '_' + section + '" class="rd_button" >' + doc_types[i] + 's</button>';
                    self.append(doc_button);
                  }
                }

                for(var j=0;j<doc_buttons.length;j++){
                  self.append(doc_buttons[j]);
                }

                for(var i=0; i<docs.length; i++){
                  if(section == label_string){
                    if(docs[i]['document_type'] == "Citation"){
                      self.append('<li class="'+ docs[i]['document_type']+'_'+section+' related_document"><a href="/'+ docs[i]['URL'] + '">'+ docs[i]['Title']+'</a></li>');
                    }else{
                      self.append('<li class="'+ docs[i]['document_type']+'_'+section+' related_document"><a href="'+ docs[i]['URL'] + '" target="_blank">'+ docs[i]['Title']+'</a></li>');
                    }
                  }
                }

                $('.related_document').hide();
              }
            });
          });
        },
    })
  },

  toggleRelatedDocs: function toggleRelatedDocs(e){
    e.stopPropagation();
    var button_id = $(e.target).attr("id");
    $('.result-list').find('.related_document').each(function(){
      if(!($(this).hasClass(button_id))){
        $(this).hide();
      }
    }) 
    $('.' + button_id).slideToggle();
  },
  
});

module.exports = SearchResultsView;
