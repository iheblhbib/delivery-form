var $deliveryForm   = $('#deliveryForm'),
    $deliveryInputs = $(".delivery-input");
var availableCity = [
  "Avdeyevka",
  "Aleksandriya",
  "Aleksandrovsk",
  "Aloshki",
  "Almaznaya",
  "Alupka",
  "Alushta",
  "Alchevsk",
  "Amvrosiyevka",
  "Anan'yev",
  "Andrushovka",
  "Antratsit",
  "Apostolovo",
  "Armyansk",
  "Artomovsk",
  "Artsiz",
  "Akhtyrka"
];
var availableAddress  = [
  "TestA street1",
  "TestB street1",
  "TestC street1",
  "TestD street1",
  "TestE street1",
  "TestF street1"
];

$("#address").autocomplete({
  source: function(request, response) {
    var results = $.ui.autocomplete.filter(availableAddress, request.term);
    response(results.slice(0, 7));
  }
});
$("#city").autocomplete({
  source: function(request, response) {
    var results = $.ui.autocomplete.filter(availableCity, request.term);
    response(results.slice(0, 7));
  }
});
if ($deliveryForm) {
  $deliveryForm.submit(function(e) {
    e.preventDefault();
    var result    = validator.call(this, e),
        firstname = $("[name='firstname']").val(),
        lastname  = $("[name='lastname']").val(),
        phone     = $("[name='phone']").val(),
        email     = $("[name='email']").val(),
        city      = $("[name='city']").val(),
        address   = $("[name='address']").val(),
        delivery  = $("[name='delivery']")[0].checked;
    if (result) {
      var newOrder = {
        firstname: firstname,
        lastname : lastname,
        phone    : phone,
        email    : email,
        city     : city,
        address  : address,
        delivery : delivery
      };
      $.ajax({
        dataType: "json",
        url     : "/delivery/add",
        method  : "POST",
        data    : newOrder
      }).then(function (res) {
          $('.b-form-wrap').addClass("hidden");
          $('#answer').addClass("show");
          setTimeout(function () {
            window.location = '/';
          }, 5 * 1000);
      }, function (error) {
        alert(error.responseJSON.messages[0]);
      });
    }
  });
}
var rules = {
  required: function (el) {
    if (el.value != '') {
      return true;
    }
    return false;
  },
  phone: function (el) {
    var reg = /^\+?[0-9-()\.]{3,20}$/;
    return reg.test(el.value.replace(/\s+/g, ''));
  },
  email: function (el) {
    var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(el.value.replace(/\s+/g, ''));
  },
  user: function (el) {
    var reg = /^[A-Za-z]+$/;
    return reg.test(el.value.replace(/\s+/g, ''));
  }
};


function validator (e) {
  var errors = [];
  var inputs = this.elements;
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].tagName != 'BUTTON') {
      var rulesList = inputs[i].dataset.rules;
      if (!rulesList) {
        continue;
      }
      rulesList = rulesList.toString().split(' ');
      for (var j = 0; j < rulesList.length; j++) {
        if (rulesList[j] in rules) {
          if (!rules[rulesList[j]](inputs[i])) {
            errors.push({name: inputs[i].name, error: rulesList[j]});
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    e.preventDefault();
    for(i = 0; i < errors.length; i++) {
      var $inputEl = $("input[name='"+errors[i].name+"']"),
          $inputElParent = $inputEl.parent(),
          text = '';
      switch (errors[i].error) {
        case "required":
          text = "This is a required field";
          break;
        case "phone":
          text = "Please, enter a valid phone number";
          break;
        case "email":
          text = "Please, enter a valid Email";
          break;
        case "lastname":
          text = "Please, enter only letters in yor Last Name";
          break;
        case "firstname":
          text = "Please, enter only letters in yor Name";
          break;
      }
      if($inputElParent.hasClass('inputs--invalid')) {
        $inputElParent.find(".error").text(text);
      } else {
        $inputElParent.addClass('inputs--invalid').append("<div class='error'>"+text+"</div>");
      }
    }
    return false;
  }
  return true;
}

var inputs = document.querySelectorAll( 'input[type=text], input[type=email], input[type=tel]' );
for (i = 0; i < inputs.length; i ++) {
  var inputEl = inputs[i];
  if(inputEl.value.trim() !== '' ) {
    inputEl.parentNode.classList.add( 'input--filled' );
  }
  inputEl.addEventListener( 'focus', onFocus );
  inputEl.addEventListener( 'blur', onBlur );
}

function onFocus( ev ) {
  ev.target.parentNode.classList.add( 'inputs--filled' );
  ev.target.parentNode.classList.remove('inputs--invalid');
}

function onBlur( ev ) {
  if ( ev.target.value.trim() === '' ) {
    ev.target.parentNode.classList.remove('inputs--filled');
    ev.target.parentNode.classList.remove('inputs--invalid');
  }
}

$("[name='delivery']").click(function(){
    $deliveryInputs.hide(400);
});

$('#deliveryBtn').click(function(){
  var delivery  = $("[name='delivery']")[0].checked;
  if(!delivery) {
    $deliveryInputs.toggle(400);
  }
});
