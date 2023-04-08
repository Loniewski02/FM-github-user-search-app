const modeBtn = document.querySelector('.app__nav-mode');
const body = document.querySelector('body');

modeBtn.addEventListener('click', () => {
	body.classList.toggle('dark-mode');
});
