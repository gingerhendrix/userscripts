
var Menu = function(){
    this.items = [];
    this.element;
    this.animationState = 0;
    this.o;
    this.textColor = "inherit";
}

Menu.prototype.makeMenu = function(){
    this.element = document.createElement("div");
 
    this.element.style.marginLeft = "auto";
    this.element.style.width = ((SearchEngines.length * 39) + 37) + "px";
    this.element.style.marginRight = "auto";
    //this.element.style.height = "88px";
    this.element.style.textAlign = "left";
    this.title = document.createElement("div");
    this.title.style.height = "20px";
    this.title.style.fontSize = "18px";
    this.title.style.marginBottom = "-2px";
    this.title.style.textAlign = "center";
    this.title.style.width = "70px";
    this.title.style.color = this.textColor;
    GM_log("TextColor: " + this.title.style.color);
    this.element.appendChild(this.title);
    
    for(var i=0; i<SearchEngines.length; i++){
        var engine = SearchEngines[i];
        var opt = this.makeOption(engine);
        this.addEventHandlers(opt, engine);
        this.element.appendChild(opt);
    }
    
    this.element.appendChild(this.makeDummyMore());
    this.element.appendChild(this.makeTag());
    return this.element;    
}

Menu.prototype.makeOption = function(item){
    var opt = document.createElement("span");
    return opt;
}

Menu.prototype.addEventHandlers = function(opt, engine){
    opt.addEventListener("mouseover", bind(this, this.menuOver, engine), true);
    opt.addEventListener("mouseout", bind(this, this.menuOut, engine), true);
    opt.addEventListener("click", bind(this, this.menuClick, engine), true);
}

Menu.prototype.makeDummyMore = function(){
    dummyMore = document.createElement("span");
    dummyMore.setAttribute("name", "more");
    return dummyMore;
}

Menu.prototype.makeTag = function(){
    var tag = document.createElement("img");
    tag.setAttribute("src", GM_getImport("tag").getURI());
    tag.setAttribute("id", "gms_tag");
    tag.setAttribute("width", "89");
    tag.setAttribute("height", "11");
    tag.style.display = "block";
    tag.style.marginTop = "-22.5px";
    tag.style.marginRight = "0";
    tag.style.marginLeft = "auto";
    tag.style.zIndex = "1";
    return tag;
}



Menu.prototype.menuOver = function (engine){
    this.title.innerHTML = engine.name;
    this.title.style.marginLeft = (engine.index*39) + "px";
    
    engine.el_img.src = engine.image;
    if(!engine.animation){
        engine.animation =  new Animator(50, 300, function(d){
            engine.el_img.style.width = (35 + (35*d)) + "px";
            engine.el_img.style.height = (35 + (35*d)) + "px";
            engine.el_img.style.paddingTop = ((1-d)*17.5) + "px";
            engine.el_img.style.paddingBottom = ((1-d)*17.5) + "px";
        });    
    }
    engine.animation.forward();
    
}

Menu.prototype.menuOut = function(engine){
    engine.el_img.src = engine.imageSm;
    if(engine.animation){
        engine.animation.reverse();
    }
    this.title.innerHTML = "";
}

var ImageMenu = function(){
    
}
ImageMenu.prototype = new Menu();

ImageMenu.prototype.makeOption = function(engine){
        var opt = document.createElement("span");
    optImg = document.createElement("img");
    engine.el_img = optImg;
    optImg.setAttribute("src", engine.imageSm);
    optImg.setAttribute("width", "35");
    optImg.setAttribute("height", "35");
    optImg.style.paddingTop = "17.5px";
    optImg.style.paddingBottom = "17.5px";
    optImg.style.paddingLeft = "2px";
    optImg.style.paddingRight = "2px";
    optImg.style.zIndex = "2";
    //opt.innerHTML = engine.name;
    opt.appendChild(optImg);
    opt.setAttribute("style", "cursor: pointer;");
    return opt;
}