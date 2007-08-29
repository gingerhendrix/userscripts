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
// 0.2 -  29/08/07 - Refactored page wrangling code into GoogleReaderLens
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

var menuButton;
var foldersShown = true;
var treeSorted = false;

function addToHeader(){
  GM_log("AddToHeader")
  var menu = readerLens.subscriptionList.header.addSubmenu()
  foldersButton = menu.addItem("Hide Folders", toggleFolders);
  sortButton = menu.addItem("Sort By Unread", toggleSort);
}

function toggleFolders(){
  if(treeSorted){
    hideFolders();
    menuButton.element.innerHTML = "Show Folders";
    foldersShown = false;
  }else{
    showFolders();
    menuButton.element.innerHTML = "Hide Folders";
    foldersShown = true;
  }
}

function toggleSort(){

}

function showFolders(){
  var subTree = document.getElementById("sub-tree");
  subTree.setAttribute("id", "sub-tree-new");
  
  var subTreeOld = document.getElementById("sub-tree-old");
  subTreeOld.style.display = "block";
  subTreeOld.setAttribute("id", "sub-tree")
  
  subTree.parentNode.replaceChild(subTreeOld, subTree);
}

function hideFolders(){
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
