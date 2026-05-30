
const TIME_WINDOWS = {
	morning: { start: "09:00", end: "12:00", endInclusive: true },
	afternoon: { start: "13:00", end: "18:00", endInclusive: false },
	night: { start: "18:00", end: "21:00", endInclusive: true },
};

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

export { toMinutes, isWithinRange, getPeriodKey, buildAllowedTimes };