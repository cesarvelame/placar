var Timer = function() {
    var context = {};
    var ticks = 0;
    var start;
    var counter;
    var emitHandlers = [];

    var convertToTicks = function(time) {
        var splitTime = time.split(':');
        var minutes = splitTime[0];
        var seconds = splitTime[1];
        return Number(minutes * 60) + Number(seconds);
    };
    
    var format = function(value){
        while(value.length < 2) {
            value = '0' + value;
        }
        return value;
    }

    var convertFromTicks = function() {
        var minutes = Math.floor(ticks / 60);
        var seconds = ticks % 60;
        return format(String(minutes)) + ':' + format(String(seconds));
    }
    
    var timer = function() {
        ticks = ticks - 1;
        if (ticks === 0) {
            clearInterval(counter);
        }
        context.emitTime(convertFromTicks());
    }
    
    context.updateTime = function(time) {
        ticks = convertToTicks(time);
    }

    context.start = function() {
        counter = setInterval(timer, 1000);
    }

    context.pause = function() {
        clearInterval(counter);
    }

    context.emitTime = function(time) {
        $.each(emitHandlers, function(idx, handler) { handler(time) });
    }
    
    context.subscribeToEmitter = function(fn) {
        emitHandlers.push(fn);
    }
    
    context.setTime = function(time) {
        ticks = convertToTicks(time);
        start = convertFromTicks();
    }
    
    context.reset = function() {
        clearInterval(counter);
        if (start) {
            context.emitTime(start);
        }
    }
    
    context.getStartTime = function() {
        return start;
    }
    
    return context;
}
