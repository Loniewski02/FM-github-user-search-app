const modeBtn = document.querySelector('.app__nav-mode');
const sunIco = document.querySelector('.sun-ico');
const moonIco = document.querySelector('.moon-ico');
const modeBtnText = document.querySelector('.mode-btn-text');
const input = document.querySelector('.app__search-input');
const searchBtn = document.querySelector('.app__search-btn');
const body = document.querySelector('body');

const userAvatar = document.querySelector('.user-avatar');
const userFullName = document.querySelector('.app__main-user-username');
const userLogin = document.querySelector('.app__main-user-userlink');
const userBio = document.querySelector('.app__main-description');

const errorInfo = document.querySelector('.error-info');

const userLocation = document.querySelector('.app__main-links-location');
const userJoined = document.querySelector('.app__main-user-joined span');
const userWebsite = document.querySelector('.app__main-links-website');
const userTwitter = document.querySelector('.app__main-links-twitter');
const userCompany = document.querySelector('.app__main-links-company');
const userRepos = document.querySelector('.app__main-box-number--repos');
const userFollowers = document.querySelector('.app__main-box-number--followers');
const userFollowing = document.querySelector('.app__main-box-number--following');

let prevUserInp = '';
let prevData = {};

const checkPreferedColorScheme = () => {
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		body.classList.add('dark-mode');
		moonIco.classList.remove('active');
		sunIco.classList.add('active');
		modeBtnText.innerHTML = 'Light';
	} else {
		body.classList.add('light-mode');
		sunIco.classList.remove('active');
		moonIco.classList.add('active');
		modeBtnText.innerHTML = 'Dark';
	}
};

checkPreferedColorScheme();

const getUser = inp => {
	const userInp = inp.value;
	if (userInp === prevUserInp) {
		return;
	}
	prevUserInp = userInp;

	fetch(`https://api.github.com/users/${userInp}`)
		.then(res => res.json())
		.then(data => {
			if (data.message === 'Not Found') {
				errorInfo.style.display = 'block';
			} else {
				errorInfo.style.display = 'none';

				updateUserProfile(data);
			}
		})
		.catch(err => {
			console.error('Error:', err);
			restoreUserProfile();
		});
};

const updateUserProfile = data => {
	const createdAccDate = new Date(data.created_at);
	userAvatar.setAttribute('src', data.avatar_url);

	if (data.bio === null) {
		userBio.textContent = 'This profile has no bio';
	} else {
		userBio.textContent = data.bio;
	}
	console.log(data);

	handleUserLogin(userLogin, data.login);
	check(userFullName, data.name);
	check(userTwitter, data.twitter_username);
	check(userLocation, data.location);
	check(userCompany, data.company);
	check(userWebsite, data.blog);
	userWebsite.setAttribute('href', data.blog);

	userJoined.textContent = createdAccDate.toDateString().slice(4);

	userRepos.textContent = data.public_repos;
	userFollowers.textContent = data.followers;
	userFollowing.textContent = data.following;

	prevData = {
		avatar_url: data.avatar_url,
		bio: data.bio,
		name: data.name,
		login: data.login,
		twitter_username: data.twitter_username,
		location: data.location,
		company: data.company,
		blog: data.blog,
		public_repos: data.public_repos,
		followers: data.followers,
		following: data.following,
	};
};

const restoreUserProfile = () => {
	userAvatar.setAttribute('src', prevData.avatar_url);
	userBio.textContent = prevData.bio;
	userFullName.textContent = prevData.name;
	userLogin.textContent = prevData.login;
	check(userFullName, prevData.name);
	check(userTwitter, prevData.twitter_username);
	check(userLocation, prevData.location);
	check(userCompany, prevData.company);
	check(userWebsite, prevData.blog);
	userWebsite.setAttribute('href', prevData.blog);
	userJoined.textContent = '';
	userRepos.textContent = prevData.public_repos;
	userFollowers.textContent = prevData.followers;
	userFollowing.textContent = prevData.following;
};

const handleUserLogin = (element, userData) => {
	element.textContent = `@${userData}`;
	element.setAttribute('href', `https://github.com/${userData}`);
};

const check = (element, userData) => {
	if (!userData) {
		element.textContent = 'Not Available';
		element.parentElement.classList.add('app__main-links-box--disabled');
	} else {
		element.textContent = userData;
		element.parentElement.classList.remove('app__main-links-box--disabled');
	}
};

input.value = 'octocat';
getUser(input);
input.value = '';

input.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		getUser(input);
	}
});

searchBtn.addEventListener('click', () => {
	getUser(input);
});

modeBtn.addEventListener('click', () => {
	if (body.classList.contains('dark-mode')) {
		body.classList.remove('dark-mode');
		body.classList.add('light-mode');
		moonIco.classList.add('active');
		sunIco.classList.remove('active');
		modeBtnText.innerHTML = 'dark';
	} else if (body.classList.contains('light-mode')) {
		body.classList.remove('light-mode');
		body.classList.add('dark-mode');
		sunIco.classList.add('active');
		moonIco.classList.remove('active');
		modeBtnText.innerHTML = 'light';
	}
});
