// ==UserScript==
// @name          GoogleMultiSearch
// @namespace     http://gandrew.com/projects/GoogleMultiSearch
// @description   Adds multiple search engine support to the google search bar 
// @include       http://www.google.tld/*
// @require bind.js
// @require Google.js
// @require animator.js
// @require searchbars/multisearch.js
// @require menu.js
// @import tag tag.png 
// @import multisearch-google-sm logos/searchbar/35/google.png
// @import multisearch-askx-sm logos/searchbar/35/ask_x.png
// @import multisearch-wikipedia-sm logos/searchbar/35/wikipedia.png
// @import multisearch-yahoo-sm logos/searchbar/35/yahoo.png
// @import multisearch-youtube-sm logos/searchbar/35/youtube.png
// @import multisearch-google-lg logos/searchbar/70/google.png
// @import multisearch-askx-lg logos/searchbar/70/ask_x.png
// @import multisearch-wikipedia-lg logos/searchbar/70/wikipedia.png
// @import multisearch-yahoo-lg logos/searchbar/70/yahoo.png
// @import multisearch-youtube-lg logos/searchbar/70/youtube.png

// ==/UserScript==
//
// Changelog 
// 0.1  - 06/03/07 - Project started
// 0.2 - 02/03/07 - Support for google/ig (personalized homepage)
// 0.3 - 30/04/07 - Refactored using gm-imports
// 0.4 - 04/08/07 - Refactored Google.js page wrapper.


//globals;
var SearchEngines;
var selected;

function formSubmit(){
    var search = Google.form.value();
    var url = selected.searchUrl;
    url = url.replace(/(%s)/, search);
    window.location.href = url;
}

function menuClick(engine, e){
   selected = engine;
   Google.form.setButtonValue(engine.name + " Search");
}


function init(){
    if(!Google){
        return;
    }

    SearchEngines = SearchBars.Multisearch;
                    
    for(var i=0; i< SearchEngines.length; i++){
        SearchEngines[i].index = i;
    }                    
    
    
    selected = SearchEngines[0];
    
    Google.form.onsubmit(formSubmit);
    
    var menu = new ImageMenu();
    menu.textColor = Google.getTextColor();
    menu.menuClick = menuClick;
    var menuElement = menu.makeMenu();
    Google.insertMenu(menuElement);
}

init();