const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// variable for determining which is my current tab
let curretTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
curretTab.classList.add("current-tab");

getFromSessionStorage();

function switchTab(clickedTab){
    if(curretTab != clickedTab){
        curretTab.classList.remove("current-tab");
        curretTab = clickedTab;
        curretTab.classList.add("current-tab");
    if(!searchForm.classList.contains("active")){
        // kya search form wala container invisile the -> usko visible krao
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        // main pehle serch form wale pr tha ab your weather wale pr krna hai
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        // ab hm your waether lale tab me aagye hai to weather bhi display krana pdega so lets check local storage first if we have saved them there.

        getFromSessionStorage(); 

    }
}
}

userTab.addEventListener('click',()=>{
    // pass clicked tab as an input parameter
    switchTab(userTab);
});
searchTab.addEventListener('click',()=>{
    // pass clicked tab as an input parameter
    switchTab(searchTab);
});

// Try To underStand This Portion Of Code

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates"); 
    // basically isase user ka coordinates mil rha hai
    if(!localCoordinates){
        // agr locat cordinates nhi mile
        grantAccessContainer.classList.add("active");   
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}
// user ka cordinates mil gya ab is cordinates ke liye api call mar do

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon} = coordinates;
    // make grant permission container invisible 
    grantAccessContainer.classList.remove("active");
    // make loading screen visible
    loadingScreen.classList.add("active");


    // API call mar do
    try{
        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await result.json();
        // jb hme data mil gya to ab loader ko hta lo
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
    loadingScreen.classList.remove("active");
    // aur kya kr skte hai
    }

} 
function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDiscription]");
    const weatherIcon  = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudeness = document.querySelector("[data-cloudeness]");
    // put the values 

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = weatherInfo?.main?.temp + " °C";
    windspeed.innerText = weatherInfo?.wind?.speed + " m/s";
    humidity.innerText = weatherInfo?.main?.humidity + "%";
    cloudeness.innerText = weatherInfo?.clouds?.all + "%";
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("Allow Permission To Find Your Weather Conditions");
    }
}
function showPosition(position){
const userCoordinates = {
    lat :position.coords.latitude,
    lon:position.coords.longitude,
}
sessionStorage.setItem("user-coordiantes",JSON.stringify(userCoordinates));
fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener('click',getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener('submit',(e)=>{
e.preventDefault();
let cityName = searchInput.value;
if(cityName === "") return;
else{
    fetchSearchWeatherInfo(cityName);
}
});
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (error){
        alert("Something went wrong");
    }
}
