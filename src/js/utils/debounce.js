// /**
//  * Debounce functions for better performance
//  * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
//  * @param  {Function} fn The function to debounce
//  */
// var debounce = function (fn) {

// 	// Setup a timer
// 	var timeout;

// 	// Return a function to run debounced
// 	return function () {

// 		// Setup the arguments
// 		var context = this;
// 		var args = arguments;

// 		// If there's a timer, cancel it
// 		if (timeout) {
// 			window.cancelAnimationFrame(timeout);
// 		}

// 		// Setup the new requestAnimationFrame()
// 		timeout = window.requestAnimationFrame(function () {
// 			fn.apply(context, args);
// 		});

// 	}

// };

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function () {
		var context = this,
			args = arguments;
		var later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
