(function() {
  $(function() {
    $('input[data-toggle="clear"]').each(function(e) {
      $input = $(this)
      $clear = $input
        .after($('i'))
        .addClass('icon icon-remove-sign clear')
        .click(function() {
          $input.val('').focus()
          $(this).hide()
        });
      $input.keyup(function() { $clear.toggle(Boolean($input.val())) })
      $clear.toggle(Boolean($input.val()))
    });
  });
}).call(this);
