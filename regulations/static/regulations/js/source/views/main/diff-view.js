import storage from '../../redux/storage';
import { paneActiveEvt } from '../../redux/paneReduce';

const $ = require('jquery');
const _ = require('underscore');
const Backbone = require('backbone');
const Helpers = require('../../helpers');
const Resources = require('../../resources');
const ChildView = require('./child-view');

Backbone.$ = $;

const DiffView = ChildView.extend({
  initialize: function initialize(options, ...args) {
    this.options = options;
    this.id = this.options.id;
    this.baseVersion = this.options.baseVersion;
    this.newerVersion = this.options.newerVersion || Helpers.findDiffVersion(
      Resources.versionElements, this.baseVersion);
    this.fromVersion = this.options.fromVersion || this.newerVersion;
        // we preserve the section id as is in config obj because
    this.options.sectionId = this.id;

    this.url = `diff/${this.model.assembleDiffURL(this.options)}`;
    ChildView.prototype.initialize.apply(this, [options].concat(args));

    if (typeof this.options.render === 'undefined') {
      storage().dispatch(paneActiveEvt('timeline'));
    }

    this.openFirstChange();
  },

  // "12 CFR Comparison of §1005.1 | eRegulations"
  assembleTitle: function assembleTitle() {
    const titleParts = _.compact(document.title.split(' '));
    const newTitle = [titleParts[0], titleParts[1], this.sectionLabel, '|', 'eRegulations'];
    return newTitle.join(' ');
  },

  // navigates to the first section in the part with a change when comparing part
  openFirstChange: function openFirstChange(){
    var sectionVar = window.location.pathname
    sectionVar = sectionVar.split('/')[2].split('-')[1];
    if(sectionVar == 1 && sessionStorage.isDiff == 1){
      var partname = String(this.id);
      partname = partname.slice(0, 3)
      sessionStorage.setItem('firstChange', true);
      sessionStorage.setItem('partname', partname);
      $("#toc ol").find('li').each(function(){
        if($(this).hasClass('modified')){
          $(this).find('a').trigger('click');
          return false;
        }
      });
      sessionStorage.isDiff = 0;
    }else{
      if(sessionStorage.firstChange){
        var newpartname = String(this.id);
        newpartname = newpartname.slice(0, 3)
        if(sessionStorage.partname != newpartname){
          sessionStorage.partname = newpartname;
          $("#toc ol").find('li').each(function(){
            if($(this).hasClass('modified')){
              $(this).find('a').trigger('click');
              return false;
            }
          });
        }
      }else{
        var partname = String(this.id);
        partname = partname.slice(0, 3)
        sessionStorage.setItem('firstChange', true);
        sessionStorage.setItem('partname', partname);
        $("#toc ol").find('li').each(function(){
          if($(this).hasClass('modified')){
            $(this).find('a').trigger('click');
            return false;
          }
        });
      }
    }
    
  },
});

module.exports = DiffView;
