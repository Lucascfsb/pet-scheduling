"use strict";

//CSS
import "./styles/global.css";
import "./styles/schedule.css";
import "./styles/form.css";

import { elements } from "./modules/dom";
import {
	clearAllFieldErrors,
	clearFormError,
	setFieldError,
	showFormError,
} from "./modules/errors";
import { closeModal } from "./modules/modal";
import { showToast } from "./modules/toast";
import { renderSchedules } from "./modules/scheduleList";
import {
	getAvailableTimes,
	updateTimeOptionsForDate,
} from "./modules/timeOptions";
import { setupListeners } from "./modules/listeners";
import { fetchSchedules, createSchedule, deleteSchedule } from "./services/scheduleApi";
import { getTodayDate, findNextAvailableDate, isDateBlocked } from "./utils/dateUtils";
import { getPeriodKey } from "./utils/timeUtils";
import { normalizeDigits, isValidPhone } from "./utils/phoneUtils";

let currentSchedules = [];
let lastValidHeaderDate = null;

const loadSchedulesForDate = async (date) => {
	const schedules = await fetchSchedules(date);
	currentSchedules = schedules;
	renderSchedules(currentSchedules, handleRemove);
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
	} else if (!getAvailableTimes().includes(elements.formTime.value)) {
		setFieldError(elements.formTime, "Horario indisponivel.");
		isValid = false;
	}

	return isValid;
};

const hasConflict = async (date, time) => {
	if (date === elements.headerDate.value) {
		return currentSchedules.some((schedule) => schedule.time === time);
	}

	const schedules = await fetchSchedules(date);
	return schedules.some((schedule) => schedule.time === time);
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
			renderSchedules(currentSchedules, handleRemove);
		}
		showToast("Agendamento realizado com sucesso.");
		await updateTimeOptionsForDate(elements.formDate.value, currentSchedules);
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
	renderSchedules(currentSchedules, handleRemove);

	try {
		await deleteSchedule(id);
		showToast("Agendamento cancelado.");
		await updateTimeOptionsForDate(elements.formDate.value, currentSchedules);
	} catch (error) {
		showFormError("Nao foi possivel remover o agendamento.");
		showToast("Erro ao cancelar agendamento.", "error");
		currentSchedules = [...currentSchedules, schedule];
		renderSchedules(currentSchedules, handleRemove);
		await updateTimeOptionsForDate(elements.formDate.value, currentSchedules);
	}
};

const init = async () => {
	const today = findNextAvailableDate(getTodayDate());
	lastValidHeaderDate = today;
	elements.headerDate.value = today;
	elements.formDate.value = today;

	setupListeners({
		handleSubmit,
		loadSchedulesForDate,
		updateTimeOptionsForDate,
		getLastValidHeaderDate: () => lastValidHeaderDate,
		setLastValidHeaderDate: (value) => {
			lastValidHeaderDate = value;
		},
		getCurrentSchedules: () => currentSchedules,
	});
	try {
		await loadSchedulesForDate(today);
		await updateTimeOptionsForDate(today, currentSchedules);
	} catch (error) {
		showFormError("Nao foi possivel carregar a agenda.");
		showToast("Erro ao carregar agenda.", "error");
	}
};

init();

