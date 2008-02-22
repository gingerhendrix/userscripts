// ==UserScript==
// @name          GoogleCustomizeMenu
// @namespace     http://gandrew.com/projects/GoogleCustomizeMenu
// @description   Customize the top menu on Google sites
// @include       http://*.google.tld/*
// ==/UserScript==
//
// TODO;
// Won't work on gmail - probably a timing issue caused by loading


var barElements = document.evaluate("//*[@class='gb1']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null); 

var barContainer = barElements.snapshotItem(0).parentNode;
var moreLink = document.evaluate("//*[@class='gb3']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

var el;
for ( var i=0 ; i < barElements.snapshotLength; i++ ){
  el = barElements.snapshotItem(i);
  el = el.parentNode.removeChild(el);
}

[
 ["Home", "http://www.google.com/ig"],
 ["Mail", "http://mail.google.com"],
 ["Reader", "http://www.google.com/reader"],
].forEach(function(item){
  var span = document.createElement("span");
  span.setAttribute("class", "gb1");
  span.innerHTML = "<a href='"+item[1] + "'>"+item[0]+"</a>";
  barContainer.insertBefore(span, moreLink);
});