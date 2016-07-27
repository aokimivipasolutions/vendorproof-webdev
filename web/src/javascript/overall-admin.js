jQuery(function($){
  var $con = $('.miwt_form');
  
  
  var updateForm = function() {
    updateHelpPoints();
    
    var $vendorCategories = $('.vendor_category_editor select');
    if ($vendorCategories.length) {
      $vendorCategories.select2({
        width: 'resolve' 
      });
    }
    
    var $vendorCategories = $('.pricing_configuration .vendor_category_limit');
    if ($vendorCategories.length) {
      $vendorCategories.find('select').select2({
        width: 'resolve' 
      });
    }
  };
  
  var updateHelpPoints = function updateHelpPoints() {
    var $helpPoints = $con.find('span.help_point');
    
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
    
    $form.on('mouseenter', 'span.help_point', function(evt){
      var $tooltip = $('<div class="hp-tooltip" />')
          .text($(this).data('title'))
          .append('<span class="arrow" />')
          .appendTo(this);
      
      clearTimeout(tooltipTimer);
      tooltipTimer = setTimeout(function(){
        $tooltip.addClass('active');
      }, 100);
    });
    $form.on('mouseleave', 'span.help_point', function(evt){
      $(this).find('.hp-tooltip').remove();
      clearTimeout(tooltipTimer);
    });
    
    this.submit_options = {
      postUpdate: updateForm
    };
  });
  
  updateForm();
});