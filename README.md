
## Demo

Check out a working example on .

## HTML

The form includes basic HTML markup:
```
<section class="customer-logos slider">
	<div class="slide"><img src="images/image1.png"></div>
	<div class="slide"><img src="images/image2.png"></div>
	<div class="slide"><img src="images/image3.png"></div>
	<div class="slide"><img src="images/image4.png"></div>
	<div class="slide"><img src="images/image5.png"></div>
	<div class="slide"><img src="images/image6.png"></div>
	<div class="slide"><img src="images/image7.png"></div>
	<div class="slide"><img src="images/image8.png"></div>
</section>
```

## CSS

All CSS is included in carousel.css.

## JavaScript

In addition to the slick.js resource, the infinite carousel itself needs to be initialized with the following script:
```
<script type="text/javascript">
	$(document).ready(function(){
		$('.customer-logos').slick({
			slidesToShow: 6,
			slidesToScroll: 1,
			autoplay: true,
			autoplaySpeed: 1000,
			arrows: false,
			dots: false,
				pauseOnHover: false,
				responsive: [{
				breakpoint: 768,
				settings: {
					slidesToShow: 4
				}
			}, {
				breakpoint: 520,
				settings: {
					slidesToShow: 3
				}
			}]
		});
	});
</script>
```

