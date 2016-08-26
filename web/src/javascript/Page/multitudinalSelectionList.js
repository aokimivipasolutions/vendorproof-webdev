$(document).ready(function() {
  $('.multitudinalSelectionList').chosen();
  $('.multitudinalSelectionList').chosen().change(function(event) {
    miwt.observerFormSubmit(event)
  });
  
  //VipaSuite uses form.miwt_form.
  //Proteus uses form.miwt-form.
  $('form.miwt-form').each(function(idx, form) {
    submitOptions = form.submit_options || {};
    previousPostUpdate = submitOptions.postUpdate;
    
    submitOptions.postUpdate = function() {
      if (typeof previousPostUpdate == 'function') {
        previousPostUpdate(data);
      }
      $('.multitudinalSelectionList').chosen();
    }
      
    form.submit_options = submitOptions;
  });
});