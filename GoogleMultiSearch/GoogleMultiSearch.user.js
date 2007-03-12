// ==UserScript==
// @name          GoogleMultiSearch
// @namespace     http://gandrew.com/projects/GoogleMultiSearch
// @description   Adds multiple search engine support to the google search bar 
// @include       http://www.google.com/
// @include       http://www.google.co.uk/ig
// ==/UserScript==
//
// Changelog 
// 0.1  - 06/03/07 - Project started
// 0.2 - 02/03/07 - Support for google/ig (personalized homepage)



var Google = function(){
    if(document.location.href == "http://www.google.com/"){
        return {
            searchLinks : function (){
                return getSingleNode("/html/body/center/form/table");
            },
            
            searchForm : function (){
                return getSingleNode("/html/body/center/form");
            },
            
            searchButton : function (){
                return getSingleNode("/html/body/center/form/table/tbody/tr/td[2]/input[3]");
            },
            
            searchBox : function (){
                return getSingleNode("/html/body/center/form/table/tbody/tr/td[2]/input[2]");
            }
        };
    }else{
        //Google IG  
      return {
        searchLinks : function (){
            return getSingleNode("//*[@id='featuretabs']");
        },
        
        searchForm : function (){
            return getSingleNode("//*[@id='sfrm']");
        },
        
        searchButton : function (){
            return getSingleNode("//input[@name='btnG']");
        },
        
        searchBox : function (){
            return getSingleNode("//*[@id='q']");
        }
      };    
    }
    
    function getSingleNode(xpath){
        return document.evaluate(xpath,
                       document, 
                       null, 
                       XPathResult.FIRST_ORDERED_NODE_TYPE, 
                       null).singleNodeValue;
    }
}();

var SearchEngines = [{name : "Google",
                     searchUrl : "http://www.google.com/search?q=%s",
                     imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/web-sm.gif",
                     image : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/web.gif"}, 
                    
                    {name: "Images",
                     searchUrl : "http://images.google.com/images?q=%s",
                     imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/images-sm.gif",
                     image : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/images.gif"}, 
                    
                    {name: "Groups",
                     searchUrl : "http://groups.google.com/groups/search?q=%s",
                     imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/groups-sm.gif",
                     image : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/groups.gif"},
                    
                    {name: "News",
                    searchUrl : "http://news.google.com/news?q=%s",
                    imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/news-sm.gif",
                    image : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/news.gif"},
                    
                    {name: "Froogle",
                    searchUrl : "http://www.google.com/froogle?q=%s",
                    imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/froogle-sm.gif",
                    image : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/froogle.gif"},
                    
                    {name: "Local",
                    searchUrl : "http://local.google.com/local?q=%s",
                    imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/local-sm.gif",
                    image : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/local.gif"},
                    
                    {name: "Scholar",
                    searchUrl : "http://scholar.google.com/scholar?q=%s",
                    imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/scholar-sm.gif",
                    image : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/scholar.gif"},
                    
                    {name: "Video",
                    searchUrl : "http://video.google.com/videosearch?q=%s",
                    imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/video-sm.gif",
                    image : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/video.gif"},
                    
                    {name: "Maps",
                    searchUrl : "http://maps.google.com/maps?q=%s", 
                    imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/maps-sm.gif",
                    image : "http://localhost/eclipse/GoogleMultiSearch/logos/googlex/groups.gif"}];
                    
                    




var selected = SearchEngines[0];

function menuClick(engine){
    return function(){
       var button = Google.searchButton();
       selected = engine;
       button.value = engine.name + " Search"; 
    }   
}

function menuHover(engine){
    return function(){
        
    }
}

function formSubmit(e){
    var search = Google.searchBox().value;
    var url = selected.searchUrl;
    url = url.replace(/(%s)/, search);
    window.location.href = url;
    e.preventDefault();    
}

function makeMenu(){
    var result = Google.searchLinks();
    
    var options = document.createElement("div");
    for(var i=0; i<SearchEngines.length; i++){
        var engine = SearchEngines[i];
        var opt = document.createElement("span");
        optImg = document.createElement("img");
        optImg.setAttribute("src", engine.imageSm);
        optImg.setAttribute("width", "35");
        optImg.setAttribute("height", "35");
        //opt.innerHTML = engine.name;
        opt.appendChild(optImg);
        opt.setAttribute("style", "cursor: pointer;");
        opt.addEventListener("mouseover", menuHover(engine), true);
        opt.addEventListener("click", menuClick(engine), true);
        options.appendChild(opt);
    }
    result.parentNode.replaceChild(options, result);
    
    dummyMore = document.createElement("span");
    dummyMore.setAttribute("name", "more");;
    options.appendChild(dummyMore);             
}

function disableForm(){
    var form = Google.searchForm();
    form.addEventListener("submit", formSubmit, true)   
}


disableForm();
makeMenu();
