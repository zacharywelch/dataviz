(function() {
  $(function() {
    $('[data-toggle="popup"]').click(function(e) {
      $popup = $(this).next('.popup')
      $popup.toggleClass('active')
    });
    $('[data-dismiss="popup"]').click(function(e) {
      $(this).parent().toggleClass('active')
    });
  });
}).call(this);
