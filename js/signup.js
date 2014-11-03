/*
    Signup Form Script
    This script will load the state select list and validate the form before submission
*/

"use strict";

document.addEventListener('DOMContentLoaded', function() {
	var signupForm = document.getElementById('signup');
	var stateSelect = signupForm.elements['state']; 
	var option;
	var state;
	var i;

    //Load all the states into the options
	for (i = 0; i < usStates.length; i++) {
		option = document.createElement('option');
		state = usStates[i];
		option.value = state.code;
		option.innerHTML = state.name;
		stateSelect.appendChild(option);
	}

	signupForm.addEventListener('change', showOccupation);
	document.getElementById('cancelButton').addEventListener('click', noThanksRedirect);
	signupForm.addEventListener('submit', onSubmit);
});

//Shows the additional box if the "other" option is chosen in the occupation box
function showOccupation() {
	var signupForm = document.getElementById('signup');
	var o = document.getElementById('occupation');
	if (o.value == 'other') {
		signupForm.elements['occupationOther'].style.display = 'block';
	}
	else {
		signupForm.elements['occupationOther'].style.display = 'none';
	}
}

//Prompts user if they want to leave, and sends them to google if they confirm
function noThanksRedirect() {
	window.confirm('Do you want to leave?');
	if (window.confirm) {
		window.location.href = 'https://www.google.com';
	}
}

//Tries to validate the form and catches errors if they occur
function onSubmit(evt) {
	try {
		var valid = validateForm(this);
	}
	catch(e) {
		console.log("error");
	}

	if (!valid && evt.preventDefault) {
        evt.preventDefault();
    }

    evt.returnValue = valid;
    return valid;
}

//Validates the whole form for required fields
function validateForm(form) {
	var requiredFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'birthdate', 'occupation']
	var i;
	var valid = true;

	for (i = 0; i < requiredFields.length; i++) {
		valid &= validateRequiredField(form.elements[requiredFields[i]]);
	}

	if (document.getElementById('occupation').value == 'other') {
		valid &= validateRequiredField(form.elements['occupationOther']);
	}

	return valid;
}

//Determines if a required field is valid or not.
function validateRequiredField(field) {
	var signupForm = document.getElementById('signup');
	var value = field.value;
	value = value.trim();
	var valid = value.length > 0;

	if (valid) {
		field.className = 'form-control';
	} else {
		field.className = 'form-control invalid-field';
	}
	console.log(valid);

    //Speical case for the zip field. Makes sure the zip is a 5 digit number
	if (field.name === 'zip') {
		var zipRegExp = new RegExp('^\\d{5}$');
		if(!zipRegExp.test(value)) {
			valid = false;
			field.className = 'form-control invalid-field';
		}
	}

    //Special case for the birthdate field. Makes sure the user is 13 years or older and tells the user if they are not
	if (field.name === 'birthdate') {
		var errMsg = document.getElementById('birthdateMessage');
		var dob = signupForm.elements['birthdate'].value;
		console.log(dob);
		dob = new Date(dob);
		var today = new Date();

		var yearsDiff = today.getFullYear() - dob.getUTCFullYear();
		var monthsDiff = today.getMonth() - dob.getUTCMonth();
		var daysDiff = today.getDate() - dob.getUTCDate();

		if (monthsDiff < 0 || (0 == monthsDiff && daysDiff < 0)) {
			yearsDiff--;
		}

		if (yearsDiff < 13) {
			valid = false;
			field.className = 'form-control invalid-field';

			errMsg.innerHTML = 'You must be older than thirteen years of age to sign up!';
        	errMsg.style.display = 'block';
		}

		 if (yearsDiff >= 13) {
		 	errMsg.style.display = 'none';
		 }
	}


	return valid;	


}

