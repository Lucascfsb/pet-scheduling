import { API_URL } from "./apiConfig";

const SCHEDULES_URL = `${API_URL}/schedules`;

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

export { fetchSchedules, createSchedule, deleteSchedule };