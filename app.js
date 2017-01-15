
var pressed = 0;
var frameState = 0;
var frameNum = 0;

$(document).ready(function(){
	setup();
})

var touchmouseval = function(e){
	var val = 0;
	if(e.clientY== undefined){
		val = e.touches[0].clientY;
	} else{
		val = e.clientY;
	}
	touchFace(val);
}

var touchmousevalend= function(e){
    if (((39-frameNum)-(39/2))<0){
    	frameNum =39;

    }else{
    	frameNum = 0;
    }
}

var setup = function(){
	resize();
      


	$("#face").on('touchstart mousedown',function(e){
		e.preventDefault();
		pressed = 1;
		frameNum = 0;
		frameState= 0;
        $("#face")[0].className = "hand"
		touchmouseval(e);

	})

	$("#face").on('mouseup touchend',function(e){
		e.preventDefault();
		pressed = 0;
		touchmousevalend(e);

	})

	$("#face").on('mouseout touchleave',function(e){
		e.preventDefault();

		pressed = 0;
	     touchmousevalend(e);
	})


	$("#face").on('touchmove mousemove',function(e){
		e.preventDefault();

		if(pressed){
			touchmouseval(e);

		}
	})

   drawFace();

}

var updateFrame = function(frameNum){	
	if(frameNum<=0){
		frameNum=0;
	
	} else if (frameNum >=39){
        frameNum = 39;
	} else{
	
     }
}

var touchFace = function(y){
  var coverage = y/sidelength;
  if(coverage<0){
    coverage =0;
  }
  if(coverage>1){
  	coverage=0.99;
  }
  if(coverage>0.0839){
    frameNum = Math.floor(40*coverage);
    updateFrame(frameNum);
  }
}

var resize = function(){
	w = $(window).width(); 
	h = $(window).height();
	sidelength = h;
	if (w<h){
		sidelength = w;
	}
	$c = $("#container");
	$c.css('width', sidelength);
	$c.css('height', sidelength)
}

$(window).resize(function(){
	resize();
})

then = Date.now();
interval = 10;

function drawFace() {




	if($("#face")[0].className == "hand"){
		now = Date.now();
		elapsed = now - then;
		if(elapsed > interval){
			diff = (frameNum-frameState);
			if(diff>=1){frameState+=Math.log(Math.abs(diff)+1)}
				if(diff<0){frameState-=Math.log(Math.abs(diff)+1)}
					frameState = Math.round(frameState);
				then = now - (elapsed % interval);
			}

			var percentPos = (frameState * -100) + "%";
			$(".hand").css("background-position","0" + percentPos)
			if(frameState ==0){
				$(".hand").css("background-position","0 -3900%")
			}

			if(diff==0 && pressed==0){
				$("#face")[0].className = "breathing"
				$(".breathing").css("background-position","")
			}

		}
		requestAnimationFrame(drawFace);
	}

