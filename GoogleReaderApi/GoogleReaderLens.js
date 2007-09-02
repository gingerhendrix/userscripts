

var GoogleReaderLens = function(){
  var thisObj = this;
  this.onload = function(){};
  this.subscriptionList = new SubscriptionList();
  
  function initLoadingObserver(){
    var loadingElement = document.getElementById("loading-area");
    var loadingStatus = -1;
  
    var timer = window.setInterval(function(){
    var hidden = loadingElement.getAttribute("class").indexOf("hidden") > -1;
      if(loadingStatus == -1 && !hidden){
        loadingStatus = 0;
      }
      if(loadingStatus == 0 && hidden){
        loadingStatus = 1;
        window.clearInterval(timer);
        thisObj.onload();
      }
    }, 200);
  };
  
  this.init = function(){
    initLoadingObserver();  
  }
  
  function SubscriptionList(){
    this.header =  new SubscriptionListHeader();
    //this.tree = new SubscriptionTree();
  }
  
  
  function SubscriptionListHeader(){
    this.addSubmenu = function(){
      var el = document.getElementById("new-subscriptions-header");
      this.submenu = new Menu();
      el.appendChild(this.submenu.element);
      return this.submenu;
    }
  }

  function Menu(){
    this.element = document.createElement("div");
    this.addItem = function(label, handler){
      GM_log("Adding menu item");
      var item = new MenuItem(label, handler);
      this.element.appendChild(item.element);
      return item;
    }
  }
  
  function MenuItem(label, handler){
    this.element = document.createElement("span");
    this.element.innerHTML = label;
    this.element.addEventListener("click", handler, false);
    this.element.style.textDecoration = "underline";
    this.element.style.cursor = "pointer";
  }
};

