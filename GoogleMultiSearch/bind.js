function bind(obj, func){
    if(typeof func == "string"){
        func = obj[func];
    }
    if (!func) {
        throw "method '" + func + "' does not exist";
    }
      
    var staticArgs = Array.prototype.splice.call(arguments, 2, arguments.length);
    
    return function() { 
        // make a copy of staticArgs (don't modify it because it gets reused for
        // every invocation).
        var args = staticArgs.concat();
    
        // add all the new arguments
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
    
        // invoke the original function with the correct this obj and the combined
        // list of static and dynamic arguments.
        return func.apply(obj, args);
      };
}