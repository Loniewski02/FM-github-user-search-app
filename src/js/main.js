const modeBtn = document.querySelector('.app__nav-mode');
const modeIco = document.querySelectorAll('.app__nav-mode svg');
const input = document.querySelector('.app__search-input');
const searchBtn = document.querySelector('.app__search-btn');
const body = document.querySelector('body');

const userAvatar = document.querySelector('.user-avatar');
const userFullName = document.querySelector('.app__main-user-username');
const userLogin = document.querySelector('.app__main-user-userlink');
const userBio = document.querySelector('.app__main-description');

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

const getUser = inp => {
	const userInp = inp.value;
	if (userInp === prevUserInp) {
		return;
	}
	prevUserInp = userInp;

	fetch(`https://api.github.com/users/${userInp}`)
		.then(res => {
			if (res.ok) {
				return res.json();
			} else {
				throw new Error('Network response was not ok.');
			}
		})
		.then(data => {
			const createdAccDate = new Date(data.created_at);
			userAvatar.setAttribute('src', data.avatar_url);

			if (data.bio === null) {
				userBio.textContent = 'This profile has no bio';
			} else {
				userBio.textContent = data.bio;
			}
			
			userLogin.textContent = data.login;

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
		})
		.catch(err => {
			console.error('Error:', err);
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
		});
};

// const getUser = inp => {
// 	const userInp = inp.value;
// 	fetch(`https://api.github.com/users/${userInp}`)
// 		.then(res => res.json())
// 		.then(data => {
// 			console.log(data);
// 			const createdAccDate = new Date(data.created_at);
// 			userAvatar.setAttribute('src', data.avatar_url);

// 			if (data.bio === null) {
// 				userBio.textContent = 'This profile has no bio';
// 			} else {
// 				userBio.textContent = data.bio;
// 			}

// 			userFullName.textContent = data.name;
// 			userLogin.textContent = data.login;

// 			check(userFullName, data.name);
// 			check(userTwitter, data.twitter_username);
// 			check(userLocation, data.location);
// 			check(userCompany, data.company);
// 			check(userWebsite, data.blog);
// 			userWebsite.setAttribute('href', data.blog);

// 			userJoined.textContent = createdAccDate.toDateString().slice(4);

// 			userRepos.textContent = data.public_repos;
// 			userFollowers.textContent = data.followers;
// 			userFollowing.textContent = data.following;
// 		})
// 		.catch(err => console.error('Error:', err));
// };

const check = (element, userData) => {
	if (!userData) {
		element.textContent = 'Not Available';
		element.parentElement.classList.add('app__main-links-box--disabled');
	} else {
		element.textContent = userData;
	}
};

input.addEventListener('keyup', e => {
	if (e.key === 'Enter') {
		getUser(input);
	}
});

searchBtn.addEventListener('click', () => {
	getUser(input);
});

modeBtn.addEventListener('click', () => {
	body.classList.toggle('dark-mode');
	modeIco.forEach(icon => {
		icon.classList.toggle('active');
	});
});
