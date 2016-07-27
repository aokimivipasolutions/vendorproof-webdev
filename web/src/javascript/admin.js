jQuery(function($){
  var $form = $('.miwt_form');
  
  
  var updateForm = function() {
  };
  
  
  $form.get(0).submit_options = {
    postUpdate: updateForm
  };
  
  updateForm();
});