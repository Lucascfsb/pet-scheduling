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

export { elements };