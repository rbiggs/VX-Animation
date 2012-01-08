//////////////////////////////////////////////////////////
//
//  Object for providing smooth scrolling to the target element.
//  Its methods can be used to automatically implement smooth
//  scrolling for internal anchors, or to implement smooth
//  scrolling from one element to another on the same page.
//
//////////////////////////////////////////////////////////
 vx.Scroll = {
   setupAnchors : function() {
   	// Get all links.
	   var links = vx.$("a");
	   var len = links.length;
	   for (var i = 0; i < len; i++) {
		 var L = links[i];
		 // If the link is internal (begins with #) then
		 // bind an "onclick" handler for scrollSmoothly to it.
		 if ((L.href && L.href.indexOf("#") != -1) && ( (L.pathname == location.pathname) || ("/" + L.pathname == location.pathname) ) && (L.search == location.search)) {
		     vx.bind(L, "click", vx.Scroll.scrollSmoothly);
		  }
	   }
   },
   //////////////////////////////////////////////////////////
   //
   //  Method to scroll smoothly to anchors on the page.
   //  This method is employed by vx.Scroll.setupAnchors to
   //  provide smooth scrolling to the anchor destination.
   //  It determines which link was clicked, determines its vertical
   //  scroll position on the page as well as the vertical scroll
   //  position of its destination anchor. It then invokes the 
   //  vx.Scroll.scrollWindow method in a timer to create a smooth scroll. 
   //
   //////////////////////////////////////////////////////////
   scrollSmoothly : function(e, steps) {
	  	if (!steps) {
			steps = 25;
	  	} else {
			var steps = steps;
	  	}
	  	function getTarget() {
		 	// Get the clicked  element.
		 	if (window.event) {
		   	target = window.event.srcElement;
		 	} else if (e) {
		   	target = e.target;
		 	} else return;
		 	// Make sure that the target is the anchor, not its text node.
		 	if (target.nodeName.toLowerCase() != "a") {
		   	target = target.parentNode;
		 	}	
		 	return target;
	  	}
	  	getTarget();
	  	// Make sure this is an anchor (a) tag
	  	if (target.nodeName.toLowerCase() != "a") {
	  		return false;
 	  	}
	  	// Find the anchor tag corresponding to this href.
	  	// First strip off the hash mark.
	  	var anchor = target.hash.substr(1);
	  	// Now loop through all "a" tags until we find one with that name.
	  	var links = vx.$("a");
	  	var dest = null;
	  	for (var i = 0; i < links.length; i++) {
		 	var L = links[i];
		 	if (L.name && (L.name == anchor)) {
				dest = L;
				break;
		 	}
	  	}
	  	// If we didn't find a destination, let the browser do its default action.
	  	if (!dest) { 
	  		return true; 
	  	}
	  	var destX = vx.left(dest);
	  	var destY = vx.top(dest);
	  	// Stop any current scrolling.
	  	clearInterval(vx.Scroll.scrollSmoothly.interval);
	  	currYPos = vx.Scroll.getCurrentYPos();
	  	stepSize = parseInt((destY - currYPos) / steps);
	  	vx.Scroll.scrollSmoothly.interval = setInterval('vx.Scroll.scrollWindow(' + stepSize + ',' + destY + ',"' + anchor + '")', 10);
		vx.stopDefault(e);
   },
   //////////////////////////////////////////////////////////
   //
   //  Method to calculate the amount to scroll the window
   //  in order to create a smooth transition from one
   //  location to another.
   //
   //////////////////////////////////////////////////////////
   scrollWindow : function(scrollAmount, dest, anchor) {
	  oldYPos = vx.Scroll.getCurrentYPos();
	  isAbove = (oldYPos < dest);
	  window.scrollTo(0, oldYPos + scrollAmount);
	  isCurrYPos = vx.Scroll.getCurrentYPos();
	  isAboveNow = (isCurrYPos < dest);
	  if ((isAbove != isAboveNow) || (oldYPos == isCurrYPos)) {
		// If we've scrolled past the destination, or
		// we haven't moved from the last scrollSmoothly (i.e., we're at the
		// bottom of the page) then scrollSmoothly exactly to the link.
		window.scrollTo(0, dest);
		// Cancel the timer.
		clearInterval(vx.Scroll.scrollSmoothly.interval);
		// Jump to the link so that the URL is correct.
		location.hash = anchor;
	  }
   },
   //////////////////////////////////////////////////////////
   //
   //  Method to find the current vertical position of the screen.
   //  This is used to help determine how much the screen has been
   //  scrolled.
   //
   //////////////////////////////////////////////////////////
   getCurrentYPos : function() {
   	var db = document.body;
   	var dd = document.documentElement;
		if (db && db.scrollTop) {
		  return db.scrollTop;
		}
		if (dd && dd.scrollTop) {
		  return dd.scrollTop;
		}
		if (window.pageYOffset) {
		  return window.pageYOffset;
		}
		return 0;
	},
	//////////////////////////////////////////////////////////
	//
	//  Method to provide smooth scroll to the target element.
	//  elem: the element to scroll to. Supplied as a quoted selector.
	//  speed: the number of milliseconds in a loop.
	//  scrollY: the number of pixels to scroll per loop.
	//  Example usage:
	//  vx.Scroll.scrollSmoothlyTo(vx.$("#divContent", 30, 80);
	//
	//////////////////////////////////////////////////////////
	scrollSmoothlyTo : function (elem, speed, scrollY) {
		if (!speed) {
			var speed = 80;
		}
		if (!scrollY) {
			var scrollY = 50;
		}
		// Check if the element's position is above or below the browser's scrollTop.
		var yPos = vx.Scroll.getCurrentYPos();
		if(vx.$(elem).offsetTop < yPos) {
			window.scrollBy(0, -scrollY);
		} else {
			window.scrollBy(0, scrollY);
		}
		// Scroll to the element.
		if(yPos != vx.$(elem).offsetTop) {
			if (yPos == vx.pageHeight() - vx.viewportHeight()) { return false; }
			var scroller = setTimeout('vx.Scroll.scrollSmoothlyTo(\'' + elem + "\'," + speed + "," + scrollY +')');
			return false;
		} else {
			// Stop the scroll and set the element's final position.
			document.body.scrollTop = vx.$(elem).offsetTop;
			clearTimeout(scroller);
			return false;
		}
	}
};