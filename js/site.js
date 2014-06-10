(function() {
  $(function() {
    $('a[href="#fakelink"]').click(function(e) {
      return e.preventDefault()
    });
    
    document.body.className += ' animate'
    window.prettyPrint && prettyPrint()         
  });
}).call(this);
