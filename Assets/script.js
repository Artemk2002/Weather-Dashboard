//get fetch request
let weather = {
    fetchWeather: function(city){
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=022add02847b9ebe48616bdf1eb9bfeb"
        )
        .then((response)=> {
          if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
          }
          return response.json();
        })
        .then((data)=> this.displayWeather(data));
    },
    displayWeather: function(data){
    //pull certin data from fetch
    const { name } = data;
    const { icon } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    //display data
    document.querySelector(".city").innerText = "Weather in " + name + " Today";
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".temp").innerText = "Temp: " + temp + "°F";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind: " + speed + " mph";

    displayForecast(city);
    },
    //Get the search input value
    search: function () {
        this.fetchWeather(document.querySelector(".searchText").value);
        city = document.querySelector(".searchText").value
        saveLocalStorage(city);
    }
};
//Submit button
document.querySelector(".search").addEventListener("click", function () {
    weather.search();
    document.querySelector("#days").innerText ="";
  });
//what happens on load
var city="Marysville";
weather.fetchWeather(city);
getLocalStorage();

//this will get and display a 5 day forcast
function displayForecast(city) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&APPID=022add02847b9ebe48616bdf1eb9bfeb",
        method: "GET",
    }).then(function (response) {
        var arrayList = response.list;
        for (var i = 0; i < arrayList.length; i++) {
            if (arrayList[i].dt_txt.split(' ')[1] === '12:00:00') {
                console.log(arrayList[i]);
                var cityMain = $('<div class="card">');
                var date5 = $("<h5>").text(response.list[i].dt_txt.split(" ")[0]);
                var image = $('<img>').attr('src', 'http://openweathermap.org/img/w/' + arrayList[i].weather[0].icon + '.png');
                var degreeMain = $('<p>').text('Temp: ' + arrayList[i].main.temp + ' °F');           
                var humidityMain = $('<p>').text('Humidity: ' + arrayList[i].main.humidity + '%');
                var windMain = $('<p>').text('Wind: ' + arrayList[i].wind.speed + 'MPH');                
                cityMain.append(date5).append(image).append(degreeMain).append(humidityMain).append(windMain);
                $('#days').append(cityMain);
               
            }
        }
    });
};
//save last search to local storage
function saveLocalStorage(city) {
    localStorage.setItem("lastSearch", city);
}
//pull data from local storage
function getLocalStorage() {
    var storedData = localStorage.getItem("lastSearch");
    if (!storedData) {
        console.log("no data stored");
    } else {
        console.log(storedData);
        document.querySelector(".lastSearch").innerText = storedData ;  
    }
};
  