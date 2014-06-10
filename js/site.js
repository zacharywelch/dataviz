(function() {
  $(function() {
    $('a[href="#fakelink"]').click(function(e) {
      return e.preventDefault()
    });

    $('.js-clipboard').each(function() {
      var $btn = $(this)
      if (!$btn.data('zeroclipboard-bound')) {
        $btn.attr('data-clipboard-text', $('#' + $btn.data('ref-id')).text().trim())
        $btn.data('zeroclipboard-bound', true)
        var clip = new ZeroClipboard(this)
        clip.on('aftercopy', function(e) {
          $this = $(e.target)
          var html = $this.html()
          $this.html('<i class="icon icon-clipboard pad0r"></i>' + 'Copied to clipboard!')
          setTimeout(function() {
            $this.html(html)
          }, 1000);
        });
      }
    });
    
    document.body.className += ' animate'
    window.prettyPrint && prettyPrint()         
  });
}).call(this);
