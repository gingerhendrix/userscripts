var Google = function(){
    var googleMain = {
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
     var googleIG = {
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
    
    function getSingleNode(xpath){
        return document.evaluate(xpath,
                       document, 
                       null, 
                       XPathResult.FIRST_ORDERED_NODE_TYPE, 
                       null).singleNodeValue;
    }
    
    
    if(new RegExp("www.google.[^/]*/([?](.*))?$").test(document.location.href)){
        return googleMain; 
    }else if(new RegExp("www.google.[^/]*/ig([?](.*))?$").test(document.location.href)){
        //Google IG  
      return  googleIG
    }else if(new RegExp("www.google.[^/]*/search([?](.*))?$").test(document.location.href)){
        return null; //Google SERP
    }else{
       return null;
    }
}();