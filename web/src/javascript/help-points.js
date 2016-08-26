jQuery(function($){
  var $con = $('.miwt_form');
  
  var updateHelpPoints = function updateHelpPoints() {
    var $helpPoints = $con.find('span.help-point');
    
    $helpPoints.each(function(){
      var $helpPoint = $(this);
      if ($helpPoint.attr('title').length) {
        $helpPoint
          .data('title', $helpPoint.attr('title').replace(/\([^\)]*\)\s+$/, ''))
          .attr('title', '');
      }
    });
  };
  
  $con.each(function(){
    var $form = $(this);
    var tooltipTimer;
    
    $form.on('mouseenter', 'span.help-point', function(evt){
      var $tooltip = $('<div class="hp-tooltip" />')
          .text($(this).data('title'))
          .append('<span class="arrow" />')
          .appendTo(this);
      
      clearTimeout(tooltipTimer);
      tooltipTimer = setTimeout(function(){
        $tooltip.addClass('active');
      }, 100);
    });
    $form.on('mouseleave', 'span.help-point', function(evt){
      $(this).find('.hp-tooltip').remove();
      clearTimeout(tooltipTimer);
    });
    
    this.submit_options = {
      postUpdate: function(){ 
        updateHelpPoints();
      }
    };
  });
  
  
    
  updateHelpPoints();
});