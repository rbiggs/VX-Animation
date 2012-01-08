//////////////////////////////////////////////////////////////
//
//  Vx.anim
//  Version 1.0
//  Robert Biggs, 2008
//  License: BSD 
//
//////////////////////////////////////////////////////////////

if (typeof vx === "undefined") {
    vx = {};
    vx.loadEvent = function ( F ) {
        var oldonload = window.onload;
        if (typeof window.onload !== 'function') {
            window.onload = F;
        } else {
            window.onload = function ( ) {
                oldonload();
                F();
           };
        }
    };
};

vx.delay = function( amount, F ) {
   if (!F) { 
       return false;
    } else {
       setTimeout(function() { F(); }, amount);
    }
};
vx.animate = function( elem, opts, duration, fps, easing ) {
    var duration = duration ? parseFloat(duration) : 1000;
    var fps = fps ? parseFloat(fps) : 20;
    var startTime  = new Date().getTime();
    var endTime = startTime + duration;
   	var frame = 1;
  	var timer = undefined;
    var easing = easing ? easing: vx.easing.linear;
    var interval = Math.ceil(1000 / fps);
    var totalframes = Math.ceil(duration / interval);
  	
    var setAnimation = function() {
       	var time = new Date().getTime();
		frame = parseInt((time - startTime) / interval);
		var onEnd = undefined;
		var onStart = undefined;
		
        for (var prop in opts){
        	if (prop !== "onEnd" || prop !== "onStart") {
           		vx.animate.utils.manufacture(elem, totalframes, frame, prop, opts, easing);
           	}
           	if (prop === "onEnd") {
           		 onEnd = opts[prop];
           	}
           	if (prop === "onStart") {
           		onStart = opts[prop];
           	}
        }
        if (onStart) {
        	onStart();
        }
        if (time >= startTime + duration) {
           if (onEnd) {
	           onEnd();
           }
		   //console.log("endTime is: " + endTime + "; present time is: " + new Date().getTime());
           clearInterval(timer);
        }
   };
   var timer = setInterval(setAnimation, interval);
};

vx.animate.utils = {
    manufacture : function ( elem, totalframes, frame, prop, opts, easing ) {
    	// We need to check what type of property we're dealing with
        var start = opts[prop].start;
        // If the property is numeric, use calculate method to determine
        if (/[0-9]+/.test(parseInt(start)) && !/\s/.test(start)) {
            this.calculate(elem, totalframes, frame, prop, opts, easing);
            return true;
        }
        // If the property is not numeric, treat it as a color value.
        var method = this.camelize(prop);
        // Here we check for one of the supported color methods
        if (this[method]) {
            this[method](elem, totalframes, frame, prop, opts, easing);
            return true;
        }
        return false;
    }, 
    calculate : function ( elem, totalframes, frame, prop, opts, easing ) {
        var start = opts[prop].start * 100;
        var end = opts[prop].end * 100;
        var units = undefined;
        if (opts[prop].units) {
            units = opts[prop].units;
        }
        var bezier = opts[prop].bezier * 100;
        var tween = easing(frame, start, end - start, totalframes);
        if (bezier) {
            tween = this.bezier(frame, tween, end, bezier, totalframes);
        }
        this.style(elem, prop, tween / 100, units);
        elem.style.zoom = 1;
    },
    style : function ( elem, prop, val, units ) {
        if (units) {
            var units = units;
        } else {
            var units = "";
        }
        if (prop === "opacity") {
            return this.opacity(elem, parseFloat(val));
        }
        if (prop === "float") {
            prop = (window.attachEvent) ? 'styleFloat': 'cssFloat';
        }
        prop = this.camelize(prop);
        if (!units) {
            units = (prop === 'zIndex' || prop === 'zoom') ? '': 'px';
        }
        try {
        	elem.style[prop] = (typeof val === "string") ? val : val + units;
        	return elem;
        } catch(e){}
    },
    // Method to handle values that are either singular or multi-part.
    determineMultiValue : function ( elem, totalframes, frame, prop, opts, easing ) {
    	var suffix = ["Top", "Right", "Bottom", "Left"];
  		var prop = prop;
    	var start = opts[prop].start.split(/\s/) || [];
    	var end = opts[prop].end.split(/\s/) || [];
    	var units = (opts[prop].units) ? opts[prop].units : "px";
    	
    	var t = 0; r = 0; b = 0; l = 0;
    	if (start.length === 2) {
    		t = 0; r = 1; b = 0; l = 1;
    	}
    	if (start.length === 3) {
    		t = 0; r = 1; b = 2; l = 1;
    	}
    	if (start.length === 4) {
    		t = 0; r = 1; b = 2; l = 3;
    	}
    	var tempProp = undefined;
    	var a = [t, r, b, l];    	
        var len = a.length;
    	for (var i = 0; i < len; i++) {
    		tempProp = prop + suffix[i];
    		
    		var z = eval("opts4 = { " + tempProp + ": { start : " + start[a[i]] + ", end : " + end[a[i]] + " }}");
    		this.calculate(elem, totalframes, frame, tempProp, z, easing);
    	}
    },
    opacity : function ( elem, val ) {
        if (elem.style.filter) {
            elem.style.zoom = 1;
        	elem.style.filter = "alpha(opacity=" + parseFloat(val * 100) + ")";
        } else {
        	elem.style.opacity = parseFloat(val);
        }
        return elem;
    },
    color : function ( elem, totalframes, frame, prop, opts, easing ) {
        
        var c1 = opts[prop].start.toLowerCase();
        var c2 = opts[prop].end.toLowerCase();
        
        function returnColorValue ( v ) {
            for (color in vx.color) {
                if (v === color) {
                    return vx.color[color];
                }
            }
        }
        if (!/#/.test(c1)) {
            c1 = returnColorValue(c1);
        }
        if (!/#/.test(c2)) {
            c2 = returnColorValue(c2);
        }
        var b = this.hexToArray(c1);
        var e = this.hexToArray(c2);
        var rgb = [];
        for (j = 0; j < 3; j++) {
            rgb.push(parseInt(easing(frame, b[j], e[j] - b[j], totalframes)));
        }
        this.style(elem, prop, 'rgb(' + rgb.join(',') + ')');
    },
    backgroundColor : function ( elem, totalframes, frame, prop, opts, easing ) {
        this.color(elem, totalframes, frame, prop, opts, easing);
    },
    borderColor : function ( elem, totalframes, frame, prop, opts, easing ) {
        this.color(elem, totalframes, frame, prop, opts, easing);
    },
    padding : function ( elem, totalframes, frame, prop, opts, easing ) {
		this.determineMultiValue(elem, totalframes, frame, prop, opts, easing);
	},
	margin : function ( elem, totalframes, frame, prop, opts, easing ) {
		this.determineMultiValue(elem, totalframes, frame, prop, opts, easing);
	},
	border : function ( elem, totalframes, frame, prop, opts, easing ) {
	    this.determineBorderParts(elem, totalframes, frame, prop, opts, easing);
	},
    bezier : function ( frame, begin, end, deviator, totalframes ) {
        var t = frame / totalframes;
        return (1 - t) * (1 - t) * begin + 2 * t * (1 - t) * deviator + t * t * end;
    },
    hexToDec : function ( hex ) {
        return parseInt(hex, 16);
    },
    hexToRgb : function ( h, e, x ) {
        return [this.hexToDec(h), this.hexToDec(e), this.hexToDec(x)];
    },
    hexToArray : function ( color ) {
        return this.hexToRgb(color.substring(1, 3), color.substring(3, 5), color.substring(5, 7));
    },
    camelize : function ( value ) {
        return value.replace(/-(.)/g,
        function(m, l) {
            return l.toUpperCase();
        });
    }
};

// These colors can be used with the color method for animation.
vx.color = {
    aliceblue : "#F0F8FF",
    antiquewhite : "#FAEBD7",
    aqua : "#00FFFF",
    aquamarine : "#7FFFD4",
    azure : "#F0FFFF",
    beige : "#F5F5DC",
    bisque : "#FFE4C4",
    black : "#000000",
    blanchedalmond : "#FFEBCD",
    blue : "#0000FF",
    blueviolet : "#8A2BE2",
    brown : "#A52A2A",
    burlywood : "#DEB887",
    cadetblue : "#5F9EA0",
    chartreuse : "#7FFF00",
    chocolate : "#D2691E",
    coral : "#FF7F50",
    cornflowerblue : "#6495ED",
    cornsilk : "#FFF8DC",
    crimson : "#DC143C",
    cyan : "#00FFFF",
    darkblue : "#00008B",
    darkcyan : "#008B8B",
    darkgoldenrod : "#B8860B",
    darkgray : "#A9A9A9",
    darkgrey : "#A9A9A9",
    darkgreen : "#006400",
    darkkhaki : "#BDB76B",
    darkmagenta : "#8B008B",
    darkolivegreen : "#556B2F",
    darkorange : "#FF8C00",
    darkorchid : "#9932CC",
    darkred : "#8B0000",
    darksalmon : "#E9967A",
    darkseagreen : "#8FBC8F",
    darkslateglue : "#483D8B",
    darkglategray : "#2F4F4F",
    darkslategrey : "#2F4F4F",
    darkturquoise : "#00CED1",
    darkviolet : "#9400D3",
    deeppink : "#FF1493",
    deepskyblue : "#00BFFF",
    dimgray : "#696969",
    dimgrey : "#696969",
    dodgerblue : "#1E90FF",
    firebrick : "#B22222",
    floralwhite : "#FFFAF0",
    forestgreen : "#228B22",
    fuchsia : "#FF00FF",
    gainsboro : "#DCDCDC",
    ghostwhite : "#F8F8FF",
    gold : "#FFD700",
    goldenrod : "#DAA520",
    gray : "#808080",
    grey : "#808080",
    green : "#008000",
    greenyellow : "#ADFF2F",
    honeydew : "#F0FFF0",
    hotpink : "#FF69B4",
    indianred :  "#CD5C5C",
    indigo :  "#4B0082",
    ivory : "#FFFFF0",
    khaki : "#F0E68C",
    lavender : "#E6E6FA",
    lavenderblush : "#FFF0F5",
    lawngreen : "#7CFC00",
    lemonchiffon : "#FFFACD",
    lightblue : "#ADD8E6",
    lightcoral : "#F08080",
    lightcyan : "#E0FFFF",
    lightgoldenrodyellow : "#FAFAD2",
    lightgray : "#D3D3D3",
    lightgrey : "#D3D3D3",
    lightgreen : "#90EE90",
    lightpink : "#FFB6C1",
    lightsalmon : "#FFA07A",
    lightseagreen : "#20B2AA",
    lightskyblue : "#87CEFA",
    lightslategray : "#778899",
    lightslategrey : "#778899",
    lightsteelblue : "#B0C4DE",
    lightyellow : "#FFFFE0",
    lime : "#00FF00",
    limegreen : "#32CD32",
    linen : "#FAF0E6",
    magenta : "#FF00FF",
    maroon : "#800000",
    mediumaquamarine : "#66CDAA",
    mediumblue : "#0000CD",
    mediumorchid : "#BA55D3",
    mediumpurple : "#9370D8",
    mediumseagreen : "#3CB371",
    mediumslateblue : "#7B68EE",
    mediumspringgreen : "#00FA9A",
    mediumturquoise : "#48D1CC",
    mediumvioletred : "#C71585",
    midnightblue : "#191970",
    mintcream : "#F5FFFA",
    mistyrose : "#FFE4E1",
    moccasin : "#FFE4B5",
    navajowhite : "#FFDEAD",
    navy : "#000080",
    oldlace : "#FDF5E6",
    olive : "#808000",
    olivedrab : "#6B8E23",
    orange : "#FFA500",
    orangered : "#FF4500",
    orchid : "#DA70D6",
    palegoldenrod : "#EEE8AA",
    palegreen : "#98FB98",
    paleturquoise : "#AFEEEE",
    palevioletred : "#D87093",
    papayawhip : "#FFEFD5",
    peachpuff : "#FFDAB9",
    peru : "#CD853F",
    pink : "#FFC0CB",
    plum : "#DDA0DD",
    powderblue : "#B0E0E6",
    purple : "#800080",
    red : "#FF0000",
    rosybrown : "#BC8F8F",
    royalblue : "#4169E1",
    saddlebrown : "#8B4513",
    salmon : "#FA8072",
    sandybrown : "#F4A460",
    seagreen : "#2E8B57",
    seashell : "#FFF5EE",
    sienna : "#A0522D",
    silver : "#C0C0C0",
    skyblue : "#87CEEB",
    slateblue : "#6A5ACD",
    slategray : "#708090",
    slategrey : "#708090",
    snow : "#FFFAFA",
    springgreen : "#00FF7F",
    steelblue : "#4682B4",
    tan : "#D2B48C",
    teal : "#008080",
    thistle : "#D8BFD8",
    tomato : "#FF6347",
    turquoise : "#40E0D0",
    violet : "#EE82EE",
    wheat : "#F5DEB3",
    white : "#FFFFFF",
    whitesmoke : "#F5F5F5",
    yellow : "#FFFF00",
    yellowgreen : "#9ACD32"
};

vx.easing = {
    //linear without easing :
    linear : function ( t, b, c, d, bezier ) {
        return b + ((b + c) - b) * (t / d);
    },
    // Quadratic easing in - accelerating from zero velocity.
    easeIn : function ( t, b, c, d ) {
        return c * (t /= d) * t + b;
    },
    // Quadratic easing out - decelerating to zero velocity
    easeOut : function ( t, b, c, d ) {
        return - c * (t /= d) * (t - 2) + b;
    },
    // Quadratic easing in/out - acceleration until halfway, then deceleration
    easeInOut : function ( t, b, c, d ) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t + b;
        }
        return - c / 2 * ((--t) * (t - 2) - 1) + b;
    },
    // Quadratic easing out/in - decelerate to halfway point, then accelerate to the end
    easeOutIn : function ( t, b, c, d ) {
        if (t < d / 2) {
            return vx.easing.easeOut(t * 2, b, c / 2, d);
        }
        return vx.easing.easeIn((t * 2) - d, b + c / 2, c / 2, d);
    },
    // Cubic easing in - accelerating from zero velocity
    cubicEaseIn : function ( t, b, c, d ) {
        return c * (t /= d) * t * t + b;
    },
    // Cubic easing out - decelerating to zero velocity
    cubicEaseOut : function ( t, b, c, d ) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    },
    // Cubic easing in/out - acceleration until halfway, then deceleration
    cubicEaseInOut : function ( t, b, c, d ) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    },
    // Cubic easing out/in - decelerate to halfway point, then accelerate to the end
    cubicEaseOutIn : function ( t, b, c, d ) {
        if (t < d / 2) {
            return vx.easing.cubicEaseOut(t * 2, b, c / 2, d);
        }
        return vx.easing.cubicEaseIn((t * 2) - d, b + c / 2, c / 2, d);
    },
    // Quartic easing in - accelerating from zero velocity
    quartEaseIn : function ( t, b, c, d ) {
        return c * (t /= d) * t * t * t + b;
    },
    // Quartic easing out - decelerating to zero velocity
    quartEaseOut : function ( t, b, c, d ) {
        return - c * ((t = t / d - 1) * t * t * t - 1) + b;
    },
    // Quartic easing in/out - acceleration until halfway, then deceleration
    quartEaseInOut : function ( t, b, c, d ) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t + b;
        }
        return - c / 2 * ((t -= 2) * t * t * t - 2) + b;
    },
    // Quartic easing out/in - decelerate to halfway point, then accelerate to the end
    quartEaseOutIn : function ( t, b, c, d ) {
        if (t < d / 2) {
            return vx.easing.quartEaseOut(t * 2, b, c / 2, d);
        }
        return vx.easing.quartEaseIn((t * 2) - d, b + c / 2, c / 2, d);
    },
    // Quintic easing in - accelerating from zero velocity
    strongEaseIn : function ( t, b, c, d ) {
        return c * (t /= d) * t * t * t * t + b;
    },
    // Quintic easing out - decelerating to zero velocity
    strongEaseOut : function ( t, b, c, d ) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    },
    // Quintic easing in/out - acceleration until halfway, then deceleration
    strongEaseInOut : function ( t, b, c, d ) {
        if ((t /= d / 2) < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    },
    // Quintic easing out/in - decelerate to halfway point, then accelerate to the end
    strongEaseOutIn : function ( t, b, c, d ) {
        if (t < d / 2) {
            return vx.easing.strongEaseOut(t * 2, b, c / 2, d);
        }
        return vx.easing.strongEaseIn((t * 2) - d, b + c / 2, c / 2, d);
    },
    // Sinusoidal easing in - accelerating from zero velocity
    sineEaseIn : function ( t, b, c, d ) {
        return - c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },
    // Sinusoidal easing out - decelerating to zero velocity
    sineEaseOut : function ( t, b, c, d ) {
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },
    // Sinusoidal easing in/out - accelerating until halfway, then decelerating
    sineEaseInOut : function ( t, b, c, d ) {
        return - c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    },
    // Sinusoidal easing out/in - decelerate to halfway point, then accelerate to the end
    sineEaseOutIn : function ( t, b, c, d ) {
        if (t < d / 2) {
            return vx.easing.sineEaseOut(t * 2, b, c / 2, d);
        }
        return vx.easing.sineEaseIn((t * 2) - d, b + c / 2, c / 2, d);
    },
    // Exponential easing in - accelerating from zero velocity
    expoEaseIn : function ( t, b, c, d ) {
        return (t === 0) ? b: c * Math.pow(2, 10 * (t / d - 1)) + b;
    },
    // Exponential easing out - decelerating to zero velocity
    expoEaseOut : function ( t, b, c, d ) {
        return (t === d) ? b + c: c * ( - Math.pow(2, -10 * t / d) + 1) + b;
    },
    // Exponential easing in/out - accelerating until halfway, then decelerating
    expoEaseInOut : function ( t, b, c, d ) {
        if (t === 0) {
            return b;
        }
        if (t === d) {
            return b + c;
        }
        if ((t /= d / 2) < 1) {
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        }
        return c / 2 * ( - Math.pow(2, -10 * --t) + 2) + b;
    },
    // Exponential easing out/in - decelerate to halfway point, then accelerate to the end
    expoEaseOutIn : function ( t, b, c, d ) {
        if (t < d / 2) {
            return vx.easing.expoEaseOut(t * 2, b, c / 2, d);
        }
        return vx.easing.expoEaseIn((t * 2) - d, b + c / 2, c / 2, d);
    },
    // Circular easing in - accelerating from zero velocity
    circleEaseIn : function ( t, b, c, d ) {
        return - c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    },
    // Circular easing out - decelerating to zero velocity
    circleEaseOut : function ( t, b, c, d ) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    },
    // Circular easing in/out - acceleration until halfway, then deceleration
    circleEaseInOut : function ( t, b, c, d ) {
        if ((t /= d / 2) < 1) {
            return - c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        }
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    },
    // Circular easing out/in - decelerate to halfway point, then accelerate to the end
    circleEaseOutIn : function ( t, b, c, d ) {
        if (t < d / 2) {
            return vx.easing.circleEaseOut(t * 2, b, c / 2, d);
        }
        return vx.easing.circleEaseIn((t * 2) - d, b + c / 2, c / 2, d);
    },
    // Back easing in - backtracking slightly, then reversing direction and moving to target
    // t: current time, b: beginning value, c: change in value, d: duration, s: overshoot amount (optional)
    // t and d can be in frames or seconds/milliseconds
    // s controls the amount of overshoot: higher s means greater overshoot
    // s has a default value of 1.70158, which produces an overshoot of 10 percent
    // s == 0 produces cubic easing with no overshoot
    backEaseIn : function ( t, b, c, d, a, p ) {
        var s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    },
    // Back easing out - moving towards target, overshooting it slightly, then reversing and coming back to target
    backEaseOut : function ( t, b, c, d, a, p ) {
        var s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    },
    // Back easing in/out - backtracking slightly, then reversing direction and moving to target,
    // then overshooting target, reversing, and finally coming back to target
    backEaseInOut : function ( t, b, c, d, a, p ) {
        var s = 1.70158;
        if ((t /= d / 2) < 1) {
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        }
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    },
    // Proceed to halfway point, then bounce off of it, proceeding to the end
    backEaseOutIn : function ( t, b, c, d, s ) {
        if (!s) {
            var s = 1.70158;
        }
        if (t < d / 2) {
            return vx.easing.backEaseOut(t * 2, b, c / 2, d, s);
        }
        return vx.easing.backEaseIn((t * 2) - d, b + c / 2, c / 2, d, s);
    },
    // Exponentially decaying sine wave
    elasticEaseIn: function ( t, b, c, d, a, p ) {
        var s = undefined;
        if (t == 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return - (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },
    // Exponentially decaying sine wave
    elasticEaseOut : function ( t, b, c, d, a, p ) {
        var s = undefined;
        if (t === 0) {
            return b;
        }
        if ((t /= d) === 1) {
            return b + c;
        }
        if (!p) {
            p = d * 0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    },
    // Exponentially decaying sine wave in/out
    elasticEaseInOut : function ( t, b, c, d, a, p ) {
        var s = undefined;
        if (t === 0) {
            return b;
        }
        if ((t /= d / 2) === 2) {
            return b + c;
        }
        if (!p) {
            p = d * ((0.3) * (1.5));
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1) {
            return - 0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        }
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
    },
    // Exponentially decaying sine wave out/in
    elasticEaseOutIn : function ( t, b, c, d, a, p ) {
        if (t < d / 2) {
            return vx.easing.elasticEaseOut(t * 2, b, c / 2, d, a, p);
        }
        return vx.easing.elasticEaseIn((t * 2) - d, b + c / 2, c / 2, d, a, p);
    },
    // Bouncing off of base slightly before proceeding to target
    bounceEaseIn : function ( t, b, c, d ) {
        return c - vx.easing.bounceEaseOut(d - t, 0, c, d) + b;
    },
    // Upon reaching target, bouncing off slightly
    bounceEaseOut : function ( t, b, c, d ) {
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        } else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        } else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        } else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        }
    },
    // Bouncing off of base slightly before proceeding to target, where it bounces again
    bounceEaseInOut : function ( t, b, c, d ) {
        if (t < d / 2) {
            return vx.easing.bounceEaseIn(t * 2, 0, c, d) * 0.5 + b;
        } else {
            return vx.easing.bounceEaseOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
        }
    },
    // Proceeds to halfway mark, where it bounces slightly before proceeding to target
    bounceEaseOutIn : function ( t, b, c, d ) {
        if (t < d / 2) {
            return vx.easing.bounceEaseOut(t * 2, b, c / 2, d);
        }
        return vx.easing.bounceEaseIn((t * 2) - d, b + c / 2, c / 2, d);
    },
    // Creates a back and forth animation
    backAndForth : function ( t, b, c, d ) {
        t = t / d;
        var end = b + c;
        return (1 - t) * (1 - t) * b + 2 * t * (1 - t) * (end + c) + t * t * b;
    }
};
vx.easing.array = [ "linear", "easeIn", "easeOut", "easeInOut", "easeOutIn", "cubicEaseIn", "cubicEaseOut", "cubicEaseInOut", "cubicEaseOutIn", "quartEaseIn", "quartEaseOut", "quartEaseInOut", "quartEaseOutIn", "strongEaseIn", "strongEaseOut", "strongEaseInOut", "strongEaseOutIn", "sineEaseIn", "sineEaseOut", "sineEaseInOut", "sineEaseOutIn", "expoEaseIn", "expoEaseOut", "expoEaseInOut", "expoEaseOutIn", "circleEaseIn", "circleEaseOut", "circleEaseInOut", "circleEaseOutIn", "backEaseIn", "backEaseOut", "backEaseInOut", "backEaseOutIn", "elasticEaseIn", "elasticEaseOut", "elasticEaseInOut", "elasticEaseOutIn", "bounceEaseIn", "bounceEaseOut", "bounceEaseInOut", "bounceEaseOutIn", "backAndForth" ];

vx.slide = function(elem, opts) {
	/*
		{
			direction: ( "down", "up", "left", "right" ),
			amount: ( "full", length identifier ),
			speed: ( "fast", "medium", "slow", milliseconds ("m") || seconds ("s"),
			opacity: ( "full", "medium", "light", percentage (0% - 100%)
		}
	*/
};
vx.blind = function(elem, opts) {
	/*
		{
			direction: ( "down", "up", "left", "right" ),
			amount: ( "full", length identifier ),
			speed: ( "fast", "medium", "slow", milliseconds ("m") || seconds ("s"),
			opacity: ( "full", "medium", "light", percentage (0% - 100%)
		}
	*/
		elem.style.position = "relative";
		 //console.log("Process started");
		for (prop in opts) {
			//console.log(prop + ": " + opts[prop]);
			if ( opts[prop] === "down") {
				
			}
		}
};
vx.shake = function(elem, opts) {
	/*
		{
			direction: ( "vertical", "horizontal" ),
			amount: ( "strong", "medium", "light", length identifier ),
			speed: ( "fast", "medium", "slow", length identifier )
		}
	*/
};
vx.fade = function(elem, opts) {
	/*
		{
			speed: ( "fast", "medium", "slow", length identifier ),
			amount: ( "transparent", "opaque", length identifier )
		}
	*/
	var speed, amount;
	for (prop in opts) {
		if (prop === "speed") {
			if (opts[prop].speed === "fast") {
				speed = 200;
			} else if (opts[prop].speed === "medium") {
				speed = 500;
			} else if (opts[prop].speed === "slow") {
				speed = 1000;
			} else {
				speed = opts[prop].speed;
			}
		}
	}
};
vx.bounce = function(elem, opts) {
	/* 
		{
			direction: ( "down", "up", "left", "right" ),
			bounces: ( default (3), length identifier ),
			bounceback: ( default, length identifier ),
			speed: ( "transparent", "opaque", length identifier )
		}
	*/

};
vx.flash = function(elem, opts) {
	/*
		{
			number: ( default (3), length identifier ),
			speed: ( "transparent", "opaque", length identifier ),
			opacity: ( "full", "medium", "light", percentage (0% - 100%)
		}
	*/
};

vx.first = function ( elem ) {
    // Get the first child.
	elem = elem.firstChild;
    // Check the node type. If it is 3 (a text node), check to see
	// if it contains anything other than \S (white space).
	// If it is a text node with only white space, ignore it
	// and get the next element.
	return elem && (elem.nodeType == 3 && !/\S/.test(elem.nodeValue)) ?
		this.next(elem) : elem;
};
vx.parent = function ( elem ) {
	return elem.parentNode;
};