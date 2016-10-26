//small gallery plugin by LeeroyJenks
(function($) {
	$.fn.simpleGallery = function(options) {
		var settings = $.extend({
			animationType: 'fade',
			adaptiveHeight: false,
			description: false,
			navigation: 'both',
			navigationType: 'dots',
			dotsPositionX: 'center',
			dotsPositionY: 'center',
			arrowsType: 'arrow',
			arrowsColor: '#000',
			dotsColor: '#000',
			slidesContainer: '.images-list',
			swipe: 'horizontal'
		}, options);
		return this.each(function() {
			var gEl = $(this);
			var startX, startY;

			var bindIt = function(element) {
				$(gEl).on('touchstart.simpleGal', touchGalleryStart);
				$(gEl).on('touchmove.simpleGal', touchGalleryMove);
				$(gEl).on('touchend.simpleGal', function() {
					touchGalleryEnd(event, gEl);
				});
			};
			var touchGalleryStart = function(e) {
				var touchobj = e.originalEvent.changedTouches[0]; // reference first touch point (ie: first finger)
				startX = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser
				startY = parseInt(touchobj.clientY);
				if (settings.swipe == 'vertical') {
					e.preventDefault();
					return true;
				}
			};
			var touchGalleryMove = function(e) {
				var touchobj = e.originalEvent.changedTouches[0]; // reference first touch point for this event
				var dist = parseInt(touchobj.clientX) - startX;
				var distY = parseInt(touchobj.clientY) - startY;
				if (Math.abs(distY) > Math.abs(dist) && settings.swipe == 'horizontal') {
					return true;
				}
				if (settings.swipe == 'vertical') {
					e.preventDefault();
				}
			};
			var touchGalleryEnd = function(e, el) {
				var touchobj = e.changedTouches[0]; // reference first touch point for this event
				var $el = el;
				var distX = parseInt(touchobj.clientX) - startX;
				var distY = parseInt(touchobj.clientY) - startY;
				var dist = (settings.swipe == 'horizontal' ? distX : distY);
				if (Math.abs(dist) > 40) {
					e.preventDefault();
					changeImage(((dist > 0) ? "previous" : "next"));
				}
			};

			var setupGallery = function(gal) {
				if($(gal).is(':hidden')){
					console.log('gallery is hidden!');
					return false;
				}
				var $g = $(gal);
				var $l = $g.find(settings.slidesContainer) || null;
				var numberOfChildren = $l.find('li').length;
				var $simpleGallery = $l.wrap('<div class="simple-gallery" style="opacity: 0;">').parent();
				var tallest = Math.max.apply(null, $l.children().map(function(){ return $(this).outerHeight(); }).get());

				var listProperties = function(elementType, i) {
					var index = i || 0;
					var styling = {
						'gallery': {
							'fade': {
								'position': 'relative',
								'display': 'block',
								'width': '100%',
								'height': 'auto'
							},
							'slide': {

							}
						},
						'ul': {
							'fade': {
								'width': '100%',
								'height': (settings.adaptiveHeight ? $l.find('li:first-child').height() : tallest) + 'px',
								'overflow': 'hidden',
								'display': 'block',
								'listStyle': 'none'
							},
							'slide': {

							}
						},
						'list': {
							'fade': {
								'width': '100%',
								'height': '100%',
								'position': 'absolute',
								'top': '50%',
								'left': '50%',
								'zIndex': (index === 0 ? 1 : 0),
								'opacity': (index === 0 ? 1 : 0),
								'margin': 0,
								'padding': 0,
								'-webkit-transform': 'translate(-50%, -50%)',
								'-moz-transform': 'translate(-50%, -50%)',
								'-ms-transform': 'translate(-50%, -50%)',
								'transform': 'translate(-50%, -50%)'
							},
							'slide': {}
						},
						'image': {
							'fade': {
								'max-width': '100%',
								'max-height': '100%',
								'display': 'block',
								'position': 'absolute',
								'top': '50%',
								'left': '50%',
								'-webkit-transform': 'translate(-50%, -50%)',
								'-moz-transform': 'translate(-50%, -50%)',
								'-ms-transform': 'translate(-50%, -50%)',
								'transform': 'translate(-50%, -50%)'
							},
							'slide': {}
						}
					};

					return styling[elementType][settings.animationType];
				};

				var dotProperties = function(dotType, i) {
					var index = i || 0;

					var styles = {
						'parent': {
							'margin': 0,
							'padding': 0,
							'list-style': 'none',
							'position': 'absolute',
							'z-index': 1,
							'left': (settings.dotsPositionX == 'left' ? 0 : settings.dotsPositionX == 'right' ? '100%' : settings.dotsPositionX == 'center' ? '50%' : 'auto'),
							'top': (settings.dotsPositionY == 'top' ? 0 : settings.dotsPositionY == 'bottom' ? '100%' : settings.dotsPositionY == 'center' ? '50%' : 'auto'),
							'-webkit-transform': 'translate(' + (settings.dotsPositionX == 'left' ? '0%' : settings.dotsPositionX == 'right' ? '-100%' : settings.dotsPositionX == 'center' ? '-50%' : '0%') + ', ' + (settings.dotsPositionY == 'top' ? '0%' : settings.dotsPositionY == 'bottom' ? '-100%' : settings.dotsPositionY == 'center' ? '-50%' : '0%') + ')',
							'-moz-transform': 'translate(' + (settings.dotsPositionX == 'left' ? '0%' : settings.dotsPositionX == 'right' ? '-100%' : settings.dotsPositionX == 'center' ? '-50%' : '0%') + ', ' + (settings.dotsPositionY == 'top' ? '0%' : settings.dotsPositionY == 'bottom' ? '-100%' : settings.dotsPositionY == 'center' ? '-50%' : '0%') + ')',
							'-ms-transform': 'translate(' + (settings.dotsPositionX == 'left' ? '0%' : settings.dotsPositionX == 'right' ? '-100%' : settings.dotsPositionX == 'center' ? '-50%' : '0%') + ', ' + (settings.dotsPositionY == 'top' ? '0%' : settings.dotsPositionY == 'bottom' ? '-100%' : settings.dotsPositionY == 'center' ? '-50%' : '0%') + ')',
							'transform': 'translate(' + (settings.dotsPositionX == 'left' ? '0%' : settings.dotsPositionX == 'right' ? '-100%' : settings.dotsPositionX == 'center' ? '-50%' : '0%') + ', ' + (settings.dotsPositionY == 'top' ? '0%' : settings.dotsPositionY == 'bottom' ? '-100%' : settings.dotsPositionY == 'center' ? '-50%' : '0%') + ')'
						},
						'dots': {
							'width': '10px',
							'height': '10px',
							'display': (settings.swipe == 'horizontal' ? 'inline-block' : 'block'),
							'vertical-align': settings.swipe,
							'position': 'relative',
							'margin': '5px',
							'border': '1px solid ' + settings.dotsColor,
							'border-radius': '53%',
							'background-color': (index === 0 ? settings.dotsColor : 'transparent'),
							'text-indent': '-9999em',
							'overflow': 'hidden',
							'cursor': 'pointer'
						},
						'numbers': {

						}
					};

					return styles[dotType];
				};

				if ($l) {
					$simpleGallery.css(listProperties('gallery'))
						.children('ul').css(listProperties('ul'))
						.find('li').each(function(index) {
							var i = index;
							$(this).addClass((i === 0 ? 'current' : ''))
								.css(listProperties('list', i))
								.children('img')
								.css(listProperties('image'));
							//console.log(i);
							if (i + 1 == numberOfChildren) {
								$simpleGallery.animate({
									'opacity': 1
								}, 200);
							}
						});

					if (settings.navigation == 'arrows' || settings.navigation == 'both') {
						var $prev = $('<a class="ng-prev ' + settings.arrowsType + '" href="#prev"><span class="arrow-one" style="background-color:' + settings.arrowsColor + ';"></span><span class="arrow-two" style="border-color:' + settings.arrowsColor + ';"></span></a>');
						var $next = $('<a class="ng-next ' + settings.arrowsType + '" href="#next"><span class="arrow-one" style="background-color:' + settings.arrowsColor + ';"></span><span class="arrow-two" style="border-color:' + settings.arrowsColor + ';"></span></a>');
						$simpleGallery.append($prev, $next);
						$prev.on('click.simpleGal', function(event) {
							changeImage("previous");
						});
						$next.on('click.simpleGal', function(event) {
							changeImage("next");
						});
					}
					if (settings.navigation == 'dots' || settings.navigation == 'both') {
						var $galNav = $('<div class="gallery-nav"></div>');
						$l.after($galNav);
						var dotList = '';
						if (settings.navigation == 'dots') {
							for (var i = 0; i < numberOfChildren; i++) {
								var $thisDot = $('<a class="dot dot-' + i + ((i === 0) ? ' current' : '') + '" data-number="' + i + '" >' + (i + 1) + '</a>');
								$galNav.css(dotProperties('parent')).append($thisDot);
								$thisDot.css(dotProperties('dots', i));
							}
						}

						$galNav.find('a').click(function(e) {
							e.preventDefault();
							changeImage($(this).index());
						});
					}

					bindIt($(gEl));

				} else {
					console.log('Error. No "' + settings.slidesContainer + '" class found.');
				}
				return true;

			};

			var changeImage = function(dir) {
				var $g = $(gEl);
				var $nav = $g.find('.gallery-nav');
				var $l = $g.find(settings.slidesContainer) || null;
				var $c = $l.find('.current') || null;
				var d = dir;
				if ($l && $c) {
					switch (d) {
						case 'previous':
							if ($c.prev().length > 0) {
								$c.css('zIndex', 0).animate({
									'opacity': 0
								}, 200).removeClass('current').prev().css('zIndex', 1).animate({
									'opacity': 1
								}, 200).addClass('current');
								$nav.find('.current').removeClass('current').prev().addClass('current');
							} else {
								$c.css('zIndex', 0).animate({
									'opacity': 0
								}, 200).removeClass('current').siblings(':last').css('zIndex', 1).animate({
									'opacity': 1
								}, 200).addClass('current');
								$nav.find('.current').removeClass('current').siblings(':last').addClass('current');
							}
							break;
						case 'next':
							if ($c.next().length > 0) {
								$c.css('zIndex', 0).animate({
									'opacity': 0
								}, 200).removeClass('current').next().css('zIndex', 1).animate({
									'opacity': 1
								}, 200).addClass('current');
								$nav.find('.current').removeClass('current').next().addClass('current');
							} else {
								$c.css('zIndex', 0).animate({
									'opacity': 0
								}, 200).removeClass('current').siblings(':first').css('zIndex', 1).animate({
									'opacity': 1
								}, 200).addClass('current');
								$nav.find('.current').removeClass('current').siblings(':first').addClass('current');
							}
							break;
						default:
							//console.log(d);
							if ($c.index() != d) {
								//console.log($c.index());
								$c.css('zIndex', 0).animate({
									'opacity': 0
								}, 200).removeClass('current');
								$l.find('li:eq(' + d + ')').css('zIndex', 1).animate({
									'opacity': 1
								}, 200).addClass('current');
								$nav.find('.current').removeClass('current');
								$nav.find('a:eq(' + d + ')').addClass('current');
							}
							break;
					}
				}
				if ((settings.navigation == 'both' || settings.navigation == 'dots') && settings.navigationType == 'dots' && $nav.length > 0) {
					$nav.find('.current').css('background-color', settings.dotsColor).siblings().css('background-color', 'transparent');
				}
				if (settings.adaptiveHeight) {
					$l.animate({
						'height': $l.find('.current').children('img').height() + 'px'
					}, 200);
				}
				if (settings.description && typeof settings.description === 'object') {
					$g.find('.gallery-description').animate({
						'opacity': 0
					}, 200, function() {
						for (var key in settings.description) {
							$g.find('.' + key).html($l.find('.current').data(settings.description[key]));
						}
						$g.find('.gallery-description').animate({
							'opacity': 1
						}, 200);
					});
				}
			};

			// initialize
			var $l = $(this).find(settings.slidesContainer) || null;
			var firstImage = $(gEl).find(settings.slidesContainer + ' li:first-child img').get(0);
			var galleryInitiated;
			
			if (firstImage && !firstImage.complete) {
				$(firstImage).load(function() {
					galleryInitiated = setupGallery($(gEl));
				});
			} else {
				galleryInitiated = setupGallery($(gEl));
			}
			if (settings.adaptiveHeight || !galleryInitiated) {
				$(window).resize(function() {
					if(settings.adaptiveHeight){
						$l.css({
							'height': $l.find('.current').children('img').height() + 'px'
						});
					}
					if(!galleryInitiated){
						galleryInitiated = setupGallery($(gEl));
					}
				});
			}

		});
	};
}(jQuery));