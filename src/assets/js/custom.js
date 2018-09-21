// $(window).scroll(function() {
//     var sticky = $('.main-header'),
//     scroll = $(window).scrollTop();
       
//         if (scroll >= 60) { 
//         sticky.addClass('fixed-header'); }
//         else { 
//        sticky.removeClass('fixed-header');
//     }
//      // var h_height = $('.main-header').height();
//      // $('.content-wrapper').css({"margin-top" : h_height })
// });
    
    
$(document).ready(function () {
    $('#open-card').click(function(){
    $('.show-card').slideToggle();
});

    // var sections = $('.scroll-sec')
    //   , nav = $('.main-header')
    //   , nav_height = nav.outerHeight();

    // $(window).on('scroll', function () {
    //   var cur_pos = $(this).scrollTop();
      
    //   sections.each(function() {
    //     var top = $(this).offset().top - nav_height - 10 ,
    //         bottom = top + $(this).outerHeight();
        
    //     if (cur_pos >= top && cur_pos <= bottom) {
    //       nav.find('a').removeClass('active');
    //       sections.removeClass('active');
          
    //       $(this).parent().addClass('active');
    //       nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
    //     }
    //   });
    // });

    // nav.find('a').on('click', function () {
    //   var $el = $(this)
    //     , id = $el.attr('href');
      
    //   $('html, body').animate({
    //     scrollTop: $(id).offset().top - nav_height
    //   }, 500);
      
    //   return false;
    // });
    
    //  $('.navbar-toggler').click(function(){
    //     $('body').toggleClass('block-scroll');
    //     $('.navbar-toggler').toggleClass('show-icon');
    // });

});

function readURL(input) {
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function(e) {
      $('.image-upload-wrap').hide();

      $('.file-upload-image').attr('src', e.target.result);
      $('.file-upload-content').show();

      $('.image-title').html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);

  } else {
    removeUpload();
  }
}

function removeUpload() {
  $('.file-upload-input').replaceWith('<input class="file-upload-input" type="file" (change)="incomingfile($event)" accept=".xlsx" />');
  $('.file-upload-content').hide();
  $('.image-upload-wrap').show();
}
$('.image-upload-wrap').bind('dragover', function () {
        $('.image-upload-wrap').addClass('image-dropping');
    });
    $('.image-upload-wrap').bind('dragleave', function () {
        $('.image-upload-wrap').removeClass('image-dropping');
});
