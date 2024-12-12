const $ = require('jquery');
const _ =require('underscore');
const Backbone = require('backbone');


Backbone.$ = $;

const DiffOnlyView = Backbone.View.extend({
    el: '#diff_view',
    
    events: {
        'click #view_diff_only' : 'viewDiffOnly',
    },

    initialize: function initialize(){
        this.showDiffOnlyDiv();
        this.scrollToChange();
    },

    viewDiffOnly: function viewDiffOnly(){
        if($('#view_diff_only h4').text() != 'View Entire Document'){
            $('#view_diff_only h4').text('View Entire Document');
        }else{
            $('#view_diff_only h4').text('View Changes Only');
        };
        var regulation_content = $('#regulation_content ol');
        regulation_content.find('li').each(function(){
            var self = $(this);
            var deleted = false;
            var added = false;
            $(this).find('del').each(function(){
                var deleted_text = $(this).text().replace(/\s/g,'');
                if(deleted_text.length > 2){
                    deleted = true;
                }
            });
            
            $(this).find('ins').each(function(){
                var added_text = $(this).text().replace(/\s/g,'');
                if(added_text.length > 2){
                    added = true;
                }
            });
            if(deleted === false && added === false){
                self.toggle();  
            };
        });
        return false;
    },

    showDiffOnlyDiv: function showDiffOnlyDiv(){
        $('#view_diff_only').hide();
        $('#view_diff_only h4').text('View Changes Only');
        var change_count = 0;
        var regulation_content = $('#regulation_content ol');
        regulation_content.find('li').each(function(){
            $(this).find('del').each(function(){
                var deleted_text = $(this).text().replace(/\s/g,'');
                if(deleted_text.length > 2){
                    change_count++;
                }
            });
            
            $(this).find('ins').each(function(){
                var added_text = $(this).text().replace(/\s/g,'');
                if(added_text.length > 2){
                    change_count++;
                }
            });
        });
        if(change_count > 0){
            $('#view_diff_only').show();
        }
    },

    scrollToChange: function scrollToChange(){
        var regulation_content = $('#regulation_content ol');
        var find_change = true;
        regulation_content.find('li').each(function(){
            if(find_change === true){
                var self = $(this);
                self.find('ins, del').each(function(){
                    var deleted_text = $(this).text().replace(/\s/g,'');
                    if(deleted_text.length > 2){
                        $("html").animate({
                            scrollTop: self.offset().top
                            },200
                        );
                        find_change = false;
                    };
                    return find_change
                });
            }    
        }); 
    },

    remove: function remove() {
        this.undelegateEvents();
    },
})

module.exports = DiffOnlyView;