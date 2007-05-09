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