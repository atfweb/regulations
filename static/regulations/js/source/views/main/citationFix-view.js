const $ = require('jquery');
const Backbone = require('backbone');

Backbone.$ = $;

const CitationFix = Backbone.View.extend({
    el: '#regulation_content',

    initialize: function initialize() {
        this.checkCitations();
    },

    checkCitations: function checkCitations(){
        const numRe = /\b[0-9]{3}\.[0-9]\d{1,2}/g
        this.$el.find('p').each(function(){
            let citation = $(this).text().match(numRe);
            if(citation){
                citation.forEach(cite => {
                    let revisedtext = $(this).html()
                    let citeLink = cite.replace('.', '-')
                    let revisedCitations = revisedtext.replace(cite, '<a href="/' + citeLink + '" class="citation internal">' + cite + '</a>');
                    $(this).html(revisedCitations);
                });
            }
        })
    }
})

module.exports = CitationFix;