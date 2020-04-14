(function (document, window) {

	var rambutan = {
		sliders: []
	};

	function getParentDimensions(DOMelement) {
		return {
			width: DOMelement.parentNode.clientWidth,
			height: DOMelement.parentNode.clientHeight
		};
	}

	function getPageY(e) {
		var pageY;
		if (e.pageY) {
			pageY = e.pageY;
		} else if (e.touches) {
			pageY = e.touches[0].pageY;
		} else {
			pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return pageY;
	}

	function getTopPercent(slider, input) {
		if (typeof (input) === 'string' || typeof (input) === 'number') {
			topPercent = parseInt(input, 10);
		} else {
			var sliderRect = slider.getBoundingClientRect();
			var offset = {
				top: sliderRect.top + document.body.scrollTop + document.documentElement.scrollTop,
				left: sliderRect.left + document.body.scrollLeft + document.documentElement.scrollLeft
			};
			var width = slider.offsetHeight;
			var pageY = getPageY(input);
			var relativeY = pageY - offset.top;
			topPercent = (relativeY / width) * 100;
		}
		return topPercent;
	}

	function rambutanslider(selector, elements, options) {

		this.selector = selector;

		var i;

		this.options = { // new options must have default values set here.
			startingPosition: '50%',
			animate: true,
			callbackOnInit: null, // pass a callback function on init of the slider
			callbackOnUpdate: null // pass a callback function on every update of the slider value
		};

		for (i in this.options) {
			if (i in options) {
				this.options[i] = options[i];
			}
		}

		if (elements.length === 2) {
			this.elBg = elements[0];
			this.elFg = elements[1];
		} else {
			console.warn('The elements parameter takes two dom objects.');
		}
	}

	rambutanslider.prototype = {

		updateSlider: function (input, animate) {
			var startPercent, endPercent;

			startPercent = getTopPercent(this.slider, input);

			startPercent = startPercent.toFixed(2) + '%';
			startPercentNum = parseFloat(startPercent);
			endPercent = (100 - startPercentNum) + '%';

			if (startPercentNum > 0 && startPercentNum < 100) {
				this.handle.classList.remove('transition');
				this.elBackground.classList.remove('transition');
				this.elForeground.classList.remove('transition');

				if (this.options.animate && animate) {
					this.handle.classList.add('transition');
					this.elForeground.classList.add('transition');
					this.elBackground.classList.add('transition');
				}

				this.handle.style.top = startPercent;
				this.elBackground.style.height = startPercent;
				this.elForeground.style.height = endPercent;
				this.sliderPosition = startPercent;

				// Execute a callback if there is one set
				// Simple functions should work ok
				// Please: remember to debounce if you are about to do something resource-intensive
				if (this.options.callbackOnUpdate && typeof (this.options.callbackOnUpdate) === 'function') {
					this.options.callbackOnUpdate(this);
				}
			}
		},

		setWrapperDimensions: function () {
			this.wrapper.style.width = getParentDimensions(this.wrapper).width + 'px';
			this.wrapper.style.height = getParentDimensions(this.wrapper).height + 'px';
		},

		_prepare: function () {
			this.wrapper = document.querySelector(this.selector);
			this.setWrapperDimensions();

			this.slider = document.createElement('div');
			this.slider.className = 'rambutan-slider';
			this.wrapper.appendChild(this.slider);

			this.handle = document.createElement('div');
			this.handle.className = 'rambutan-handle';

			this.elBackground = document.createElement('div');
			this.elBackground.className = 'rambutan__element rambutan__element--bg';
			this.elBackground.appendChild(this.elBg);

			this.elForeground = document.createElement('div');
			this.elForeground.className = 'rambutan__element rambutan__element--fg';
			this.elForeground.appendChild(this.elFg);

			this.slider.appendChild(this.handle);
			this.slider.appendChild(this.elBackground);
			this.slider.appendChild(this.elForeground);

			this.control = document.createElement('div');
			this.controller = document.createElement('div');

			this.control.className = 'rambutan-control';
			this.controller.className = 'rambutan-controller';

			this.controller.setAttribute('tabindex', 0); //put the controller in the natural tab order of the document
			this.controller.setAttribute('role', 'slider');
			this.controller.setAttribute('aria-valuenow', 50);
			this.controller.setAttribute('aria-valuemin', 0);
			this.controller.setAttribute('aria-valuemax', 100);

			this.handle.appendChild(this.control);
			this.control.appendChild(this.controller);

			this._init();
		},

		_init: function () {

			this.updateSlider(this.options.startingPosition, false);

			var self = this;
			window.addEventListener('resize', function () {
				self.setWrapperDimensions();
			});

			// Set up Javascript Events
			// On mousedown, call updateSlider then set animate to false
			// (if animate is true, adds css transition when updating).

			this.slider.addEventListener('mousedown', function (e) {
				e = e || window.event;
				e.preventDefault();
				self.updateSlider(e, true);
				animate = true;

				this.addEventListener('mousemove', function (e) {
					e = e || window.event;
					e.preventDefault();
					if (animate) {
						self.updateSlider(e, false);
					}
				});

				this.addEventListener('mouseup', function (e) {
					e = e || window.event;
					e.preventDefault();
					e.stopPropagation();
					this.removeEventListener('mouseup', arguments.callee); // jshint ignore:line
					animate = false;
				});
			});

			this.slider.addEventListener('touchstart', function (e) {
				e = e || window.event;
				e.preventDefault();
				e.stopPropagation();
				self.updateSlider(e, true);

				this.addEventListener('touchmove', function (e) {
					e = e || window.event;
					e.preventDefault();
					e.stopPropagation();
					self.updateSlider(event, false);
				});

			});

			/* keyboard accessibility */

			this.handle.addEventListener('keydown', function (e) {
				e = e || window.event;
				var key = e.which || e.keyCode;
				var ariaValue = parseFloat(this.style.left);

				//move jx-controller left
				if (key === 37) {
					ariaValue = ariaValue - 1;
					var leftStart = parseFloat(this.style.left) - 1;
					self.updateSlider(leftStart, false);
					self.controller.setAttribute('aria-valuenow', ariaValue);
				}

				//move jx-controller right
				if (key === 39) {
					ariaValue = ariaValue + 1;
					var rightStart = parseFloat(this.style.left) + 1;
					self.updateSlider(rightStart, false);
					self.controller.setAttribute('aria-valuenow', ariaValue);
				}
			});

			//toggle right-hand image visibility
			this.elForeground.addEventListener('keydown', function (event) {
				var key = event.which || event.keyCode;
				if ((key === 13) || (key === 32)) {
					self.updateSlider('90%', true);
					self.controller.setAttribute('aria-valuenow', 90);
				}
			});

			//toggle left-hand image visibility
			this.elBackground.addEventListener('keydown', function (event) {
				var key = event.which || event.keyCode;
				if ((key === 13) || (key === 32)) {
					self.updateSlider('10%', true);
					self.controller.setAttribute('aria-valuenow', 10);
				}
			});

			rambutan.sliders.push(this);

			if (this.options.callbackOnInit && typeof (this.options.callbackOnInit) === 'function') {
				this.options.callbackOnInit(this);
			}
		}
	};

	rambutan.makeSlider = function (element, idx) {
		if (typeof idx === 'undefined') {
			idx = rambutan.sliders.length; // not super threadsafe...
		}

		var options = {};

		specificClass = 'rambutan-' + idx;
		element.classList.add(specificClass);

		selector = '.' + specificClass;

		slider = new rambutan.rambutanslider(
			selector,
			[
				element.querySelector('.rambutan-background'),
				element.querySelector('.rambutan-foreground')
			],
			options
		);

		slider._prepare();
	};

	// Enable HTML Implementation
	rambutan.scanPage = function () {
		var elements = document.querySelectorAll('.rambutan');
		for (var i = 0; i < elements.length; i++) {
			rambutan.makeSlider(elements[i], i);
		}
	};

	rambutan.rambutanslider = rambutanslider;
	window.rambutan = rambutan;

	rambutan.scanPage();


}(document, window));
