import { elements } from "./dom";
import { getPeriodKey, toMinutes } from "../utils/timeUtils";

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

const renderSchedules = (schedules, handleRemove) => {
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

export { renderSchedules };