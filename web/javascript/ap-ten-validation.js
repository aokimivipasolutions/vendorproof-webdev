/**
 * Adds functionality to disable parts of the UI and add popup dialogs. Helps with making the UI more intuitive.
 * @author Nick McCollum (nmccollum@providertrust.com)
 */

jQuery(function($){
  /**
   * Check if a CHS location is being edited.
   */
  function isEditingChsLocation()
  {
    return jQuery("button:contains('New Location'):disabled").length == 1 || jQuery(".client-location-column button:contains('Save')").length == 1;
  }
  
  /**
   * Disable editing of remittance addresses and purchasing contacts.
   */
  function disableEdits()
  {
  	jQuery('.remit-to-ui').addClass("disabled-div");
    jQuery('.purchasing-contact-ui').addClass("disabled-div");
    jQuery('.remit-to-ui').on("mousedown", function () { displayWarningDialog(); });
    jQuery('.purchasing-contact-ui').on("mousedown", function () { displayWarningDialog(); });
    
  }
  
  /**
   * Enable editing of remittance addresses and purchasing contacts.
   */
  function enableEdits()
  {
  	jQuery('.remit-to-ui').removeClass("disabled-div");
    jQuery('.purchasing-contact-ui').removeClass("disabled-div");
    jQuery('.remit-to-ui').off();
    jQuery('.purchasing-contact-ui').off();
  }
  
  /**
   * Display a popup dialog to explain why UI is disabled.
   */
  function displayWarningDialog()
  {
  	jQuery("<div>Before making any edits to the <b>Remittance Address List</b> or <b>Purchasing Contact List</b> save or cancel your changes.</div>")
      .dialog({
        modal: true,
        title: "Unsaved Changes Detected",
        dialogClass: "no-close-btn",
        buttons: [{ 
          text: "OK",
          click: function () 
          {
          	$(this).dialog("close");
          }
        }]
      });
  }
  
  /**
   * Initialize the listeners.
   */
  function init()
  {
    if (isEditingChsLocation())
    {
    	disableEdits();
    }
  	jQuery(document).on("mouseup",".ap-ten-add-button button:contains('New Location')", function () {
      disableEdits();
    });
    
    jQuery(document).on("mouseup",".client-location-column button:contains('Edit')", function () {
      disableEdits();
    });	
    
    jQuery(document).on("mouseup",".client-location-column button:contains('Save')", function () {
      enableEdits();
    });
    
    jQuery(document).on("mouseup",".client-location-column button:contains('Cancel')", function () {
      enableEdits();
    });
  }
  
  init();
});