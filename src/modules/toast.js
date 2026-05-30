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

export { getToastContainer, showToast };