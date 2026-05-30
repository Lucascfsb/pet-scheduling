import { elements } from "./dom";
import { fetchSchedules } from "../services/scheduleApi";
import { showToast } from "./toast";
import { buildAllowedTimes } from "../utils/timeUtils";
import { isDateBlocked } from "../utils/dateUtils";

let availableTimes = [];

const setTimeOptions = (times) => {
	while (elements.formTime.firstChild) {
		elements.formTime.removeChild(elements.formTime.firstChild);
	}
	const placeholder = document.createElement("option");
	placeholder.value = "";
	placeholder.disabled = true;
	placeholder.selected = true;
	placeholder.textContent = "Selecione o horário";
	elements.formTime.appendChild(placeholder);
	availableTimes = times;
	if (times.length === 0) {
		return;
	}
	const fragment = document.createDocumentFragment();
	times.forEach((time) => {
		const option = document.createElement("option");
		option.value = time;
		option.textContent = time;
		fragment.appendChild(option);
	});
	elements.formTime.appendChild(fragment);
};

const updateTimeOptionsForDate = async (date, currentSchedules) => {
	if (!date || isDateBlocked(date)) {
		setTimeOptions([]);
		return;
	}
	let schedules = currentSchedules || [];
	if (date !== elements.headerDate.value) {
		try {
			schedules = await fetchSchedules(date);
		} catch (error) {
			showToast("Falha ao carregar horarios.", "error");
			setTimeOptions([]);
			return;
		}
	}
	const booked = new Set(schedules.map((item) => item.time));
	const times = buildAllowedTimes().filter((time) => !booked.has(time));
	setTimeOptions(times);
};

const getAvailableTimes = () => availableTimes;

export { setTimeOptions, updateTimeOptionsForDate, getAvailableTimes };