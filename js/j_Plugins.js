(function() {

Function.prototype.throttle = (function() {
	var self = func = delay = null,
		busy = false;
	func = function throttle(delay) {
		if (busy) {
			return false;
		} else {
			if( isNaN(delay) ) {
				return false
			} else {
				delay = parseInt(delay)
			}
			self = this;
			busy = true;
			setTimeout(function() {
				busy = false;
			}, delay)
			return self.apply(this, Array.prototype.slice.call(arguments, 1 ) )
		}
	}
	return func;
})()

Array.prototype.remake = function(Type) {
	if (!Type || !Type.prototype) return false;
	var length = this.length;
	while(length--) {
		this[length] = new Type();
	}
	return this;
}

if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun /*, thisp*/) {
		var len = this.length;
		if (typeof fun != "function") throw new TypeError();
		var res = new Array();
		var thisp = arguments[1];
		for (var i = 0; i < len; i++) {
			if (i in this) {
				var val = this[i]; // in case fun mutates this
				if (fun.call(thisp, val, i, this)) res.push(val);
			}
		}
	return res;
	}
}

if (!Array.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
    return -1;
  }
}

if (jQuery) {

jQuery.fn.leftclick = function ( data, fn ) {
	var name = "mousedown",
		func = function(e) {
			var self = this;
			if (e.which==1) {
				e.type = "leftclick"
				return ( func = fn.call(this, e) );
			}
			return false;
		}
	if ( fn == null ) {
		fn = data;
		data = null;
	}
	return arguments.length > 0 ? this.on( name, null, data, func ) : this.trigger( name );
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateArrayRandomNumber (min, len) {
//  Нужно учесть что в диапазоне участвуют и минимальное и максимальное число
//  тоесть если задать (0, 100) то на выходе получим массив из 101-го числа
//  от 1 до 100 и плюс число 0
	var totalNumbers    = questions({}).count()-1 - min + 1,
	    arrayTotalNumbers   = [],
	    arrayRandomNumbers  = [],
	    tempRandomNumber;
	while (totalNumbers--) {
		arrayTotalNumbers.push(totalNumbers + min);
	}
	while (len--) {
		tempRandomNumber = Math.round(Math.random() * (arrayTotalNumbers.length - 1));
		arrayRandomNumbers.push(arrayTotalNumbers[tempRandomNumber]);
		arrayTotalNumbers.splice(tempRandomNumber, 1);
	}
	return arrayRandomNumbers;
}

}

if (!Array.prototype.forEach)
{
  Array.prototype.forEach = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
        fun.call(thisp, this[i], i, this);
    }
  };
}

if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    var T, A, k;
    if (this == null) {
      throw new TypeError(" this is null or not defined");
    }
    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
    var O = Object(this);
    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;
    // 4. If IsCallable(callback) is false, throw a TypeError exception.
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== "function") {
      throw new TypeError(callback + " is not a function");
    }
    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (thisArg) {
      T = thisArg;
    }
    // 6. Let A be a new array created as if by the expression new Array(len) where Array is
    // the standard built-in constructor with that name and len is the value of len.
    A = new Array(len);
    // 7. Let k be 0
    k = 0;
    // 8. Repeat, while k < len
    while(k < len) {
      var kValue, mappedValue;
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {
        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[ k ];
        // ii. Let mappedValue be the result of calling the Call internal method of callback
        // with T as the this value and argument list containing kValue, k, and O.
        mappedValue = callback.call(T, kValue, k, O);
        // iii. Call the DefineOwnProperty internal method of A with arguments
        // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
        // and false.
        // In browsers that support Object.defineProperty, use the following:
        // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });
        // For best browser support, use the following:
        A[ k ] = mappedValue;
      }
      // d. Increase k by 1.
      k++;
    }
    // 9. return A
    return A;
  };     
}

})()