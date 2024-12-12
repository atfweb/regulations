const $ = require('jquery');
const Backbone = require('backbone');
const _ = require('underscore');
const { string } = require('prop-types');
const { event } = require('jquery');

Backbone.$ = $;

var eventfired = false;
var tocState = false;
var allowKeyboardControls = false;
var counter = 0;

const Tutorial = Backbone.View.extend({
    events: {
       
    },

    initialize: function initialize() {
        this.startTutorial();
        var tutorialCount = 0
        while(tutorialCount <= 21 && eventfired == false){
            if(tutorialCount==0){
                $('#tutorial_' + tutorialCount).append('<div class="prev_next_tutorial bshadow"><p class="next_bubble"><span class="underline">NEXT</span> &gt;</p></div>');
            }else if(tutorialCount == 20){
                $('#tutorial_' + tutorialCount).append('<div class="prev_next_tutorial bshadow"><p class="prev_bubble">&lt; <span class="underline">PREVIOUS</span></p><p class="next_bubble"><span class="underline">CLOSE</span> &gt;</p></div>');
            }else{
                $('#tutorial_' + tutorialCount).append('<div class="prev_next_tutorial bshadow"><p class="prev_bubble">&lt; <span class="underline">PREVIOUS</span></p><p class="next_bubble"><span class="underline">NEXT</span> &gt;</p></div>'); 
            }
            tutorialCount++;
        }
        eventfired = true
    },

    startTutorial: function startTutorial() {
        var heroBanner = $(".list-header");
        var tutorialOverlay = $(".tutorial_overlay1");
        var tutorialicon = $("#tutorial_icon");
        var nextBubble = $(".next_bubble");
        var prevBubble = $(".prev_bubble");
        var panel = $(".panel");


        tutorialicon.fadeTo(500, 1);
        $('.part-switcher-nav').hide();
        
        $('.about_link').css({'color':'white !important', 'font-weight': 'bold', 'text-decoration': 'underline'});
        
        function beginTutorial(e){
            e.stopImmediatePropagation();
            tutorialOverlay.trigger('focus');
            $('.main-content-overlay').hide();
            $('.main-content-overlay-2').hide();
            $('.sidebar-tutorial-overlay').hide();


            if(counter == 0){
                allowKeyboardControls = true;
                e.stopPropagation();
                if(!($("#panel-link").hasClass('open'))){
                    $('.toc-toggle').click();
                }
                panel.css({'overflow-y':'hidden'});
                tutorialOverlay.appendTo("#menu"); 
                tutorialOverlay.appendTo(".search_toc");
                tutorialOverlay.appendTo("#toc-title");
                tutorialOverlay.fadeIn('fast');
                $("#toc").css('pointer-events','none');
                $(".wrap").css('pointer-events','none');
                $('.tutorial').css('pointer-events','auto');
                $('.prev_next_tutorial').css('pointer-events','auto');
                counter++;
                tutorialicon.css({'background-color': '#660e0e', 'font-size': '1.0em'}).text('X').addClass('in-progress').fadeTo(900, 1);
                $("#tutorial_0").css({'line-height' : '25px', 'margin-left':'30px', 'margin-top':'20px'});
                $("#tutorial_0").fadeIn('fast');
            }else if(counter > 0){
                $("#toc").css('pointer-events','auto');
                $(".wrap").css('pointer-events','auto');
                e.stopPropagation();
                tutorialicon.css({'background-color': '#50627a', 'font-size': '1.3em'}).text('?').removeClass('in-progress');
                panel.css({'overflow-y':'scroll'});
                $("#tutorial_" + String(counter-1)).hide();
                $('.panel').removeClass('tutorial-toc-left');
                $('.toc-head').removeClass('tutorial-toc-left');
                tutorialOverlay.hide();
                $('.subgroup-heading-2').removeClass('toc-heading-background');
                $('.subgroup-2').removeClass('bring-to-front');
                $('.subgroup-heading-2').removeClass('bring-to-front');
                $('.subgroup-2').hide('slow');
                $('.subgroup-2').css({'pointer-events':'auto'}); 
                counter = 0;
                allowKeyboardControls = false;
            }
        }

        function continueTutorial(e){
            var scrollnow = true;
            if(counter == 21){
                e.stopPropagation();
                tutorialOverlay.hide();
                panel.css('overflow-y', 'scroll');
                tutorialicon.css({'background-color': '#50627a', 'font-size': '1.3em'}).text('?').removeClass('in-progress');
                $("#tutorial_" + String(counter-1)).hide();
                tutorialOverlay.css('opacity', '1')
                counter = 0;
                panel.removeClass('tutorial-toc-left');
                $('.toc-head').removeClass('tutorial-toc-left');
                $("html").animate({
                    scrollTop: $("body").offset().top 
                }, 'fast');
                allowKeyboardControls = false;
                $('.main-content-overlay').hide();
                $('.main-content-overlay-2').hide();
                $('.sidebar-tutorial-overlay').hide();
            }else if(counter > 0){
                e.stopPropagation();
                if(counter == 1){
                    tutorialOverlay.css('opacity', '0.5')
                }
                if(counter == 2 || counter == 3){
                    $(".search_toc").css({"z-index": 101});
                }else{
                    $(".search_toc").css({"z-index": 100});
                }
                if(counter == 4){
                    $(".search_toc").css({"z-index": 100});          
                }
                if(counter == 4 || counter == 5){
                    $(tutorialOverlay).animate({left:238});
                }else{
                    $(tutorialOverlay).animate({left:0});
                }

                if(counter == 5){
                    setTimeout(function(){
                        $('.subgroup-2').show('slow');
                        $('.subgroup-2').css({'pointer-events':'none'});
                        $('.subgroup-heading-2').addClass('toc-heading-background');
                    }, 500)   
                }

                if(counter == 6){
                    $('.toc-toggle')[0].click();
                    if($(window).width() < 1085){
                        $('.panel').addClass('tutorial-toc-left');
                        $('.toc-head').addClass('tutorial-toc-left'); 
                    }
                    $('.subgroup-heading-2').removeClass('toc-heading-background');
                    $('.subgroup-2').removeClass('bring-to-front');
                    $('.subgroup-heading-2').removeClass('bring-to-front');
                    $('.subgroup-2').hide('slow');
                    $('.subgroup-2').css({'pointer-events':'auto'});
                    $('.main-content-overlay').show();
                    $('.main-content-overlay-2').show();
                    $('.sidebar-tutorial-overlay').show();
                
                    tocState = true; 
                }
                

                if(counter == 18 || counter == 19){
                    $("#tutorial_" + String(counter)).css({'margin-top': '-80px'});
                }

                $("#tutorial_" + String(counter-1)).hide();
                $("#tutorial_" + String(counter)).show();
                if(counter >= 6){
                    $("#tutorial_" + String(counter)).css({'position':'absolute', 'z-index':'400'})
                    $("#tutorial_19").css({'margin-top':'-7%', 'margin-left':'5%'});
                    $("#tutorial_20").css({'margin-top':'-7%', 'margin-left':'5%'});
                    $("#tutorial_21").css({'margin-top':'-7%', 'margin-left':'5%'});
                };
                
                $("#tutorial_1").css({'margin-top':'-80px'});
                $("#tutorial_2").css('margin-top', '90px');
                $("#tutorial_2 h3").css('drawer-header h3');
                $("#tutorial_3").css('margin-top', '90px');
                $("#tutorial_5 h3").css('drawer-header h3');
                if(scrollnow == true){
                    $("html").animate({
                        scrollTop: $("#tutorial_" + String(counter)).offset().top - 200 
                    }, 'fast');

                    setTimeout(function(){
                        if(counter == 7 || counter == 8 || counter == 9){
                            var pageTop = $(window).scrollTop()
                            var topOverlayLocation = $('.important-topics').offset().top;
                            var bottomOverlayLocation = $('.popular-topics').offset().top;
                            var topOverlayHeight  = topOverlayLocation - pageTop;
                            var bottomOverlayHeight = bottomOverlayLocation - pageTop;

                            $('.main-content-overlay').animate({'height':topOverlayHeight});
                            $('.main-content-overlay-2').animate({'top':bottomOverlayHeight});
                        }
                        if(counter == 10 || counter == 11 || counter == 12){
                            var pageTop = $(window).scrollTop()
                            var topOverlayLocation = $('.popular-topics').offset().top;
                            var bottomOverlayLocation = $('#disclaimer').offset().top;
                            var topOverlayHeight  = topOverlayLocation - pageTop;
                            var bottomOverlayHeight = bottomOverlayLocation - pageTop;

                            $('.main-content-overlay').animate({'height':topOverlayHeight});
                            $('.main-content-overlay-2').animate({'top':bottomOverlayHeight});
                        }
                        if(counter == 13 || counter == 14 || counter == 15){
                            var pageTop = $(window).scrollTop()
                            var topOverlayLocation = $('.landing-search-wrapper').offset().top;
                            var bottomOverlayLocation = $('.examples-intro').offset().top;
                            var topOverlayHeight  = topOverlayLocation - pageTop;
                            var bottomOverlayHeight = bottomOverlayLocation - pageTop;

                            $('.main-content-overlay').animate({'height':topOverlayHeight});
                            $('.main-content-overlay-2').animate({'top':bottomOverlayHeight});
                        }
                        if(counter == 16 || counter == 17 || counter == 18){
                            var pageTop = $(window).scrollTop()
                            var topOverlayLocation = $('.examples-intro').offset().top;
                            var bottomOverlayLocation = $('.cf-icon-print').offset().top;
                            var topOverlayHeight  = topOverlayLocation - pageTop;
                            var bottomOverlayHeight = bottomOverlayLocation - pageTop;

                            $('.main-content-overlay').animate({'height':topOverlayHeight});
                            $('.main-content-overlay-2').animate({'top':bottomOverlayHeight});
                        }
                        if(counter == 19 || counter == 20 || counter == 21){
                            var pageTop = $(window).scrollTop()
                            var topOverlayLocation = $('.cf-icon-print').offset().top;
                            var bottomOverlayLocation = $('.cf-icon-print').offset().top;
                            var topOverlayHeight  = topOverlayLocation - pageTop;
                            var bottomOverlayHeight = bottomOverlayLocation - pageTop;

                            $('.main-content-overlay').animate({'height':topOverlayHeight - 30});
                            $('.main-content-overlay-2').animate({'top':bottomOverlayHeight + 30});
                        }        
                    }, 700)
                    scrollnow = false;
                }

                
                counter++;
            }else{
                e.stopPropagation();
            }
            return counter;
        }

        function revertTutorial(e){
            
            if(counter == 4 || counter == 5){
                $(".search_toc").css({"z-index": 101});
            }else{
                $(".search_toc").css({"z-index": 100});
            }
            if(counter == 7){
                if(tocState == true){
                    if($(window).width() < 1085){
                        $('.panel').removeClass('tutorial-toc-left');
                        $('.toc-head').removeClass('tutorial-toc-left'); 
                    }
                    $('.toc-toggle')[0].click();
                    tocState = false; 
                }
                $("#tutorial_" + String(counter-1)).hide();
                $("#tutorial_" + String(counter-2)).show();  
            }else{
                $("#tutorial_" + String(counter-1)).hide();
                $("#tutorial_" + String(counter-2)).show();  
            } 

            var scrollnow = true;
            if(scrollnow == true){
                $("html").animate({
                    scrollTop: $("#tutorial_" + String(counter-2)).offset().top - 200 
                }, 'fast');

                setTimeout(function(){
                    if(counter == 7 || counter == 8 || counter == 9){
                        var pageTop = $(window).scrollTop()
                        var topOverlayLocation = $('.important-topics').offset().top;
                        var bottomOverlayLocation = $('.popular-topics').offset().top;
                        var topOverlayHeight  = topOverlayLocation - pageTop;
                        var bottomOverlayHeight = bottomOverlayLocation - pageTop;

                        $('.main-content-overlay').animate({'height':topOverlayHeight});
                        $('.main-content-overlay-2').animate({'top':bottomOverlayHeight});
                    }
                    if(counter == 10 || counter == 11 || counter == 12){
                        var pageTop = $(window).scrollTop()
                        var topOverlayLocation = $('.popular-topics').offset().top;
                        var bottomOverlayLocation = $('#disclaimer').offset().top;
                        var topOverlayHeight  = topOverlayLocation - pageTop;
                        var bottomOverlayHeight = bottomOverlayLocation - pageTop;

                        $('.main-content-overlay').animate({'height':topOverlayHeight});
                        $('.main-content-overlay-2').animate({'top':bottomOverlayHeight});
                    }
                    if(counter == 13 || counter == 14 || counter == 15){
                        var pageTop = $(window).scrollTop()
                        var topOverlayLocation = $('.landing-search-wrapper').offset().top;
                        var bottomOverlayLocation = $('.examples-intro').offset().top;
                        var topOverlayHeight  = topOverlayLocation - pageTop;
                        var bottomOverlayHeight = bottomOverlayLocation - pageTop;

                        $('.main-content-overlay').animate({'height':topOverlayHeight});
                        $('.main-content-overlay-2').animate({'top':bottomOverlayHeight});
                    }
                    if(counter == 16 || counter == 17 || counter == 18){
                        var pageTop = $(window).scrollTop()
                        var topOverlayLocation = $('.examples-intro').offset().top;
                        var bottomOverlayLocation = $('.cf-icon-print').offset().top;
                        var topOverlayHeight  = topOverlayLocation - pageTop;
                        var bottomOverlayHeight = bottomOverlayLocation - pageTop;

                        $('.main-content-overlay').animate({'height':topOverlayHeight});
                        $('.main-content-overlay-2').animate({'top':bottomOverlayHeight});
                    }
                    if(counter == 19 || counter == 20 || counter == 21){
                        var pageTop = $(window).scrollTop()
                        var topOverlayLocation = $('.cf-icon-print').offset().top;
                        var bottomOverlayLocation = $('.cf-icon-print').offset().top;
                        var topOverlayHeight  = topOverlayLocation - pageTop;
                        var bottomOverlayHeight = bottomOverlayLocation - pageTop + 30;

                        $('.main-content-overlay').animate({'height':topOverlayHeight});
                        $('.main-content-overlay-2').animate({'top':bottomOverlayHeight});
                    }        
                }, 700)
                scrollnow = false;
            }

            if(counter == 5 || counter == 6 || counter == 7){
                $(tutorialOverlay).animate({left:238});
            }else{
                $(tutorialOverlay).animate({left:0});
            }

            if(counter <= 7){
                $('.main-content-overlay').hide();
                $('.main-content-overlay-2').hide();
                $('.sidebar-tutorial-overlay').hide();
            }

            counter--;
            return counter; 
        }


        tutorialicon.click(function(e){
            beginTutorial(e);
            $('.part-switcher-nav').hide();
        });

        nextBubble.click(function(e){
            continueTutorial(e);
            $('.part-switcher-nav').hide();
        });

        prevBubble.click(function(e){
            revertTutorial(e);
            $('.part-switcher-nav').hide();
        });

        tutorialicon.on( "keypress", (function(e){
                if(e.key == "n" || e.key == "N"){
                    e.stopImmediatePropagation();
                    $('.part-switcher-nav').hide();   
                    continueTutorial(e);
                }
                if(e.key == "p" || e.key == "P"){  
                    if(counter > 1){
                        e.stopImmediatePropagation();
                        $('.part-switcher-nav').hide();
                        revertTutorial(e);  
                    }  
                }
                if(e.key == "e" || e.key == "E" || e.key=="enter" || e.key=="Enter"){
                    e.stopImmediatePropagation();
                    $('.part-switcher-nav').hide();
                    beginTutorial(e);
                }
        })); 

        $(document).on( "keypress", (function(e){
            if(allowKeyboardControls === true){
                if(e.key == "n"){   
                    e.stopImmediatePropagation();
                    $('.part-switcher-nav').hide();
                    continueTutorial(e);
                }
                if(e.key == "p"){  
                    if(counter > 1){
                        e.stopImmediatePropagation();
                        $('.part-switcher-nav').hide();
                        revertTutorial(e);  
                    }  
                }
                if(e.key == "e"){
                    e.stopImmediatePropagation();
                    $('.part-switcher-nav').hide();
                    beginTutorial(e);
                    panel.css('overflow-y', 'scroll');
                }
            }
        }));
    },    
})

module.exports = Tutorial;