/*
	Arcana by HTML5 UP (html5up.net | @ajlkn)
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)

	Customized for Al-Talib Al Thaki Private School.
	Sections: 1) preload  2) mobile menu  3) current-section highlight
	          4) contact form  5) footer year
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// 1) Preload ---------------------------------------------------------------
	// <body> starts with the "is-preload" class, which the CSS uses to switch off
	// animations/transitions. Once the page has loaded we remove it so they can run.

		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// 2) Mobile menu -----------------------------------------------------------
	// Below 840px the CSS hides the desktop header/nav. Here we build the two
	// replacements from the same markup, so the menu only needs editing in one place:
	// a fixed title bar (copies the logo from #logo) and a slide-out panel
	// (copies every link from #nav).

		// Title bar with the menu button.
			$(
				'<div id="titleBar">' +
					'<a href="#navPanel" class="toggle" aria-label="Open menu"></a>' +
					'<span class="title">' + $('#logo').html() + '</span>' +
				'</div>'
			)
				.appendTo($body);

		// Slide-out panel. Its slide time (delay) must match the 0.5s transition in main.css.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

	// 3) Current-section highlight --------------------------------------------
	// Marks the nav item of the section being read with "current" (the gold pointer).
	// Uses IntersectionObserver instead of a scroll listener, which is lighter on the browser.
	// A section counts as current while it crosses a thin band about 35-45% down the screen.

		var	$navItems = $('#nav li'),
			sections = [];

		$('#nav a[href^="#"]').each(function() {

			var href = $(this).attr('href');

			// Skip links with no target (e.g. Login / Register is just "#" for now),
			// because document.querySelector('#') is invalid and would throw.
				if (href.length < 2)
					return;

			var section = document.querySelector(href);

			if (section)
				sections.push(section);

		});

		if (sections.length && 'IntersectionObserver' in window) {

			var observer = new IntersectionObserver(function(entries) {

				entries.forEach(function(entry) {

					if (!entry.isIntersecting)
						return;

					$navItems.removeClass('current');
					$navItems.has('a[href="#' + entry.target.id + '"]').addClass('current');

				});

			}, { rootMargin: '-35% 0px -55% 0px' });

			sections.forEach(function(section) {
				observer.observe(section);
			});

		}

	// 4) Contact form ----------------------------------------------------------
	// No server is connected yet, so this only checks the fields and shows a message
	// under the button. To send for real, replace the "success" branch with a fetch()
	// call to your endpoint (or a form service such as Formspree).

		var	form = document.getElementById('contactForm');

		if (form) {

			var	status = form.querySelector('.form-status'),
				emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

			// Shows a message; type is "success" or "error" (styled in main.css).
				var setStatus = function(text, type) {

					if (!status)
						return;

					status.textContent = text;
					status.className = 'form-status ' + type;

				};

			form.addEventListener('submit', function(event) {

				event.preventDefault(); // keep the page from reloading

				// form.elements is used because a field called "name" would clash with form.name
				var	name = form.elements['name'].value.trim(),
					email = form.elements['email'].value.trim(),
					message = form.elements['message'].value.trim();

				if (!name || !email || !message) {
					setStatus('Please complete all fields before sending.', 'error');
					return;
				}

				if (!emailPattern.test(email)) {
					setStatus('Please enter a valid email address.', 'error');
					return;
				}

				setStatus('Thank you, ' + name + '! Your message has been received.', 'success');
				form.reset();

			});

		}

	// 5) Footer year -----------------------------------------------------------
	// Keeps the copyright year current without editing the HTML each January.

		$('#copyright-year').text(new Date().getFullYear());

})(jQuery);
