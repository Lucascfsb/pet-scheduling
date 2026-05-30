
import dayjs from "dayjs";

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

const getTodayDate = () => dayjs().format("YYYY-MM-DD");

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

export { getTodayDate, isWeekend, isHoliday, isDateBlocked, findNextAvailableDate };