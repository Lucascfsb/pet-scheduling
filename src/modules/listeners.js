import { elements } from "./dom";
import { openModal, closeModal } from "./modal";
import { showToast } from "./toast";
import { getTodayDate, isDateBlocked } from "../utils/dateUtils";
import { setFieldError, clearFieldError } from "./errors";
import { applyPhoneMask } from "../utils/phoneUtils";
import { setTimeOptions } from "./timeOptions";

const setupListeners = ({
	handleSubmit,
	loadSchedulesForDate,
	updateTimeOptionsForDate,
	getLastValidHeaderDate,
	setLastValidHeaderDate,
	getCurrentSchedules,
}) => {
	elements.newScheduleButton.addEventListener("click", async () => {
		openModal();
		const selected = elements.formDate.value || elements.headerDate.value || getTodayDate();
		await updateTimeOptionsForDate(selected, getCurrentSchedules());
	});
	elements.closeButton.addEventListener("click", closeModal);
	elements.backdrop.addEventListener("click", closeModal);
	elements.modal.addEventListener("submit", handleSubmit);

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape" && !elements.modal.classList.contains("hidden")) {
			closeModal();
		}
	});

	elements.headerDate.addEventListener("change", async () => {
		const selected = elements.headerDate.value || getTodayDate();
		if (isDateBlocked(selected)) {
			showToast("Data indisponivel. Escolha outro dia.", "error");
			elements.headerDate.value = getLastValidHeaderDate();
			return;
		}
		setLastValidHeaderDate(selected);
		elements.formDate.value = selected;
		await loadSchedulesForDate(selected);
		await updateTimeOptionsForDate(selected, getCurrentSchedules());
	});

	elements.formDate.addEventListener("change", async () => {
		const selected = elements.formDate.value;
		if (!selected) {
			return;
		}
		if (isDateBlocked(selected)) {
			setFieldError(elements.formDate, "Data indisponivel.");
			setTimeOptions([]);
			return;
		}
		clearFieldError(elements.formDate);
		await updateTimeOptionsForDate(selected, getCurrentSchedules());
	});

	[
		elements.tutorName,
		elements.petName,
		elements.description,
		elements.formDate,
		elements.formTime,
	].forEach((input) => {
		input.addEventListener("input", () => clearFieldError(input));
	});

	elements.telephone.addEventListener("input", () => {
		applyPhoneMask(elements.telephone);
		clearFieldError(elements.telephone);
	});

	elements.formTime.addEventListener("change", () => {
		clearFieldError(elements.formTime);
	});
};

export { setupListeners };
