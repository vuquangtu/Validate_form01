function Validator(form) {
  var formElement = document.querySelector(form);
  var min;

  if (formElement) {
    inputElements = formElement.querySelectorAll("[name]");
  }

  var rules = {
    required: function (value) {
      return value ? "" : "Vui lòng nhập trường này";
    },
    username: function (value) {
      regex = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;
      return regex.test(value)
        ? ""
        : "Vui lòng nhập username chứa ít nhất 1 ký tự và 1 chữ số";
    },
    email: function (value) {
      regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? "" : "Vui lòng nhập Email";
    },
    min: function (value) {
      return function (min) {
        regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
        return regex.test(value)
          ? ""
          : `Mật khẩu PHẢI chứa ít nhất: ${min} ký tự ,1 chữ in hoa và 1 chữ số `;
      };
    },
    isConfirm: function (value) {
      return value == formElement.querySelector("#password").value
        ? ""
        : "Mật khẩu chưa khớp";
    },
  };

  //   oject tổng hợp hàm

  var inputRules = Array.from(inputElements).reduce(getRules, {});
  console.log(inputRules);

  function getRules(values, input) {
    for (var rule of input.getAttribute("rules").split("|")) {
      if (rule.includes(":")) {
        ruleInfo = rule.split(":");
        rule = ruleInfo[0];
        min = ruleInfo[1];
      }

      if (!Array.isArray(values[input.name])) {
        values[input.name] = [rules[rule]];
      } else {
        values[input.name].push(rules[rule]);
      }
    }

    return values;
  }

  function validate(key) {
    var messageElement =
      key.target.parentElement.querySelector(".form-message");
    var message;

    for (func of inputRules[key.target.name]) {
      var message = func(key.target.value);
      if (message != "") {
        key.target.parentElement.classList.add("invalid");
        break;
      }
    }

    if (typeof message == "function") {
      messageElement.innerText = message(min);
    } else {
      messageElement.innerText = message;
    }

    if (messageElement.innerText == "") {'/'
      key.target.parentElement.classList.remove("invalid");
    }

    return messageElement.innerText;
  }

  //   khi người dùng onblur và oninput

  for (inputElement of inputElements) {
    inputElement.onblur = validate;

    inputElement.oninput = function (key) {
      key.target.parentElement.classList.remove("invalid");
      key.target.parentElement.querySelector(".form-message").innerText = "";
    };
  }

  // khi nguoi dung bam dang ky

  formElement.onsubmit = function (e) {
    var isValid = true;
    e.preventDefault();
    for (inputElement of inputElements) {
      var valid = validate({ target: inputElement });

      if (valid != "") {
        isValid = false;
      }
    }
    console.log(isValid);
  };
}
