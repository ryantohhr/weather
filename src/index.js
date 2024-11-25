import "./style.css";
import rain from "./assets/rain.svg";
import partlyCloudyDay from "./assets/partly-cloudy-day.svg";
import partlyCloudyNight from "./assets/partly-cloudy-night.svg";
import cloudy from "./assets/cloudy.svg";
import clearDay from "./assets/clear-day.svg";
import clearNight from "./assets/clear-night.svg";
import precipprobImgLink from "./assets/precipprobicon.svg";
import sunsetImg from "./assets/sunset.svg";
import sunriseImg from "./assets/sunrise.svg";


async function getWeatherData(location) {
    const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=KXPL6CA5QW7CNQMY57BFEQHHE&include=current`,
        {mode: 'cors'}
    );
    if (response.ok) {
        const weatherData = await response.json();
        const appData = getAppData(weatherData);
        generateDOM(appData);
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const input = document.querySelector("#search");
        getWeatherData(input.value);
    }
})

function getAppData(weatherData) {
    const temp = toCelsius(weatherData.currentConditions.temp).toFixed(1);
    const conditions = weatherData.currentConditions.conditions;
    const icon = weatherData.currentConditions.icon;
    const precipprob = weatherData.currentConditions.precipprob;
    const sunset = weatherData.currentConditions.sunset.slice(0, 5);
    const sunrise = weatherData.currentConditions.sunrise.slice(0, 5);
    let sun;
    const now = new Date();
    const hoursNow = now.getHours().toString().padStart(2);
    const minsNow = now.getMinutes().toString().padStart(2);
    const timeNow = `${hoursNow}:${minsNow}`;
    if (timeNow < sunrise) {
        sun = "sunrise";
    } else if (timeNow > sunset) {
        sun = "sunrise";
    } else {
        sun = "sunset";
    }
    return {
        temp, 
        conditions,
        icon,
        precipprob,
        sunset,
        sunrise,
        sun,
    }
}

function toCelsius(tempInFahrenheit) {
    return (tempInFahrenheit - 32) * 5 / 9;
}

function generateDOM(appData) {
    const weatherDiv = document.querySelector(".weather");
    while (weatherDiv.firstChild) {
        weatherDiv.removeChild(weatherDiv.firstChild);
    }
    
    const dataDiv = document.createElement("div");
    dataDiv.classList.add("data");

    while (dataDiv.firstChild) {
        dataDiv.removeChild(dataDiv.firstChild);
    }

    const conditionsImg = document.createElement("img");

    switch(appData.icon) {
        case "rain":
            conditionsImg.src = rain;
            break;
        case "partly-cloudy-day":
            conditionsImg.src = partlyCloudyDay;
            break;
        case "partly-cloudy-night":
            conditionsImg.src = partlyCloudyNight;
            break;
        case "cloudy":
            conditionsImg.src = cloudy;
            break;
        case "clear-day":
            conditionsImg.src = clearDay;
            break;
        case "clear-night":
            conditionsImg.src = clearNight;
            break;
    }
    dataDiv.appendChild(conditionsImg);

    const temp = document.createElement("div");
    temp.classList.add("temp");
    temp.innerHTML = `${appData.temp}&deg`;
    dataDiv.appendChild(temp);

    const conditions = document.createElement("div");
    conditions.classList.add("conditions");
    conditions.textContent = `${appData.conditions}`;
    dataDiv.appendChild(conditions);

    const otherInfo = document.createElement("div");
    otherInfo.classList.add("otherinfo");

    const precipprob = document.createElement("div");
    precipprob.classList.add("precipprob");
    const precipprobImg = document.createElement("img");
    const precipprobText = document.createElement("div");
    precipprobImg.src = precipprobImgLink;
    precipprobText.textContent = `${appData.precipprob}%`;
    precipprob.appendChild(precipprobImg);
    precipprob.appendChild(precipprobText);

    const sun = document.createElement("div");
    sun.classList.add("sun");
    const sunImg = document.createElement("img");
    const sunText = document.createElement("div");
    let suntext;
    if (appData.sun === "sunset") {
        sunImg.src = sunsetImg;
        suntext = appData.sunset;
    } else {
        sunImg.src = sunriseImg;
        suntext = appData.sunrise;
    }
    sunText.textContent = `${suntext}`
    sun.appendChild(sunImg);
    sun.appendChild(sunText);

    otherInfo.appendChild(precipprob);
    otherInfo.appendChild(sun);

    dataDiv.appendChild(otherInfo);

    weatherDiv.appendChild(dataDiv);

}