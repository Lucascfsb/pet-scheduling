import { elements } from "./dom";

const ensureFormErrorContainer = () => {
	let formError = elements.modal.querySelector(".form-error");
	if (!formError) {
		const header = elements.modal.querySelector(".header-form");
		formError = document.createElement("p");
		formError.className = "form-error";
		formError.hidden = true;
		header.insertAdjacentElement("afterend", formError);
	}
	return formError;
};

const showFormError = (message) => {
	const formError = ensureFormErrorContainer();
	formError.textContent = message;
	formError.hidden = false;
};

const clearFormError = () => {
	const formError = elements.modal.querySelector(".form-error");
	if (formError) {
		formError.textContent = "";
		formError.hidden = true;
	}
};

const getFieldErrorElement = (input) => {
	const id = input.id;
	return elements.modal.querySelector(`.field-error[data-error-for="${id}"]`);
};

const setFieldError = (input, message) => {
	const fieldContainer = input.closest(".input-div");
	if (!fieldContainer) {
		return;
	}

	let error = getFieldErrorElement(input);
	if (!error) {
		error = document.createElement("p");
		error.className = "field-error";
		error.dataset.errorFor = input.id;
		error.hidden = true;
		fieldContainer.insertAdjacentElement("afterend", error);
	}

	error.textContent = message;
	error.hidden = false;
};

const clearFieldError = (input) => {
	const error = getFieldErrorElement(input);
	if (error) {
		error.textContent = "";
		error.hidden = true;
	}
};

const clearAllFieldErrors = () => {
	const errors = elements.modal.querySelectorAll(".field-error");
	errors.forEach((error) => {
		error.textContent = "";
		error.hidden = true;
	});
};

export {
	showFormError,
	clearFormError,
	setFieldError,
	clearFieldError,
	clearAllFieldErrors,
};
