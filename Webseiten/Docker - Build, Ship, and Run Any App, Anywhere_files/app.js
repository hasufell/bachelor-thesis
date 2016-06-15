jQuery(document).foundation({
  equalizer : {
    equalize_on_stack: true
  }
});
wow = new WOW(
  {
    boxClass:     'wow',      // default
    animateClass: 'animated', // default
    offset:       200,          // default
    mobile:       false,       // default
    live:         true        // default
  }
)
wow.init();

	if ($('.heronav_section').length > 0) {
			$('.heronav_section').affix({
				offset: {
					top:$(".heronav_section").offset().top,
		bottom: $('footer').outerHeight(true)
				}
			});
		}	
jQuery.each( jQuery.browser, function( i, val ) {
  $('html').addClass(i, val);
});
$(document).on('click', 'a[href*="#"]:not(.noanchor , .find_a_partner_section .cbp-caption-defaultWrap, .strategic_alliances_tabs li a)', function() {
      if ( this.hash && this.pathname === location.pathname ) {
        $.bbq.pushState( '#/' + this.hash.slice(1) );
        return false;
      }
    }).ready(function() {
      $(window).bind('hashchange', function(event) {
        var tgt = location.hash.replace(/^#\/?/,'');
        if ( document.getElementById(tgt) ) { 
			//$.smoothScroll.animateScroll( null,{scrollTarget: '#' + tgt }, { speed: 1000, easing: 'easeOutCubic' } );
			if ($('body').hasClass('node-type-products') || $('body').hasClass('node-type-product') || $('body').hasClass('node-type-use-cases') || $('body').hasClass('node-type-use-case') || $('body').hasClass('node-type-enterprise') || $('body').hasClass('node-type-government') || $('body').hasClass('node-type-partners') || $('body').hasClass('node-type-partner-programs')) {
				 if ($(window).width() > 991 ) {
						$('html,body').animate({ scrollTop: $('#' + tgt).offset().top -69}, 'slow');
					} else if($(window).width() > 768 && $(window).width() < 991 ) {
						$('html,body').animate({ scrollTop: $('#' + tgt).offset().top -59}, 'slow');
					} else {
							$('html,body').animate({ scrollTop: $('#' + tgt).offset().top -59}, 'slow');
					}
			} else {
				$.smoothScroll({scrollTarget: '#' + tgt});
			}
			//$.smoothScroll({scrollTarget: '#' + tgt});
        }
      });
      $(window).trigger('hashchange');
    });
(function($) {
  $('.bsr-item-detail').hide();
  $('.bsr-item').on('click', function(e) {
    e.preventDefault();
    // find the target of the clicked anchor tag
    var targetBSR = $(this).find('a')[0].hash;
    var parentBSR = $(this);
    // hide detail containers, not the the current target
    $('.bsr-item-detail').not(targetBSR).hide();
    // toggle current target detail container
    $(targetBSR).slideToggle();

    // toggle parent active class
    if (parentBSR.hasClass('is-active')) {
      parentBSR.removeClass('is-active');
    }
    else {
      // wipe out all other active classes
      $('.bsr-item').each(function() {
        $(this).removeClass('is-active');
      });
      // add active class to the current parent
      parentBSR.addClass('is-active');
    }
  });
  $('.quotes_slider').flexslider({
    animation: "slide",
	directionNav: false
  });
  $('.CTA_section').each(function() {
		$(this).children('.mheight').matchHeight();
		});
  $('.CTA_section .row').each(function() {
		$(this).children('.CTA_item').matchHeight();
		}); 
  $('.resources_items.row').each(function() {
		$(this).children('.resources_link').matchHeight();
		});
  $('.mhp').each(function() {
		$(this).children('.mhc').matchHeight();
		});
 $('a[target="_video"]').magnificPopup({
	  midClick: true,
	  type: 'iframe',
	  mainClass: 'mfp-fade',
	  removalDelay: 160,
	  preloader: false,
	  disableOn: 280,
	  fixedContentPos: false
   });
 $('a[rel="video"]').magnificPopup({
	  midClick: true,
	  type: 'iframe',
	  mainClass: 'mfp-fade',
	  removalDelay: 160,
	  preloader: false,
	  disableOn: 280,
	  fixedContentPos: false
   });
$(window).load(function() {
	$(window).trigger("resize");
});
$(window).resize(function() {
	$('body>.off-canvas-wrap').css('min-height', $(window).height() - ($('.main-footer').outerHeight(true)));
	$(".plan_name2 , .plan_name3").height($(".plan_name1").outerHeight(true));
	var maxHeight_title = -1;
	maxHeight_title = maxHeight_title > $(".ibm_solutions .title").height() ? maxHeight_title : $(".ibm_solutions .title").height();
	$(".ibm_solutions .title").height(maxHeight_title);
	var maxHeight_body = -1;
	
	maxHeight_body = maxHeight_body > $(".ibm_solutions .body").height() ? maxHeight_body : $(".ibm_solutions .body").height();
	$(".ibm_solutions .body").height(maxHeight_body);
	
	var maxHeight_productbox = -1;
   $('.docker_solutions_section  .media').each(function() {
     maxHeight_productbox = maxHeight_productbox > $(this).height() ? maxHeight_productbox : $(this).height();
   });
   $('.docker_solutions_section  .media').each(function() {
     $(this).height(maxHeight_productbox);
   });
   
   var maxHeight_productboxul = -1;
   $('.docker_solutions_section  .body_box ul').each(function() {
     maxHeight_productboxul = maxHeight_productboxul > $(this).height() ? maxHeight_productboxul : $(this).height();
   });
   $('.docker_solutions_section  .body_box ul').each(function() {
     $(this).height(maxHeight_productboxul);
   });
   
   var maxHeight_productpricing = -1;
   $('section.pricing_product_section .plan_box .header').each(function() {
     maxHeight_productpricing = maxHeight_productpricing > $(this).height() ? maxHeight_productpricing : $(this).height();
   });
   $('section.pricing_product_section .plan_box .header').each(function() {
     $(this).height(maxHeight_productpricing);
   });
   
   var maxHeight_productdemo = -1;
   $('section.demo_product_section .items li .mheight').each(function() {
     maxHeight_productdemo = maxHeight_productdemo > $(this).height() ? maxHeight_productdemo : $(this).height();
   });
   $('section.demo_product_section .items li .mheight').each(function() {
     $(this).height(maxHeight_productdemo);
   });
   
   var maxHeight_productuse = -1;
   $('section.use_product_section .items li .mheight').each(function() {
     maxHeight_productuse = maxHeight_productuse > $(this).height() ? maxHeight_productuse : $(this).height();
   });
   $('section.use_product_section .items li .mheight').each(function() {
     $(this).height(maxHeight_productuse);
   });
}).trigger("resize");

$(window).load(function() { 
   var maxHeight_use_cases_overview_h3 = -1;
   $('section.use_cases_section .items li .item-link').each(function() {
     maxHeight_use_cases_overview_h3 = maxHeight_use_cases_overview_h3 > $(this).height() ? maxHeight_use_cases_overview_h3 : $(this).height();
   });
   $('section.use_cases_section .items li .item-link').each(function() {
     $(this).height(maxHeight_use_cases_overview_h3 + 15);
   });
   
   var maxHeight_use_cases_overview_p = -1;
   $('section.use_cases_section .items li p').each(function() {
     maxHeight_use_cases_overview_p = maxHeight_use_cases_overview_p > $(this).height() ? maxHeight_use_cases_overview_p : $(this).height();
   });
   $('section.use_cases_section .items li p').each(function() {
     $(this).height(maxHeight_use_cases_overview_p);
   });
});
$(document).ready(loadRetina);
$(window).resize(loadRetina);
function loadRetina() { 
    if(window.devicePixelRatio > 1) {
        $('html,body').addClass('retina-display');
    } else {
       $('html,body').removeClass('retina-display');
    }
}
$(".plans_tabs ul a").click(function(event) {
        event.preventDefault();
		var tab = $(this).attr("href");
        $(this).parent().addClass("current").siblings().removeClass("current");
        $(tab).addClass("current").fadeIn().siblings('.plans').removeClass("current").hide();
});
$('.faq-body').each(function() {
	$(this).parent('.faq').addClass('collapsible');
});
$(".faqs-group").on( "click", ".faq-title", function(e) {
	e.preventDefault();
	var $FAQ = $(this).parent(".faq"), $FAQz = $(".faq").not($FAQ);
	$FAQ.toggleClass("active");
	$(".faq-body",$FAQ).slideToggle(300)
	$FAQz.removeClass("active");
	$(".faq-body",$FAQz).slideUp(300);
});
if ($(window).width() > 1199) {
		$(".faqs_section .faqs-group").height($(".faqs-group .col-xs-12").outerHeight(true) + 120);
	} else if ($(window).width() < 1200 && $(window).width() > 991) {
		$(".faqs_section .faqs-group").height($(".faqs-group .col-xs-12").outerHeight(true) + 180);
	} else if ($(window).width() < 992 && $(window).width() > 767) {
		$(".faqs_section .faqs-group").height($(".faqs-group .col-xs-12").outerHeight(true) + 190); 
	} else {
		$(".faqs_section .faqs-group").height($(".faqs-group .col-xs-12").outerHeight(true) + $(".faqs-group .col-xs-12").outerHeight(true) + 70);
	}
	
	$('.serverplan_boxs').each(function() {
		$(this).children('.col-sm-4').matchHeight();
	});
	$('.plans_section .cloud_plan_boxs').each(function() {
		$(this).children('.col-xs-12').matchHeight();
	});

var sliderRepoMap = [1, 5, 10, 20, 50, 100, 250]
,	RepoSlider = $( "#RepoSlider" )
,	CmSupport = $("#RepoCommercialSupport")
,	CrSupport = $("#RepoCriticalSupport")
,	BuyButtontxt
,	BuyButtonURL
,	Repos
,	RepoPrice
,	RepoPricing
,	PricingInfo
,	RepoSliderVal;

	RepoSlider.slider({
		value: 3,
		min: 0,
		max: sliderRepoMap.length-1,
		slide: function( event, ui ) {
			RepoPlans(ui.value)
			CmSupport.prop('checked', false).prop('disabled', false);
			CrSupport.prop('checked', false);
			$.bbq.pushState( '#/repo-' + sliderRepoMap[ui.value] );
		},
		change :function( event, ui ) {
			RepoPlans(RepoSlider.slider('value'))
			$.bbq.pushState( '#/repo-' + sliderRepoMap[RepoSlider.slider('value')] );
		}
	}).slider("pips", {
		rest: "label",
		labels: sliderRepoMap
	});
$("#RepoSlider.ui-slider-pips .ui-slider-label").on( "click", function(e) {
	CmSupport.prop('checked', false).prop('disabled', false);
	CrSupport.prop('checked', false);
});
$(window).on('load', RepoPlans(RepoSlider.slider('value')));
function RepoPlans(RepoSliderValue) {
	RepoSliderVal = RepoSliderValue;
	if(RepoSliderVal == 0){
		RepoPrice = 0;
		RepoPricing = RepoPricing_free;
		BuyButtontxt = buybuttontxt_signup;
	} else if(RepoSliderVal < 4) {
		RepoPrice = parseFloat(sliderRepoMap[RepoSliderVal]) + 2;
		RepoPricing = '<span class="">$</span> <span>' + RepoPrice + '</span> / month';
		BuyButtontxt = BuyButtontxt_buy;
	} else {
		RepoPrice = parseFloat(sliderRepoMap[RepoSliderVal]);
		RepoPricing = '<span class="">$</span> <span>' + RepoPrice + '</span> / month';
		BuyButtontxt = BuyButtontxt_buy;
	}
	if(RepoSliderVal == 0) {
		BuyButtonURL = BuyButtonURL_0;
	} else if(RepoSliderVal == 1) {
		BuyButtonURL = BuyButtonURL_1;
	} else if(RepoSliderVal == 2) {
		BuyButtonURL = BuyButtonURL_2;
	} else if(RepoSliderVal == 3) {
		BuyButtonURL = BuyButtonURL_3;
	} else if(RepoSliderVal == 4) {
		BuyButtonURL = BuyButtonURL_4;
	} else if(RepoSliderVal == 5) {
		BuyButtonURL = BuyButtonURL_5;
	} else if(RepoSliderVal == 6) {
		BuyButtonURL = BuyButtonURL_6;
	} else {
		BuyButtonURL = BuyButtonURL_0;
	}
	Repos = sliderRepoMap[RepoSliderVal];
	if(RepoSliderVal == 0) {
		PricingInfo = '<li>'+Repos+PricingInfo_freeText+'</li>';
	} else {
		PricingInfo = '<li>'+Repos+PricingInfo_Text+'</li>';
	}
	$('#PricingInfo').html(PricingInfo);
	$('#RepoBuyButton').text(BuyButtontxt);
	$('#RepoBuyButton').attr('href', BuyButtonURL);
	$('#RepoPricing').html(RepoPricing);
}

$(CmSupport).on('change', RepoCommercialSupport);
function RepoCommercialSupport() {
	RepoSliderVal = RepoSlider.slider('value');
	RepoSlider.slider('value', 3);
	if((CmSupport).is(':checked')) {
		Repos = sliderRepoMap[RepoSliderVal];
		RepoPrice = 150;
		RepoPricing = '<span class="">$</span> <span>' + RepoPrice + '</span> / month';
		BuyButtontxt = BuyButtontxt_buy;
		BuyButtonURL = BuyButtonURL_cloud_starter;
		PricingInfo = '<li>'+Repos+PricingInfo_CommercialSupportText+'</li>';
		$('#PricingInfo').html(PricingInfo);
		$('#RepoBuyButton').text(BuyButtontxt);
		$('#RepoBuyButton').attr('href', BuyButtonURL);
		$('#RepoPricing').html(RepoPricing);
		$.bbq.pushState( '#/repo-commercial-support' );
	} else {
		RepoPlans(RepoSlider.slider('value'));
		RepoSlider.slider('enable');
		$.bbq.pushState( '#/repo-' + sliderRepoMap[RepoSlider.slider('value')] );
	}
}

$(CrSupport).on('change', RepoCriticalSupport);
function RepoCriticalSupport() {
	RepoSliderVal = RepoSlider.slider('value');
	RepoSlider.slider('value', 3);
	if((CrSupport).is(':checked')) {
		CmSupport.prop('checked', true).prop('disabled', true);
		Repos = sliderRepoMap[RepoSliderVal];
		RepoPricing = RepoPricing_CriticalSupport;
		BuyButtontxt = buybuttontxt_quote;
		BuyButtonURL = BuyButtonURL_inquiry;
		PricingInfo = '<li>'+Repos+PricingInfo_CriticalSupportText+'</li>';
		$('#PricingInfo').html(PricingInfo);
		$('#RepoBuyButton').text(BuyButtontxt);
		$('#RepoBuyButton').attr('href', BuyButtonURL);
		$('#RepoPricing').html(RepoPricing);
		$.bbq.pushState( '#/repo-critical-support' );
	} else {
		CmSupport.prop('disabled', false);
		RepoCommercialSupport();
	}
}
if(window.location.hash.match('repo-') != null) {
	var repopkg = location.hash.replace(/^#\/repo-?/,'');
//	alert(repopkg);
	if(repopkg == 'commercial-support') {
		$('a[href*="#tab-cloud"]').parent().addClass("current").siblings().removeClass("current");
        $('#tab-cloud').addClass("current").fadeIn().siblings('.plans').removeClass("current").hide();
		CmSupport.prop('checked', true);
		RepoCommercialSupport();
	} else if (repopkg == 'critical-support') {
		$('a[href*="#tab-cloud"]').parent().addClass("current").siblings().removeClass("current");
        $('#tab-cloud').addClass("current").fadeIn().siblings('.plans').removeClass("current").hide();
		CrSupport.prop('checked', true);
		RepoCriticalSupport();
	} else {
		repopkg = jQuery.inArray( parseFloat(repopkg), sliderRepoMap );
		$('a[href*="#tab-cloud"]').parent().addClass("current").siblings().removeClass("current");
        $('#tab-cloud').addClass("current").fadeIn().siblings('.plans').removeClass("current").hide();
		RepoSlider.slider('value', repopkg);
	}
}

if(window.location.hash === "#/forcloud" || window.location.hash === "#forcloud" || window.location.hash === "#/forserver" || window.location.hash === "#forserver") {
		var tab = location.hash.replace(/^#\/for?/,'#tab-');
        $('a[href*="'+tab+'"]').parent().addClass("current").siblings().removeClass("current");
        $(tab).addClass("current").fadeIn().siblings('.plans').removeClass("current").hide();
}

$('.products-items').each(function() {
		$(this).children('li').matchHeight();
	});
$(".nolinkhere").on('click', function(e) {
	e.preventDefault();
});
$('.ibm_solutions').each(function() {
		$(this).children('.ibm_solution').matchHeight();
		});

var check_initfederal_item01 = true;
var check_initfederal_item02 = true;
var check_initfederal_item03 = true;
$(window).scroll(function() {
	var visibilityfederal_item01 = $('#federal_item01.federal_item').css('visibility');
	if (visibilityfederal_item01 == 'visible'){
		if(check_initfederal_item01){
			initfederal_item01();
			check_initfederal_item01 = false;
		}
	}
});
$(window).scroll(function() {
	var visibilityfederal_item02 = $('#federal_item02.federal_item').css('visibility');
	if (visibilityfederal_item02 == 'visible'){
		if(check_initfederal_item02){
			initfederal_item02();
			check_initfederal_item02 = false;
		}
	}
});
$(window).scroll(function() {
	var visibilityfederal_item03 = $('#federal_item03.federal_item').css('visibility');
	if (visibilityfederal_item03 == 'visible'){
		if(check_initfederal_item03){
			initfederal_item03();
			check_initfederal_item03 = false;
		}
	}
});
$(window).load(function() {
	if ($('body').hasClass('page-node-6439')){
		initfederal_all_item();
	}
});
$(window).load(function() {
	var isoOptions = {
		itemSelector : '.events_region',
		masonry: {
			columnWidth: '.col-md-6'
		}
	};
	var $grid = $('.events_section .events_regions').isotope( isoOptions );
	$('.event-search input.ng-valid').on('keyup', function() {
			if ($(".events_regions .events_region").siblings().size() > 1) { 
				$('.events_regions .events_region').removeClass('row'); 
				$('.events_regions .events_region').addClass('col-xs-12 col-sm-6 col-md-6'); 
				$('.events_regions .events_region .media.events_item').removeClass('col-xs-12 col-sm-6 col-md-6'); 
				$('.events_regions .events_region .events_region_name').removeClass('col-xs-12 col-md-12');
				$('.events_regions').removeClass('margintop55'); 
					$grid.isotope('destroy');				
				//	$grid.isotope('reloadItems')
					$grid.isotope({
							itemSelector : '.events_region',
							masonry: {
								columnWidth: '.col-md-6'
							}
					});
			} else { 
				$('.events_regions .events_region').addClass('row');
				$('.events_regions .events_region').removeClass('col-xs-12 col-sm-6 col-md-6'); 
				$('.events_regions .events_region .media.events_item').addClass('col-xs-12 col-sm-6 col-md-6'); 
				$('.events_regions .events_region .events_region_name').addClass('col-xs-12 col-md-12'); 
				$('.events_regions').addClass('margintop55'); 
					$grid.isotope('destroy');				
					$grid.isotope({
							itemSelector : '.events_region .events_item',
							masonry: {
								columnWidth: '.col-md-6'
							}
					});
			}
			
			setTimeout(function(){ $grid.isotope('layout'); }, 2000);
	});
	$('.event-search select.ng-valid').on('change', function() {
			if ($(".events_regions .events_region").siblings().size() > 1) { 
				$('.events_regions .events_region').removeClass('row'); 
				$('.events_regions .events_region').addClass('col-xs-12 col-sm-6 col-md-6'); 
				$('.events_regions .events_region .media.events_item').removeClass('col-xs-12 col-sm-6 col-md-6'); 
				$('.events_regions .events_region .events_region_name').removeClass('col-xs-12 col-md-12'); 
				$('.events_regions').removeClass('margintop55'); 
					$grid.isotope('destroy');	
					$grid.isotope({
							itemSelector : '.events_region',
							masonry: {
								columnWidth: '.col-md-6'
							}
					});
						
			} else { 
				$('.events_regions .events_region').addClass('row');
				$('.events_regions .events_region').removeClass('col-xs-12 col-sm-6 col-md-6'); 
				$('.events_regions .events_region .media.events_item').addClass('col-xs-12 col-sm-6 col-md-6'); 
				$('.events_regions .events_region .events_region_name').addClass('col-xs-12 col-md-12'); 
				$('.events_regions').addClass('margintop55'); 
					$grid.isotope('destroy');				
					$grid.isotope({
							itemSelector : '.events_region .events_item',
							masonry: {
								columnWidth: '.col-md-6'
							}
					});

			}
			
			setTimeout(function(){ $grid.isotope('layout'); }, 2000);
	});
});
$('a[href="#toptop"]').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 800);
			return false;
		});

$(window).load(function() {
  $('.resources_video_slider , .demo_product_section, .rest_apis_product_section, .customer_spotlight_section ').flexslider({
	selector: ".slides > .slide",
    animation: "fade",
	controlNav: true,
	directionNav: false
  });
  $('.technology_partners_section, .program_benefits_section').each(function() {
		$(this).children('li').matchHeight();
		});
});
$('.products_items').each(function() {
		$(this).children('li').matchHeight();
		});
$('.product_features_product_section ul.items ').each(function() {
		$(this).children('li').matchHeight();
		});
$('.pricing_product_section .plan_boxes').each(function() {
		$(this).children('.plan_box').matchHeight();
		});
$('.GenericDev .items').each(function() {
		$(this).children('li').matchHeight();
		});
$('.quotes_use_cases_slider').flexslider({
    animation: "slide",
	directionNav: true,
	controlNav: false
  });
$('.quotes_2_slider').flexslider({
    animation: "slide",
	directionNav: true,
	controlNav: false
  });
$('.off-canvas-list li.has-submenu').prepend('<span class="asd"></span>'); 

$(".strategic_alliances_tabs ul a").click(function(event) {
        event.preventDefault();
		var tab = $(this).attr("href");
        $(this).parent().addClass("current").siblings().removeClass("current");
        $(tab).addClass("current").fadeIn().siblings('.strategic_alliances').removeClass("current").hide();
	});
 /* ===================== 1 Mar =====================*/
$(".find_a_partner_section ul.partners_list li.no_info a.cbp-singlePageInline.cbp-nocontent").click(function() {
		var asdasd=	$(this);
       $(asdasd).parents('#grid-container').addClass('nomore').removeClass('nomore2');
		});
 $(".find_a_partner_section ul.partners_list li a.cbp-singlePageInline.cbp-hascontent").click(function() {
		var qweqwe=	$(this);
		$(qweqwe).parents('#grid-container').addClass('nomore2').removeClass('nomore');
	});
	
})(jQuery);
(function ($, window, document, undefined) {

    var gridContainer = $('#grid-container,#grid-container2');

	// init cubeportfolio
    gridContainer.cubeportfolio({

        animationType: 'rotateSides',

        gapHorizontal: 30,

        gapVertical: 30,

        gridAdjustment: 'responsive',

        caption: '',

        displayType: 'sequentially',

        displayTypeSpeed: 100,

        // lightbox
        lightboxDelegate: '.cbp-lightbox',
        lightboxGallery: true,
        lightboxTitleSrc: 'data-title',
        lightboxShowCounter: true,

        // singlePage popup
        singlePageDelegate: '.cbp-singlePage',
        singlePageDeeplinking: true,
        singlePageStickyNavigation: true,
        singlePageShowCounter: true,
        singlePageCallback: function (url, element) {
            // to update singlePage content use the following method: this.updateSinglePage(yourContent)
        },

        // singlePageInline
        singlePageInlineDelegate: '.cbp-singlePageInline',
        singlePageInlinePosition: 'below',
        singlePageInlineShowCounter: true,
        singlePageInlineCallback: function(url, element) {

            // to update singlePageInline content use the following method: this.updateSinglePageInline(yourContent)
            var t = this;
			if($(url).length == 0) {
			  return false;
			} else { 
				var cont = $(url).html();
				t.updateSinglePageInline(cont);
			} 

        }
    });

})(jQuery, window, document);