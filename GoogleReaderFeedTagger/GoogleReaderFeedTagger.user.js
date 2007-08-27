// ==UserScript==
// @name          GoogleReaderFeedTagger
// @namespace     http://gandrew.com/projects/GoogleReaderFeedTagger
// @description   Adds the ability to tag the feed of the current post 
// @include       http://www.google.com/reader/view/*

// ==/UserScript==
//
// Changelog 
// 0.1  - 22/07/07 - Project started
//
// == Todo ==
// Enter to OK, Escape to cancel, or click outside to cancel
// Provide feedback
// Major refactoring

new GoogleReaderFeedTagger();


function GoogleReaderFeedTagger(){
  
  var _USER_ID;
  var _COMMAND_TOKEN;
  var tagsBox;
  var tagsBoxInput;
  var tagsBoxAutocomplete;
  var feed;
  var allTags = [];
  var subscriptionList = [];
  var subscriptionIndex = {};

  init();
  
  function init(){
    window.addEventListener("keypress", onKeyUp, false);
    addToHelp();
    getSubscriptionList();
  }
  
  function getAllTags(){
    var url = "http://www.google.com/reader/api/0/tag/list?output=json&ck="+_COMMAND_TOKEN+ "&client=scroll";
    GM_xmlhttpRequest({
        method:"GET",
        url: url,
        onload: function(response) {
          if(response.status==200){
            var json = response.responseText;
            var jsonObj = eval('('+json+')');
            var tags = jsonObj.tags;
            var tags = tags.map(function(t){
              var id = t.id;
              return id.substr(id.lastIndexOf("/")+1); 
            })
            allTags = tags;
          }else{
            alert("Error getting tags " + response.status + ": " + response.statusText);
          }
        }
    });
  }
  
  function getSubscriptionList(){
    var url = "http://www.google.com/reader/api/0/subscription/list?output=json&ck=" + _COMMAND_TOKEN + "&client=scroll";
    GM_xmlhttpRequest({
        method:"GET",
        url: url,
        onload: function(response) {
          if(response.status==200){
            var json = response.responseText;
            var jsonObj = eval('('+json+')');
            var subs = jsonObj.subscriptions;
            subscriptionIndex = {};
            subs.forEach(function(sub){
              subscriptionIndex[sub.id] = sub;
            });
            subscriptionList = subs;
          }else{
            alert("Error getting tags " + response.status + ": " + response.statusText);
          }
        }
    });
  }
  
  function addToHelp(){
    var insPoint = getSingleNode("id('keyboard-help')/tbody/tr[./td/text()='e:']");
    var newRow = document.createElement("tr");
    [0,1].forEach(function(){
      var col = document.createElement("td");
      newRow.appendChild(col);
    });
    var key = document.createElement("td");
    key.setAttribute("class", "key");
    key.innerHTML = "&lt;Shift&gt; + t:";
    newRow.appendChild(key);
    
    var desc = document.createElement("td");
    desc.setAttribute("class", "desc");
    desc.innerHTML = "tag current feed";
    newRow.appendChild(desc); 
    
    insPoint.parentNode.insertBefore(newRow, insPoint.nextSibling);
  }
  
  function onKeyUp(evt){
    //GM_log("Keypress: " + evt.charCode);
    if(String.fromCharCode(evt.charCode) == "T"){
      GM_log("'T' pressed");
      _USER_ID = unsafeWindow._USER_ID;
      
      feed = getFeed();
      if(!tagsBox){
        makeTagsBox();
      }
      tagsBox.style.display  = "block";
      var currentSubscription = subscriptionIndex[feed.url];
      if(currentSubscription){
        var currentTags = currentSubscription.categories;
        currentTags = currentTags.map(function(t){
           return t.id.substring(t.id.lastIndexOf("/")+ 1);   
        });
      }
      
      tagsBoxInput.value = currentTags.join(",");
      tagsBoxInput.focus();
  
      GM_log("Appended tagsBox");
      
      GM_log("Getting all tags");
      getAllTags();
      
      
      return false;
    }
    return true;
  }
  
  function makeTagsBox(){
      tagsBox = document.createElement("div");
      
      tagsBox.style.backgroundColor= "#E1ECFE";
      tagsBox.style.position = "absolute";
      tagsBox.style.top = "200px"
      tagsBox.style.left = "500px"
      tagsBox.style.zIndex = "1000";
      tagsBox.style.paddingLeft = "20px";
      tagsBox.style.paddingRight = "20px";
      tagsBox.style.paddingTop = "10px";
      tagsBox.style.paddingBottom = "10px";
      tagsBox.style.borderColor = "#C3D9FF";
      tagsBox.style.borderWidth = "2px";
      tagsBox.style.borderStyle = "solid";
      tagsBox.style.MozBorderRadius = "5px";
      
      tagsBoxInput = document.createElement("input");
      tagsBoxInput.setAttribute("id", "tagsBoxInput");
      tagsBoxInput.setAttribute("type", "text");
      tagsBoxInput.setAttribute("size", "30");
      tagsBoxInput.addEventListener("keydown", autocompleteKeydown, false);
      tagsBoxInput.addEventListener("keyup", autocomplete, false);
      tagsBox.appendChild(tagsBoxInput);
      
      tagsBoxAutocomplete = document.createElement("div");
      tagsBoxAutocomplete.style.backgroundColor = "#EEEEEE";
      tagsBoxAutocomplete.style.border = "1px solid #666666";
      tagsBoxAutocomplete.style.position = "absolute";
      tagsBoxAutocomplete.style.left = "20px";
      tagsBoxAutocomplete.style.top = "40px";
      tagsBoxAutocomplete.style.minWidth = "50px";
      tagsBoxAutocomplete.style.minHeight = "20px";
      tagsBoxAutocomplete.style.display = "none";
      tagsBox.appendChild(tagsBoxAutocomplete);
      
      
      var tagsBoxText = document.createElement("div");
      tagsBoxText.innerHTML = "Enter your tags separated by commas";
      tagsBox.appendChild(tagsBoxText);
      
      tagsBoxButtons = document.createElement("div");
      
      tagsBoxOK = document.createElement("input");
      tagsBoxOK.setAttribute("type", "button");
      tagsBoxOK.setAttribute("value", "Ok");
      
      tagsBoxOK.addEventListener("click", submitTags, false);
      
      tagsBoxButtons.appendChild(tagsBoxOK);
      
      tagsBoxCancel = document.createElement("input");
      tagsBoxCancel.setAttribute("type", "button");
      tagsBoxCancel.setAttribute("value", "Cancel");
      
      tagsBoxCancel.addEventListener("click", hideBox, false);
      
      tagsBoxButtons.appendChild(tagsBoxCancel);
      
      tagsBox.appendChild(tagsBoxButtons);
      
      document.body.appendChild(tagsBox);    
      GM_log("Created tagsBox");
      
      return tagsBox;
  }
  
  function getFeedTags(feed){
    var currentSubscription = subscriptionIndex[feed.url];
      if(currentSubscription){
        var currentTags = currentSubscription.categories;
        currentTags = currentTags.map(function(t){
           return t.id.substring(t.id.lastIndexOf("/")+ 1);   
        });
      }
      return currentTags;
  }
  
  var autocompleteSelected=0;
  var autocompleteElements = [];
  var autocompleteTag = "";
  
  function autocompleteSelect(id){
    if(autocompleteElements.length==0){
      return;
    }
    id = Math.abs(id % autocompleteElements.length);
    GM_log("Selecting " + id + " Deselecting " + autocompleteSelected);
    GM_log("Elements " + autocompleteElements.toSource());
    autocompleteElements[autocompleteSelected].style.backgroundColor = "";
    autocompleteElements[id].style.backgroundColor = "#666666";
    autocompleteSelected=id;
  }
  
  function autocompleteComplete(){
    if( autocompleteSelected >= autocompleteElements.length){
      return;
    }
    var autocompleteValue = autocompleteElements[autocompleteSelected].tagValue; 
    GM_log("Autocompleting - " + autocompleteValue);
    var inputValue = tagsBoxInput.value;
    var tags = inputValue.split(",");
    tags[tags.length-1] = autocompleteValue;
    var newValue = tags.join(",");
    GM_log("Newvalue " + newValue);
    autocompleteTag = "";
    tagsBoxInput.value = newValue;
    tagsBoxAutocomplete.style.display = "none";
  }
  
  function autocompleteKeydown(evt){
    GM_log("Autocomplete - keydown " + evt.keyCode);
    if(evt.keyCode == 9){//Tab
      autocompleteComplete();
      evt.preventDefault();
      evt.stopPropagation();
      window.setTimeout(function(){
        tagsBoxInput.focus()
      }, 0);
      return true;
    }else if(evt.keyCode == 27){//ESC
      hideBox();
    }else if(evt.keyCode == 27){//Enter
      submitTags();
    }else if(evt.keyCode == 38){//Up arrow
      GM_log("UP Key")
      autocompleteSelect(autocompleteSelected - 1);
      return true;
    }else if(evt.keyCode == 40){//Down arrow
      autocompleteSelect(autocompleteSelected + 1);
      return true;
    }
  }
  
  function autocomplete(evt){
    GM_log("Autocomplete - keyup " + evt.keyCode);
    
    var value = evt.target.value;
    var tags = value.split(",");
    if(tags.length>0){
      var tag = tags[tags.length-1];
    }else{
      return;
    }
    tag = tag.replace(/^[\s]+/, "");
    GM_log("Autocompleting for: " + tag)
    if(tag == autocompleteTag || tag == ""){
      return;
    }
    autocompleteTag = tag;
    var matches = allTags.filter(function(t){
      if(t.match(new RegExp("^"+tag+"", "i"))){
        return true;
      }else{
        return false;
      }
    });
    GM_log("Autocomplete matches: " + matches.toSource())
    autocompleteElements = [];
    tagsBoxAutocomplete.innerHTML = "";  
    matches.forEach(function(t){
      var div = document.createElement("div");
      div.innerHTML = t.replace(tag, "<b>$&</b>", "i");
      div.tagValue = t;
      autocompleteElements.push(div)
      tagsBoxAutocomplete.appendChild(div);
    });
    if(matches.length> 0 ){
      autocompleteElements[autocompleteSelected].style.backgroundColor = "#666666"
      tagsBoxAutocomplete.style.display = "block";
    }else{
      tagsBoxAutocomplete.style.display = "none";
    }
  }
  
  function getCommandToken(){
     _COMMAND_TOKEN = unsafeWindow._COMMAND_TOKEN;
     if(unsafeWindow._COMMAND_TOKEN_EXPIRES > new Date().getTime()){
       GM_log("Token expired!");
     }
     GM_log("ct: " + _COMMAND_TOKEN);
  }
  
  function submitTags(){
    getCommandToken();  
   
    var value = tagsBoxInput.value;
    GM_log("Value: "   + value);
    var tags = value.split(",");
    GM_log("Tags: "   + tags.toSource());
    var oldTags =  getFeedTags(feed);
    tags.filter(function(tag){
      if(oldTags.indexOf(tag)>=0){
        return false;
      }else{
        return true;
      }
    });
    tags.forEach(function(tag){
      tag = tag.replace(/[\s]+$/, "");
      tag = tag.replace(/^[\s]+/, "");
      var url = "http://www.google.com/reader/api/0/subscription/edit?client=scroll"
      var body = "";
      body += "s="+encodeURIComponent(feed.url);
      body += "&ac=edit";
      body += "&t=" + encodeURIComponent(feed.title);
      body += "&a=" + encodeURIComponent("user/" + _USER_ID + "/label/"+ tag);
      body += "&T="+_COMMAND_TOKEN;
      GM_log("URL: " + url);
      GM_log("Data:" + body);
      GM_xmlhttpRequest({
        method:"POST",
        url: url,
        data: body,
        headers: {"Content-Type" : "application/x-www-form-urlencoded"},
        onload: function(details) {
          
        }
      });
    });
    
    tagsBox.style.display = "none";
  }
  
  function hideBox(){
    tagsBox.style.display = "none";
  }
  
  function getFeed(){
      var eEntrySource = getSingleNode("id('current-entry')//a[@class='entry-source-title']");
      GM_log("Entry Source" + eEntrySource);
      
      var sSourceUrl = eEntrySource.getAttribute("href");
      sSourceUrl=decodeURIComponent(sSourceUrl);
      sSourceUrl = sSourceUrl.substr("/reader/view/".length);
      
      var sSourceTitle = eEntrySource.innerHTML;
      GM_log(sSourceUrl + " : " + sSourceTitle);
      
      return {url : sSourceUrl, title : sSourceTitle, element : eEntrySource};
  }
  
  function getSingleNode(xpath, root){
      if(!root){ 
        root = document;
      }
      return document.evaluate(xpath,
                     root, 
                     null, 
                     XPathResult.FIRST_ORDERED_NODE_TYPE, 
                     null).singleNodeValue;
      }
  
  //alert(_USER_ID + " : " + _COMMAND_TOKEN);
  
};

function GoogleReaderAPI(){
  
  
}