(function() {
  $(function() {
    $('[data-toggle="offcanvas"]').click(function(e) {
      target = $(this).data('target')
      $(target).toggleClass('active')
    });
    $('[data-dismiss="offcanvas"]').click(function(e) {
      $(this).parent().toggleClass('active')
    });
  });
}).call(this);
