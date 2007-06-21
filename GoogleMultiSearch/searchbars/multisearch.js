if(!SearchBars){
    var SearchBars = {};
}

SearchBars.Multisearch = [
                    {name : "Google",
                     searchUrl : "http://www.google.com/search?q=%s",
                     imageSm : GM_getImport("multisearch-google-sm").getURI(),
                     image : GM_getImport("multisearch-google-lg").getURI()},
                     
                     {name : "Yahoo",
                     searchUrl : "http://search.yahoo.com/search?p=%s",
                     imageSm : GM_getImport("multisearch-yahoo-sm").getURI(),
                     image : GM_getImport("multisearch-yahoo-lg").getURI()},
                     
                     {name : "AskX",
                     searchUrl : "http://www.ask.com/w#q=%s",
                     imageSm : GM_getImport("multisearch-askx-sm").getURI(),
                     image : GM_getImport("multisearch-askx-lg").getURI()},
                     
                     {name : "Wikipedia",
                     searchUrl : "http://en.wikipedia.org/wiki/Special:Search?search=%s",
                     imageSm : GM_getImport("multisearch-wikipedia-sm").getURI(),
                     image : GM_getImport("multisearch-wikipedia-lg").getURI()},
                     
                     {name : "YouTube",
                     searchUrl : "http://www.youtube.com/results?search_query=%s",
                     imageSm : GM_getImport("multisearch-youtube-sm").getURI(),
                     image : GM_getImport("multisearch-youtube-lg").getURI()}];
