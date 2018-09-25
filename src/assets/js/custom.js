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
  $(document).on('click', '#open-card',function(){
      $('.show-card').slideToggle();
    });
  $(document).on('click', '#go-register',function () {
    setTimeout(function () {
      $('#register-card').removeClass('d-none');
      $('#login-card').addClass('d-none');
    }, 500);
    $('#login-card').addClass('fadeIn');
    $('#register-card').removeClass('fadeIn');
  });
  $(document).on('click','#back-r_login',function () {
    setTimeout(function () {
      $('#register-card').addClass('d-none');
      $('#login-card').removeClass('d-none');
    }, 500);
    $('#register-card').addClass('fadeIn');
    $('#login-card').removeClass('fadeIn');
  });
  $(document).on('click','#goforgot',function () {
    setTimeout(function () {
      $('#forgot-card').removeClass('d-none');
      $('#login-card').addClass('d-none');
    }, 500);
    $('#forgot-card').removeClass('fadeIn');
    $('#login-card').addClass('fadeIn');
  });
  $(document).on('click','#back-f_login',function () {
    setTimeout(function () {
      $('#forgot-card').addClass('d-none');
      $('#login-card').removeClass('d-none');
    }, 500);
    $('#forgot-card').addClass('fadeIn');
    $('#login-card').removeClass('fadeIn');
  });

  /* $(document).on('click', '.dash-toggler_icon' , function(){
    $('.sidebar').toggleClass('icon-sidebar');
    $('.right-sidebar').toggleClass('full-rightbar');
    $('.main-header').toggleClass('full-header')
  }); */
 /*  $('#datepicker').datepicker({
    uiLibrary: 'bootstrap4'
  }); */
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
