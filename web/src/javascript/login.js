(function(global){
  var TEXT_USERNAME = 'Username';
  var TEXT_PASSWORD = 'Password';
  var INPUT_CSS_DEFAULT = 'default';

  var inputUsername, inputPassword;

  function setupLegacy() {
	  var labelPassword = document.createElement('div');

    function addEvent(el, type, handler) {
      if(document.addEventListener) {
        el.addEventListener(type, handler, false);
      } else {
        el["on" + type] = handler;
      }
    }

    function showPasswordLabel() {
      labelPassword.style.display = 'block';
    }

    function hidePasswordLabel() {
      labelPassword.style.display = 'none';
    }

    function setInputDefault() {
      inputUsername.value = TEXT_USERNAME;
      inputUsername.className = INPUT_CSS_DEFAULT;
    }

    function clearInputDefault() {
      inputUsername.value = '';
      inputUsername.className = '';
    }

    //add the fake password label
    labelPassword.className = 'password';
    labelPassword.innerHTML = TEXT_PASSWORD;
    inputPassword.parentNode.appendChild(labelPassword);

    //initial checks for fields
    if (inputUsername.value == TEXT_USERNAME || !inputUsername.value.length) {
      setInputDefault();
    }

    if (inputPassword.value.length) {
      hidePasswordLabel();
    } else {
      showPasswordLabel();
    }

    //input events
    addEvent(inputUsername, 'focus', function(){
      if (this.value == TEXT_USERNAME) {
        clearInputDefault();
      }
    });

    addEvent(inputUsername, 'blur', function(){
      if (!this.value) {
        setInputDefault();
      }
    });

    //password input events
    addEvent(inputPassword, 'focus', function(){
      hidePasswordLabel();
    });

    addEvent(inputPassword, 'blur', function(){
      if (!this.value) {
        showPasswordLabel();
      }
    });

    addEvent(inputPassword, 'change', function(){
      if (this.value.length) {
        hidePasswordLabel();
      } else {
        showPasswordLabel();
      }
    });

    //password label event
    addEvent(labelPassword, 'click', function(){
      hidePasswordLabel();
      inputPassword.focus();
    });
  }

  function setup() {
    inputUsername.setAttribute('placeholder', TEXT_USERNAME);
    inputPassword.setAttribute('placeholder', TEXT_PASSWORD);
  }

  function hasPlaceholderSupport() {
    var testInput = document.createElement('input');
    return 'placeholder' in testInput;
  }

  function init() {
    inputUsername = document.getElementById('lr_username');
    inputPassword = document.getElementById('lr_password');

    //if placeholder exists, just use it, otherwise older legacy code will run
    if (hasPlaceholderSupport()) {
      setup();
    } else {
      setupLegacy();
    }
  }
  
  if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', init, false);
  } else if (window.addEventListener) {
    window.addEventListener('load', init, false);
  } else if (window.attachEvent) {
    window.attachEvent('onload', init);
  }  
})(window);