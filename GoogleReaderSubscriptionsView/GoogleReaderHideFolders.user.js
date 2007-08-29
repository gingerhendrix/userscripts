// ==UserScript==
// @name          GoogleReaderHideFolders
// @namespace     http://gandrew.com/projects/GoogleReaderFeedsView
// @description   Adds an option for a simple list view which ignores folders 
// @include       http://www.google.com/reader/view/*
// @require       http://localhost/eclipse/GoogleReaderApi/GoogleReader.js
// @require       http://localhost/eclipse/GoogleReaderApi/GoogleReaderLens.js
// ==/UserScript==
//
// Changelog 
// 0.1  - 01/08/07 - Project started
//
// == Todo ==

var readerLens = new GoogleReaderLens();
readerLens.onload = loaded;
readerLens.init();

var googleReader;

function loaded(){
  googleReader = new GoogleReader();
  googleReader.onload = addToHeader;
  googleReader.init();
}

var div;
var labelsShown = true;

function addToHeader(){
  var header = document.getElementById("new-subscriptions-header");
  div = document.createElement("div");
  div.innerHTML = "Hide Folders";
  div.addEventListener("click", toggleLabels, false);
  div.style.textDecoration = "underline";
  div.style.cursor = "pointer";
  header.appendChild(div);
}

function toggleLabels(){
  if(labelsShown){
    hideLabels();
    div.innerHTML = "Show Folders";
    labelsShown = false;
  }else{
    showLabels();
    div.innerHTML = "Hide Folders";
    labelsShown = true;
  }
}

function showLabels(){
  var subTree = document.getElementById("sub-tree");
  subTree.setAttribute("id", "sub-tree-new");
  
  var subTreeOld = document.getElementById("sub-tree-old");
  subTreeOld.style.display = "block";
  subTreeOld.setAttribute("id", "sub-tree")
  
  subTree.parentNode.replaceChild(subTreeOld, subTree);
}

function hideLabels(){
  var subs = googleReader.getSubscriptionList();
  var unread = subs.filter(function(s){
    return s.count > 0;
  })
  
  var oldTree = document.getElementById("sub-tree");
  oldTree.style.display = "none";
  oldTree.setAttribute("id", "sub-tree-old");
   
  var newTree = document.getElementById("sub-tree-new");
  if(newTree){

  }else{
    newTree = oldTree.cloneNode(false);
    unread.forEach(function(sub){
      var id = sub.id.replace("feed/", "");
      var xpath = "id('sub-tree-old')//a[contains(@href,'/reader/view/feed/"+encodeURIComponent(id)+"')]";
      var originalLink = getSingleNode(xpath, oldTree);
      var newLink = originalLink.parentNode.cloneNode(true);
      newTree.appendChild(newLink);
    });
    oldTree.parentNode.appendChild(newTree);
  }
  
  newTree.style.display = "block";
  newTree.setAttribute("id", "sub-tree");
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
