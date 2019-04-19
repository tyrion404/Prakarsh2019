/* slider http://themenectar.com/demo/salient-slider-portfolio/ */

$(function(){

    function portfolioFullScreenSliderCalcs() {
        $('.slider').each(function() {
            $(this).css('height', $(window).height());
        });
    }

    function nectarCustomSliderRotate(slider) {
        var $controlSelector = (slider.find('.slides').length > 0) ? '.dot-nav > span' : '.controls > li';
        var $controlSelectorInd = (slider.find('.slides').length > 0) ? 'span' : ' li';
        var $slideLength = slider.find($controlSelector).length;
        var $currentSlide = slider.find($controlSelector + '.active').index();
        if ($currentSlide + 1 == $slideLength) {
            slider.find($controlSelector + ':first-child').click();
        } else {
            slider.find($controlSelector + '.active').next($controlSelectorInd).click();
        }
    }

    function sliderAutoRotate(slider) {
        clearTimeout(slider.autorotate);
        slider.autorotate = setTimeout(function(){
            nextSlide(slider);
            sliderAutoRotate(slider);
        }, 7500);
    }


    if ($('.slider').length > 0) {
        portfolioFullScreenSliderCalcs();
        $(window).resize(portfolioFullScreenSliderCalcs);
    }

    $('.slider').each(function() {
        var slider = $(this);
        var slidesCount = slider.find('.slide').length;

        slider.autorotate = null;
        slider.slidesCount = slidesCount;

        $('.slide', slider).each(function(i) {
            var h1 = $(this).find("h1");
            var h1_html = h1.html();
            h1_html = h1_html.replace(/<br>/g, " <br> ");
            var h1_words = h1_html.split(" ");
            var new_html = "";

            $.each(h1_words, function(index, word){
                word = $.trim(word);
                if(word != "" && word != " " && word != "&nbsp;"){
                    if(index > 0 && word === h1_words[index-1]) return;

                    if(word.indexOf("<br>") != -1){
                        new_html += word;
                        return;
                    }

                    new_html += "<span><span>" + word + "</span></span> ";
                }
            });

            h1.html(new_html);
        });


        $('.slider-controls .next', slider).click(function() {
            var $that = $(this);
            if (slider.hasClass('timeout')){
                return false;
            } else {
                setTimeout(function() {
                    slider.removeClass('timeout');
                }, 1150);
                slider.addClass('timeout');
            }

            sliderAutoRotate(slider);

            var $current = slider.find('.slide.current');
            $('.slide', slider).removeClass('next prev').each(function(i) {
                if (i < $current.index() + 1 && $current.index() + 1 < slidesCount){
                    $(this).addClass('prev');
                } else {
                    $(this).addClass('next');
                }
            });
            if ($current.index() + 1 == slidesCount) {
                $('.slide:first-child', slider).addClass('no-trans');
            }

            setTimeout(function() {
                if ($current.index() + 1 == slidesCount) {
                    $('.slide:first-child', slider).removeClass('no-trans next prev').addClass('current');
                    $('.slide:last-child', slider).removeClass('next current').addClass('prev');
                } else {
                    $current.next('.slide').removeClass('next prev').addClass('current');
                    $current.removeClass('current').addClass('prev');
                }
                if ($('.dot-nav', slider).length > 0) {
                    $('.dot-nav span.active', slider).removeClass('active');
                    $('.dot-nav span:nth-child(' + ($('.slide.current', slider).index()+1) + ')', slider).addClass('active');
                }
            }, 30);

            return false;
        });

        $('.slider-controls .prev', slider).click(function() {
            var $that = $(this);
            if (slider.hasClass('timeout')){
                return false;
            } else {
                setTimeout(function() {
                    slider.removeClass('timeout');
                }, 1150);
                slider.addClass('timeout');
            }

            sliderAutoRotate(slider);

            var $current = $('.slide.current', slider);
            $('.slide', slider).removeClass('next prev').each(function(i) {
                if (i < $current.index() || $current.index() == 0){
                    $(this).addClass('prev');
                } else {
                    $(this).addClass('next');
                }
            });
            if ($current.index() == 0){
                $('.slide:last-child', slider).addClass('no-trans');
            }
            setTimeout(function() {
                if ($current.index() == 0) {
                    $('.slide:last-child', slider).removeClass('no-trans next prev').addClass('current');
                    $('.slide:first-child', slider).removeClass('next prev current').addClass('next');
                } else {
                    $current.prev('.slide').removeClass('next prev').addClass('current');
                    $current.removeClass('current').addClass('next');
                }
                if ($('.dot-nav', slider).length > 0) {
                    $('.dot-nav span.active', slider).removeClass('active');
                    $('.dot-nav span:nth-child(' + ($('.slide.current', slider).index() + 1) + ')', slider).addClass('active');
                }
            }, 30);
            return false;
        });

        //dots
        var dotNav = $('<div />').attr({'class': 'dot-nav'});

        $('.slide', slider).each(function(index, el){
            var classes = $(this).attr("class").split(" ");
            var themeClass = typeof classes[1] != "undefined" ? classes[1] : "";
            //console.log(themeClass);

            if (index == 0) {
                dotNav.append('<span class="dot active ' + themeClass + '"><span></span></span>');
            } else {
                dotNav.append('<span class="dot ' + themeClass + '"><span></span></span>');
            }
        });

        slider.find('> .normal-container').append(dotNav);

        var $dotIndex = 1;
        dotNav.find('> span').click(function() {
            if ($(this).hasClass('active')) return;

            if (slider.hasClass('timeout')){
                return false;
            } else {
                setTimeout(function() {
                    slider.removeClass('timeout');
                }, 1150);
                slider.addClass('timeout');
            }

            sliderAutoRotate(slider);

            $(this).parent().find('span.active').removeClass('active');
            $(this).addClass('active');

            $dotIndex = $(this).index() + 1;
            var $current = $('.slide.current', slider);
            var $prevIndex = $current.index() + 1;
            $('.slide', slider).removeClass('next prev').each(function(i) {
                if (i < $dotIndex - 1)
                    $(this).addClass('prev');
                else
                    $(this).addClass('next');
            });
            if ($prevIndex > $dotIndex) {
                $('.slide', slider).eq($dotIndex - 1).addClass('no-trans prev').removeClass('next');
                setTimeout(function() {
                    $('.slide', slider).eq($dotIndex - 1).removeClass('no-trans next prev').addClass('current');
                    $current.removeClass('current').addClass('next');
                }, 30);
            }
            else {
                $('.slide', slider).eq($dotIndex - 1).addClass('no-trans next').removeClass('prev');
                setTimeout(function() {
                    $('.slide', slider).eq($dotIndex - 1).removeClass('no-trans next prev').addClass('current');
                    $current.removeClass('current').addClass('prev');
                }, 30);
            }
        });

        //keyboard
        $(document).keydown(function(e) {
            switch(e.which) {
                case 37: case 40: // prev
                    $('.slider-controls .prev', slider).trigger('click');
                    break;

                case 39: case 38:// next
                    $('.slider-controls .next', slider).trigger('click');
                    break;

                default: return;
            }
            e.preventDefault();
        });

        //mousewheel
        $(window).bind('mousewheel DOMMouseScroll', function(e){
            if(window.innerWidth > 767){
                if(e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0){
                    //console.log("up");
                    $('.slider-controls .prev', slider).trigger('click');
                } else {
                    //console.log("down");
                    $('.slider-controls .next', slider).trigger('click');
                }
            }
        });

        //swipes
        var isTouchDevice = "ontouchstart" in window || navigator.msMaxTouchPoints > 0;
        if(isTouchDevice && typeof $.fn.swipe != "undefined"){
            $(".slider").swipe({
                swipeLeft: function(event, distance, duration, fingerCount, fingerData, currentDirection) {
                    //console.log("swipe left");
                    $('.slider-controls .prev', slider).trigger('click');
                },
                swipeRight: function(event, distance, duration, fingerCount, fingerData, currentDirection) {
                    //console.log("swipe right");
                    $('.slider-controls .next', slider).trigger('click');
                }
            });
        }


        //autoslide
        sliderAutoRotate(slider);
    });


    function nextSlide(slider){
        if (slider.hasClass('timeout')){
            sliderAutoRotate(slider);
            return false;
        } else {
            setTimeout(function() {
                slider.removeClass('timeout');
            }, 1150);
            slider.addClass('timeout');
        }

        var $current = slider.find('.slide.current');
        $('.slide', slider).removeClass('next prev').each(function(i) {
            if (i < $current.index() + 1 && $current.index() + 1 < slider.slidesCount){
                $(this).addClass('prev');
            } else {
                $(this).addClass('next');
            }
        });
        if ($current.index() + 1 == slider.slidesCount) {
            $('.slide:first-child', slider).addClass('no-trans');
        }

        setTimeout(function() {
            if ($current.index() + 1 == slider.slidesCount) {
                $('.slide:first-child', slider).removeClass('no-trans next prev').addClass('current');
                $('.slide:last-child', slider).removeClass('next current').addClass('prev');
            } else {
                $current.next('.slide').removeClass('next prev').addClass('current');
                $current.removeClass('current').addClass('prev');
            }
            if ($('.dot-nav', slider).length > 0) {
                $('.dot-nav span.active', slider).removeClass('active');
                $('.dot-nav span:nth-child(' + ($('.slide.current', slider).index()+1) + ')', slider).addClass('active');
            }
        }, 30);
    }

});


/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
// !function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});