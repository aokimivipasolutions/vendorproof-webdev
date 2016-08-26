jQuery(function($){
  var $form = $('.miwt-form');
  
  
  var updateForm = function() {
  };
  
  
  $form.get(0).submit_options = {
    postUpdate: updateForm
  };
  
  updateForm();
});