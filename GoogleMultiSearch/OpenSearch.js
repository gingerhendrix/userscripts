

function OpenSearch(dom){
  var name;
  var description;
  var tags;
  var urls;
  var images;
  
  this.__defineGetter__("name", getName);
  this.__defineGetter__("description", getDescription);
  this.__defineGetter__("tags", getTags);
  this.__defineGetter__("urls", getUrls);
  this.__defineGetter__("images", getImages);
  
  function getName(){
    if(!name){
     name = getSingleNode("//ShortName/text()").data;
    }
    return name;
  }
  
  function getDescription(){
    if(!description){
     description = getSingleNode("//Description/text()").data;
    }
    return description;
  }
  
  function getTags(){
    if(!tags){
     var tagText = getSingleNode("//Tags/text()").data;
     tags = tagText.split(" ");
    }
    return tags;
  }
  
  function getUrls(){
    if(!urls){
      var iter = getNodeIterator("//Url");
      urls = [];
      var node;
      while(node = iter.iterateNext()){
        var type = node.getAttribute("type");
        var template = node.getAttribute("template");
        urls.push({type : type, template: template});
      }
    }
    return urls;
  }
  
  function getImages(){
    if(!images){
      images = [];
      var iter = getNodeIterator("//Image");
      var node;
      while(node = iter.iterateNext()){
        var type = node.getAttribute("type");
        var width =  new Number(node.getAttribute("width"));
        var height = new Number(node.getAttribute("height"));
        var href = node.firstChild.data;
        
        images.push({type : type, 
                   width : width,
                   height : height,
                   href : href});
      }
    }
    return images;
  }
  
  function getNodeIterator(xpath){
     return dom.evaluate(xpath,
                         dom, 
                         null, 
                         XPathResult.ORDERED_NODE_ITERATOR_TYPE, 
                         null);
  }
  
  function getSingleNode(xpath){
        return dom.evaluate(xpath,
                       dom, 
                       null, 
                       XPathResult.FIRST_ORDERED_NODE_TYPE, 
                       null).singleNodeValue;
    }
}

OpenSearch.fromXML = function(xmlString){
  var parser = new DOMParser();
  var dom = parser.parseFromString(xmlString, "text/xml");
  
  return new OpenSearch(dom)
}