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
    updateTree();
    foldersButton.element.innerHTML = "Show Folders";
    foldersShown = false;
  }else{
    updateTree();
    foldersButton.element.innerHTML = "Hide Folders";
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

var masterTree;

function updateTree(){
  var subs = googleReader.getSubscriptionList();
  var unread = subs.filter(function(s){
    return s.count > 0;
  });
  unread = unread.sort(function(s1, s2){
    return (s2.count > s1.count ) ? 1 : ((s2.count < s1.count) ? -1 : 0);
  });  
  
  if(!masterTree){
    masterTree = document.getElementById("sub-tree");
    masterTree.style.display = "none";
    masterTree.setAttribute("id", "sub-tree-master");
  }
  var newTree = masterTree.cloneNode(false);

  unread.forEach(function(sub){
    var id = sub.id;
    if(id.search(/^feed\//) !=-1){
      id = id.replace(/^feed\//, "");
      id = "feed/" + encodeURIComponent(id);
    }else{
      id = sub.id.replace(/(user\/)([0-9]*)(\/label)/, "$1-$3");
      return;
    }
    GM_log("Cloning Link " + id + "");
    var xpath = "id('sub-tree-master')//a[contains(@href,'/reader/view/"+id+"')]";
    
    var originalLink = getSingleNode(xpath, masterTree);
    if(!originalLink){
      GM_log("Link " + id + " not found");
      return;
    }
    GM_log("Element " + originalLink.parentNode + "");
    var newLink = originalLink.parentNode.cloneNode(true);
    newLink.addEventListener("click", function(e){
        var evt = document.createEvent("MouseEvents");
        evt.initEvent("click", true, false, 
                      window, 1,
                      0, 0, 0, 0,
                      false, false, false, false,
                      0, null);
        originalLink.dispatchEvent(evt);
        e.preventDefault();
        e.stopPropagation();
    }, true);
    newTree.appendChild(newLink);
  });

  masterTree.parentNode.appendChild(newTree);

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
