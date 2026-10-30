/*
	Arcana by HTML5 UP (html5up.net | @ajlkn)
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)

	Customized for Al-Talib Al Thaki Private School.
	Sections: 1) preload  2) mobile menu  3) current-section highlight
	          4) contact form  5) footer year  6) language (English / Arabic)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Language state, and the few strings that live here instead of in index.html
	// (form messages and the text WhatsApp pre-fills). Everything else on the page is
	// translated with data-ar attributes in index.html. See section 6.

		var	siteLang = 'en',
			ui = {
				en: {
					formEmpty: 'Please complete all fields before sending.',
					formEmail: 'Please enter a valid email address.',
					formThanks: function(name) {
						return 'Thank you, ' + name + '! Your message has been received.';
					},
					whatsapp: {
						admission: 'Hello, I would like to ask about admission.',
						contact: 'Hello, I have a question for Al-Talib Al Thaki Private School.'
					}
				},
				ar: {
					formEmpty: 'يرجى تعبئة جميع الحقول قبل الإرسال.',
					formEmail: 'يرجى إدخال بريد إلكتروني صحيح.',
					formThanks: function(name) {
						return 'شكرًا لك، ' + name + '! تم استلام رسالتك.';
					},
					whatsapp: {
						admission: 'مرحبًا، أودّ الاستفسار عن القبول.',
						contact: 'مرحبًا، لدي استفسار لمدرسة الطالب الذكي الخاصة.'
					}
				}
			};

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
					setStatus(ui[siteLang].formEmpty, 'error');
					return;
				}

				if (!emailPattern.test(email)) {
					setStatus(ui[siteLang].formEmail, 'error');
					return;
				}

				setStatus(ui[siteLang].formThanks(name), 'success');
				form.reset();

			});

		}

	// 5) Footer year -----------------------------------------------------------
	// Keeps the copyright year current without editing the HTML each January.
	// It is a function because switching language rewrites the footer line, so section 6
	// calls it again afterwards.

		var fillYear = function() {
			$('#copyright-year').text(new Date().getFullYear());
		};

		fillYear();

	// 6) Language (English / Arabic) ---------------------------------------------
	// How it works: English is the normal text in index.html. Each translatable tag also
	// carries its Arabic in a data-ar="..." attribute. Switching language swaps the two,
	// flips the page to right-to-left (<html dir="rtl">, which main.css reacts to), and
	// remembers the choice in localStorage so the next visit opens in the same language.
	// The first time an element is swapped its English is saved in data-en, so we can go back.

		var	LANG_KEY = 'atat-lang',
			DEFAULT_LANG = 'ar',   // language for first-time visitors: 'ar' or 'en' (also change it in the <head> script of index.html)
			WHATSAPP_NUMBER = $body.attr('data-whatsapp') || '',
			metaDesc = document.querySelector('meta[name="description"]'),
			pageMeta = {
				en: {
					title: document.title,
					desc: metaDesc ? metaDesc.getAttribute('content') : ''
				},
				ar: {
					title: 'مرحبًا بكم في الصفحة الرئيسية لمدرسة الطالب الذكي الخاصة',
					desc: 'مدرسة الطالب الذكي الخاصة مركز تعليمي يوفر بيئة آمنة وداعمة وملهمة للأطفال ليتعلموا ويحبوا ويعيشوا حياتهم على أكمل وجه.'
				}
			};

		// The slide-out panel copies its links from #nav once, without classes. Mark the copy of
		// the language link so clicks on it are recognised, and give it a button role.
			var toggleIndex = $('#nav a').index($('#nav a.lang-toggle'));

			if (toggleIndex > -1)
				$('#navPanel a.link').eq(toggleIndex).addClass('lang-toggle').attr('role', 'button');

		// Swaps one attribute (alt, aria-label) between English and Arabic.
			var swapAttr = function(attr, isArabic) {

				$('[data-ar-' + attr + ']').each(function() {

					if (this.getAttribute('data-en-' + attr) === null)
						this.setAttribute('data-en-' + attr, this.getAttribute(attr) || '');

					this.setAttribute(attr, this.getAttribute(isArabic ? 'data-ar-' + attr : 'data-en-' + attr));

				});

			};

		// Switches the whole page. "userChoice" is true when a visitor pressed the toggle
		// (we save it and clear any old form message), false for the automatic first run.
			var setLang = function(next, userChoice) {

				var isArabic = (next === 'ar');

				siteLang = isArabic ? 'ar' : 'en';

				document.documentElement.lang = siteLang;
				document.documentElement.dir = isArabic ? 'rtl' : 'ltr';

				// Text. innerHTML (not text) so small bits of markup, like the office hours, survive.
					$('[data-ar]').each(function() {

						if (this.getAttribute('data-en') === null)
							this.setAttribute('data-en', this.innerHTML);

						this.innerHTML = this.getAttribute(isArabic ? 'data-ar' : 'data-en');

					});

				swapAttr('alt', isArabic);
				swapAttr('aria-label', isArabic);

				// The toggle's own text is in the other language, so tell screen readers.
					$('.lang-toggle').attr('lang', isArabic ? 'en' : 'ar');

				// The slide-out panel's links were copied as plain text, so refresh them from #nav.
					var $panelLinks = $('#navPanel a.link');

					$('#nav a').each(function(i) {

						var link = $panelLinks.get(i);

						if (link && link.lastChild)
							link.lastChild.nodeValue = $(this).text();

					});

				// WhatsApp links: number from <body data-whatsapp>, pre-filled text in the chosen language.
					$('.js-whatsapp').each(function() {

						var topic = this.getAttribute('data-topic') || 'contact';

						this.href = 'https://wa.me/' + WHATSAPP_NUMBER +
							'?text=' + encodeURIComponent(ui[siteLang].whatsapp[topic]);

					});

				// Browser tab title and search-engine description.
					document.title = pageMeta[siteLang].title;

					if (metaDesc)
						metaDesc.setAttribute('content', pageMeta[siteLang].desc);

				// The footer line was just rewritten, so put the year back.
					fillYear();

				if (userChoice) {

					// An old "message received" note would now be in the wrong language.
						$('.form-status').text('').attr('class', 'form-status');

					try {
						localStorage.setItem(LANG_KEY, siteLang);
					} catch (e) {}

				}

			};

		// The toggle lives in the desktop nav and in the slide-out panel. The panel stops clicks
		// from bubbling up, so we listen on each of them directly.
			$('#nav, #navPanel').on('click', '.lang-toggle', function(event) {

				event.preventDefault();
				setLang(siteLang === 'ar' ? 'en' : 'ar', true);

			});

		// First run: open in the language the visitor chose last time, or DEFAULT_LANG if they never chose.
			var savedLang = null;

			try {
				savedLang = localStorage.getItem(LANG_KEY);
			} catch (e) {}

			setLang((savedLang === 'ar' || savedLang === 'en') ? savedLang : DEFAULT_LANG, false);

})(jQuery);
