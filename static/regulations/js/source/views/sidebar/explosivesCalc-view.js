const $ = require('jquery');
const _ =require('underscore');
const Backbone = require('backbone');


Backbone.$ = $;

const ExplosivesCalcView = Backbone.View.extend({
    el: '#calc_distance',

    events: {
        'click #get_distance' : 'calculateDistance',
    },

    initialize: function initialize(){ 
        this.showCalculator();
        this.parseTable();
        $("#calc_response").hide();
    },

    getSection: function getSection(){
        var section = $('#active-title').text();
        var sectionNum = Number(section.replace(/[^0-9\.]+/g,""));
        return sectionNum
    },

    parseTable: function parseTable(){
        var sectionNum = this.getSection();
        var tableMatrix = []
        $('#blast_label').hide();
        $('#blasting_agent').hide();
        if(sectionNum == 555.218 || sectionNum == 555.219 || sectionNum == 555.220){
            $("#storage_location_fireworks").hide()
            $("#storage_label_fireworks2").hide();
            $("#storage_location_fireworks2").hide();
            if(sectionNum == 555.219){
                $("#bct_label").hide();
                $("#barricade_type").hide();
            }
            if(sectionNum == 555.219 || sectionNum == 555.220){  
                $("#storage_location").hide();
                $("#storage_label1").hide();
            }else if(sectionNum == 555.218 || sectionNum == 555.220){
                $("#storage_location2").hide();
                $("#storage_label2").hide();
                $("#bct_label").show();
                $("#barricade_type").show();
            }
            if(sectionNum == 555.220){
                $("#storage_location2").hide();
                $("#storage_label2").hide();
                $("#blast_label").show();
                $("#blasting_agent").show();
            }
            $("tbody tr").each(function(){
                var tr_numbers = [];
                $(this).find('td').each(function(){
                    var td_numbers = $(this).text();
                    td_numbers = Number(td_numbers.replace(/[^0-9\.]+/g,""));
                    tr_numbers.push(td_numbers);
                })
                tableMatrix.push(tr_numbers);
            });
            return(tableMatrix);
        }else if(sectionNum == 555.224 || sectionNum == 555.222 || 555.223){
            $("#storage_location").hide();
            $("#storage_location2").hide();
            $("#storage_label2").hide();  
            if(sectionNum == 555.222 || sectionNum == 555.223){
               $("#storage_location_fireworks").hide();
               $("#storage_label1").hide();
             
            }
            if(sectionNum == 555.224){
                $("#storage_label_fireworks2").hide();
                $("#storage_location_fireworks2").hide();
                $("#bct_label").show();
                $("#barricaded_radio_label").hide();
                $("#barricaded_radio").hide();
                $("#barricade_disclaimer").html('<p class="barricade_disclaimer">All calculations are unbarricaded. See table footnote 3 for fireworks storage magazines in use prior to March 7. 1990.</p>');
            }
            if(sectionNum == 555.223){
                $("#bct_label").hide();
                $("#barricade_type").hide(); 
            }
            if(sectionNum == 555.222){
                $("#bct_label").show();
                $("#barricade_type").show(); 
            }
            $("tbody tr").each(function(){
                var tr_numbers = [];
                $(this).find('td').each(function(){
                    var td_numbers = $(this).text();
                    if(td_numbers.indexOf("-") > -1){
                        td_numbers = td_numbers.split("-")
                        var minNumber = Number(td_numbers[0].replace(/[^0-9\.]+/g,""));
                        var maxNumber = Number(td_numbers[1].replace(/[^0-9\.]+/g,""));
                        tr_numbers.push(minNumber);
                        tr_numbers.push(maxNumber);
                    }else if(td_numbers.indexOf("Above") > -1){
                        var td_numbers = $(this).text();
                        td_numbers = Number(td_numbers.replace(/[^0-9\.]+/g,""));
                        tr_numbers.push(td_numbers);
                        tr_numbers.push(td_numbers);
                    }else{
                        var td_numbers = $(this).text();
                        td_numbers = Number(td_numbers.replace(/[^0-9\.]+/g,""));
                        tr_numbers.push(td_numbers);
                    };
                });
                tableMatrix.push(tr_numbers);
            });
            return(tableMatrix);
        }         
    },

    validateInputs: function validateInputs(tableMatrix){
        $(".null_value").remove();
        var weight = Math.ceil(Number($('[name=weight]').val().replace(/\s*,\s*/g, '')));
        var success;
        if(weight == null || weight === undefined || weight === false || weight <= 0 || weight == "" || isNaN(weight)){
            $("#calc_response").hide();
            this.$el.find('#weight').after('<p class="null_value">Enter a number</p>');
            var success = 'false';
            return success;
        }
        if($("#kilograms").is(":checked")){
            if(weight > tableMatrix[tableMatrix.length-1][1] * 0.45359237){
                $("#calc_response").hide();
                this.$el.find('#weight').after('<p class="null_value">Number exceeds maximum allowable input weight</p>');
                var success = 'false'
                return success;
            }
        }else if(weight > tableMatrix[tableMatrix.length-1][1]){
            $("#calc_response").hide();
            this.$el.find('#weight').after('<p class="null_value">Number exceeds maximum allowable input weight</p>');
            var success = 'false';
            return success;
        }
        var success = 'true';
        return success;
    },

    calculateDistance: function calculateDistance(e){
        e.preventDefault();
        $("#explosives_form").submit(function() { return false; });
        var tableMatrix = this.parseTable();
        var isValidated = this.validateInputs(tableMatrix);
        var sectionNum = this.getSection();
        if(isValidated == 'true'){
            //section 555.218
            if(sectionNum == 555.218){
                var location_names = [];
                var locations = [];
                if($("#storage_location_1").is(':checked')){
                    locations.push(Number($('[name=storage_location_1]').val()));
                    location_names.push($("#sl1").text());
                }
                if($("#storage_location_1A").is(':checked')){
                    locations.push(Number($('[name=storage_location_1A]').val()));
                    location_names.push($("#sl1A").text());
                }
                if($("#storage_location_1B").is(':checked')){
                    locations.push(Number($('[name=storage_location_1B]').val()));
                    location_names.push($("#sl1B").text());
                }
                if($("#storage_location_1C").is(':checked')){
                    locations.push(Number($('[name=storage_location_1C]').val()));
                    location_names.push($("#sl1C").text());
                }
                var type = Number($("input[name=barricade_type]:checked").val());
                if(type == 0){
                    var barricade_type = "barricaded";
                }else{
                    var barricade_type = "unbarricaded";
                }
                var explosives_type = 'explosives material';
            //section 555.219
            }else if(sectionNum == 555.219){
                var location_names = [];
                var locations = [];
                if($("#storage_location_2").is(':checked')){
                    locations.push(Number($('[name=storage_location_2]').val()));
                    location_names.push($("#sl2").text());
                }
                if($("#storage_location_2B").is(':checked')){
                    locations.push(Number($('[name=storage_location_2B]').val()));
                    location_names.push($("#sl2b").text());
                }
                if($("#storage_location_2C").is(':checked')){
                    locations.push(Number($('[name=storage_location_2C]').val()));
                    location_names.push($("#sl2c").text());
                }
                var type = 0;
                var explosives_type = 'low explosives';
                var barricade_type = "";
            //section 555.222 & 555.223
            }else if(sectionNum == 555.222 || sectionNum == 555.223){
                var location_names = [];
                var locations = [];
                if($("#storage_location_fireworks_2").is(':checked')){
                    locations.push(Number($('[name=storage_location_fireworks_2]').val()));
                    location_names.push($("#slf2").text());
                }
                if($("#storage_location_fireworks_2B").is(':checked')){
                    locations.push(Number($('[name=storage_location_fireworks_2B]').val()));
                    location_names.push($("#slf2b").text());
                }
                var type = Number($("input[name=barricade_type]:checked").val());
                if(type == 0){
                    var barricade_type = "barricaded";
                }else{
                    var barricade_type = "unbarricaded";
                }
            //section 555.224
            }else if(sectionNum == 555.224){
                var location_names = [];
                var locations = [];
                if($("#storage_location_fireworks_1").is(':checked')){
                    locations.push(Number($('[name=storage_location_fireworks_1]').val()));
                    location_names.push($("#slf1").text());
                }
                if($("#storage_location_fireworks_1B").is(':checked')){
                    locations.push(Number($('[name=storage_location_fireworks_1B]').val()));
                    location_names.push($("#slf1b").text());
                }
                var type = 1;
                var barricade_type = "unbarricaded";
                var explosives_type = 'fireworks';
            //section 555.220
            }else if(sectionNum == 555.220){
                var location_names = [];
                var locations = [];
                if($("#blasting_agent_1").is(':checked')){
                    locations.push(Number($('[name=blasting_agent_1]').val()));
                    location_names.push($("#ba1").text());
                }
                if($("#blasting_agent_1B").is(':checked')){
                    locations.push(Number($('[name=blasting_agent_1B]').val()));
                    location_names.push($("#ba1b").text());
                }
                var type = Number($("input[name=barricade_type]:checked").val());
                if(type == 0){
                    var barricade_type = "barricaded";
                }else{
                    var barricade_type = "unbarricaded";
                } 
            }
            var weight = Math.ceil(Number($('[name=weight]').val().replace(/\s*,\s*/g, '')));
            var weight_input = weight;
            var units = 'lbs (pounds)';
            if($("#kilograms").is(':checked')){
                weight = weight * 2.20462262185;
                units = 'kg (kilograms)' 
            }
            //Change text to
            //"Minimum required distance between storage of 'explosives_type' and 'barricade_type' 'location_name' is: <p class='large_text'>distance</p>"
            var cells = [];
            var results = [];
            var messages = [];
            for(var i = 0; i<tableMatrix.length; i++){
                if(weight >= tableMatrix[i][0] && weight <= tableMatrix[i][1]){
                    for(var k = 0; k < locations.length; k++){
                        if(sectionNum == 555.218){
                            cells.push(Number(locations[k]) + Number(type));
                        }else{
                            cells.push(Number(locations[k]));
                        }
                    }
                    if($("#meters").is(':checked')){    
                        for(var l = 0; l<cells.length; l++){
                          var result = Math.ceil(Number(tableMatrix[i][cells[l]]) / 3.2808);
                          results.push(result);  
                        }
                        if(sectionNum == 555.223){
                            messages.push('<p class="calc_response">Minimum required distance between fireworks process buildings and other specified areas, and <strong>' + weight_input + " " + units + '</strong> of:</p>');
                            for(var z = 0; z < locations.length; z++){
                                messages.push('<div class="calc_text"><p class="location_title">' + location_names[z] + ': </p><p class="large_text"><strong>' + results[z] + ' m</strong></p></div>');
                            }
                        }else if(sectionNum == 555.222){
                            messages.push('<p class="calc_response">Minimum required <strong>' + barricade_type + '</strong> distance between fireworks process buildings (or between fireworks process and fireworks nonprocess buildings) with <strong>' + weight_input + " " + units + '</strong> of:</p>');
                            for(var b = 0; b < locations.length; b++){
                                if(type == 1){
                                    results[b] = results[b] * 2;
                                }
                                messages.push('<div class="calc_text"><p class="location_title">' + location_names[b] + '</p><p class="large_text"><strong>' + results[b] + ' m</strong></p></div>');
                            }
                        }else if(sectionNum == 555.220){
                            var thickness = Math.ceil(Number(tableMatrix[i][4]) * 2.54);
                            messages.push('<p class="calc_response">Minimum required <strong>' + barricade_type + '</strong> distance between explosives or blasting agents and a donor weight of <strong>' + weight_input + " " + units + '</strong> of : </p>');
                            for(var y = 0; y<locations.length; y++){
                                if(type == 1){
                                    results[y] = results[y] * 6;
                                    messages.push('<div class="calc_text"><p class="location_title">' + location_names[y] + '</p><p class="large_text"><strong>' + results[y] + ' m</strong></p></div>');
                                }else{
                                    messages.push('<div class="calc_text"><p class="location_title">' + location_names[y] + '</p><p class="large_text"><strong>' + results[y] + ' m</strong></p><p class="calc_response">and the minimum thickness for artificial barricades is <strong>' + thickness + ' cm</strong></p></div>');
                                }
                                
                            }   
                        }else if(sectionNum == 555.224){
                            messages.push('<p class="calc_response">Minimum required <strong>' + barricade_type + '</strong> distance between a magazine containing <strong>' + weight_input + " " + units + '</strong> of  display fireworksand:</p>');
                            for(var c = 0; c < locations.length; c++){
                                if(type == 0){
                                    results[c] = results[c] / 2;
                                }
                                messages.push('<div class="calc_text"><p class="location_title">' + location_names[c] + '</p><p class="large_text"><strong>' + results[c] + ' m</strong></p></div>');
                            }
                        }else{
                            messages.push('<p class="calc_response">Minimum required distance between <strong>' + weight_input + " " + units + '</strong> of <strong>'+ barricade_type + " " + explosives_type + '</strong> storage and:</p>'); 
                            for(var x = 0; x < locations.length; x++){
                                messages.push('<div class="calc_text"><p class="location_title">'  + location_names[x] + '</p><p class="large_text"><strong>' + results[x] + ' m</strong></p></div>');
                            }         
                        }
                    }else{
                        for(var l = 0; l<cells.length; l++){
                            var result = Math.ceil(Number(tableMatrix[i][cells[l]]));
                            results.push(result);  
                        }
                        if(sectionNum == 555.223){
                            messages.push('<p class="calc_response">Minimum required distance between fireworks process buildings and other specified areas, and <strong>' + weight_input + " " + units + '</strong> of:</p>');
                            for(var u = 0; u < locations.length; u++){
                                messages.push('<div class="calc_text"><p class="location_title">' + location_names[u] + ': </p><p class="large_text"><strong>' + results[u] + ' ft</strong></p></div>');
                            }
                        }else if(sectionNum == 555.222){
                            messages.push('<p class="calc_response">Minimum required <strong>' + barricade_type + '</strong> distance between fireworks process buildings (or between fireworks process and fireworks nonprocess buildings) with <strong>' + weight_input + " " + units + '</strong> of:</p>');
                            for(var a = 0; a < locations.length; a++){
                                if(type == 1){
                                    results[a] = results[a] * 2;
                                }
                                messages.push('<div class="calc_text"><p class="location_title">' + location_names[a] + '</p><p class="large_text"><strong>' + results[a] + ' ft</strong></p></div>');
                            }
                        }else if(sectionNum == 555.220){
                            var thickness = Math.ceil(Number(tableMatrix[i][4]));
                            messages.push('<p class="calc_response">Minimum required <strong>' + barricade_type + '</strong> distance between explosives or blasting agents and a donor weight of <strong>' + weight_input + " " + units + '</strong> of : </p>');
                            for(var g = 0; g<locations.length; g++){
                                if(type == 1){
                                    results[g] = results[g] * 6;
                                    messages.push('<div class="calc_text"><p class="location_title">' + location_names[g] + '</p><p class="large_text"><strong>' + results[g] + ' ft</strong></p></div>');
                                }else{
                                    messages.push('<div class="calc_text"><p class="location_title">' + location_names[g] + '</p><p class="large_text"><strong>' + results[g] + ' ft</strong></p><p class="calc_response">and the minimum thickness for artificial barricades is <strong>' + thickness + ' in</strong></p></div>');
                                }
                                
                            }      
                        }else if(sectionNum == 555.224){
                            messages.push('<p class="calc_response">Minimum required <strong>' + barricade_type + '</strong> distance between a magazine containing <strong>' + weight_input + " " + units + '</strong> of display fireworks and:</p>');
                            for(var d = 0; d < locations.length; d++){
                                if(type == 0){
                                    results[d] = results[d] / 2;
                                }
                                messages.push('<div class="calc_text"><p class="location_title">' + location_names[d] + '</p><p class="large_text"><strong>' + results[d] + ' ft</strong></p></div>');
                            }
                        }else{
                            messages.push('<p class="calc_response">Minimum required distance between <strong>' + weight_input + " " + units + '</strong> of <strong>' + barricade_type + " "  + explosives_type + '</strong> storage and:</p>'); 
                            for(var x = 0; x < locations.length; x++){
                                messages.push('<div class="calc_text"><p class="location_title">'+ location_names[x] + '</p><p class="large_text"><strong>' + results[x] + ' ft</strong></p></div');
                            }    
                        }
                    }
                    break;
                }
            }
            
            $("#calc_response").empty();
            $("#checkbox_error").empty();
            if(messages.length < 2){
                $("#checkbox_error").append("<p class='no_messages'>Select at least one value</p>")
            }else{
                for(var m = 0; m<messages.length; m++){
                    $("#calc_response").append(messages[m]); 
                }
                $("#calc_response").slideDown();
                $("#sidebar").animate({scrollTop: 300}, "fast");
                if($(window).width() < 480){
                    var curheight = $(window).scrollTop();
                    $('html').animate({scrollTop: curheight - $("#calc_response").height() - 100}, "fast");
                }
            }

            var count = 0;
            randomizer(messages);
            function randomizer(messages){
                var numlist = [];
                for(var q = 0; q<messages.length-1; q++){
                    var resultNum = $(".large_text:eq(" + q + ")");
                    resultNum.addClass("result_" + q );
                    var resultNumtext = resultNum.text();
                    numlist.push(resultNumtext.replace(/[^0-9\.]+/g,""));
                    resultNum.html('');
                }
                for(var i = 0; i < messages.length-1; i++){
                    var numClass = $(".result_" + i);
                    var currentNum = String(numlist[i]).split('');
                    for(var j = 0; j < currentNum.length; j++){
                        var spanClassName = 'randNum';
                        numClass.append('<span class="' + spanClassName + '">0</span>');
                    }
                    if($("#meters").is(':checked')){
                        numClass.append(' m');
                    }else{
                        numClass.append(' ft');
                    }
                }
                numlist = numlist.join("");
                numlist.split("");
                var currentNumber = 0;
                var maxCount = 25 * numlist.length;
                $(".randNum").each(function(){
                    var self = this
                    var finalnumber = numlist[currentNumber]
                    var numb = setInterval(function(){
                        if(count < maxCount){
                            $(self).html(Math.floor(Math.random() * 10));
                            count++
                        }else{
                            clearInterval(numb);
                            $(self).html(finalnumber);
                        }
                    }, 25)
                    currentNumber++;
                })
            }    
        }
    },

    showCalculator: function showCalculator(){
        var sectionNum = this.getSection()
        if(sectionNum == 555.218 || sectionNum == 555.224 || sectionNum == 555.219 || sectionNum == 555.220 || sectionNum == 555.222 || sectionNum == 555.223){
            $("#calc_distance").show();
            $(".calc_btn").show()
            if(sectionNum == 555.218 || sectionNum == 555.219 || sectionNum == 555.220){
                $("#calc_disclaimer_1").show()
                $("#calc_disclaimer_2").hide()
                $("#calc_disclaimer_3").hide()
            }else if(sectionNum == 555.224){
                $("#calc_disclaimer_2").show()
                $("#calc_disclaimer_1").hide()
                $("#calc_disclaimer_3").hide()
            }else if(sectionNum == 555.222 || sectionNum == 555.223){
                $("#calc_disclaimer_3").show()
                $("#calc_disclaimer_1").hide()
                $("#calc_disclaimer_2").hide()
            }
        }else{
            $("#calc_distance").hide();
            $(".calc_btn").hide()          
        }
    },

})


module.exports = ExplosivesCalcView;