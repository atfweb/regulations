const $ = require('jquery');
const Backbone = require('backbone');

Backbone.$ = $;

const NextPrevView = Backbone.View.extend({
    el: '#content-header',

    events: {
        'click .next a': 'OpenTabs',
        'click .previous a': 'OpenTabs',
    },

    initialize: function initialize() {
        var pageURL = $(location).attr('href');
        if(!(pageURL.indexOf('/646')) !== -1){
            if(pageURL.indexOf('-') !== -1){
                this.OpenTabs();  
            }else{
                this.CloseTabs();
            }
        }  
    },

    OpenTabs: function OpenTabs(){
      const sectionId = this.$el.find(".header-label").text();
      var id = sectionId.replace('§ ', '');
      id = id.replace('.', '-');
      var child = $('#toc').find('[data-section-id="'+ id + '"]') || $('#toc').find('[data-linked-section="'+ id + '"]');
      var tocCurrentSection = child.parent().attr('class'); 
      if(tocCurrentSection === undefined || tocCurrentSection === null){
        console.log('');
      }else{
        var subgroupNum = tocCurrentSection.match(/\d+/)[0];
        
        var currentHeader = $("#toc").find(".toc-heading-background");
        
        if(currentHeader !== undefined || currentHeader !== false){
            if(currentHeader[0] !== undefined){
                var curHead = currentHeader[0].className;
                var curHeadNum = curHead.match(/\d+/)[0];   
                if(curHeadNum != subgroupNum){
                    var hasSubheader = $('#toc').find('li').each(function(){
                        var attr = id;
                        if(typeof attr !== typeof undefined && attr !== false){
                            $('.toggle-tocmenu-sections').hide();
                        }
                    });
                    $('.subgroup-' + subgroupNum).show('slow');
                    $('li').removeClass('toc-heading-background');
                    $('.subgroup-heading-' + subgroupNum).addClass('toc-heading-background');
                } 
            }
        }
      }
    },

    CloseTabs: function CloseTabs(){
        var currentPart = parseInt($(".search-reg-part").text());
        if(currentPart != 646){
            $('.toggle-tocmenu-sections').hide();
        }  
    }
})

module.exports = NextPrevView;