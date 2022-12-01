//api key and my preset city
var APIkey = "022add02847b9ebe48616bdf1eb9bfeb";
var city = "Marysville"

var date = moment().format('dddd, MMMM Do YYYY');

//search section
var searchCity = [];
$('.search').on("click", function (event) {
	event.preventDefault();
	city = $(this).parent('.searchBtnPar').siblings('.searchText').val().trim();
	if (city === "") {
		return;
	};
	searchCity.push(city);

	localStorage.setItem('city', JSON.stringify(searchCity));
	fiveDayForcastEl.empty();
	searchHistory();
	currentWeather();
});

var searchCityEl = $('.searchCity');
function searchHistory() {
	searchCityEl.empty();

	for (let i = 0; i < searchCity.length; i++) {

        var rowEl = $('<row>');
		var btnEl = $('<button>').text(`${searchCity[i]}`)

		rowEl.addClass('row searchBtnRow');
		btnEl.addClass('btn btn-outline-secondary searchBtn');
		btnEl.attr('type', 'button');

		searchCityEl.prepend(rowEl);
		rowEl.append(btnEl);
	} if (!city) {
		return;
	}
	$('.searchBtn').on("click", function (event) {
		event.preventDefault();
		city = $(this).text();
		fiveDayForcastEl.empty();
		currentWeather();
	});
};
//todays weather
var currentDay = $('.currentDay')
function currentWeather() {
	var currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${APIkey}`;

	$(currentDay).empty();

	$.ajax({
		url: currentURL,
		method: 'GET',
	}).then(function (response) {
		$('.currentCityName').text(response.name);
		$('.currentDate').text(date);
		$('.images').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
		var tempEl = $('<p>').text(`Temp: ${response.main.temp} °F`);
		currentDay.append(tempEl);
		var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
		currentDay.append(pElHumid);
		var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
		currentDay.append(pElWind);
		var lon = response.coord.lon;
		console.log(lon);
		var lat = response.coord.lat;
		console.log(lat);

	});
	getFiveDayForecast();
};

var fiveDayForcastEl = $('.fiveDayForecast');
//5 day forcast
function getFiveDayForecast() {
	var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${APIkey}`;

	$.ajax({
		url: fiveDayURL,
		method: 'GET',
	}).then(function (response) {
		var fiveDayArray = response.list;
		var userWeather = [];
		$.each(fiveDayArray, function (index, value) {
			testObj = {
				date: value.dt_txt.split(' ')[0],
				time: value.dt_txt.split(' ')[1],
				temp: value.main.temp,
				icon: value.weather[0].icon,
				humidity: value.main.humidity,
                wind_speed: value.wind.speed
			}

			if (value.dt_txt.split(' ')[1] === "12:00:00") {
				userWeather.push(testObj);
			}
		})
		for (let i = 0; i < userWeather.length; i++) {

			var divElCard = $('<div>');
			divElCard.attr('class', 'card text-white bg-danger mb-3 cardOne');
			divElCard.attr('style', 'width:180px;');
			fiveDayForcastEl.append(divElCard);

			var divElHeader = $('<div>');
			divElHeader.attr('class', 'card-header')
			var m = moment(`${userWeather[i].date}`).format('MM-DD-YYYY');
			divElHeader.text(m);
			divElCard.append(divElHeader)

			var divElBody = $('<div>');
			divElBody.attr('class', 'card-body');
			divElCard.append(divElBody);

			var divElIcon = $('<img>');
			divElIcon.attr('class', 'icons');
			divElIcon.attr('src', `https://openweathermap.org/img/wn/${userWeather[i].icon}@2x.png`);
			divElBody.append(divElIcon);

			var pElTemp = $('<p>').text(`Temp: ${userWeather[i].temp} °F`);
			divElBody.append(pElTemp);
            var pElWind = $('<p>').text(`Wind: ${userWeather[i].wind_speed} MPH`);
			divElBody.append(pElWind);
			var pElHumid = $('<p>').text(`Humidity: ${userWeather[i].humidity} %`);
			divElBody.append(pElHumid);
            
		}
	});
};
//on load function
function firstLoad() {

	var searchCityStore = JSON.parse(localStorage.getItem('city'));

	if (searchCityStore !== null) {
		searchCity = searchCityStore
	}
	searchHistory();
	currentWeather();
};
firstLoad();