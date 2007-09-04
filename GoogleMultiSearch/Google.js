var Google = function(){
     var googleIG = function(){
      
       return {
          form : {
             value : function(){
               var searchBox = getSingleNode("//*[@id='q']");
               return searchBox.value;
             },
             onsubmit : function(func){
               var searchForm = getSingleNode("//*[@id='sfrm']");
               searchForm.addEventListener("submit", function(e){
                 func();
                 e.preventDefault();
               }, true)   
             },
             setButtonValue : function(val){
               var searchButton = getSingleNode("//input[@name='btnG']");
               searchButton.value = val;
             }
          },
          
          insertMenu : function(menu){
            var searchBox = document.getElementById("gsea");
            searchBox.parentNode.insertBefore(menu, searchBox);
            menu.style.marginTop = "0px";
            menu.style.marginBottom = "-20px";
            menu.style.zIndex = "5";
          },
          
          getTextColor : function(){
            var refNode = getSingleNode("//p[@class='gseaopt']/a");
            return document.defaultView.getComputedStyle(refNode, null)["color"];
          }  
       }
     };  
    
    function getSingleNode(xpath){
        return document.evaluate(xpath,
                       document, 
                       null, 
                       XPathResult.FIRST_ORDERED_NODE_TYPE, 
                       null).singleNodeValue;
    }
    
    
    if(new RegExp("www.google.[^/]*/([?](.*))?$").test(document.location.href)){
        return null;//Google main page 
    }else if(new RegExp("www.google.[^/]*/ig([?](.*))?$").test(document.location.href)){
      return  googleIG();
    }else if(new RegExp("www.google.[^/]*/search([?](.*))?$").test(document.location.href)){
        return null; //Google SERP
    }else{
       return null;
    }
}();