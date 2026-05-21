"use strict";

//Configuração do dayjs


//CSS
import "./styles/global.css";
import "./styles/schedule.css";
import "./styles/form.css";

//JS
document.addEventListener("DOMContentLoaded", () => {
	const headerDateInput = document.querySelector("#header-date");
	const dateArrow = document.querySelector(".input-calendar .date-arrow");

	if (!headerDateInput || !dateArrow) {
		return;
	}

	dateArrow.addEventListener("click", (event) => {
		event.preventDefault();

		if (typeof headerDateInput.showPicker === "function") {
			headerDateInput.showPicker();
			return;
		}

		headerDateInput.focus();
		headerDateInput.click();
	});
});
