function start() {
  let formallyElements = document.querySelectorAll('[formally]');
  formallyElements.forEach((el) => {
    if (!el.hasAttribute('id'))
      el.setAttribute('id', el.getAttribute('formally'));
    setUpFormallyLabels(el);
    assignClass(el);
    addEventListeners(el);
  })
}

function addEventListeners(formElement) {
  if (formElement.classList.contains('f-required')) {
    formElement.addEventListener('focusin', focus);
    formElement.addEventListener('input', function(e) { checkValidity(e, atLeastOneCharacter) });
    formElement.addEventListener('change', validateOnOut);
    formElement.addEventListener('click', highlightText);
    formElement.addEventListener('focusout', focusOut);
    createFooterMessage(formElement, 'f-required');
  }
  else if (formElement.classList.contains('f-email')) {
    formElement.addEventListener('focusin', focus);
    formElement.addEventListener('input', function(e) { checkValidity(e, isRFC822ValidEmail) });
    formElement.addEventListener('change', validateOnOut);
    formElement.addEventListener('click', highlightText);
    formElement.addEventListener('focusout', focusOut);
    createFooterMessage(formElement, 'f-email');
  }
  else if (formElement.classList.contains('f-password')) {
    formElement.addEventListener('focusin', focus);
    formElement.addEventListener('input', function(e) { checkValidity(e, validatePassword) });
    formElement.addEventListener('change', validateOnOut);
    formElement.addEventListener('click', highlightText);
    formElement.addEventListener('focusout', focusOut);
    createFooterMessage(formElement, 'f-password');
  }
  else if ((formElement.tagName === 'INPUT' && !formElement.getAttribute('type') === 'button' && !formElement.getAttribute('type') === 'checkbox' && !formElement.getAttribute('type') === 'image' && !formElement.getAttribute('type') === 'radio' && !formElement.getAttribute('type') === 'submit' && !formElement.getAttribute('type') === 'reset') || (formElement.tagName === 'TEXTAREA')) {
    formElement.addEventListener('focusin', focus);
    formElement.addEventListener('focusout', focusOut);
    formElement.addEventListener('click', highlightText);
  }
  else if (formElement.getAttribute('type') === 'date' && formElement.tagName === 'INPUT') {
    formElement.addEventListener('focusin', focus);
    formElement.addEventListener('focusout', focusOut);
    formElement.addEventListener('click', highlightText);
  }
}

function createFooterMessage(element, className) {
  let msg;
  if (className === 'f-required')
    msg = '*This field is required';
  else if (className === 'f-password')
    msg = '*Password must include at least one capital letter, one number and one special character';
  else if (className === 'f-email')
    msg = '*Please enter a valid email address';
  let parent = element.parentElement;
  console.log(parent)
  let pTag = document.createElement('p');
  pTag.classList.add('f-helperMessage');
  pTag.innerHTML = msg;
  parent.insertBefore(pTag, element.nextSibling);
}

function setUpFormallyLabels(element) {
    if (element.getAttribute('type') === 'image' && !element.hasAttribute('alt'))
      addAlt(element);
    else if ((element.getAttribute('type') === 'submit' || element.getAttribute('type') === 'reset' || element.getAttribute('type') === 'button') && !element.hasAttribute('value'))
      addValue(element);
    else if ((element.getAttribute('type') === 'submit' || element.getAttribute('type') === 'reset' || element.getAttribute('type') === 'button') && element.hasAttribute('value'))
      return
    else if (!element.hasAttribute('aria-label'))
      insertLabel(element);

}

function assignClass(element) {
  if (element.tagName === 'INPUT')
    element.classList.add('formally-input-' + (element.getAttribute('type')).toLowerCase());
  else
    element.classList.add('formally-' + element.tagName.toLowerCase());
}

function checkValidity(e, cb) {
  if (cb(e.target.value) === true) {
    e.target.classList.add('validate');
  }
  else {
    e.target.classList.remove('validate');
  }
}

function focus(e) {
    this.classList.add('f-active')
    let label = this.previousSibling;
    label.classList.add('f-active');
}

function validateOnOut(e) {
  if (!this.classList.contains('validate'))
    this.classList.add('f-invalid');
  else
    this.classList.remove('f-invalid');
}

function highlightText(e) {
  this.select();
}

function focusOut(e) {
  this.classList.remove('f-active')
  let label = this.previousSibling;
  label.classList.remove('f-active');
}

function insertLabel(formElement) {
  let newLabel = document.createElement('label');
  newLabel.setAttribute('for', formElement.id);
  newLabel.innerHTML = formElement.getAttribute('formally');
  newLabel.classList.add('formally-label-' + formElement.tagName.toLowerCase());
  if (formElement.getAttribute('type'))
    newLabel.classList.add(formElement.getAttribute('type'));
  let parent = formElement.parentElement;
  if (formElement.getAttribute('type') === 'checkbox' || formElement.getAttribute('type') === 'radio'){
    parent.insertBefore(newLabel, formElement.nextSibling);
  }
  else {
    parent.insertBefore(newLabel, formElement);
  }
}

function addAlt(formElement) {
  formElement.setAttribute('alt', formElement.getAttribute('formally'));
  setUpFormallyLabels([formElement]);
}
function addValue(formElement) {
  formElement.setAttribute('value', formElement.getAttribute('formally'));
}

function isRFC822ValidEmail(sEmail) {

  var sQtext = '[^\\x0d\\x22\\x5c\\x80-\\xff]';
  var sDtext = '[^\\x0d\\x5b-\\x5d\\x80-\\xff]';
  var sAtom = '[^\\x00-\\x20\\x22\\x28\\x29\\x2c\\x2e\\x3a-\\x3c\\x3e\\x40\\x5b-\\x5d\\x7f-\\xff]+';
  var sQuotedPair = '\\x5c[\\x00-\\x7f]';
  var sDomainLiteral = '\\x5b(' + sDtext + '|' + sQuotedPair + ')*\\x5d';
  var sQuotedString = '\\x22(' + sQtext + '|' + sQuotedPair + ')*\\x22';
  var sDomain_ref = sAtom;
  var sSubDomain = '(' + sDomain_ref + '|' + sDomainLiteral + ')';
  var sWord = '(' + sAtom + '|' + sQuotedString + ')';
  var sDomain = sSubDomain + '(\\x2e' + sSubDomain + ')*';
  var sLocalPart = sWord + '(\\x2e' + sWord + ')*';
  var sAddrSpec = sLocalPart + '\\x40' + sDomain; // complete RFC822 email address spec
  var sValidEmail = '^' + sAddrSpec + '$'; // as whole string

  var reValidEmail = new RegExp(sValidEmail);

  if (reValidEmail.test(sEmail)) {
    return true;
  }
  return false;
}

//Minimum 8 characters at least 1 Uppercase Alphabet, 1 Lowercase Alphabet and 1 Number and 1 special character:
function validatePassword(pass) {
  let pwVal = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/);
  if (pwVal.test(pass)) {
    return true;
  }
  return false;
}

function atLeastOneCharacter(char) {
  let charVal = new RegExp(/[\s\S]*\S[\s\S]*/);
  if (charVal.test(char)) {
    return true;
  }
  return false;
}

start();

module.exports = {
  start,
}
