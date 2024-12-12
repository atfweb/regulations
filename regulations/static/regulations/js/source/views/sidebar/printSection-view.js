const $ = require('jquery');
const _ =require('underscore');
const Backbone = require('backbone');


Backbone.$ = $;


const PrintSectionView = Backbone.View.extend({
    el: '#print_section',
  
    events: {
        'click .print_regulation' : 'printRegulationSection',
    },

    initialize: function(){  },

    printRegulationSection: function(e){
        e.preventDefault();
        var content = $('#regulation_content').html();
        var frame1 = document.createElement('iframe');
        frame1.name = "frame1";
        frame1.style.position = "absolute";
        frame1.style.top = "-1000000px";
        document.body.appendChild(frame1);
        var printerWindow = (frame1.contentWindow) ? frame1.contentWindow : (frame1.contentDocument.document) ? frame1.contentDocument.document : frame1.contentDocument;
        printerWindow.document.open();
        printerWindow.document.write('<html><head><title></title>');
        printerWindow.document.write('<link rel="stylesheet" href="/static/regulations/css/regulations.min.css" media="all" />');
        printerWindow.document.write('</head><body><hr style="color: #aaaaaa; background-color: #aaaaaa;">' + content + '</body></html>');
        printerWindow.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            document.body.removeChild(frame1);
        }, 600);
        return false;  
      },

});

module.exports = PrintSectionView;