$(function(){

	//debug / resize
	/*$("body").append("<div id='d' style='padding:5px;color:#fff;background:#00f;position:fixed;top:0;left:0;z-index:99999999;'>--</div>");
	$(window).resize(function(){
		$("#d").text(window.innerWidth + " x " + window.innerHeight);
	}).trigger("resize");*/
	//

	var isTouchDevice = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
	var win = $(window);

	var prefix = (function () {
		var styles = window.getComputedStyle(document.documentElement, ''),
			pre = (Array.prototype.slice
			.call(styles)
			.join('') 
			.match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
			)[1],
			dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
		return {
			dom: dom,
			lowercase: pre,
			css: '-' + pre + '-',
			js: pre[0].toUpperCase() + pre.substr(1)
		};
	})();
	//console.log(prefix);


	//force reload page after Back/Forward button (safari)
	//https://stackoverflow.com/a/13123626
	$(window).bind("pageshow", function(event) {
	    if (event.originalEvent.persisted) {
	        window.location.reload() 
	    }
	});


	// preloader
	var images = [];
	var preloadTimeout = 10000;
	var preloadTimer = null;
	
	setBannerImage();
	getImages();
	//console.log(images);

	if(images.length){
		preloadImages(images);
	} else {
		onPreloadComplete();
	}

	function setBannerImage(){
		var pageHead = $(".page-head[data-bg]");
		if(pageHead.length){
			var bgSrc = pageHead.data("bg");
			if(bgSrc){
				if(bgSrc.indexOf("#") > 0){
					var num = ~~(Math.random() * 5) + 1;
					bgSrc = bgSrc.replace("#", num);
				}
				pageHead.data({bg: bgSrc});
				pageHead.css({backgroundImage: "url(" + bgSrc + ")"});

				//add mob img to styleshhet
				var mobBgSrc = bgSrc.replace(".jpg", "_Mobile.jpg");
				var sheet = document.styleSheets[0];
				var cssRule = "@media (max-width: 767px) and (orientation: portrait){.page-head {background-image: url(../" + mobBgSrc + ") !important;}}";
				if("insertRule" in sheet) {
					sheet.insertRule(cssRule);
				} else if("addRule" in sheet) {
					sheet.addRule(cssRule);
				}

				images.push(mobBgSrc);
			}
		}
	}

	function getImages(){
		var el, src, bgImg;
		$("body *").each(function(){
			el = $(this);
			if(el[0].tagName.toLowerCase() == "img"){
				//imgs src
				src = el.attr("src");
				if(src && $.inArray(src, images) < 0) images.push(src);
			} else {
				//bg imgs
				bgImg = el[0].style.backgroundImage;
				bgImg = bgImg.replace(/"/g, '');
				if(bgImg){
					src = bgImg.substring(4, bgImg.length-1);
					if(src && src.length > 5) images.push(src);
				}
			}
		});
	}

	function preloadImages(){
		var totalImages = images.length;
		if (totalImages) {

			var progress = $("<div />").attr({class: "progress"});
			$(".preloader").addClass("loading").append(progress);

			var loaded = loadedPercent = 0;

			$.each(images, function(index, src){
				var img = new Image();

				if(src && typeof src != "undefined" && src != ""){
					img.onload = function(){
		            	clearTimeout(preloadTimer);

		            	loaded++;
		            	loadedPercent = parseInt((loaded / totalImages) * 100);
		            	progress.css({width: loadedPercent + "%"});
		            	//console.log("loaded " + loadedPercent + "%");

		            	if(loaded == totalImages){
		            		setTimeout(onPreloadComplete, 1000);
			            } else {
			            	preloadTimer = setTimeout(onPreloadComplete, preloadTimeout);
			            }
		            }
		            img.src = src;
		        }
			});

		} else {
        	setTimeout(onPreloadComplete, 1000);
        }
	}

	function onPreloadComplete(){
		$("html").addClass("loaded");

		setTimeout(function(){
			$(".preloader").fadeOut(500, function(){
				$(this).remove();
			});
		}, 500);

		initSkrollr();
	}


	//link transition
	$('a[target!="_blank"]').click(function(e){
        var href = this.href;
        if(href.indexOf("#") != -1 || href.indexOf("mailto:") != -1 || href.indexOf("tel:") != -1) return true;
        e.preventDefault();

        $("body").wrapInner("<div class='fx-container'></div>");

        setTimeout(function(){
        	var scrollTop = document.body.scrollTop;
	        $("body").addClass("link-transition");
	        $(".fx-container")[0].scrollTop = scrollTop;
        	$(".header-fixed").css({top: scrollTop});
	    });

        setTimeout(function(){
            window.location = href;
        }, 1000);

        return false;
    });


	if(typeof $.fn.textareaAutoSize != "undefined"){
		$('.field-textarea textarea').textareaAutoSize();
	}


	$('.toggle-info').click(function(){
		var selected = $(this).parents('.person');
		var opened = $('.person.opened').not(selected);
		
		selected.toggleClass('opened').find('.person-info').stop(!0,!0).slideToggle(500, "easeOutQuad");
		opened.removeClass('opened').find('.person-info').stop(!0,!0).slideUp(500, "easeOutQuad");
		return false;
	});


	$('.project-slides').each(function(){
		var slider = $(this);
		slider.slick();
	});


    if( $('.quotes-slider').length ){
        var quoteSlider = $('.quotes-slider').slick({
            infinite: true,
            fade: true,
            speed: 2000,
            arrows: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 6000,
            pauseOnHover: false,
            pauseOnFocus: false,
            swipe: false,
            touchMove: false,
            draggable: false
        });

        quoteSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
            var bgColor = $('.quotes-slider-wr .quotes-slider-item').not('.slick-cloned').eq(nextSlide).data('color');
            if(bgColor){
                $('.quotes-slider-wr').css({background: bgColor});
            }
        });
    }


	$(".header-menu-button").click(function(){
		$(".header-menu-inner").animate({scrollTop: 0}, 1000);
	});

	var btnMenuClose = $("<div />", {"class": "btn-menu-close"});
	$("header .header-menu-inner").append(btnMenuClose);
	btnMenuClose.on("click", function(e){
        e.stopPropagation();
		$("body").removeClass("opened-menu");
		return false;
	});

	$(document).on("click", function(e){
        if(!$(e.target).closest("header").length){
        	e.stopPropagation();
			$("body").removeClass("opened-menu");
        }
	});



	//
	// skrollr
	function initSkrollr(){
		if(window.innerWidth > 767 && !isTouchDevice && typeof skrollr !== "undefined"){

			//lazy anim
			$(".slide-up-group").attr({"data--33p-bottom-top": "z-index:1;", "data-center": "z-index:1"});
			$(".slide-up").attr({"data--33p-bottom-top": "z-index:1;", "data-center": "z-index:1"});
			$(".slide-up-scale").attr({"data--33p-bottom-top": "z-index:1;", "data-center": "z-index:1"});

			$(".project-imgs, .project-slides").addClass("fade-img").attr({"data-bottom-top": "z-index:1;", "data-center": "z-index:1;"});

			$(".client-logos ul").attr({"data-bottom-top": "border-color:rgba(231,231,231,0);", "data-top": "border-color:rgba(231,231,231,1);"});

			$(".client-logos img").wrap("<span></span>");
			$(".client-logos span").attr({"data--33p-bottom-top": "opacity:0; transform:scale(.3);", "data-center": "opacity:1; transform:scale(1);"});

			$(".value").attr({"data--33p-bottom-top": "z-index:1;", "data-center": "z-index:1"});

			//process elements
			$(".elements").attr({"data--33p-bottom-top": "z-index:1;", "data-center": "z-index:1;"});

			//process circles
			$(".circles").attr({"data--35p-bottom-top": "z-index:1;", "data-center": "z-index:1;"});

			//start project
			$(".start-project").attr({"data--40p-bottom-top": "z-index:1;", "data-center": "z-index:1;"});

			//footer
			if(window.innerHeight * .33 > 400){
				$(".footer").attr({"data--20p-bottom-top": "z-index:1;", "data-center": "z-index:1;"});
			} else {
				$(".footer").attr({"data--30p-bottom-top": "z-index:1;", "data-center": "z-index:1;"});
			}

			skrollr.init({
				forceHeight: false
			});
		}
	}


	//hero parallax/animations
	var heroBg = $(".page-head[data-bg]");
	var heroText = $(".page-head-inner");
	var heroScroll = $(".head-scroll > div");
	if(heroBg.length || heroText.length){

		if(heroBg.length){
			var dim = $("<div />", {"class": "dim"});
			heroBg.append(dim); 
		}

		win.on("scroll", function(){
			var scrollTop = win.scrollTop();
			if(scrollTop < window.innerHeight){
				if(heroBg.length){
					heroBg.css({backgroundPositionY: scrollTop * .3 + "px"});
					dim.css({opacity: scrollTop*1.5 / window.innerHeight});
				}

				if(heroText.length){
					var textCssObj = {opacity: 1 - scrollTop*2.5 / window.innerHeight};
					textCssObj[prefix.js + "Transform"] = "translateY(-" + (scrollTop*.3) + "px)";
					heroText.css(textCssObj);
				}

				var scrollCssObj = {opacity: 1 - scrollTop*3 / window.innerHeight};
				scrollCssObj[prefix.js + "Transform"] = "translateY(" + (scrollTop*.5) + "px)";
				heroScroll.css(scrollCssObj);
			}
		}).trigger("scroll");
	}

	var projParallax = $(".project-parallax");
	if(projParallax.length){
		var projParallaxTop = projParallax.offset().top;

		win.on("scroll", function(){
			var scrollTop = win.scrollTop();
			var bgPosY = (scrollTop - projParallaxTop) * .5;
			projParallax.css({backgroundPositionY: bgPosY + "px"});
		}).trigger("scroll");

		win.on("resize orientationchange", function(){
			projParallaxTop = projParallax.offset().top;
		});
	}


	//custom cursor
	if(!isTouchDevice){
		var cursorBox = $("html").addClass("js-cursor");
		var cursor = $("<div />", {"class": "cursor"});
		$("body").append(cursor);
	
		win.on("mousemove mouseenter", function(e){
			var x = e.clientX;
			var y = e.clientY;
			cursor.css({top: y, left: x});
		}).trigger("mousemove");

		$(document).on("mouseenter", function(e){
    		cursorBox.removeClass("cursor-out");
		}).on("mouseleave", function(e){
    		cursorBox.addClass("cursor-out");
		});

		$(".project-slides .slide").on("mouseover", function(){
			cursorBox.addClass("cursor-hide");
		}).on("mouseleave", function(){
			cursorBox.removeClass("cursor-hide");
		});

		$("a, button, form label, .dot").on("mouseover", function(){
			cursorBox.addClass("cursor-over");
		}).on("mouseleave", function(){
			cursorBox.removeClass("cursor-over");
		});
	}


	//who we are mob
	$(".btn-toggle-who").click(function(){
		$(".cols-wrap").toggleClass("cols-shift");
		return false;
	});



	//counters

	var stats = $(".stats");
	if(stats.length && typeof CountUp != "undefined"){
		setupCounters();

		win.on("scroll.stats resize.stats", $.throttle(100, function(){
			var scrollTop = win.scrollTop();
			var statsTop = stats.offset().top;
			//var startPos = statsTop - window.innerHeight + 300;
			var startPos = statsTop - window.innerHeight * .66;
			//console.log(scrollTop, startPos, statsTop);

			if(scrollTop >= startPos){
				win.off("scroll.stats resize.stats");
				//console.log("start");
				startCounters();
				stats.addClass("counter-start");
			}
		})).trigger("scroll.stats");
	}

	function setupCounters(){
		$(".stat-col strong").each(function(){
			var counter = $(this);
			var val = counter.text();
			counter.text("0").data({val: val});
		});
	}

	function startCounters(){
		var duration = 2; //sec

		$(".stat-col strong").each(function(){
			var counter = $(this);
			var val = counter.data("val");

			var start = 0;
			var end = val;
			var decimals = 0;

			var options = {
				suffix: "",
				separator: "",
				useEasing: true
			}

			if(val.indexOf(",") > 0){
				options.separator = ",";
				end = val.replace(",", "");
			}

			if(val.indexOf("k+") > 0){
				options.suffix = "k+";
				end = val.replace("k+", "");
			} 
			else if(val.indexOf("k") > 0){
				options.suffix = "k";
				end = val.replace("k", "");
			}

			if(val.indexOf("%") > 0){
				options.suffix = "%";
				end = val.replace("%", "");
			}

			if(val.indexOf("x") > 0){
				options.suffix = "x";
				end = val.replace("x", "");
			}

			if(val.indexOf("b+") > 0){
				options.suffix = "b+";
				end = val.replace("b+", "");
			}

			if(val.indexOf(".") > 0){
				decimals = ((end + "").split(".")[1]).length;
			}

			var count = new CountUp(counter[0], 0, end, decimals, duration, options);
			if (!count.error) {
				count.start();
			} else {
				console.error(count.error);
			}
		});

		setTimeout(function(){
			$(".stat-col span").hide().show(0);
		}, duration * 1000 - 500);
	}


	//videos
	var videoOverlay = $(".video-overlay");
	if(videoOverlay.length){
		var videoFrame = $("iframe", videoOverlay);
		$(document).on("click", "a.btn-video", function(e){
			var src = $(this).data("src");
			if(!src || src == "") return;
			e.preventDefault();

			videoOverlay.fadeIn(200, function(){
				videoFrame.attr({src: src});
				videoOverlay.addClass("video-active");
			});

			return false;
		});

		videoOverlay.on("click", function(){
			videoOverlay.removeClass("video-active");
			videoOverlay.fadeOut(500, function(){
				videoFrame.removeAttr("src");
			});
			return false;
		});
	}


	//contact form
	var form = $("#contact-form");
	if(form.length){

		var submitBtn = $(".btn-submit");
		submitBtn.click(function(){
			var isValid = true;

			//fields
			$("[required]:visible", form).each(function(){
				var field = $(this);
				var fieldBox = field.parents(".field:first");
				var val = field.val();

				if(!val || val.length < 2 || (field.attr("type") == "email" && !/^[\+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(val))){
					fieldBox.addClass("err");
					isValid = false;
				} else {
					fieldBox.removeClass("err");
				}
			}).on("keyup blur", function(){
				var field = $(this);
				var fieldBox = field.parents(".field:first");
				var val = field.val();
				if((val && val.length >= 2 && field.attr("type") != "email") || (field.attr("type") == "email" && /^[\+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(val))){
					fieldBox.removeClass("err");
				}
			});

			//checkboxes
			var fieldBox = $(".field-cb");
			var cb_vals = [];
			$("input[type=checkbox]", fieldBox).each(function(){
				var cb = $(this);
				if(cb.prop("checked")) cb_vals.push(cb.next("label").text());
			}).on("change", function(){
				fieldBox.removeClass("err");
			});

			if(!cb_vals.length){
				fieldBox.addClass("err");
				isValid = false;
			}

			if(!isValid) return false;

			//submit
			var data = {
	    		name: $("[name=name]", form).val(),
				email: $("[name=email]", form).val() || $("[name=email2]", form).val(),
				phone: $("[name=phone]", form).val() || $("[name=phone2]", form).val(),
				company: $("[name=company]", form).val(),
				interested: cb_vals.join("; "),
				question: $("[name=question]", form).val(),
				hp: $("[name=message]", form).val() //honeypot
	    	}

	    	console.log(data);
	    	//return false;

	    	$.ajax({
	    		url: "send-form.php",
	    		data: data,
	    		type: "POST",
	    		cache: false,
	    		dataType: "json",
	    		timeout: 10000,
	    		beforeSend: function(){
		    		submitBtn.addClass("btn-disabled");
		    	}
	    	})
	    	.done(function(data, status) {
	    		if(data !== "undefined" && data.status === "OK"){
					document.location.href = "thankyou.html";
		    	} else {
		    		onSubmitError();
		    	}
	    	})
	    	.fail(function(jqXHR, status, error){
	    		onSubmitError();
	    	})
	    	.always(function(data, status, error){
		    	submitBtn.removeClass("btn-disabled");
		    });

			return false;
		});

		function onSubmitError(){
			setTimeout(function(){
				submitBtn.removeClass("btn-disabled");
			}, 2000);
	    }
	}

});


/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2008 George McGinley Smith
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158; 
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright Â© 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */

