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

const applyPhoneMask = (input) => {
	input.value = formatPhone(input.value);
};

const isValidPhone = (value) => {
	const digits = normalizeDigits(value);
	return digits.length >= 10;
};

export { normalizeDigits, formatPhone, applyPhoneMask, isValidPhone };