
function GoogleReader(){
 var _COMMAND_TOKEN;
 var subscriptionList;
 var subscriptionIndex;
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
            subs.forEach(function(sub){
              subscriptionIndex[sub.id] = sub;
            });
            GM_log("Subscription list updated " + subs.length + " items");
            subscriptionList = subs;
            if(callback){
              callback.call(thisObj);
            }
          }else{
            alert("Error getting tags " + response.status + ": " + response.statusText);
          }
        }
    });
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
                GM_log("Subscription " + count.id + " not found");
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