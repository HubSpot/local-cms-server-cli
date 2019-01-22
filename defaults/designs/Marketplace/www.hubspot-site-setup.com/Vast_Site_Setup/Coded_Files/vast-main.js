$(document).ready(function() {

    /** 
     * Mobile Nav
     *
     * Hubspot Standard Toggle Menu
     */

    $('.custom-menu-primary').addClass('js-enabled');
    $('.custom-menu-primary .hs-menu-wrapper').before('<div class="mobile-trigger cta_border_button">MENU</div>');
    $('.custom-menu-primary .flyouts .hs-item-has-children > a').after(' <div class="child-trigger"><i></i></div>');
    $('.mobile-trigger').click(function() {
        $(this).next('.custom-menu-primary .hs-menu-wrapper').slideToggle(250);
        $('body').toggleClass('mobile-open');
        $('.child-trigger').removeClass('child-open');
        $('.hs-menu-children-wrapper').slideUp(250);
        return false;
     });

    $('.child-trigger').click(function() {
        $(this).parent().siblings('.hs-item-has-children').find('.child-trigger').removeClass('child-open');
        $(this).parent().siblings('.hs-item-has-children').find('.hs-menu-children-wrapper').slideUp(250);
        $(this).next('.hs-menu-children-wrapper').slideToggle(250);
        $(this).next('.hs-menu-children-wrapper').children('.hs-item-has-children').find('.hs-menu-children-wrapper').slideUp(250);
        $(this).next('.hs-menu-children-wrapper').children('.hs-item-has-children').find('.child-trigger').removeClass('child-open');
        $(this).toggleClass('child-open');
        return false;
    });
    
    
    
    /** 
     * Set Banner Image on Homepage
     */
    
    // Grab the SRC of the Background Image module uploaded image
    var bannerSRC = $(".background-image").find("img").attr("src");
    
    // Apply the src as the background image for the banner area
    $("#banner-background-image").css('background-image', 'url(' + bannerSRC + ')');
    
    
    
    /** 
     * Set Offer Image on Homepage
     */
    
    // Grab the SRC of the Background Image module uploaded image
    var offerBannerSRC = $(".offer-image").find("img").attr("src");
    
    // Apply the src as the background image for the banner area
    $("#offer-background-image").css('background-image', 'url(' + offerBannerSRC + ')');
    
    
    
    
    
    
    /** 
     * Small Header on Page Scroll
     */
    
    $(window).scroll(function(){
        
        // Variables
        var $body = $("body");
        var windowScrollTop = $(window).scrollTop();
        var secondRowOffset = $(".body-container").offset();
        
        if(windowScrollTop > secondRowOffset.top){
            $body.addClass("small-header");
    	}
    	else {
    		$body.removeClass("small-header");
    	}
    });
    
    
    
    // Body Padding based off from Header Height & Stick Footer

    function updateheaderHeight(){
        var pageWidth = $(window).width(); 
        var headerHeight = $('.header-container-wrapper').height() ;
        var bodyHeight = $( window ).height() - headerHeight - $('.footer-container-wrapper').height();
        if (pageWidth > 767) {
            $('.body-container-wrapper').css('padding-top', headerHeight + 'px');
        }
        else {
            $('.body-container-wrapper').css('padding-top', '0' + 'px');
        }
        $('.body-container-wrapper').css('min-height', bodyHeight + 'px');
    }
    updateheaderHeight();
    $(window).on("resize", updateheaderHeight);
    
    
    
    /** * Hide Footer Contact Icons if content doesn't exist */
    $(document).ready(function() {
        if (!$.trim($(".phone-icon .contact-info").html()) == true) {
            $(".contact-us .fa-phone").hide();
        }
        if (!$.trim($(".envelope-icon .contact-info").html()) == true) {
            $(".contact-us .fa-envelope").hide();
        }
        if (!$.trim($(".home-icon .contact-info").html()) == true) {
            $(".contact-us .fa-home").hide();
        }
    });
    
});  /* End of Document Ready */


