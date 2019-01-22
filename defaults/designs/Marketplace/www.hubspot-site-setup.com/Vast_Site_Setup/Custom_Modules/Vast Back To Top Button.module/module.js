$(document).ready(function(){
	var $backToTop = $(".back-to-top");
    $backToTop.hide();
    
    $(window).scroll(function() {
        if ($(this).scrollTop()>50) {
            $backToTop.fadeIn();
        } else {
            $backToTop.fadeOut();
        }
    });
    
    $backToTop.find("a").click(function(e) {
        e.preventDefault();
        $("html, body").animate({scrollTop: 0}, 500);
    });
});