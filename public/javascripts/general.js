$(function () {
    $(window).ready(function () {
        $("body").addClass("mostrar");
    });

    $('button.btn-index').hover(function(){
        $(this).toggleClass("hover");
    });
    $('button.btn-sidebar').hover(function(){
        $(this).toggleClass("hover");
    });
});