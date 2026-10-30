/*
	Helpers for the mobile menu (adapted from Arcana by HTML5 UP, html5up.net | @ajlkn).
	Only the two helpers this site uses are kept: navList() and panel().
*/

(function($) {

	/**
	 * Builds an indented list of links from a nav (used to fill the slide-out panel).
	 * Each link gets a "depth-N" class and an empty "indent-N" span the CSS can pad with.
	 * @return {string} HTML string of <a> tags.
	 */
	$.fn.navList = function() {

		var	$a = $(this).find('a'),
			b = [];

		$a.each(function() {

			var	$this = $(this),
				indent = Math.max(0, $this.parents('li').length - 1),
				href = $this.attr('href'),
				target = $this.attr('target');

			b.push(
				'<a ' +
					'class="link depth-' + indent + '"' +
					( (typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
					( (typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
				'>' +
					'<span class="indent-' + indent + '"></span>' +
					$this.text() +
				'</a>'
			);

		});

		return b.join('');

	};

	/**
	 * Turns an element into a slide-out panel.
	 * The panel opens/closes by toggling a class (config.visibleClass) on config.target.
	 * @param {object} userConfig Overrides for the defaults below.
	 * @return {jQuery} jQuery object.
	 */
	$.fn.panel = function(userConfig) {

		// No elements? Nothing to do.
			if (this.length == 0)
				return this;

		// Multiple elements? Panel-ify each one separately.
			if (this.length > 1) {

				for (var i = 0; i < this.length; i++)
					$(this[i]).panel(userConfig);

				return this;

			}

		// Vars.
			var	$this = $(this),
				$body = $('body'),
				$window = $(window),
				id = $this.attr('id'),
				config;

		// Config.
			config = $.extend({

				// Delay (ms) before post-hide cleanup and before following a clicked link.
					delay: 0,

				// Hide panel when one of its links is clicked.
					hideOnClick: false,

				// Hide panel on escape keypress.
					hideOnEscape: false,

				// Hide panel on swipe (in the direction of "side").
					hideOnSwipe: false,

				// Reset scroll position on hide.
					resetScroll: false,

				// Reset forms on hide.
					resetForms: false,

				// Side of viewport the panel appears on: 'left', 'right', 'top' or 'bottom'.
					side: null,

				// Element that receives the "visibleClass".
					target: $this,

				// Class toggled on the target while the panel is open.
					visibleClass: 'visible'

			}, userConfig);

			// Make sure "target" is a jQuery object.
				config.target = $(config.target);

		// Panel.

			// Hide the panel (does nothing if it's already hidden).
				$this._hide = function(event) {

					if (!config.target.hasClass(config.visibleClass))
						return;

					// If an event was provided, cancel it.
						if (event) {
							event.preventDefault();
							event.stopPropagation();
						}

					config.target.removeClass(config.visibleClass);

					// Post-hide cleanup (after the slide animation).
						window.setTimeout(function() {

							if (config.resetScroll)
								$this.scrollTop(0);

							if (config.resetForms)
								$this.find('form').each(function() {
									this.reset();
								});

						}, config.delay);

				};

			// Smooth, native-feeling scrolling inside the panel on older touch browsers.
				$this
					.css('-ms-overflow-style', '-ms-autohiding-scrollbar')
					.css('-webkit-overflow-scrolling', 'touch');

			// Hide on link click, then follow the link once the panel has closed.
				if (config.hideOnClick) {

					$this.find('a')
						.css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

					$this
						.on('click', 'a', function(event) {

							var $a = $(this),
								href = $a.attr('href'),
								target = $a.attr('target');

							// Links that go nowhere (or point at the panel itself) are left alone.
								if (!href || href == '#' || href == '' || href == '#' + id)
									return;

							// Cancel the original click, close the panel...
								event.preventDefault();
								event.stopPropagation();
								$this._hide();

							// ...then go to the link after the panel has slid away.
								window.setTimeout(function() {

									if (target == '_blank')
										window.open(href);
									else
										window.location.href = href;

								}, config.delay + 10);

						});

				}

			// Touch: remember where the finger started.
				$this.on('touchstart', function(event) {

					$this.touchPosX = event.originalEvent.touches[0].pageX;
					$this.touchPosY = event.originalEvent.touches[0].pageY;

				});

			// Touch: swipe to close, and stop the page scrolling behind the panel.
				$this.on('touchmove', function(event) {

					if ($this.touchPosX === null
					||	$this.touchPosY === null)
						return;

					var	diffX = $this.touchPosX - event.originalEvent.touches[0].pageX,
						diffY = $this.touchPosY - event.originalEvent.touches[0].pageY,
						th = $this.outerHeight(),
						ts = ($this.get(0).scrollHeight - $this.scrollTop());

					// Hide on swipe?
						if (config.hideOnSwipe) {

							var result = false,
								boundary = 20,
								delta = 50,
								side = config.side;

							// In Arabic (right-to-left) main.css moves the panel to the opposite edge,
							// so the swipe that closes it points the opposite way too.
								if (document.documentElement.dir == 'rtl') {
									if (side == 'left')
										side = 'right';
									else if (side == 'right')
										side = 'left';
								}

							switch (side) {

								case 'left':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
									break;

								case 'right':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
									break;

								case 'top':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
									break;

								case 'bottom':
									result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
									break;

							}

							if (result) {

								$this.touchPosX = null;
								$this.touchPosY = null;
								$this._hide();

								return false;

							}

						}

					// Prevent vertical scrolling past the top or bottom of the panel.
						if (($this.scrollTop() < 0 && diffY < 0)
						|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

							event.preventDefault();
							event.stopPropagation();

						}

				});

			// Clicks/touches inside the panel shouldn't reach the body (which would close it).
				$this.on('click touchend touchstart touchmove', function(event) {
					event.stopPropagation();
				});

			// A link inside the panel that points at the panel's own id just closes it.
				$this.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.removeClass(config.visibleClass);

				});

		// Body.

			// Clicking/tapping anywhere else on the page closes the panel.
				$body.on('click touchend', function(event) {
					$this._hide(event);
				});

			// Any link pointing at the panel's id (the menu button) toggles it.
				$body.on('click', 'a[href="#' + id + '"]', function(event) {

					event.preventDefault();
					event.stopPropagation();

					config.target.toggleClass(config.visibleClass);

				});

		// Window.

			// Optionally close on ESC.
				if (config.hideOnEscape)
					$window.on('keydown', function(event) {

						if (event.keyCode == 27)
							$this._hide(event);

					});

		return $this;

	};

})(jQuery);
