/**
 */
function Animator(interval, duration, f){
    var timer = null;
    var counter = 0;
    var end = duration/interval;
    var forward = true;
    var self =  this;
    var id = Animator.count++;
    
    this.stop = function(){
        window.clearInterval(timer);
    }
    
    this.finish = function(){
        this.stop();
        var oldCount = counter;
        counter = forward ? end : 0;
        f(forward ? 1.0 : 0.0, ec(oldCount));
    };
    
    this.forward = function(){
        this.stop();
        forward = true;
        go();
    };
    
    
    this.reverse = function(){
        this.stop();
        forward = false;
        go();
    };

    function go(){
        timer = window.setInterval(bind(self, function(){
                var oldCount = forward ? counter++ : counter--;
                if((forward && counter>=end) || (!forward && counter<=0)){
                     this.finish();
                }else{
                    f(ec(counter), ec(oldCount))
                }
            }), 
            interval);
    }    
    
    
    /**
     * Escape counter? turns the counter into a fraction
     */
    function ec(counter){
        return (counter*1.0)/end;
    }
}

Animator.count = 0;