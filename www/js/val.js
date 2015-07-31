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
              case 'required':
                valRequired( element );
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

function valRequired( element ) {
  
  var messageElement = getMessageElement( element );
  
  element.addEventListener( 'input', function ( e ) {
    if ( element.value == '' || element.value == null ) {
      messageElement.style.opacity = 100;
      console.log( 'bad' );
    }
    else {
      messageElement.style.opacity = 0;
      console.log( 'good' );
    }
  });
  
  element.addEventListener( 'input', function ( e ) {
    console.log( 'test' );
  });
  
  element.addEventListener( 'blur', function ( e ) {
    if ( element.value == '' || element.value == null ) {
      messageElement.style.opacity = 100;
      console.log( 'bad' );
    }
    else {
      messageElement.style.opacity = 0;
      console.log( 'good' );
    }
  });
}

function valEmail( element ) {
  
}

function getMessageElement( formElement ) {
  var messageElement = undefined;
  
  for ( var i = 0; i < formElement.parentNode.childNodes.length; i ++ ) {
    var node = formElement.parentNode.childNodes[i];
    if ( node.className != undefined && node.className.indexOf( VAL_SELECTOR_MSG ) != -1 ) {
      messageElement = node;
      break;
    }
  }
  
  return messageElement;
}