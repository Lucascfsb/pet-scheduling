"use strict";

//Configuração do dayjs
import dayjs from "dayjs";

//CSS
import "./styles/global.css";
import "./styles/schedule.css";
import "./styles/form.css";

//JS
import { apiConfig } from "./services/apiConfig";

const SCHEDULES_URL = `${apiConfig.baseUrl}/schedules`;
const TIME_WINDOWS = {
	morning: { start: "09:00", end: "12:00", endInclusive: true },
	afternoon: { start: "13:00", end: "18:00", endInclusive: false },
	night: { start: "18:00", end: "21:00", endInclusive: true },
};
const HOLIDAYS = [
	"01-01",
	"04-21",
	"05-01",
	"09-07",
	"10-12",
	"11-02",
	"11-15",
	"12-25",
];

const toMinutes = (time) => {
	if (!time || !time.includes(":")) {
		return NaN;
	}
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + minutes;
};

const isWithinRange = (time, range) => {
	const value = toMinutes(time);
	const start = toMinutes(range.start);
	const end = toMinutes(range.end);
	if (Number.isNaN(value)) {
		return false;
	}

	if (range.endInclusive) {
		return value >= start && value <= end;
	}
	return value >= start && value < end;
};

const getPeriodKey = (time) => {
	if (isWithinRange(time, TIME_WINDOWS.morning)) {
		return "morning";
	}
	if (isWithinRange(time, TIME_WINDOWS.afternoon)) {
		return "afternoon";
	}
	if (isWithinRange(time, TIME_WINDOWS.night)) {
		return "night";
	}
	return null;
};

const getTodayDate = () => dayjs().format("YYYY-MM-DD");

const elements = {
	headerDate: document.querySelector("#header-date"),
	modal: document.querySelector("form.modal"),
	backdrop: document.querySelector(".modal-backdrop"),
	newScheduleButton: document.querySelector(".new-schedule"),
	closeButton: document.querySelector("form.modal .close-button"),
	tutorName: document.querySelector("#tutor-name"),
	petName: document.querySelector("#pet-name"),
	telephone: document.querySelector("#telephone"),
	description: document.querySelector("#description"),
	formDate: document.querySelector("#form-date"),
	formTime: document.querySelector("#hour"),
	morningList: document.querySelector('ul[data-period="morning"]'),
	afternoonList: document.querySelector('ul[data-period="afternoon"]'),
	nightList: document.querySelector('ul[data-period="night"]'),
};

let currentSchedules = [];
let availableTimes = [];
let lastValidHeaderDate = null;

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

const getToastContainer = () => {
	let container = document.querySelector(".toast-container");
	if (!container) {
		container = document.createElement("div");
		container.className = "toast-container";
		document.body.appendChild(container);
	}
	return container;
};

const showToast = (message, variant = "success") => {
	const container = getToastContainer();
	const toast = document.createElement("div");
	toast.className = `toast ${variant}`;
	toast.textContent = message;
	container.appendChild(toast);
	setTimeout(() => {
		toast.remove();
	}, 2800);
};

const fetchSchedules = async (date) => {
	const response = await fetch(`${SCHEDULES_URL}?date=${encodeURIComponent(date)}`);
	if (!response.ok) {
		throw new Error("Falha ao buscar agendamentos.");
	}
	return response.json();
};

const createSchedule = async (payload) => {
	const response = await fetch(SCHEDULES_URL, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		throw new Error("Falha ao criar agendamento.");
	}

	return response.json();
};

const deleteSchedule = async (id) => {
	const response = await fetch(`${SCHEDULES_URL}/${id}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		throw new Error("Falha ao remover agendamento.");
	}
};

const normalizeDigits = (value) => value.replace(/\D/g, "");

const formatPhone = (value) => {
	const digits = normalizeDigits(value).slice(0, 11);
	if (!digits) {
		return "";
	}
	const area = digits.slice(0, 2);
	const prefix = digits.slice(2, 7);
	const suffix = digits.slice(7, 11);
	if (digits.length <= 2) {
		return `(${area}`;
	}
	if (digits.length <= 7) {
		return `(${area}) ${digits.slice(2)}`;
	}
	return `(${area}) ${prefix}-${suffix}`;
};

const applyPhoneMask = () => {
	const masked = formatPhone(elements.telephone.value);
	elements.telephone.value = masked;
};

const clearScheduleList = (list) => {
	while (list.firstChild) {
		list.removeChild(list.firstChild);
	}
};

const addEmptyState = (list) => {
	const item = document.createElement("li");
	item.className = "empty-state";
	item.textContent = "Sem agendamentos.";
	list.appendChild(item);
};

const buildAllowedTimes = () => {
	const times = [];
	const addWindowTimes = (window) => {
		const start = toMinutes(window.start);
		const end = toMinutes(window.end);
		const last = window.endInclusive ? end : end - 60;
		for (let value = start; value <= last; value += 60) {
			const hours = String(Math.floor(value / 60)).padStart(2, "0");
			const minutes = String(value % 60).padStart(2, "0");
			times.push(`${hours}:${minutes}`);
		}
	};
	addWindowTimes(TIME_WINDOWS.morning);
	addWindowTimes(TIME_WINDOWS.afternoon);
	addWindowTimes(TIME_WINDOWS.night);
	return times;
};

const isWeekend = (dateStr) => {
	const day = dayjs(dateStr).day();
	return day === 0 || day === 6;
};

const isHoliday = (dateStr) => {
	const key = dayjs(dateStr).format("MM-DD");
	return HOLIDAYS.includes(key);
};

const isDateBlocked = (dateStr) => {
	if (!dateStr) {
		return false;
	}
	return isWeekend(dateStr) || isHoliday(dateStr);
};

const findNextAvailableDate = (startDate) => {
	let candidate = dayjs(startDate);
	for (let i = 0; i < 365; i += 1) {
		const value = candidate.format("YYYY-MM-DD");
		if (!isDateBlocked(value)) {
			return value;
		}
		candidate = candidate.add(1, "day");
	}
	return startDate;
};

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

const updateTimeOptionsForDate = async (date) => {
	if (!date || isDateBlocked(date)) {
		setTimeOptions([]);
		return;
	}
	let schedules = currentSchedules;
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

const renderSchedules = (schedules) => {
	clearScheduleList(elements.morningList);
	clearScheduleList(elements.afternoonList);
	clearScheduleList(elements.nightList);

	const grouped = {
		morning: [],
		afternoon: [],
		night: [],
	};

	schedules.forEach((schedule) => {
		const period = getPeriodKey(schedule.time);
		if (period) {
			grouped[period].push(schedule);
		}
	});

	Object.keys(grouped).forEach((period) => {
		grouped[period].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
		const list = elements[`${period}List`];
		if (grouped[period].length === 0) {
			addEmptyState(list);
			return;
		}

		grouped[period].forEach((schedule) => {
			const item = document.createElement("li");
			item.dataset.id = schedule.id;

			const time = document.createElement("span");
			time.textContent = schedule.time;

			const owner = document.createElement("p");
			owner.className = "dog-owner";

			const petName = document.createElement("strong");
			petName.textContent = schedule.pet;

			const separator = document.createTextNode(" / ");

			const tutorName = document.createElement("small");
			tutorName.textContent = schedule.tutor;

			owner.appendChild(petName);
			owner.appendChild(separator);
			owner.appendChild(tutorName);

			const service = document.createElement("p");
			service.className = "service";
			service.textContent = schedule.description;

			const remove = document.createElement("button");
			remove.type = "button";
			remove.className = "remove-schedule";
			remove.textContent = "Remover agendamento";
			remove.addEventListener("click", () => handleRemove(schedule.id));

			item.appendChild(time);
			item.appendChild(owner);
			item.appendChild(service);
			item.appendChild(remove);
			list.appendChild(item);
		});
	});
};

const loadSchedulesForDate = async (date) => {
	const schedules = await fetchSchedules(date);
	currentSchedules = schedules;
	renderSchedules(currentSchedules);
};

const isValidPhone = (value) => {
	const digits = normalizeDigits(value);
	return digits.length >= 10;
};

const validateFields = () => {
	let isValid = true;

	clearAllFieldErrors();
	clearFormError();

	if (!elements.tutorName.value.trim()) {
		setFieldError(elements.tutorName, "Informe o nome do tutor.");
		isValid = false;
	}

	if (!elements.petName.value.trim()) {
		setFieldError(elements.petName, "Informe o nome do pet.");
		isValid = false;
	}

	if (!elements.telephone.value.trim()) {
		setFieldError(elements.telephone, "Informe o telefone.");
		isValid = false;
	} else if (!isValidPhone(elements.telephone.value)) {
		setFieldError(elements.telephone, "Telefone precisa ter pelo menos 10 digitos.");
		isValid = false;
	}

	if (!elements.description.value.trim()) {
		setFieldError(elements.description, "Descreva o servico.");
		isValid = false;
	}

	if (!elements.formDate.value) {
		setFieldError(elements.formDate, "Selecione a data.");
		isValid = false;
	} else if (isDateBlocked(elements.formDate.value)) {
		setFieldError(elements.formDate, "Data indisponivel.");
		isValid = false;
	}

	if (!elements.formTime.value) {
		setFieldError(elements.formTime, "Selecione a hora.");
		isValid = false;
	} else if (!getPeriodKey(elements.formTime.value)) {
		setFieldError(elements.formTime, "Horario fora das janelas validas.");
		isValid = false;
	} else if (!availableTimes.includes(elements.formTime.value)) {
		setFieldError(elements.formTime, "Horario indisponivel.");
		isValid = false;
	}

	return isValid;
};

const hasConflict = async (date, time) => {
	if (date === elements.headerDate.value) {
		return currentSchedules.some((schedule) => schedule.time === time);
	}

	const response = await fetch(
		`${SCHEDULES_URL}?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}`
	);
	if (!response.ok) {
		throw new Error("Falha ao validar conflito.");
	}
	const existing = await response.json();
	return existing.length > 0;
};

const handleSubmit = async (event) => {
	event.preventDefault();
	if (!validateFields()) {
		return;
	}

	const payload = {
		tutor: elements.tutorName.value.trim(),
		pet: elements.petName.value.trim(),
		phone: normalizeDigits(elements.telephone.value),
		description: elements.description.value.trim(),
		date: elements.formDate.value,
		time: elements.formTime.value,
	};

	try {
		const conflict = await hasConflict(payload.date, payload.time);
		if (conflict) {
			setFieldError(elements.formTime, "Ja existe agendamento neste horario.");
			return;
		}

		const created = await createSchedule(payload);
		if (payload.date === elements.headerDate.value) {
			currentSchedules = [...currentSchedules, created];
			renderSchedules(currentSchedules);
		}
		showToast("Agendamento realizado com sucesso.");
		await updateTimeOptionsForDate(elements.formDate.value);
		closeModal();
	} catch (error) {
		showFormError("Nao foi possivel salvar o agendamento. Tente novamente.");
		showToast("Erro ao agendar atendimento.", "error");
	}
};

const handleRemove = async (id) => {
	const schedule = currentSchedules.find((item) => item.id === id);
	if (!schedule) {
		return;
	}

	currentSchedules = currentSchedules.filter((item) => item.id !== id);
	renderSchedules(currentSchedules);

	try {
		await deleteSchedule(id);
		showToast("Agendamento cancelado.");
		await updateTimeOptionsForDate(elements.formDate.value);
	} catch (error) {
		showFormError("Nao foi possivel remover o agendamento.");
		showToast("Erro ao cancelar agendamento.", "error");
		currentSchedules = [...currentSchedules, schedule];
		renderSchedules(currentSchedules);
	}
};

const setupListeners = () => {
	elements.newScheduleButton.addEventListener("click", openModal);
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
			elements.headerDate.value = lastValidHeaderDate;
			return;
		}
		lastValidHeaderDate = selected;
		elements.formDate.value = selected;
		await loadSchedulesForDate(selected);
		await updateTimeOptionsForDate(selected);
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
		await updateTimeOptionsForDate(selected);
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
		applyPhoneMask();
		clearFieldError(elements.telephone);
	});

	elements.formTime.addEventListener("change", () => {
		clearFieldError(elements.formTime);
	});
};

const init = async () => {
	const today = findNextAvailableDate(getTodayDate());
	lastValidHeaderDate = today;
	elements.headerDate.value = today;
	elements.formDate.value = today;

	setupListeners();
	try {
		await loadSchedulesForDate(today);
		await updateTimeOptionsForDate(today);
	} catch (error) {
		showFormError("Nao foi possivel carregar a agenda.");
		showToast("Erro ao carregar agenda.", "error");
	}
};

init();

