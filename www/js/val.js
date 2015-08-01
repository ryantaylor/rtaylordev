/////////////////////////////////////
// Pure Javascript form validation //
// Written by Ryan Taylor          //
// ryantaylodev.ca                 //
/////////////////////////////////////

var VAL_SELECTOR = 'jsval-';
var VAL_SELECTOR_MSG = VAL_SELECTOR + 'message';

document.addEventListener( 'DOMContentLoaded', function () {
  
  var el = document.getElementById( 'send' );
  el.addEventListener( 'click', function ( e ) {
    //e.preventDefault();
  });
  
  console.log( document.forms );
  var form, element, elClass, valType;
  
  // Loop through all forms on the page
  for ( var i = 0; i < document.forms.length; i ++ ) {
    form = document.forms[i];
    
    // Loop through all elements in the form
    for ( var j = 0; j < form.elements.length; j ++ ) {
      element = form.elements[j];
      
      // If the element is tagged for validation, handle it
      if ( element.className.indexOf( VAL_SELECTOR ) != -1 ) {
        
        // Loop through all classes on element to find the validation indicators
        for ( var k = 0; k < element.classList.length; k ++ ) {
          elClass = element.classList[k];
          
          // Make sure it contains the selector so we don't waste time checking
          // a bunch of conditionals if we don't have to
          if ( elClass.indexOf( VAL_SELECTOR ) != -1 ) {
            
            // Remove selector to get validation type
            valType = elClass.replace( VAL_SELECTOR, '' );
            
            switch ( valType ) {
              case 'text-required':
                valTextRequired( element );
                break;
              case 'email':
                valEmail( element, false );
                break;
              case 'email-required':
                valEmail( element, true );
                break;
              default:
                break;
            }
          }
        }
      }
    }
  }
});

function valTextRequired( element ) {
  
  var messageElement = getMessageElement( element );
  
  // Listener for when input changes. If input is empty after a change we
  // want to show the user a validity message.
  element.addEventListener( 'input', function ( e ) {
    if ( element.value == '' || element.value == null )
      messageElement.style.opacity = 100;
    else
      messageElement.style.opacity = 0;
  });
  
  // Listener for when input loses focus. This is mainly for when a user
  // tabs out of an input without entering any text.
  element.addEventListener( 'blur', function ( e ) {
    if ( element.value == '' || element.value == null )
      messageElement.style.opacity = 100;
    else
      messageElement.style.opacity = 0;
  });
}

function valEmail( element, required ) {
  
  var messageElement = getMessageElement( element );
  // Taken from HTML5 spec
  var emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  element.addEventListener( 'input', function ( e ) {
    if ( required ) {
      // If required, just check regex, since it will fail on empty string
      if ( element.value.match( emailRegex ) != null )
        messageElement.style.opacity = 0;
      else
        messageElement.style.opacity = 100;
    }
    else {
      // If not required, let user leave input empty.
      if ( element.value == '' ||
           element.value == null ||
           element.value.match( emailRegex ) != null )
        messageElement.style.opacity = 0;
      else
        messageElement.style.opacity = 100;
    }
  });
  
  element.addEventListener( 'blur', function ( e ) {
    if ( required ) {
      // If required, just check regex, since it will fail on empty string
      if ( element.value.match( emailRegex ) != null )
        messageElement.style.opacity = 0;
      else
        messageElement.style.opacity = 100;
    }
    else {
      // If not required, let user leave input empty.
      if ( element.value == '' ||
           element.value == null ||
           element.value.match( emailRegex ) != null )
        messageElement.style.opacity = 0;
      else
        messageElement.style.opacity = 100;
    }
  });
}

// Message element is selected as the first sibling element of the form element's
// parent node that's found when the parent's child nodes are iterated through.
function getMessageElement( formElement ) {
  for ( var i = 0; i < formElement.parentNode.childNodes.length; i ++ ) {
    var node = formElement.parentNode.childNodes[i];
    if ( node.className != undefined && node.className.indexOf( VAL_SELECTOR_MSG ) != -1 ) {
      return node;
    }
  }
  
  return undefined;
}