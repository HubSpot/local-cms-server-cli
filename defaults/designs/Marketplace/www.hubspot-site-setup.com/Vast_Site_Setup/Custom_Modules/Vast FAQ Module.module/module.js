$(document).ready(function() { 
    var $accordion = $('.accordion');

    // Initially hide all accordion content
    $accordion.find('.accordion_content').hide();
    // Initially display the accordion content with .expanded class
    $accordion.find('.accordion_group.expanded .accordion_content').show();

    $accordion.find('.accordion_header').click(function(){

        // Hide the displayed sibling accordion content so only one appears at a time
       $accordion.find(".accordion_header").not(this).parent(".accordion_group.expanded").removeClass('expanded').children('.accordion_content').stop(true,true).slideUp();

        if(!$(this).parent('.accordion_group').hasClass('expanded')){
            // Display the accordion content if it is not displayed
            $(this).parent(".accordion_group").addClass('expanded').children('.accordion_content').stop(true,true).slideDown();
        }
        else{
            // Hide the accordion content if it is displayed
            $(this).parent(".accordion_group").removeClass('expanded').children('.accordion_content').stop(true,true).slideUp();
        }
    });
});