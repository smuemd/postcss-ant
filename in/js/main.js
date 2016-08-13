// Gross/sleepy code
function openSidebar() {
  $('.overlay, .sidebar').show();
  $('.sidebar-button > span').html('&times;')
  $('.sidebar-button').addClass('js-active');
}

function closeSidebar() {
  $('.overlay, .sidebar').hide();
  $('.sidebar-button > span').html('<span></span><span></span><span></span>')
  $('.sidebar-button').removeClass('js-active');
}

function mobile() {
  if ($(window).width() <= 800) {
    $('html').addClass('mobile');
    $('.sidebar-button').show();
    if ($('.sidebar-button').hasClass('js-active')) {
      $('.overlay').show();
    }
  } else {
    $('html').removeClass('mobile');
    $('.sidebar').show();
    $('.overlay, .sidebar-button').hide();
  }
}

mobile();

$('.sidebar-button').click(function () {
  if ($('.sidebar-button').hasClass('js-active')) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

// Throttle
var didResize = false;

$(window).resize(function () {
  didResize = true;
});

setInterval(function () {
  if(didResize) {
    mobile();
    didResize = false;
  }
}, 250);
