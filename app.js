var pressed = 0;
var frameState = 0;
var frameNum = 0;
var startTime = Date.now();

var lastFrameState = 0;
var trackEventName;
var trackEventParam;

var sessionGuid = guid();

$(document).ready(function() {
    setup();
})

var totalElapsed = function(start) {
  return -(startTime - Date.now());
}

var touchmouseval = function(e) {
    var val = 0;
    if (e.clientY == undefined) {
        val = e.touches[0].clientY;
    } else {
        val = e.clientY;
    }
    touchFace(val);
}

var touchmousevalend = function(e) {
    if (((39 - frameNum) - (39 / 2)) < 0) {
        frameNum = 39;

    } else {
        frameNum = 0;
    }
}

var setup = function() {
    resize();

    $("#face").on('touchstart mousedown', function(e) {
        e.preventDefault();
        pressed = 1;
        frameNum = 0;
        frameState = 0;

        touchmouseval(e);

    })

    $("#face").on('mouseup touchend', function(e) {
        e.preventDefault();
        pressed = 0;
        touchmousevalend(e);

    })

    $("#face").on('mouseout touchleave', function(e) {
        e.preventDefault();

        pressed = 0;
        touchmousevalend(e);
    })


    $("#face").on('touchmove mousemove', function(e) {
        e.preventDefault();

        if (pressed) {
            touchmouseval(e);

        }
    })

    drawFace();
    trackTimer();
}

var updateFrame = function(frameNum) {
    if (frameNum <= 0) {
        frameNum = 0;

    } else if (frameNum >= 39) {
        frameNum = 39;
    } else {

    }
    var trackParams = {
        "session": sessionGuid, 
        "timeElapsed": totalElapsed(), 
        "position": frameNum
      };
    track("scroll-state", JSON.stringify(trackParams));
}

var guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}


var touchFace = function(y) {
    var coverage = y / sidelength;
    if (coverage < 0) {
        coverage = 0;
    }
    if (coverage > 1) {
        coverage = 0.99;
    }
    if (coverage > 0.0839) {
        frameNum = Math.floor(40 * coverage);
        updateFrame(frameNum);
    }
}

var resize = function() {
    w = $(window).width();
    h = $(window).height();
    sidelength = h;
    if (w < h) {
        sidelength = w;
    }
    $c = $("#container");
    $c.css('width', sidelength);
    $c.css('height', sidelength)
}

$(window).resize(function() {
    resize();
})

then = Date.now();
interval = 10;

function drawFace() {

    now = Date.now();
    elapsed = now - then;
    if (elapsed > interval) {
        diff = (frameNum - frameState);
        if (diff >= 1) {
            frameState += Math.log(Math.abs(diff) + 1)
        }
        if (diff < 0) {
            frameState -= Math.log(Math.abs(diff) + 1)
        }
        frameState = Math.round(frameState);
        then = now - (elapsed % interval);
    }

    var percentPos = (frameState * -100) + "%";
    $("#face").css("background-position", "0" + percentPos)
    if (frameState == 0) {
        $("#face").css("background-position", "0 -3900%")
    }

   

    requestAnimationFrame(drawFace);
}

function track(name, params){
  trackEventName = name;
  trackEventParam = params;
}

function trackTimer(){
  window.setTimeout(function(){
    if (lastFrameState != frameState){
      if(tt != undefined){
        tt(trackEventName, trackEventParam);
      }
      lastFrameState = frameState;
    }
    trackTimer();
  }, 250)
}