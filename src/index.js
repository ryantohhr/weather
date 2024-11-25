import "./style.css";
import rain from "./assets/rain.svg";
import partlyCloudyDay from "./assets/partly-cloudy-day.svg";
import cloudy from "./assets/cloudy.svg";
import clearDay from "./assets/clear-day.svg";
import clearNight from "./assets/clear-night.svg";


async function getWeatherData(location) {
    const response = await fetch(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=KXPL6CA5QW7CNQMY57BFEQHHE&include=current`,
        {mode: 'cors'}
    );
    if (response.ok) {
        const weatherData = await response.json();
        console.log(weatherData);
        const appData = getAppData(weatherData);
        console.log(appData);
        generateDOM(appData);
    }
}

getWeatherData("Singapore");

function getAppData(weatherData) {
    const temp = toCelsius(weatherData.currentConditions.temp).toFixed(1);
    const conditions = weatherData.currentConditions.conditions;
    const icon = weatherData.currentConditions.icon;
    const precipprob = weatherData.currentConditions.precipprob;
    return {
        temp, 
        conditions,
        icon,
        precipprob
    }
}

function toCelsius(tempInFahrenheit) {
    return (tempInFahrenheit - 32) * 5 / 9;
}

function generateDOM(appData) {
    const dataDiv = document.querySelector("div.data");

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
}