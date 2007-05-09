// ==UserScript==
// @name          GoogleMultiSearch
// @namespace     http://gandrew.com/projects/GoogleMultiSearch
// @description   Adds multiple search engine support to the google search bar 
// @include       http://www.google.com/
// @include       http://www.google.co.uk/ig
// @include       http://www.google.com/ig
// @require bind.js
// @require Google.js
// @require animator.js
// @require searchbars/googlex.js
// @require searchbars/multisearch.js
// @require menu.js
// @import tag tag.png 
// ==/UserScript==
//
// Changelog 
// 0.1  - 06/03/07 - Project started
// 0.2 - 02/03/07 - Support for google/ig (personalized homepage)
// 0.3 - 30/04/07 - Refactored using gm-imports



function formSubmit(e){
    var search = Google.searchBox().value;
    var url = selected.searchUrl;
    url = url.replace(/(%s)/, search);
    window.location.href = url;
    e.preventDefault();    
}

function disableForm(){
    var form = Google.searchForm();
    form.addEventListener("submit", formSubmit, true)   
}

function init(){

    SearchEngines = SearchBars.Multisearch;
                    
    for(var i=0; i< SearchEngines.length; i++){
        SearchEngines[i].index = i;
    }                    
    
    
    selected = SearchEngines[0];
    
    disableForm();
    var menu = new ImageMenu();
    var menuElement = menu.makeMenu();
    var searchLinks = Google.searchLinks();
    searchLinks.parentNode.replaceChild(menu.element, searchLinks);
}

//globals;
var SearchEngines = SearchBars.Multisearch;
var selected;

init();