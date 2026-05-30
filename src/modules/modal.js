import { elements } from "./dom";
import { clearAllFieldErrors, clearFormError } from "./errors";

const openModal = () => {
	elements.modal.classList.remove("hidden");
	elements.modal.setAttribute("aria-hidden", "false");
	elements.backdrop.classList.remove("hidden");
	elements.backdrop.setAttribute("aria-hidden", "false");
	document.body.classList.add("modal-open");
	if (!elements.formDate.value) {
		elements.formDate.value = elements.headerDate.value;
	}
	elements.tutorName.focus();
};

const closeModal = () => {
	elements.modal.classList.add("hidden");
	elements.modal.setAttribute("aria-hidden", "true");
	elements.backdrop.classList.add("hidden");
	elements.backdrop.setAttribute("aria-hidden", "true");
	document.body.classList.remove("modal-open");
	elements.modal.reset();
	elements.formDate.value = elements.headerDate.value;
	clearAllFieldErrors();
	clearFormError();
};

export { openModal, closeModal };