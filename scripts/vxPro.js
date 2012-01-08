//////////////////////////////////////////////////////////////
//
//  VX JavaScript Framework
//  Robert Biggs: www.vertigo.com
//  2007
//  BSD License
//
//  First we need to initialize an object.
//  We'll check to see if it's already initialized or not.
//  We're going to use the name ogitrev, which is vertigo backwards.
//  That's our company's logo, by the way.
//
//////////////////////////////////////////////////////////////
if ( typeof ogitrev === "undefined" ) {

   ///////////////////////////////////////////////////////////
   //
   //  Initialize ogitrev object.
   //
   ///////////////////////////////////////////////////////////
    var ogitrev = new Function();
    // Extend the ogitrev object through its prototype.
    ogitrev.prototype = {
      // Version number:
      version : "1.1",
  	  // Setup initial array to hold scripts for registering.
      /*scripts : [],*/

      //////////////////////////////////////////////////////////
      //
      //  Method to return an element by id, class, attribute,
      //  attribute value or tag. This method takes a primary
      //  argument representing the node or nodes to find.
      //  This may be an id, class, attribute, attribute/value pair
      //  or tag. All strings must be quoted. To indicate the various
      //  possible selectors, the method uses CSS-like markers. To get 
      //  an id, prepend the string with "#": vx.$("#myId"). To get a 
      //  class collection, prepend the string with ".": vx.$(".myClass").
      //  To get an attribute, prepend the string with "@":
      //  vx.$("@someAttribute"). To get an attribute/value pair, prepend
      //  the string with "@", followed by the = operator and a quoted
      //  value: vx.$("@class='menuItem selected'"). Using quote arround
      //  the attribute value allows you to pass in complex values,
      //  such as: vx.$("@style='font: bold, 24px/36px Calibri, Myriad, Arial'").
      //  This would get all elements with that exact inline style.
      //  Note that in such instances it is the users duty to insure that
      //  the word order of the values will match the target element.
      //  This method does not parse attribute values to check against
      //  possible matches.
      //
      //  The method can take a second, optional argument for context.
      //  Context can be any of the following:
      //  The symbol of an id:
      //     var el = vx.$("#main");
      //     var tags = vx.$("p", el);
      //  The symbol of any member of a collection.
      //     var divs = vx.$("div");
      //     var paras = vx.$("p" divs[2]);
      //  The $ function as an argument:
      //     var tags = vx.$("p", vx.$("div");
      //     var paras = vx.$("p", vx.$("#main"));
      //  A tag:
      //     var tags = vx.$("p", "div");
      //
      //////////////////////////////////////////////////////////
      $ : function ( value, context ) {
         var value = value;    

		 // First check to see if the browser supports the querySelector
		 // method. If it does, we'll use that since it's very fast.
		 if(document.querySelectorAll){
		 	if (context) {
         		var context = context;
		 	}
			if (!context) {
				var collection = document.querySelectorAll(value);
				if (collection.length == 1) {
					return collection[0];
				} else {
					return collection;
				}
			} else {
				var c = document.querySelectorAll(content);
				if  (c.length == 1) {
					return c[0];
				} else {
					return c;
				}
			}
			
		} else {
         //////////////////////////////////////////////////////////
         //
         //  Private method used by $ method to get the provided
         //  context for the element retrieval. getContext can accept 
         //  the following data types: the symbol of an id or any single 
         //  member of an array or object or an array, a string representing 
         //  a tag, or an object literal. It can also accept the $ method 
         //  itself as an argument for context. getContext always returns
         //  a collection of child nodes of the argument supplied. It does
         //  not return all descendant nodes, only the immediate children.
         //
         //////////////////////////////////////////////////////////
         getContext = function ( context ) {
         
            // If no context is supplied, get a collection of all
            // document nodes.
            if (!context) {
               return document.getElementsByTagName("*");
            // Otherwise, check to see if the argument represents
            // an html element. This could be a symbol of an id,
            // or a member of an array or object representing a
            // single element. The method uses this as the base
            // for finding all child nodes.
            } else if (context.nodeType == 1) {
               return context.getElementsByTagName("*");
            // If the argument is a string, consider it a tag.
            // Return all nodes of that tag.
            } else if (typeof context == "string") {
               return document.getElementsByTagName(context);
            // Check to see if the argument is an object. This is a 
            // peculiar "bug" that cropped up. Somehow it converts arrays
            // into objects, so I need to use object iteration instead of
            // array methods.
            } else if (context.constructor.toString().indexOf("Object") != -1) {
               var len = context.length;
               var elems = [];
               for (var i = 0; i < len; i++) {
                  elems.push(context[i]);
               }
            }
            return elems;
         };        
         // Create a RegEx to check for the id marker: "#".
         var idCheck = new RegExp("^#");
         // Create a RegEx to check for the class marker: ".".
         var classCheck = new RegExp("^\\.");
         // Create a RegEx to check for the attribute/value marker: "@ + =".
         var valueCheck = new RegExp("^@.*=");
         // Create a RegEx to check for the attribute marker: "@".
         var attrCheck = new RegExp("^@.*[^=]");
         
         // Check the entered string to see if it begins with "#".
         if (idCheck.test(value)) {
            // Remove "#" from id value.
            value = value.substring(1, value.length);
            // Return the node.
            return document.getElementById(value);
         // Check the entered string to see if it begins with ".".
          } else if (classCheck.test(value)) {
            // If the browser does not support native getElementsByClassName,
            // execute the following code.
            if (!document.getElementsByClassName) {
               // Remove "." from class value.
               var value = value.substring(1, value.length);
               // Create a regular expression to check against.
               var classRegExp = new RegExp("(^|\\s)" + value + "(\\s|$)");
               // Create a temporary array to store elements collected.
               var results = [];
               // Get the context, if any.
               var elems = getContext(context);
               var len = elems.length;
               for (var i = 0; i < len; i++) {
                  // Test if the elements contain the class name.
                  if (classRegExp.test(elems[i].className)) {
                     // If they do, save them in the array.
                     results.push(elems[i]);
                  }
               }
               // Return the result.
               return results;
            // If the browser supports native getElementsByClassName,
            // execute this code.
            } else {
               var value = value.substring(1, value.length);
               return document.getElementsByClassName(value);
            }
         } else if (valueCheck.test(value)) {
            // Need to split attribute/values into two.
            // Find attribute first, then match value.
            var str = value.split("=");
            // Save the attribute name.
            var attr = str[0].substring(1, str[0].length);
            // Save the attribute value.
            var val = str[1].substring(1, str[1].length -1);
            // Get the context, if any.
            var elems = getContext(context);
            // Set name to className if IE Windows
            if (name == "class" && (this.browser == "IE" && this.os == "Windows")) {
               val = "className";
            }
            // Set name to HTHMLFor if IE Windows.
            if (attr == "for" && (this.browser == "IE" && this.os == "Windows")) {
               val = "htmlFor";
            }
            // Create a temporary array to store the results.
            var results = [];
            var len = elems.length;
            // Cycle through the attributes and test for the value.
            for (var i = 0; i < len; i++) {
               if (elems[i].getAttribute(attr) == val) {
                  // Store the results.
                  results.push(elems[i]);
               }
            }          
            // Return the results.
            return results;
         // Check for just an attribute name.
         } else if (attrCheck.test(value)) {
            // Remove the "@" from the attribute name.
            var attr = value.substring(1, value.length);
            // Create a temporary array to store the results.
            var results = [];
            // Get the context, if any.
            var elems = getContext(context);
            // Check attribute of type class.
            if (value == "class") {
               var len = elems.length;
               for (var i = 0; i < len; i++) {
                  if (elems[i].className) {
                     // If any of the elements have the class attribute,
                     // store the results in the array.
                     results.push(elems[i]);
                  }
               }
               // Return the results.
               return results; 
            // If attribute is of type "for" and browser is IE Win,
            } else if (value == "for" && (this.browser=="IE" && this.os=="Windows")) {
               // Set name to HTHMLFor.
               var value = "htmlFor";
               var len = elems.length;
               for (var i = 0; i < len; i++) {
                  if (elems[i].className) {
                     // If any of the elements have the for attribute,
                     // store the results in the array.
                     results.push(elems[i]);
                  }
               }
               // Return the results.
               return results; 
            } else { 
               // Otherwise, just return the sought for attribute.
               var len = elems.length;
               for (var i = 0; i < len; i++) {
                  if (elems[i].getAttribute(attr)) {
                     results.push(elems[i]);
                  }
               } 
            }
            // Return results of search.
            return results;
         } else {
            // Otherwise treat the string as a tag.
            if (!context) {
               // If no context was supplied, get a collection
               // of all instances of the supplied tag.
               return document.getElementsByTagName(value);
            // If the supplied argument represents a singular DOM node,
            // return it.
            } else if (context.nodeType == 1) {
               return context.getElementsByTagName(value);
            // If the context is a string, treat it as a tag.
            } else if (typeof context == "string") {
               // Get context as a collection of those tags.
               var elems = getContext(context);
               // Create an array to store the results.
               var results = [];
               var len = elems.length;
               // Cycle through the returned nodes to see if they
               // match the sought for tag.
               for (var i = 0; i < len; i++) {
                  var tar = elems[i].getElementsByTagName(value);
                  var l = tar.length;
                  for (var j = 0; j < l; j++) {
                     results.push(tar[j]);
                  }
               }
            // Check to see if the result returned is an object.
            } else if (context.constructor.toString().indexOf("Object") != -1) {
               var c = context;
               var results = [];
               var len = c.length;
               // Iterate over the object and find the nodes
               // descended from the context nodes.
               for (var i = 0; i < len; i++) {
                  var tar = c[i].getElementsByTagName(value);
                  var l = tar.length;
                  for (var j = 0; j < l; j++) {
                     results.push(tar[j]);
                  }
               }
            }
            // Return the results.
            return results;
         }
		}
      },
      //////////////////////////////////////////////////////////
      //
      //  Find the previous sibling of an element.
      //
      //////////////////////////////////////////////////////////
      prev : function ( elem ) {
         do {
            // Get the previous sibling.
            elem = elem.previousSibling;
         // Check the node type. If it is 3 (a text node), check to see
         // if it contains anything other than \S (white space).
         // If it is a text node with only white space, ignore it.
         } while (elem && (elem.nodeType == 3 && !/\S/.test(elem.nodeValue)));
         return elem;
      },
      //////////////////////////////////////////////////////////
      //
      //  Find the next sibling of an element
      //
      //////////////////////////////////////////////////////////
      next : function ( elem ) {
         do {
            // Get the next sibling.
            elem = elem.nextSibling;
         // Check the node type. If it is 3 (a text node), check to see
         // if it contains anything other than \S (white space).
         // If it is a text node with only white space, ignore it.
         } while (elem && (elem.nodeType == 3 && !/\S/.test(elem.nodeValue)));
         return elem;
      },
      //////////////////////////////////////////////////////////
      //
      //  Get the first child of an element.
      //
      //////////////////////////////////////////////////////////
      first : function ( elem ) {
         // Get the first child.
         elem = elem.firstChild;
         // Check the node type. If it is 3 (a text node), check to see
         // if it contains anything other than \S (white space).
         // If it is a text node with only white space, ignore it
         // and get the next element.
         return elem && (elem.nodeType == 3 && !/\S/.test(elem.nodeValue)) ?
            this.next(elem) : elem;
      },
      //////////////////////////////////////////////////////////
      //
      //  Get the last child of an element.
      //
      //////////////////////////////////////////////////////////
      last : function ( elem ) {
         // Get the last child.
         elem = elem.lastChild;
         // Check the node type. If it is 3 (a text node), check to see
         // if it contains anything other than \S (white space).
         // If it is a text node with only white space, ignore it
         // and get the previous element.
         return (elem.nodeType == 3 && !/\S/.test(elem.nodeValue)) ?
            this.prev( elem ) : elem;
      },
      //////////////////////////////////////////////////////////
      //
      //  Get all children of an element.
      //  Although we can find out how many child nodes an
      //  element has, the result may contain empty text nodes.
      //  ELem is a reference to an element of type id, class or tag.
      //
      //////////////////////////////////////////////////////////
      children : function ( elem ) {
         theChildren = new Array();
         // Get all the element's child nodes.
         var tempNodes = elem.childNodes;
         // Cycle through the results.
         var len = tempNodes.length;
         for (var i = 0; i < len; i++) {
            // If a node is not empty,
            if (tempNodes[i].nodeType == 1 || (tempNodes[i].nodeType == 3 && !/\S/.test(elem.nodeValue))) {
               // put it in the theChildren array.
               theChildren.push(tempNodes[i]);
            }
         }
         return theChildren;
      },
	  //////////////////////////////////////////////////////////
	  //
      //  Get the parent of an element.
      //
      //////////////////////////////////////////////////////////
      parent : function ( elem ) {
         return elem.parentNode;
      },
      //////////////////////////////////////////////////////////
      //
      //  Get the ancestor of an element.
      //  If no number is supplied, it returns
      //  the immediate parent node.
      //  Otherwise it climbs up the DOM tree
      //  to the nth parent node.
      //
      //////////////////////////////////////////////////////////
      ancestor : function ( elem, num ) {
         num = num || 1;
         for (var i = 0; i < num; i++) {
            if (elem != null) {
               elem = elem.parentNode;
            }
         }
         return elem;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to get the text of a node. Since text
      //  can consist of various fragments, this cycles
      //  through all found fragments and retrieves
      //  their text node values as one continuous string.
      //
      //////////////////////////////////////////////////////////
      text : function ( elem ) {
         var t = "";
         // If an element was passed, get it's children,
         // otherwise assume it's an array
         elem = elem.childNodes || elem;
         // Look through all child nodes
         for ( var i = 0; i < elem.length; i++ ) {
            // If it's not an element, append its text value
            // Otherwise, recurse through all the element's children.
            t += elem[i].nodeType != 1 ?
               elem[i].nodeValue : this.text(elem[i].childNodes);
         }
         // Return the matched text
         return t;
      },
      //////////////////////////////////////////////////////////
      //
      //  Determine if an elemement has a particular attribute.
      //  Returns true is successful, otherwise false.
      //
      //////////////////////////////////////////////////////////
      hasAttr : function ( elem, name ) {
         // Add in conditional checking for alternate names used by IE.
         // If the attribute is of type "class", check for className.
         if (name == "class" && (this.browser == "IE" && this.os == "Windows")) {
            if (elem.getAttribute("className")) {
               return true;
            }
         // If the attribute is of type "for", check for htmlFor.
         } else if (name == "for" && (this.browser == "IE" && this.os == "Windows")) {
            if (elem.getAttribute("htmlFor")) {
               return true;
            }
         // Otherwise return the result of attribute check.
         } else {
            if (elem.getAttribute(name)) {
               return true;
            }
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Since browsers use different naming schemes for some attribute names,
      //  I've created a cross-browser method for getting attribute values.
      //  Please note that browsers also have a different way of handling
      //  the style attribute. I therefore have updated this method to handle
      //  the style attribute with a special method: getStyle().
      //
      //////////////////////////////////////////////////////////
      getAttr : function ( elem, name ) {
         // Check for attribute of type "class".
         // If the browser is IE on Windows, use "className" instead.
         if (name == "class" && (this.browser == "IE" && this.os == "Windows")) {
            return elem.getAttribute("className");
         // Check for the attribute of type "for".
         // If the browser is IE on Windows, use "htmlFor" instead.
         } else if (name == "for" && (this.browser == "IE" && this.os == "Windows")) {
            return elem.getAttribute("htmlFor");
         // If trying to access the style attribute, use the getStyle method.
         } else if (name == "style") {
            return this.getStyle(elem, name);
         // Otherwise, use normal way to getting an attribute.
         } else {
            return elem.getAttribute(name);
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Since browsers use different naming schemes for some attribute names,
      //  I've create a cross-browser method for setting attribute values.
      //  Please note that browsers also have a different way of handling
      //  the style attribute. I therefore have updated this method to handle
      //  the style attribute with a special method: setStyle().
      //
      //////////////////////////////////////////////////////////
      setAttr : function ( elem, name, value ) {
         // Check for attribute of type "class".
         // If the browser is IE on Windows, use "className" instead.
         if (name == "class" && (this.browser == "IE" && this.os == "Windows")) {
            return elem.setAttribute("className", value);
         // Check for the attribute of type "for".
         // If the browser is IE on Windows, use "htmlFor" instead.
         } else if (name == "for" && (this.browser == "IE" && this.os == "Windows")) {
            return elem.setAttribute("htmlFor", value);
         // If trying to access the style attribute, use the setStyle method.
         } else if (name == "style") {
            this.setStyle(elem, value);
         // Otherwise, use normal way to set an attribute.
         } else {
            return elem.setAttribute(name, value);
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  This method removes the attribute from the target element.
      //  It works with browser differences for attribute names as well.      
      //
      //////////////////////////////////////////////////////////
      removeAttr : function ( elem, name ) {
         // Check for attribute of type "class".
         // If the browser is IE on Windows, use "className" instead.
         if (name == "class" && (this.browser == "IE" && this.os == "Windows")) {
            return elem.removeAttribute("className");
         // Check for the attribute of type "for".
         // If the browser is IE on Windows, use "htmlFor" instead.
         } else if (name == "for" && (this.browser == "IE" && this.os == "Windows")) {
            return elem.removeAttribute("htmlFor");
         // Otherwise, use normal way to getting an attribute.
         } else {
            elem.removeAttribute(name);
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Add a class to an element.
      //
      //////////////////////////////////////////////////////////
      addClass : function ( elem, name ) {
         // Use regular expression to check for the class.
         // Since a class could be either single or in combination
         // with other class names, we use ^,$ to check for the
         // end of the expression and also \s for whitespace.
         var nameCheck = new RegExp("(^|\\s)" + name + "(\\s|$)");
         // Test to see if the elem already has the class.
         if (!nameCheck.test(elem.className)) {
            // If the element has no class at all,
            // add a class attribute with the class name.
            if (elem.className == "") {
               elem.className = name;
            } else {
               // Otherwise, add a space after the existing
               // class name and then the new class.
               elem.className += " " + name;
            }
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Remove a class from an element.
      //
      //////////////////////////////////////////////////////////
      removeClass : function ( elem, name ) {
         // Create a temporary holder for the element's
         // existing class value.
         var modifiedClass = elem.className;
         // Use regular expression to check for the class.
         // Since a class could be either single or in combination
         // with other class names, we use ^,$ to check for the
         // end of the expression and also \s for whitespace.
         var nameCheck = new RegExp("(^|\\s)" + name + "(\\s|$)");
         // Remove the class name.
         modifiedClass = modifiedClass.replace(nameCheck, "");
         // Remove any left over whitespace.
         // modifiedClass = modifiedClass.replace(/\\s$/, "");
         // Set the element's class name to the new one.
         elem.className = modifiedClass;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to toggle classes. This can be done in two ways.
      //  You can supply two arguments: elem and oldClass.
      //  This lets you add and remove the supplied class name.
      //  Or you can supply three arguments: elem, oldClass and newClass.
      //  This will toggle between the two supplied classes.
      //  If the one of the two classes is alread there,
      //  the toggle will begin from there, otherwise it will
      //  add the second parameter oldClass to the element.
      //
      //////////////////////////////////////////////////////////
      toggleClass : function ( elem, oldClass, newClass ) {
         // Regular expressions to identify class names.
         var oldClassCheck = new RegExp("(^|\\s)" + oldClass + "(\\s|$)");
         var newClassCheck = new RegExp("(^|\\s)" + newClass + "(\\s|$)");
         // No class name was supplied, so exit.
         if (!oldClass) {
            return false;
         }
         // If only one class was supplied,
         if (!newClass) {
            // if the element does not yet have it,
            if (!oldClassCheck.test(elem.className)) {
               // add it to the element.
               this.addClass(elem, oldClass);
            } else {
               // Otherwise, if the element does have
               // the class already, remove it.
               this.removeClass(elem, oldClass);
            }
         // If a second class was supplied,
         } else if (newClass) {
            // check to see if the element already has it.
            if (!newClassCheck.test(elem.className)) {
               // If it does not, remove remove the first class.
               this.removeClass(elem, oldClass);
               // Then add the second class.
               this.addClass(elem, newClass);
            // Otherwise, if the second class is found,
            } else {
               // remove it and add the first class.
               this.removeClass(elem, newClass);
               this.addClass(elem, oldClass);
            }
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to create DOM nodes from a string of HTML.
      //  This uses innerHTML to create true DOM nodes from the text.
      //  Then it copies those nodes out so you can use
      //  normal DOM methods to insert the result in a document.
      //  For string that represent multiple nodes, this method
      //  returns an array, so you must iterate over the array
      //  to inject the indeces into the document.
      //
      //////////////////////////////////////////////////////////
      make : function ( string ) {
         // Initialize array to hold DOMified child nodes.
         var nodes = [];
         // Create a temporary node to receive the text to convert.
         var temp = document.createElement("div");
         // Inject the string into the temporary node.
         temp.innerHTML = string;
         // Extract the DOM nodes out of the temporary node
         // into the nodes array.
         var len = temp.childNodes.length;
         for (var i = 0; i < len; i++) {
            nodes[i] = temp.childNodes[i];
         }
         // Return the array of nodes.
         return nodes;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to make a clone of the target element.
      //  By default it clones the target node and all of its
      //  descendants. If an optional argument of true is passed,
      //  it will do the same. However, if a value of false is passed,
      //  it will only clone the target element, not its descendants.
      //
      //////////////////////////////////////////////////////////
      clone : function ( elem, value ) {
         if (value == true || !value) {
            return elem.cloneNode(true);
         } else {
            return elem.cloneNode(false);
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to wrap the target element with a node defined
      //  by the supplied string. First a clone of the target element
      //  is created. Then the string is converted to a true node.
      //  The clone is inserted into this node. This is then inserted 
      //  before the actual target in the document, afterwhich the
      //  target element is deleted.
      //
      //////////////////////////////////////////////////////////
      wrap : function ( elem, string ) {
         var tempNode = this.make(string);
         tempNode = tempNode[0];
         var whichClone = this.clone(elem);
         tempNode.appendChild(whichClone);
         this.after(tempNode, elem);
         this.remove(elem); 
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to unwrap a node by removing its parent node.
      //  This method is for removing any wrapper node added
      //  programmatically as for animation, etc., or just to
      //  rid a target node of its parent.
      //
      //////////////////////////////////////////////////////////
      unwrap : function ( elem ) {
         // This method will also remove the body tag if that is the
         // only parent node the target element has. This will leave
         // the target element as the next sibling of the head tag,
         // probably not what you would want. To prevent deletion
         // of the body tag when the target element has no other
         // parent, we check to see if the parent is the body tag.
         // If so, we do nothing.
         if (elem.parentNode.nodeName == "BODY") {
            return false;
         }
         var p = this.clone(elem, true);
         this.replace(p, elem.parentNode);
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to insert an element before another.
      //  This takes two arguments: the element to insert (elem),
      //  and the element before which to insert (targetElem).
      //  Since JavaScript is clumsy in how it does this, requiring
      //  references to parent nodes and siblings, I've written
      //  this method to make it easier. The first argument
      //  an array of DOM nodes. The second argument is the target
      //  element before which you wish to insert.
      //
      //////////////////////////////////////////////////////////
      before : function ( elem, targetElem ) {
         // Check to see if elem is an array.
         if (elem.constructor == Array) {
            var len = elem.length;
            // Iterate over the array and insert its contents
            // before the target element.
            for (var i = 0; i < len; i++) {
               targetElem.parentNode.insertBefore(elem[i], targetElem);
            }
         // If this is not an array but a reference to a DOM element,
         // we'll use the normal method on it.
         } else {
            targetElem.parentNode.insertBefore(elem, targetElem);
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to insert an element after another.
      //  This takes two argument: the element to insert (elem),
      //  and the element after which to insert (targetElem).
      //  Since JavaScript is clumsy in how it does this, requiring
      //  references to parent nodes and siblings, I've written
      //  this method to make it easier. The first argument
      //  can be either a reference to a DOM element, or
      //  an array of DOM nodes. The second argument is the target
      //  element after which you wish to insert.
      //////////////////////////////////////////////////////////
      after : function ( elem, targetElem ) {
            // Find the parent of the node after which
            // we will insert our nodes.
            var parent = targetElem.parentNode;
         // Check to see if elem is an array.
         if (elem.constructor == Array) {
            // Find the parent of the node after which
            // we will insert our nodes.
            var len = elem.length;
            for (var i = 0; i < len; i++) {
            // If the element after which we are inserting
            // is the last child of its parent, we'll use
            // the append method on the element's parent.
            if (targetElem == parent.lastChild) {
               parent.appendChild(elem[i]);
            // Otherwise we'll insert it before the element.
            } else {
               parent.insertBefore(elem[i],targetElem.nextSibling);
            }
         }
         // If this is not an array but a reference to a DOM element,
         // we'll use normal methods on it.
         } else {
            // If the element which we are inserting
            // is the last child of its parent, we'll use
            // the append method on the element's parent.
            if (elem == targetElem.lastChild) {
               parent.appendChild(elem);
            // Otherwise we'll insert it before the element.
            } else {
               parent.insertBefore(elem,targetElem.nextSibling);
            }
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to insert a node at a specific position in
      //  the hierarchy of a parent node's child node collection.
      //  This takes three arguments: the element to insert,
      //  the target element, and the position (an integer) as the
      //  nth child of that parent element to insert the node at.
      //  If the position is greater than the number of child nodes,
      //  the element will be inserted as the last child. That means
      //  that if there are only 4 child nodes and you designate
      //  a position of 10, the element will be inserted as the last
      //  child at position 5.
      //
      //////////////////////////////////////////////////////////
      insert : function ( elem, targetElem, position ) {
         // Check to make sure that the child nodes do not
         // contain empty text nodes.
         var kids = this.children(targetElem);
         if (!position) {
            try {
               targetElem.appendChild(elem);
            }
            catch (e) {
            }
         }
         // If the position is one, insert the element
         // as the first child of the target element.
         if (position == 1) {
            try {
               targetElem.insertBefore(elem, targetElem.firstChild);
            }
            catch (e) {
            }
         // If the position supplied is greater than the target
         // element's actual number of children, append the
         // element as the last child of the target element.
         } else if (position > vx.children(targetElem).length) {
            try {
               targetElem.appendChild(elem);
            }
            catch (e) {
            }
          // Otherwise, insert the element as the nth child of
          // the target element.
          } else {
           try {
              targetElem.insertBefore(elem, kids[position-1]);
          }
          catch (e) {
          }
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to remove a node from the document. Since
      //  JavaScript does this by removing the element as a
      //  child of a parent element, I've created this method
      //  to make this easier. This takes one argument,
      //  the element to remove.
      //
      //////////////////////////////////////////////////////////
      remove : function ( elem ) {
         elem.parentNode.removeChild(elem);
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to delete the child nodes of an element.
      //  This basically leaves it empty. This takes one
      //  argument, the element to empty.
      //
      //////////////////////////////////////////////////////////
      empty : function ( elem ) {
         // If there are any child nodes,
         // remove the first child node and loop.
         var kids = this.children( elem );
         var len = kids.length;
         for (var i = 0; i < len; i++) {
            this.remove(kids[i]);
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to replace one element with another.
      //  Since the JavaScript to do this is a little cumbersome,
      //  I've put together this method to simplify it.
      //
      //////////////////////////////////////////////////////////
      replace : function ( newElem, oldElem ) {
         oldElem.parentNode.replaceChild(newElem, oldElem);
      },
      //////////////////////////////////////////////////////////
      //
      //  Method for retrieving the odd members of a collection.
      //  This takes one argument, the collection, which can be
      //  an array or collection of nodes.
      //  The method returns an array of odd elements.
      //  Since arrays start at position[0], the odd
      //  members will start at position[0].
      //  The method supports an optional second parameter
      //  for a callback. This allows you to use a callback
      //  to act on the odd members of the collection.
      //
      //  var l = vx.$("li");
      //  vx.odd(l, function(x) {
      //     x.style.backgroundColor = "red";
      //     x.style.color = "#fff";
      //  });
      //
      //////////////////////////////////////////////////////////
      odd : function ( collection, callback ) {
         var results = [];
         var len = collection.length;
         for (var i = 0; i < len; i += 2) {
            // Preserve scope of i inside closure.
            var x = i;
            callback(collection[x]);
            results.push(collection[i]);
         }
         return results;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method for retrieving the even members of a collection.
      //  This takes one argument, the collection, which can be
      //  an array or collection of nodes.
      //  The method returns an array of even elements.
      //  Since arrays start at position[0], the even
      //  members will start at position[1].
      //  The method supports an optional second parameter
      //  for a callback. This allows you to use a callback
      //  to act on the even members of the collection.
      //
      //  var l = vx.$("li");
      //  vx.even(l, function(x) {
      //     x.style.backgroundColor = "yellow";
      //     x.style.color = "red";
      //  });
      //
      //////////////////////////////////////////////////////////
      even : function ( collection, callback ) {
         var results = [];
         var len = collection.length;
         for (var i = 1; i < len; i += 2) {
            // Preserve scope of i inside closure.
            var x = i;
            callback(collection[x]);
            results.push(collection[i]);
         }
         return results;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to get the computed style of an element.
      //  This takes two arguments: the target element and
      //  the CSS property whose value to get.
      //
      //////////////////////////////////////////////////////////
      getStyle : function ( elem, name ) {
         // Use ogitrev.util.camelize on the supplied CSS string.
         // This puts it in a format that JavaScript understands.
         var cName = this.util.camelize(name);
         var value = "";
         // Check for browser to adjust for differences in handling
         // the CSS float property. IE uses "styleFloat".
         // Firefox and Safari are fine with "foat".
         // For IE, use IE-specific way of getting the computed style.
         if (this.browser == "IE" && name == "float") {
            return elem.currentStyle["styleFloat"];
         // For everyone else use the W3C way of getting the computed style.
         } else if (this.browser != "IE" && name == "float") {
            return document.defaultView.getComputedStyle(elem, "").getPropertyValue("float");
         }
         // Check for inline styles.
         if (elem.style[cName]) {
             return elem.style[cName];
         }
         // Otherwise, try IE's method to get the computed style.
         else  if (elem.currentStyle) {
             value = elem.currentStyle[cName];
         }
         // Or the W3C's method, if it exists.
         else if (document.defaultView && document.defaultView.getComputedStyle) {
            value = document.defaultView.getComputedStyle(elem, "").getPropertyValue(name);
         }
         // Test to see if the value returned contains an RGB value.
         // If it does, convert it to hex using ogitrev.util.rgbToHex.
         if (/^\s*rgb\s*\(/.test(value)) {
            value = this.util.rgbToHex(value);
         }
         // Fix for Safari not being able to query properties of an element
         // whose display is set to none.
         if (this.browser == "Safari" && document.defaultView.getComputedStyle(elem, "").getPropertyValue("display") == "none") {
            this.setStyle(elem, "display: block");
            value = document.defaultView.getComputedStyle(elem, "").getPropertyValue(name);
            this.setStyle(elem, "display: none");
         }
         // Return the retrieved value.
         return value;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to set the style of an element. This takes two
      //  arguments by default: the target element and the css property 
      //  and a value to set. This can be a single key/value pair, or
      //  several key/value pairs. The setStyle method sets
      //  the CSS definition inline on the target element.
      //  By passing a third parameter with a positive value,
      //  the method will overwrite any existing inline styles
      //  with the value of the string.
      //
      //////////////////////////////////////////////////////////
      setStyle : function ( elem, css, overwrite ) {
         // Add the CSS definition as an inline attribute/value pair.
         // Setting CSS values is tricky because setAttribute("style", value)
         // doesn't work cross-browser (IE). You could parse the CSS,
         // break it down into property/value pairs, camelize the properties,
         // then apply them to the element(s). That's a lot of work for
         // something simple. Fortunately there is an alternative, using
         // cssText attached to the style property of an element. Since
         // We don't necessarily want to completely wipe out what might
         // already be there, we use the += operator.
         // If a third argument is supplied, such as 1 or true,
         // the method will completely replace any existing inline         
         // styles with the string definition supplied.
         overwrite ? elem.style.cssText = css : elem.style.cssText += css;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to get the full height of an element. This includes
      //  padding and border thickness. Regardless of what length units
      //  were used, this always returns a pixel value. 
      //
      //////////////////////////////////////////////////////////
      fullHeight : function ( elem ) {
         // First we check to see if the target element is hidden.
         // If it is, we need to display it briefly to get its
         // dimensions, afterwhich we hide it again.
         if (this.getStyle(elem, "display") != "none") {
            // If the element wasn't hidden,
            // get it's full height and return it.
            return elem.offsetHeight;
         } else {
            // Find out what the current values are for these properties:
            var p = this.getStyle(elem, "position");
            var v = this.getStyle(elem, "visibility");
            var d = this.getStyle(elem, "display");
            // Store the values in this variable.
            var oldCSS = "position:" + p + "; visibility:" + v + "; display:" + d + ";";
            // Create a new display definition for the target element.
            var newCSS = "position: relative; visibility: hidden; display : block;";
            // Set the target element to the above CSS.
            this.setStyle(elem, newCSS);
            // Get the element's true height.
            var oh = elem.offsetHeight;
            // Reset the element's CSS to what it was.
            this.setStyle(elem, oldCSS);
            // Return the height.
            return oh;
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to get the full width of an element. This includes
      //  padding and border thickness. Regardless of what length units
      //  were used, this always returns a pixel value.
      //
      //////////////////////////////////////////////////////////
      fullWidth : function ( elem ) {
         // First we check to see if the target element is hidden.
         // If it is, we need to display it briefly to get its
         // dimensions, afterwhich we hide it again.
         if (this.getStyle(elem, "display") == "none") {
            var p = this.getStyle(elem, "position");
            var v = this.getStyle(elem, "visibility");
            var d = this.getStyle(elem, "display");
            var oldCSS = "position:" + p + "; visibility:" + v + "; display:" + d + ";";
            var newCSS = "position: relative; visibility: hidden; display : block;";
            // Set the target element to the above CSS.
            this.setStyle(elem, newCSS);
            // Get the element's true height.
            var ow = elem.offsetWidth;
            // Reset the element's CSS to what it was.
            this.setStyle(elem, oldCSS);
            // Return the height.
            return ow;
         } else {
            // If the element wasn't hidden,
            // get it's full height and return it.
            return elem.offsetWidth;
         }
      }, 
      //////////////////////////////////////////////////////////
      //
      //  Method to find the height of the target element. Since browsers
      //  vary in how they return the value length: auto, em, px, etc.,
      //  this method normalize all lengths to pixels. The value returned
      //  is the height of the target element minus any borders and padding.
      //  The only catch is that borders and padding need to be pixel values,
      //  otherwise in the case of IE the results will be unreliable.
      //
      //////////////////////////////////////////////////////////
      height : function ( elem ) {
         var h = this.fullHeight(elem);
         var bp = parseInt(this.getStyle(elem, "border-top-width"));
         bp += parseInt(this.getStyle(elem, "border-bottom-width"));
         bp += parseInt(this.getStyle(elem, "padding-top"));
         bp += parseInt(this.getStyle(elem, "padding-bottom"));
         return h - bp;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to find the width of the target element. Since browsers
      //  vary in how they return the value length: auto, em, px, etc.,
      //  this method normalize all lengths to pixels. The value returned
      //  is the width of the target element minus any borders and padding.
      //  The only catch is that borders and padding need to be pixel values,
      //  otherwise in the case of IE the results will be unreliable.
      //
      //////////////////////////////////////////////////////////
      width : function ( elem ) {
         var w = this.fullWidth(elem);
         var bp = parseInt(this.getStyle(elem, "border-left-width"));
         bp += parseInt(this.getStyle(elem, "border-right-width"));
         bp += parseInt(this.getStyle(elem, "padding-left"));
         bp += parseInt(this.getStyle(elem, "padding-right"));
         return w - bp;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to find the absolute top (vertical) position
      //  of an element in relation to the top of the page.
      //
      //////////////////////////////////////////////////////////
      top : function ( elem ) {
         var pos = 0;
         // We need to add up all the offsets for every parent.
         while ( elem.offsetParent ) {
             // Add the offset to the variable pos.
             pos += elem.offsetTop;
             // Continue to the next parent element.
             elem = elem.offsetParent;
         }
         // Return the total of all offsetTop values.
         pos = pos + document.body.offsetTop;
         return pos;      
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to find the absolute left (horizontal) position
      //  of an element in relation to the left of the page.
      //
      //////////////////////////////////////////////////////////
      left : function ( elem ) {
         var pos = 0;
         // We need to add up all of the offsets for every parent.
         while ( elem.offsetParent ) {
             // Add the offset to the current pos.
             pos += elem.offsetLeft;
             // Continue to the next parent element.
             elem = elem.offsetParent;
         }
         // Return the total of all offsetLeft values.
         pos = pos + document.body.offsetLeft;
         return pos;      
      },     
      //////////////////////////////////////////////////////////
      //
      //  Method to find the absolute bottom of an element in
      //  relation to the bottom of the page. By default, the value
      //  returned is measured from the top of the page. However, 
      //  the method can be given an optional second argument of 
      //  "page" or "viewport". If page is supplied, 
      //  it will return the distance of the bottom of
      //  the element from the bottom of the page, even if
      //  the full page height exceeds the browser window.
      //  If viewport is supplied, it returns the distance from
      //  the bottom of the element to the bottom of the viewport.
      //
      //////////////////////////////////////////////////////////
      bottom : function ( elem, value ) {
         // Set default value for distance.
         var distance = 0;
         // If the value page is supplied, calculate the distance of
         // the target element's bottom from the bottom of the page.
         if (value == "page") {
            distance =  this.pageHeight(); 
         // Else if the value viewport is supplied, calculate the distance
         // of the target element's bottom from the bottom of the viewport.
         } else if (value == "viewport") {
            distance = this.viewportHeight();
         }
         // Find the top position, then add the offsetHeight and subtract
         // it from distance to get the result.
         if (distance != 0) {
            return distance - (this.top(elem) + this.fullHeight(elem));
         } else {
            return this.top(elem) + this.fullHeight(elem);
         }
      }, 
      //////////////////////////////////////////////////////////
      //
      //  Method to find the absolute right of an element in
      //  relation to the right of the page. By default, the value
      //  returned is measured from the left of the page. However, 
      //  the method can be given an optional second argument of 
      //  "page" or "viewport". If page is supplied, 
      //  it will return the distance of the left of
      //  the element from the left side of the page, even if
      //  the full page width exceeds the browser window.
      //  If viewport is supplied, it returns the distance from
      //  the left of the element to the left side of the viewport.
      //
      //////////////////////////////////////////////////////////
      right : function ( elem, value ) {
         // Set default value for distance.
         var distance = 0;
         // If the value page is supplied, calculate the distance of
         // the target element's right from the right side of the page.
         if (value == "page") {
            distance =  this.pageWidth(); 
         // Else if the value viewport is supplied, calculate the distance
         // of the target element's right from the right side of the viewport.
         } else if (value == "viewport") {
            distance = this.viewportWidth();
         }
         // Find the left position, then add the offsetWidth and subtract
         // it from distance to get the result.
         if (distance != 0) {
            return distance - (this.left(elem) + this.fullWidth(elem));
         } else {
            return this.left(elem) + this.fullWidth(elem);
         }
      },  
      //////////////////////////////////////////////////////////
      //
      //  Method to find the top of an element relative to
      //  its parent. We need to find the vertical position
      //  of an element within its parent element. If the element's
      //  parent node is its offsetParent, return the offsetTop.
      //  Otherwise 
      //
      //////////////////////////////////////////////////////////
      relTop : function ( elem ) {
         return elem.parentNode == elem.offsetParent ? elem.offsetTop : 
            this.top(elem) - this.top(elem.parentNode);
      }, 
      //////////////////////////////////////////////////////////
      //
      //  Method to find the left of an element relative to
      //  its parent. We need to find the vertical position
      //  of an element within its parent element. If the result
      //  is equal to the offsetLeft of 
      //
      //////////////////////////////////////////////////////////
      relLeft : function ( elem ) {
         return elem.parentNode == elem.offsetParent ? elem.offsetLeft : 
            this.left(elem) - this.left(elem.parentNode );
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to find the bottom of an element relative to
      //  its parent. By default this method returns the distance
      //  of the bottom of the target element from the top of
      //  its parent. If an optional second argument of true
      //  is passed, the method will return the distance of the
      //  target element's bottom from the parent element's bottom.
      //
      //////////////////////////////////////////////////////////
      relBottom : function ( elem, value ) {
         // If the value true is passed, calculate the distance of
         // the target element's bottom from the bottom of its
         // parent element.
         if (value == true) {
            return this.fullHeight(elem.parentNode) - (this.relTop(elem) + this.fullHeight(elem)); 
         // Otherwise return the distance from the target element's 
         // parent element's left side.
         } else {
            return this.relTop(elem) + this.fullHeight(elem);
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to find the right of an element relative to
      //  its parent. By default this method returns the distance
      //  of the right side of the target element from the left side
      //  of its parent. If an optional second argument of true
      //  is passed, the method will return the distance of the
      //  target element's right from the parent element's right.
      //
      //////////////////////////////////////////////////////////
      relRight : function ( elem, value ) {
         // If the value true is passed, calculate the distance of
         // the target element's right side from the right of its
         // parent element.
         if (value == true) {
            return this.fullWidth(elem.parentNode) - (this.relLeft(elem) + this.fullWidth(elem)); 
         // Otherwise return the distance from the target element's 
         // parent element's left side.
         } else {
            return this.relLeft(elem) + this.fullWidth(elem);
         }
      }, 
      //////////////////////////////////////////////////////////
      //
      //  Method to get the height of the page.
      //
      //////////////////////////////////////////////////////////
      pageHeight : function ( ) {
         return document.body.scrollHeight;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to get the width of the page.
      //
      //////////////////////////////////////////////////////////
      pageWidth : function ( ) {
         return document.body.scrollWidth;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to get the height of the viewport.
      //
      //////////////////////////////////////////////////////////
      viewportHeight : function ( ) {
         var doc = document.documentElement;
         return self.innerHeight || (doc && doc.clientHeight) || document.body.clientHeight;
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to get the width of the viewport.
      //
      //////////////////////////////////////////////////////////
      viewportWidth : function ( ) {
         var doc = document.documentElement;
         return self.innerWidth || (doc && doc.clientWidth) || document.body.clientWidth;
      },      
      //////////////////////////////////////////////////////////
      //
      //  Method to set the left position of an element. If the
      //  target element has a position value of absolute or
      //  relative, just its position value will be changed.
      //  Otherwise the method will give the target element a
      //  position value of relative so that it can be positioned.
      //
      //////////////////////////////////////////////////////////
      setLeft : function ( elem, value ) {
         if (this.getStyle(elem, "position") == "absolute" ||
         this.getStyle(elem, "position") == "relative") {
            elem.style.left = value + "px";
         } else {
            this.setStyle(elem, "position: relative;");
            elem.style.left = value + "px";
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to set the left position of an element. If the
      //  target element has a position value of absolute or
      //  relative, just its position value will be changed.
      //  Otherwise the method will give the target element a
      //  position value of relative so that it can be positioned.
      //
      //////////////////////////////////////////////////////////
      setTop : function ( elem, value ) {
         if (this.getStyle(elem, "position") == "absolute" ||
         this.getStyle(elem, "position") == "relative") {
            elem.style.top = value + "px";
         } else {
            this.setStyle(elem, "position: relative;");
            elem.style.top = value + "px";
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to set the left position of an element. If the
      //  target element has a position value of absolute or
      //  relative, just its position value will be changed.
      //  Otherwise the method will give the target element a
      //  position value of relative so that it can be positioned.
      //
      //////////////////////////////////////////////////////////
      setRight : function ( elem, value ) {
         if (this.getStyle(elem, "position") == "absolute" ||
         this.getStyle(elem, "position") == "relative") {
            elem.style.right = value + "px";
         } else {
            this.setStyle(elem, "position: relative;");
            elem.style.right = value + "px";
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to set the left position of an element. If the
      //  target element has a position value of absolute or
      //  relative, just its position value will be changed.
      //  Otherwise the method will give the target element a
      //  position value of relative so that it can be positioned.
      //
      //////////////////////////////////////////////////////////
      setBottom : function ( elem, value ) {
         if (this.getStyle(elem, "position") == "absolute" ||
         this.getStyle(elem, "position") == "relative") {
            elem.style.bottom = value + "px";
         } else {
            this.setStyle(elem, "position: relative;");
            elem.style.bottom = value + "px";
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to hide an element that is visible. By default the first
      //  argument is the target element. This method hides the target by
      //  changing its display property to "none." If a second optional
      //  argument is supplied, the method will instead change the target
      //  element's visibility to "hidden."
      //
      //////////////////////////////////////////////////////////
      hide : function ( elem, visibility ) { 
         // If no argument was supplied for visibility, target the
         // the display property of the element.
         if (!visibility) {
            // Set the display property of the target element to "none."
            elem.style.display = "none";
         } else {
            // If visibility was provided as an argument, set
            // the visibility of the target element to "hidden."
            elem.style.visibility = "hidden";
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to show an element that is hidden. By default, this
      //  method defines the target element's display property as
      //  "block". However, an optional second arguemnt of "options"
      //  allows for two additional arguments: "inline" or "visibility".
      //  For this to work, the optional arguments are supplied as
      //  properties of an object literal. For example, to have only
      //  "inline" and an argument, you would use (with curly braces):
      //  { inline }
      //  The method will then display the target element as an 
      //  "inline" element. This is useful for hiding and showing inline 
      //  elements, like spans, b, i, etc.
      //  You could also just supply { visibility } as the second
      //  argument to trigger setting visibility to visible.
      //  To use both, do this: { inline, visible }
      //
      //////////////////////////////////////////////////////////
      show : function ( elem, options ) {
         // If no argument for "options" was supplied,
         // change the display property of the element.
         if (!options) {
            // Set the target element's display property to "block."
            elem.style.display = "block";
         } else {
            // If a second argument for options as an object literal
            // was supplied, iterate over its properties.
            for (var opt in options) { 
               // If "inline" is a property and its display property
               // is "none," set the target element's display property 
               // to "inline."
               if (opt == "inline") {
                  if (this.getStyle(elem, "display") == "none") {
                     this.setStyle(elem, "display: inline"); 
                  }
               }
               // If "visible" is a property and its visibility property
               // is "hidden," set the target element's visibility property 
               // to "visible."
               if (opt == "visible") {
                  if (this.getStyle(elem, "visibility") == "hidden") {
                     this.setStyle(elem, "visibility: visible"); 
                  }
               }
            }
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to toggle the visibility of the target element.
      //  It first checks to discover the visibility state of
      //  the target element. According to that, it will toggle 
      //  the state.
      //
      //////////////////////////////////////////////////////////
      toggleShow : function ( elem, options ) {
         if (!options) {
            // If no options were supplied, toggle the display property.
            // If it is "none," set it to block.
            if (this.getStyle(elem, "display") == "none") {
               elem.style.display = "block";
            // Otherwise, if its display is "block," set it to "none."
            } else {
               elem.style.display = "none";
            }
         // If options were supplied,
         } else {
            for (opt in options) {
               // if it is "inline," and the display is "none,"
               // set the display to "inline."
               if (opt == "inline") {
                  if (this.getStyle(elem, "display") == "none") {
                     this.setStyle(elem, "display: inline");
                  // Otherwise, if its display is block, set it to "none."
                  } else {
                     this.setStyle(elem, "display: none");
                  }
               }
               // If the options is "visible," and the visibility property
               // is "hidden," set the visibility to "visible."
               if (opt == "visible") {
                  if (this.getStyle(elem, "visibility") == "hidden") {
                     this.setStyle(elem, "visibility: visible");
                  // Otherwise set the visibility to "hidden."
                  } else {
                     this.setStyle(elem, "visibility: hidden");
                  }
               }
            }
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  Method to set the opacity of the target element. Since
      //  IE uses IE-specific filter to accomplish this, we first
      //  check for support for the filter property. Otherwise, we
      //  use the W3C standard way of setting opacity.
      //
      //////////////////////////////////////////////////////////
      setOpacity : function ( elem, amount ) {
         if ( this.browser == "IE" ) {
            // Apply IE-specific zoom property to make sure
            // the target element has "hasLayout", otherwise
            // opacity won't work.
            elem.style.zoom = 1;
            // Create the opacity filter for IE, then apply it.
            var o = "alpha(opacity=" + amount + ")";
            elem.style.filter = o;
           
         // Otherwise use the standard W3C way with the opacity property.
         } else {
            amount = amount / 100;
            // Set the value for opacity.
            elem.style.opacity = amount;
         }
      }, 
      //////////////////////////////////////////////////////////
      //
      //  Window.onload event alternative.
      //  For when you need to fire multiple methods during page load.
      //  The trick to this is to create a closure whereby we
      //  give the window.onload event an anonymous function.
      //  All the methods we want to fire we tag  on to it.
      //  Before doing so, we first tag on any existing
      //  window.onload event.
      //
      //////////////////////////////////////////////////////////
      loadEvent : function ( F ) {
         var oldonload = window.onload;
         if (typeof window.onload !== 'function') {
            window.onload = F;
         } else {
            window.onload = function ( ) {
               oldonload();
               F();
            };
         }
      },  
      //////////////////////////////////////////////////////////
      //
      //  Several Methods to determine when the DOM is ready
      //  to access.
      //  The onload method is to handle method activation once
      //  the DOM is ready.
      //
      //////////////////////////////////////////////////////////
      onload : [],
      // Method to fire multiple functions:
      load : function() {
         if (arguments.callee.done) {
            return false;
         }
          arguments.callee.done = true;
          for (i = 0;i < ogitrev.prototype.onload.length;i++) {
            ogitrev.prototype.onload[i]();
         }
      },
      //////////////////////////////////////////////////////////
      //
      //  From here we begin the process of checking browsers' internal
      //  mechanisms to determine when the DOM is fully loaded.
      //  First off, we use the convenient Mozilla event "DOMContentLoaded".
      //  We can use a standards-based event listener for this.
      //
      //////////////////////////////////////////////////////////
      ready : function ( fireThis ) {
         this.onload.push(fireThis);
         // Test if browser uses Mozilla/Opera scheme:
         if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", this.load, null);
         }
         //////////////////////////////////////////////////////////
         //
         //  Next we use a test for KHTML/Webkit/Safari.
         //  Browsers based on the Webkit platform will return a
         //  value of "loaded" or "ready" for the document.readyState property.
         //  We use an interval loop to test for these values.
         //
         //////////////////////////////////////////////////////////
         if (/KHTMl|WebKit/i.test(navigator.userAgent)) {
            var timer = setInterval(function() {
               if (/loaded|complete/.test(document.readyState)) {
                  clearInterval(timer);
                  delete timer;
                  ogitrev.prototype.load();
               }
            }, 10);
         }
         //////////////////////////////////////////////////////////
         //
         //  For IE we use a tricky way to take advantage of the defer
         //  property in a script to determine if that browser's
         //  DOM is loaded. Most versions rely on IE-specific
         //  JScript conditional comments. I've done away with them.
         //  Thanks to Matthias Miller who devised the original
         //  solution for IE.
         //
         //////////////////////////////////////////////////////////
         if (/MSIE/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent)) {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.setAttribute("id", "__ie_onload");
            script.setAttribute("defer");
            script.src = "//0"; 
            document.getElementsByTagName("head")[0].appendChild(script);
            script.onreadystatechange = function() {
               if (this.readyState == "complete") {
                 this.load();
               }
            };
         }
         script = null;
         // Use window.onload for unsupported browsers.
         window.onload = this.load;
      },
      //////////////////////////////////////////////////////////
      //
      //  Add/Remove Event Handlers:
      //  Adopted from originals by Dean Edwards
      //
      //////////////////////////////////////////////////////////
      bind : function ( element, type, handler ) {
         // Assign each event handler a unique ID.
         if (!handler.$$guid) {
            handler.$$guid = this.bind.guid++;
         }
         // Create a hash table of event types for the element.
         if (!element.events) {
            element.events = {};
         }
         // Create a hash table of event handlers for each
         // element/event pair.
         var handlers = element.events[type];
         if (!handlers) {
             handlers = element.events[type] = {};
             // Store the existing event handler (if there is one).
             if (element["on" + type]) {
                 handlers[0] = element["on" + type];
             }
         }
         // Store the event handler in a hash table.
         handlers[handler.$$guid] = handler;
         // Assign a global event handler to do all the work.
         element["on" + type] = this.handleEvent;
      },

      // A counter used to create unique IDs
      "bind.guid" : 1,

      unbind : function (element, type, handler) {
         // Delete the event handler from the hash table.
         if (element.events && element.events[type]) {
             delete element.events[type][handler.$$guid];
         }
      },
      handleEvent : function ( event ) {
         var returnValue = true;
         // Grab the event object (IE uses a global event object).
         event = event || window.event;
         // Get a reference to the hash table of event handlers.
         var handlers = this.events[event.type];
         // Execute each event handler.
         for (var i in handlers) {
            this.$$handleEvent = handlers[i];
            if (this.$$handleEvent(event) === false) {
               returnValue = false;
            }
         }
         return returnValue;
      },
      stopDefault : function ( event ) {
         if (!event) {
            var event = window.event;
         }
         if (this.browser == "IE") {
             event.returnValue = false;
         } else {
             event.preventDefault();
         }
      },
      stopBubble : function ( event ) {
         if (!event) {
            var event = window.event;
         }
         if (this.browser == "IE") {
             event.cancelBubble = true;
         } else {
             event.stopPropagation();
         }
      }
   };
}
//////////////////////////////////////////////////////////
//
//  Instantiate a new object ".util" contained in the ogitrev object.
//  This will serve as a namespace for additional properties
//  and methods to add on to the vx object.
//  This will be used by the extend method further ahead.
//
//////////////////////////////////////////////////////////
ogitrev.prototype.util = {
    that : ogitrev.prototype,
	node : function ( object ) {
		if (object.nodeType == 1) {
			return "element";
		} else if (object.nodeType == 2) {
			return "attribute";
		} else if (object.nodeType == 3) {
			return "text";
		} else if (object.nodeType == 4) {
			return "CDATA";
		} else if (object.nodeType == 5) {
			return "entity reference";
		} else if (object.nodeType == 6) {
			return "entity";
		} else if (object.nodeType == 7) {
			return "processing instruction";
		} else if (object.nodeType == 8) {
			return "comment";
		} else if (object.nodeType == 9) {
			return "document";
		} else if (object.nodeType == 10) {
			return "document type";
		} else if (object.nodeType == 11) {
			return "document fragment";
		} else if (object.nodeType == 12) {
			return "notation";
		}
   },
   //////////////////////////////////////////////////////////
   //
   //  Helper method to convert hyphenated CSS property names to camel case.
   //
   //////////////////////////////////////////////////////////
   camelize : function ( value ) {
      return value.replace(/\-(.)/g, function(m, l){return l.toUpperCase()});
   },
   //////////////////////////////////////////////////////////
   //
   //  Helper method to convert camel case JavaScript style property names to
   //  their hyphenated CSS equivalents.
   //
   //////////////////////////////////////////////////////////
   deCamelize : function ( value ) {
      return value.replace(/([A-Z])/g, '-$1').toLowerCase();
   },
   //////////////////////////////////////////////////////////
   //
   //  Array of hex digit values.
   //
   //////////////////////////////////////////////////////////

   hexDigit :  ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"],

   //////////////////////////////////////////////////////////
   //
   //  Method to convert RGB values into Hex. Internally, 
   //  Mozilla and Webkit based browsers convert hex color values to RGB.
   //  When you use getStyle to find the color, even though a
   //  hex value was used, Mozilla and Safari return RGB values. This
   //  Method is used by getStyle to convert RGB back to hex.
   //
   //////////////////////////////////////////////////////////

   rgbToHex : function ( value ) {

	  return this.hexDigit[dec >> 4] + this.hexDigit[dec&15];
   },
   //////////////////////////////////////////////////////////
   //
   // Method to convert a hex color value to RGB.
   //
   //////////////////////////////////////////////////////////
   hexToRGB : function ( hex ) {

	return parseInt(hex, 16);
   },
   //////////////////////////////////////////////////////////
   //
   //  Method to check for the display status of an element
   //  in the Safari/Webkit browsers. This mehtod is used
   //  by fullHeight and fullWidth. This is needed because
   //  Safari will not allow access to the dimensions of an
   //  element with display: none. Neither can we easily test
   //  if an element has display set to none, unless it is inline.
   //  That means we have to test various possible situations
   //  and make assumptions based on what Safari returns.
   //
   //////////////////////////////////////////////////////////
   safariDisplay : function ( elem ) {
      // We'll define some default
      // CSS to make Safari's CSS available for access.
      // First, though, we need to check if any display style was
      // set inline. 
      var oldCSS = "";
      if (elem.style.display == "none") {
         // If the inline value is "none", then we
         // want to remember that.
         oldCSS = "display: none;";
      // Otherwise, if it's value is "block", remember that.
      } else if (elem.style.display == "block") {
         oldCSS = "display: block;";
      // Otherwise, the display value is not set or is set in
      // a style sheet, so we set the oldCSS value to empty.
      } else {
         oldCSS = "";
      }    
   },
   //////////////////////////////////////////////////////////
   //
   //  Method to give the target element relative positioning
   //  for animation purposes when its positioning is only static.
   //
   //////////////////////////////////////////////////////////
   setPositioning : function ( elem ) { 
      // Make a symbol of the parent object for easier referencing.
      var that = ogitrev.prototype;
      // If the element has static positioning, we'll need
      // to give it relative positioning to move it.
      if (that.getStyle(elem, "position") == "static") {
         // We'll also set a custom attribute to show that
         // we've purposely set it's positioning to relative.
         // That way we can change it back to static when needed.
         that.setAttr(elem, "positioning", "relative");
         that.setStyle(elem, "position: relative;");
      }
   },
   //////////////////////////////////////////////////////////
   //
   //  Method to undo relative positioning applied to a target
   //  element for animation purposes.
   //
   //////////////////////////////////////////////////////////
   unsetPositioning : function ( elem ) {
      // Make a symbol of the parent object for easier referencing.
      var that = ogitrev.prototype;
      // Check to see it the target has the custom attribute 
      // of "positioning." If it does, we know that we changed
      // its position from static to relative, so we can change
      // it back to static.
      if (that.hasAttr(elem, "positioning")) {
         that.setStyle(elem, "position: static;");
         // We then remove the custom attribute.
         that.removeAttr(elem, "positioning");
      }
   },
   //////////////////////////////////////////////////////////
   //
   //  Method to reset the inline CSS of the target element.
   //
   //////////////////////////////////////////////////////////
   resetCSS : function ( elem ) {
      // Use the cssText property to nothing. This will remove
      // all inline styles on the target element.
      elem.style.cssText = "";
   },
   /////////////////////////////////////////////////////////
   //
   //  Method to test the type of data. It returns a string.
   //  If the data is a JavaScript primitive, it will return
   //  the string in lowercase. If the data is an object type,
   //  it returns a string with an uppercase initial letter.
   //  Array literals and Object arrays are identified with
   //  and initial uppercase letter string, as are object literals
   //  and Object objects. This is because JavaScript does not
   //  distinguish between the literal and object versions of
   //  these two datatypes.
   //
   /////////////////////////////////////////////////////////
   typeOf : function ( value ) {
      // First check for null value. We need to do this before
      // checking for undefined, otherwise browsers will 
      // do type casting and resolve null and undefined.
      if (typeof value) {
         // Check if typeof returns an object. Weird, but
         // JavaScript's typeof operator sees null as an object.
           if (typeof value == "object") {
             // Test if the object has any value. If it doesn't,
             // return it as null.
             if (typeof value == "object" && !value) {
             return "null";
             } 
          }
       }
       // Here we test the value directly to see if it resolves
       // to undefined.
       if (value == undefined) {
          return "undefined";
       }
       // Here we'll begin testing for objects with the instanceof operator.
       if (value instanceof Object) {
       // Return Boolean.
          if (value instanceof Boolean) {
             return "Boolean";
             // If it is an Object of type Number,
             // check to see if it is a float.
             // Otherwise return it as an int.
          } else if (value instanceof Number) {
             if (/\./.test(value)) {
                return "Float";
             } else {
                return "Int";
             }
          // Check if the object is a String.
          } else if (value instanceof String) {
             return "String";
          // Check if the object is an Array.
          // At this point we also trap array literals
          // because instanceof returns both as objects.
          } else if (value instanceof Array) {
             return "Array";
          // Check if the object is a Date.
          } else if (value instanceof Date) {
             return "Date";
          // Check if the object is a Function.
          } else if(value instanceof Function) {
             return "Function";
          // Check if the object is an Object.
          // At this point we also trap object literals
          // because instanceof returns both as objects.
          } else if (value instanceof Object && value.length ) {
             return "Collection";
          } else if (value instanceof Object && !value.length) {
		     return "Object";
		  }
          // If something slipped through the above tests,
          // we use the typeof operator to test if they
          // are primitives (literals).
       } else if (typeof value) {
          // Check for a boolean literal.
          if (typeof value == "boolean") {
             return "boolean";
          // If it is a number literal, check whether it is
          // a float or int.
          } else if (typeof value == "number") {
             if (/\./.test(value)) {
                return "float";
             } else {
                return "int";
             }
          // Check whether it is a string literal.
          } else if (typeof value == "string") {
             return "string";
          }
      // If the value got through these tests, we don't know 
      // what it is.
      } else {
         return false;
      }
   }   
};
//////////////////////////////////////////////////////////
//
//  Method to add properties and methods
//  directly to the vx and vx.util objects.
//  It also allows us to overload any existing object members.
//  Notice that we include the.util namespace that we created above.
//  This allows us to assign the same anonymous function
//  to either object: vx.extend or vx.util.
//
//////////////////////////////////////////////////////////
ogitrev.prototype.extend = ogitrev.prototype.util.extend = function ( obj, prop ) {
   // If prop not supplied,
   if (!prop) {
      // set prop to obj,
      prop = obj;
      // set obj to "this" (object).
      obj = this;
   }
   // Loop through prop items and attach them to the object.
   for (var i in prop) {
      obj[i] = prop[i];
    }
    // Return the newly extended object.
    return obj;
};

ogitrev.prototype.extend({ 
	//////////////////////////////////////////////////////////
	//
	//  Method to create cookies. If no value is passed, the
	//  method deletes the named cookie, otherwise, it sets
	//  the named cookie with the value and days passed in.
	//  If no name is passed, the cookie only last for the session.
	//
	//////////////////////////////////////////////////////////
   setCookie: function(name, value, days) {
   	// If no value was supplied, delete cookie.
   	if (!value) {
            ogitrev.prototype.setCookie(name, "", -1);
         }
         // If no days were supplied, set default to session.
         if (!days) {
            var expires = "";
         // Otherwise, set number of days for cookie.
         } else {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
         } 
         // Set cookie.
         document.cookie = name + "=" + value + expires + "; path=/";
   },
   //////////////////////////////////////////////////////////
	//
	//  Method to get value of cookies. It loops the contents of
	//  the documents cookie jar and checks for the cookie name, 
	//  after which it returns the value.
	//
	//////////////////////////////////////////////////////////
   getCookie : function( name ) {
		var cookieName = name + "=";
		var cookies = document.cookie.split(";");
		var len = cookies.length;
		for (var i=0; i < len; i++) {
			var c = cookies[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1, c.length);
			}
			// Check for cookie name, if present, grab value.
			if (c.indexOf(cookieName) == 0) {
				return c.substring(cookieName.length, c.length);
			}
		}
		return false;
	}
});
//////////////////////////////////////////////////////////
//
//  Here we're going to add in some testing for browser,
//  browser version and operating system.
//  We use an anonymous function so that it fires immediately.
//  This will allow us to make timely decisions based on its results.
//
//////////////////////////////////////////////////////////
(function() {
    var n = navigator.userAgent.toLowerCase();
    // Figure out what browser is being used.
    // Since Opera often identifies itself as IE,
    // eliminate it from the match.
    // Here we first make a symbol of the ogitrev.prototype object.
    // Because this is an anonymous closure, it has no reference
    // to ogitrev's properties and methods. We therefore use the
    // symbol to attach properties and to the ogitrev object.
    var that = ogitrev.prototype;
    if (/msie/i.test(n) && !/opera/i.test(n)) {
        that.browser = "IE";
    // Single out Safari.
    } else if (/safari/i.test(n)) {
        that.browser = "Safari";
    // Test for Firefox.
    } else if (/firefox/i.test(n)) {
        that.browser = "Firefox";
    // Identify Netscape Navigator.
    } else if (/netscape/i.test(n)) {
        that.browser = "Netscape";
    // Test for Mozilla.
    // Since Safari identifies itself as Mozilla,
    // eliminate it from the match.
    } else if (/!webkit|firefox/i.test(n) && /mozilla/i.test(n)) {
        that.browser = "Mozilla";
    // Single out Opera.
    } else if (/opera/i.test(n)) {
        that.browser = "Opera";
    // Single out KHTML.
    } else if (navigator.vendor == "KDE") {
        that.browser = "KHTML";
    } else if (/webkit/i.test(n)) {
    // Single out Webkit.
        that.browser = "Webkit";
    }
    var p = navigator.platform.toLowerCase();
    //////////////////////////////////////////////////////////
    //
    //  Determine which operating system is being used:
    //
    //////////////////////////////////////////////////////////
    if (/bsd/i.test(p)) {
        that.os = "BSD";
    } else if (/linux/i.test(p)) {
        that.os = "Linux";
    } else if (/mac/i.test(p)) {
        that.os = "Mac";
    } else if (/sunos/i.test(p)) {
        that.os = "Solaris";
    } else if (/unix/i.test(p)) {
        that.os = "Unix";
    } else if (/win/i.test(p)) {
        that.os = "Windows";
    }
    //////////////////////////////////////////////////////////
    //
    //  Determine the browser version.
    //  This was tricky because browser vendors differ
    //  in where they put key information in the user
    //  agent string. Since we already have the browser
    //  identified above in the ogitrev.browser property,
    //  we use that to check how to determine the
    //  browser version.
    //
    //////////////////////////////////////////////////////////
    that.bv = navigator.appVersion; 
    that.ba = navigator.userAgent;
    that.bName = "";
    that.bNamePos = 0;
    if (that.browser == "IE") {
        that.vPos = that.ba.indexOf("MSIE");
        that.browserVersion = parseFloat(that.ba.substring(that.vPos+5));
    } else if (that.browser == "Opera") {
        that.vPos = that.ba.indexOf("Opera");
        that.browserVersion = parseFloat(that.ba.substring(that.vPos+6));
    }
    //////////////////////////////////////////////////////////
    //
    //  Since Safari doesn't carry browser information in
    //  its userAgent string but instead gives the
    //  build version, I test the build version to
    //  determine the browser version. Based on information
    //  provided by Apple:
    //  http://developer.apple.com/internet/safari/uamatrix.html
    //
    //////////////////////////////////////////////////////////
    else if (that.browser == "Safari") {
        that.tempBv = "";
        that.bNamePos = that.ba.lastIndexOf(' ') + 1;
        that.vPos = that.ba.lastIndexOf('/');
        if (that.ba.lastIndexOf('Version/')) {
        	  that.vvPosTemp = that.ba.lastIndexOf('Version/');
        	  that.vvPosEnd = that.ba.lastIndexOf(' Safari');
        	  that.browserVersion = that.ba.substring(that.vvPosTemp + 8, that.vvPosEnd);
        } else {
			  that.tempBv = parseFloat(that.ba.substring(that.vPos + 1));
			  if (that.tempBv < 86) {
					that.browserVersion = 1;
			  } else if (that.tempBv > 99 && that.tempBv < 100.1) {
					that.browserVersion = 1.1;
			  } else if (that.tempBv > 124 && that.tempBv < 126) {
					that.browserVersion = 1.2;
			  } else if (that.tempBv > 311 && that.tempBv < 313) {
					that.browserVersion = 1.3;
			  } else if (that.tempBv > 412 && that.tempBv < 500) {
					that.browserVersion = 2;
			  } else if (that.tempBv > 500) {
					that.browserVersion = 3;
			  }
		  }
    } 
    // For all other browsers: 
    else if ((that.bNamePos = that.ba.lastIndexOf(' ') + 1) < (that.vPos = that.ba.lastIndexOf('/'))) {
        that.browser = that.ba.substring(that.bNamePos, that.vPos);

        that.browserVersion = parseFloat(that.ba.substring(that.vPos + 1));
    }
    //////////////////////////////////////////////////////////
    //
    //  Check for box model compliance.
    //  Only IE and browsers using the IE engine
    //  have quirks mode. So if the browser is not
    //  IE, it will not be in quirks mode.
    //  If it is IE, then if it has the property of
    //  CSS1Compat, we know it is not in quirks mode.
    //
    //////////////////////////////////////////////////////////
    that.boxModel = "";
    that.browser != "IE" || document.compatMode == "CSS1Compat" ? that.boxModel = true : that.boxModel = false;
})();


//////////////////////////////////////////////////////////
//
//  Create an instance of the ogitrev object as vx.
//
//////////////////////////////////////////////////////////
if (typeof window.vx === "undefined") {
	window.vx = new ogitrev();
}
