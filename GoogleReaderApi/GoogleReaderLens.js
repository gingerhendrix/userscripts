

var GoogleReaderLens = function(){
  var thisObj = this;
  this.onload = function(){};
  
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
};