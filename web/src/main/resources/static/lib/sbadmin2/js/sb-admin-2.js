/**
 * Created by noname on 15/8/31.
 */
$(function() {

    $('#side-menu').metisMenu();

});

//Loads the correct sidebar on window load,
//collapses the sidebar on window resize.
// Sets the min-height of #page-wrapper to window size
$(function() {
    $(window).bind("load resize", function() {
        topOffset = 50;
        bottomOffset = 50;
        width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset - bottomOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });
    // set side bar
    (function(){
        var currentSideId = $('#side-menu').data('current');
        var $currentA = $('#side_'+currentSideId);
        var ptr = $currentA;
        var lv = 0;
        while(true){
            if (lv++ == 3) break;
            ptr.addClass('active').parent().parent().addClass('in');
            ptr = ptr.parent();
        }
    })();
});
