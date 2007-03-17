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

var SearchBars = {};
SearchBars.GoogleX = [{name : "Google",
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

SearchBars.Multisearch = [
                    {name : "Google",
                     searchUrl : "http://www.google.com/search?q=%s",
                     imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/searchbar/70/google.gif",
                     image : "http://localhost/eclipse/GoogleMultiSearch/logos/searchbar/70/google.gif"},
                     
                     {name : "Yahoo",
                     searchUrl : "http://search.yahoo.com/search?p=%s",
                     imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/searchbar/70/yahoo.png",
                     image : "http://localhost/eclipse/GoogleMultiSearch/logos/searchbar/70/yahoo.png"},
                     
                     {name : "AskX",
                     searchUrl : "http://www.ask.com/w#q=%s",
                     imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/searchbar/70/ask_x.png",
                     image : "http://localhost/eclipse/GoogleMultiSearch/logos/searchbar/70/ask_x.png"},
                     
                     {name : "Wikipedia",
                     searchUrl : "http://en.wikipedia.org/wiki/Special:Search?search=%s",
                     imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/searchbar/70/wikipedia.png",
                     image : "http://localhost/eclipse/GoogleMultiSearch/logos/searchbar/70/wikipedia.png"},
                     
                     {name : "YouTube",
                     searchUrl : "http://www.youtube.com/results?search_query=%s",
                     imageSm : "http://localhost/eclipse/GoogleMultiSearch/logos/searchbar/70/youtube.png",
                     image : "http://localhost/eclipse/GoogleMultiSearch/logos/searchbar/70/youtube.png"}
                     
]
var SearchEngines = SearchBars.Multisearch;
                    
for(var i=0; i< SearchEngines.length; i++){
    SearchEngines[i].index = i;
}                    


var selected = SearchEngines[0];

function menuClick(engine){
    return function(){
       var button = Google.searchButton();
       selected = engine;
       button.value = engine.name + " Search"; 
    }   
}

var fadeIn;

function menuHover(engine){
    return function(){
        title.innerHTML = engine.name;
        title.style.marginLeft = (engine.index * 37) + "px";
        engine.el_img.src = engine.image;
        engine.animation =  new Animator(20, 300, function(d){
            engine.el_img.style.width = (35 + (35*d)) + "px";
            engine.el_img.style.height = (35 + (35*d)) + "px";
            engine.el_img.style.paddingTop = ((1-d)*35) + "px";
        });
    }
}

function menuExit(engine){
    engine.el_img.src = engine.imageSm;
    return function(){
        engine.animation.reverse();
        title.innerHTML = "";
    }
}

function Animator(interval, duration, f){
    var timer = null;
    var counter = 0;
    var end = duration/interval;
    
    this.stop = function(){
        window.clearInterval(timer);
    }
    
    this.finish = function(){
        this.stop();
        counter = end;
        f(1.0);
    };
    
    this.reverse = function(){
        this.stop();
        timer = window.setInterval(function(){
                counter--;
                if(counter<=0){
                     f(0.0);
                    window.clearTimeout(timer);
                }else{
                    f((counter*1.0)/end)
                }
            }, 
            interval);
    };
    
    this.clear = function(){
        this.stop();
        counter = 0;
        f(0.0);
    };
    
    this.start = function(){
        this.stop();
        timer = window.setInterval(function(){
                counter++;
                if(counter>=end){
                    f(1.0);
                    window.clearTimeout(timer);
                }else{
                    f((counter*1.0)/end)
                }
            }, 
            interval);
    };
    
    this.start();
}


function formSubmit(e){
    var search = Google.searchBox().value;
    var url = selected.searchUrl;
    url = url.replace(/(%s)/, search);
    window.location.href = url;
    e.preventDefault();    
}

var title;

function makeMenu(){
    var result = Google.searchLinks();
    
    var options = document.createElement("div");
    options.style.height = "70px";
    
    for(var i=0; i<SearchEngines.length; i++){
        var engine = SearchEngines[i];
        var opt = document.createElement("span");
        
        optImg = document.createElement("img");
        engine.el_img = optImg;
        optImg.setAttribute("src", engine.imageSm);
        optImg.setAttribute("width", "35");
        optImg.setAttribute("height", "35");
        optImg.style.paddingTop = "35px";
        optImg.style.paddingLeft = "2px";
        optImg.style.paddingRight = "2px";
        //opt.innerHTML = engine.name;
        opt.appendChild(optImg);
        opt.setAttribute("style", "cursor: pointer;");
        opt.addEventListener("mouseover", menuHover(engine), true);
        opt.addEventListener("mouseout", menuExit(engine), true);
        opt.addEventListener("click", menuClick(engine), true);
        options.appendChild(opt);
    }
    result.parentNode.replaceChild(options, result);
    
    dummyMore = document.createElement("span");
    dummyMore.setAttribute("name", "more");;
    options.appendChild(dummyMore);
    title = document.createElement("div");
    title.setAttribute("style", "font-size: 1.5em; height: 1.5em; margin-top: -1.5em; text-align: left;")
    options.parentNode.insertBefore(title, options);             
}

function disableForm(){
    var form = Google.searchForm();
    form.addEventListener("submit", formSubmit, true)   
}


disableForm();
makeMenu();
