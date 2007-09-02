
function GoogleReader(){
 var _COMMAND_TOKEN;
 var subscriptionList;
 var subscriptionIndex;
 var labelList = [];
 var labelMap = {};
 
 var thisObj = this;
 
 this.onload = function(){};

 this.init = function(){
   _COMMAND_TOKEN = unsafeWindow._COMMAND_TOKEN;
   this.updateSubscriptionList(function(){
    this.updateUnreadCount(function(){
      this.onload.call(thisObj);
    }) 
   });
 }
 
 this.getLabels = function(){
   return labelList;
 } 
 
 this.getSubscriptionsByLabel = function(label){
   return labelMap[label];
 }
 
 this.getSubscriptionList = function(){
   return subscriptionList;
 }
 
 this.getSubscription = function(id){
   return subscriptionIndex[id];
 }
  
 this.updateSubscriptionList = function(callback){
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
            subscriptionList = [];
            subs.forEach(addSubscription);
            GM_log("Subscription list updated " + subs.length + " items");
            if(callback){
              callback.call(thisObj);
            }
          }else{
            alert("Error getting tags " + response.status + ": " + response.statusText);
          }
        }
    });
  }
  
  function updateLabel(sub){
    if(!labelMap[sub.id]){
      labelList.push(sub);
      labelMap[sub.id] = [];
    }
  }
  
  function addSubscription(sub){
    sub.isLabel = false;
    sub.isState = false;
    if(sub.id.match(/user\/[0-9]*\/label\//)){
      updateLabel(sub);
      sub.isLabel = true;
    }else if(sub.id.match(/user\/[0-9]*\/state\//)){
       sub.isState = true;
    }else{
      sub.categories.forEach(function(label){
        updateLabel({id: label.id})
        labelMap[label.id].push(sub.id);
      });
    }
    subscriptionList.push(sub);
    subscriptionIndex[sub.id] = sub;
  }
  
  this.updateUnreadCount = function(callback){
    var url = "http://www.google.com/reader/api/0/unread-count?all=true&output=json&ck=" + _COMMAND_TOKEN + "&client=scroll";
    GM_xmlhttpRequest({
        method:"GET",
        url: url,
        onload: function(response) {
          if(response.status==200){
            var json = response.responseText;
            var jsonObj = eval('('+json+')');
            var counts = jsonObj.unreadcounts;
            counts.forEach(function(count){
              if( subscriptionIndex[count.id]){
                 subscriptionIndex[count.id].count = count.count;
              }else{
                addSubscription({id: count.id, count : count.count});
              }
            });
            if(callback){
              callback.call(thisObj);
            }
          }else{
            alert("Error getting unread count " + response.status + ": " + response.statusText);
          }
        }
    });
  }
}