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
			swipe: 'horizontal',
			autoScroll: false,
			scrollSpeed: 3000,
			scrollStartDelay: 3000,
			scrollRestart: true,
			restartDelay: 3000
		}, options);
		return this.each(function() {
			var gEl = $(this);
			var widest = 1;
			var startX, startY;
			var startTimeout, scrollInterval;

			var autoScroll = function(){
				if(settings.scrollStartDelay == 'load'){
					$(window).on('load.simpleGal', function(){
						scrollInterval = setInterval(function(){
							changeImage('next');
						}, settings.scrollSpeed);
					});
				}else{
					startTimeout = setTimeout(function(){
						scrollInterval = setInterval(function(){
							changeImage('next');
						}, settings.scrollSpeed);
					}, settings.scrollStartDelay);
				}
			};
			
			var clearRestartScroll = function(){				
				clearTimeout(startTimeout);
				clearInterval(scrollInterval);
				startTimeout = setTimeout(function(){
					scrollInterval = setInterval(function(){
						changeImage('next');
					}, settings.scrollSpeed);
				}, settings.restartDelay);
			};
			
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
					clearRestartScroll();
					changeImage(((dist > 0) ? "previous" : "next"));
				}
			};

			var setupGallery = function(gal) {
				if($(gal).is(':hidden')){
					return false;
				}
				var $g = $(gal);
				var $l = $g.find(settings.slidesContainer) || null;
				var numberOfChildren = $l.find('li').length;
				var $simpleGallery = $l.wrap('<div class="simple-gallery" style="opacity: 0;">').parent();
				var tallest = Math.max.apply(null, $l.children().map(function(){ return $(this).outerHeight(); }).get());
				widest = Math.max.apply(null, $l.children().map(function(){ var ratio = $(this).outerWidth()/$(this).outerHeight(); return ratio; }).get());
				var firstDescription = {};

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
								'height': (settings.adaptiveHeight ? $l.find('li:first-child').height() : $g.outerWidth() / widest) + 'px',
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
								'max-width': (settings.adaptiveHeight ? 'auto' : '100%'),
								'max-height': (settings.adaptiveHeight ? 'auto' : '100%'),
								'width': (settings.adaptiveHeight ? '100%' : 'auto'),
								'height': (settings.adaptiveHeight ? 'auto' : '100%'),
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

				var navProperties = function(navType, i) {
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

						},
						'arrows-left': {
							'display': 'block',
							'position': 'absolute',
							'top': '50%',
							'left': '0',
							'width': '14px',
							'height': '24px',
							'-webkit-transform': 'translate(-200%, -50%)',
							'-moz-transform': 'translate(-200%, -50%)',
							'-ms-transform': 'translate(-200%, -50%)',
							'transform': 'translate(-200%, -50%)'
						},
						'arrows-right':{
							'display': 'block',
							'position': 'absolute',
							'top': '50%',
							'right': '0',
							'width': '14px',
							'height': '24px',
							'-webkit-transform': 'translate(200%, -50%)',
							'-moz-transform': 'translate(200%, -50%)',
							'-ms-transform': 'translate(200%, -50%)',
							'transform': 'translate(200%, -50%)'
						},
						'arrows-left-one': {
							'display': 'block',
							'position': 'absolute',
							'top': '50%',
							'left': '3px',
							'width': '16px',
							'height': '16px',
							'border-left': '1px solid',
							'border-bottom': '1px solid',
							'border-color': settings.arrowsColor,
							'-webkit-transform': 'translateY(-50%) rotate(45deg)',
							'-moz-transform': 'translateY(-50%) rotate(45deg)',
							'-ms-transform': 'translateY(-50%) rotate(45deg)',
							'transform': 'translateY(-50%) rotate(45deg)'
						},
						'arrows-right-one': {
							'display': 'block',
							'position': 'absolute',
							'top': '50%',
							'right': '3px',
							'width': '16px',
							'height': '16px',
							'border-right': '1px solid',
							'border-top': '1px solid',
							'border-color': settings.arrowsColor,
							'-webkit-transform': 'translateY(-50%) rotate(45deg)',
							'-moz-transform': 'translateY(-50%) rotate(45deg)',
							'-ms-transform': 'translateY(-50%) rotate(45deg)',
							'transform': 'translateY(-50%) rotate(45deg)'
						}
					};

					return styles[navType];
				};

				if ($l) {
					$simpleGallery.css(listProperties('gallery'))
						.children(settings.slidesContainer).css(listProperties('ul'))
						.children().each(function(index) {
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
							if(i === 0){
								if(settings.description){
									for(var j=0; j < settings.description.length; j++){
										if($(this).data(settings.description[j])){
											firstDescription[settings.description[j]] = $(this).data(settings.description[j]);
										}
									}
								}
							}
						});

					if (settings.navigation == 'arrows' || settings.navigation == 'both') {
						var $prev = $('<a class="sg-prev ' + settings.arrowsType + '" href="#prev"><span class="arrow"></span></a>');
						var $next = $('<a class="sg-next ' + settings.arrowsType + '" href="#next"><span class="arrow"></span></a>');
						$simpleGallery.append($prev, $next);
						$prev
						.css(navProperties('arrows-left'))
						.on('click.simpleGal', function(event) {
							clearRestartScroll();
							changeImage("previous");
						})
						.children('.arrow')
						.css(navProperties('arrows-left-one'));
						$next
						.css(navProperties('arrows-right'))
						.on('click.simpleGal', function(event) {
							clearRestartScroll();
							changeImage("next");
						})
						.children('.arrow')
						.css(navProperties('arrows-right-one'));
					}
					if(settings.navigation == 'dots' || settings.navigation == 'both') {
						var $galNav = $('<div class="gallery-nav"></div>');
						$l.after($galNav);
						var dotList = '';
						if(settings.navigation == 'dots' || settings.navigation == 'both') {
							for (var i = 0; i < numberOfChildren; i++) {
								var $thisDot = $('<a class="dot dot-' + i + ((i === 0) ? ' current' : '') + '" data-number="' + i + '" >' + (i + 1) + '</a>');
								$galNav.css(navProperties('parent')).append($thisDot);
								$thisDot.css(navProperties('dots', i));
							}
						}

						$galNav.find('a').click(function(e) {
							e.preventDefault();
							clearRestartScroll();
							changeImage($(this).index());
						});
					}
					
					if(settings.description){
						var $galDesc = $('<div class="gallery-description"></div>');
						$g.append($galDesc);
						for(var d = 0; d < settings.description.length; d++){
							$galDesc.append('<div class="'+settings.description[d]+'">'+firstDescription[settings.description[d]]+'</div>');
						}
					}

					bindIt($(gEl));
					if(settings.autoScroll){
						autoScroll();
					}

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
				if (settings.description && Array.isArray(settings.description)) {
					$g.find('.gallery-description').animate({
						'opacity': 0
					}, 100, function() {
						var hasDescription = false;
						for (var i = 0; i < settings.description.length; i++) {
							if($l.find('.current').data(settings.description[i])){
								$g.find('.' + settings.description[i]).html($l.find('.current').data(settings.description[i]));
								hasDescription = true;
							}else{
								$g.find('.' + settings.description[i]).empty();
							}
						}
						if(hasDescription){
							$g.find('.gallery-description').animate({
								'opacity': 1
							}, 100);
						}
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
			$(window).resize(function() {
				if(settings.adaptiveHeight){
					$l.css({
						'height': $l.find('.current').children('img').height() + 'px'
					});
				}else{
					$l.css({
					  'height': ($l.outerWidth() / widest) + 'px'
					});
				  }
				if(!galleryInitiated){
					galleryInitiated = setupGallery($(gEl));
				}
			});

		});
	};
}(jQuery));