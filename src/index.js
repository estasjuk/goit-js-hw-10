import './css/styles.css';
import { fetchCountries } from './js/fetchCountry';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const refs = {
    searchBox: document.querySelector("#search-box"),
    list: document.querySelector(".country-list"),
    info: document.querySelector(".country-info"),
    preloader: document.querySelector(".preloader")
};

refs.searchBox.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    e.preventDefault();
    const country = e.target.value.trim();
    clearData();
    if (!country) {                 //the same: country.length === 0
        return;
    }
        showLoader("add");
        fetchCountries(country)
        .then(renderData)
        .catch(error => {
            onFetchError(error);
            
        })   
};

function showLoader(method) { 
    refs.preloader.classList[method]("show");
};

function getWarning() { 
    return Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
};

function getMarkupOfCountryList(countries) { 
    return countries
            .map(country => {
                return `<li>
    <div class="box"><img src="${country.flags.png}" alt="flag ${country.name.official}" width="120" /><h2>${country.name.official}</h2></div>
    </li>`;
            })
            .join('');  
};

function getMarkupOfCountryCard(countries) { 
    return countries
            .map(country => {
                return `<li>
    <div class="box"><img src="${country.flags.png}" alt="flag ${country.name.official}" width="120" /><h2>${country.name.official}</h2></div>
    <div class="country-info">
    <div class="prop"><h3 class="country-prop">Capital: </h3><span>${country.capital}</span></div>
    <div class="prop"><h3 class="country-prop">Population: </h3><span>${country.population}</span></div>
    <div class="prop"><h3 class="country-prop">Languages: </h3><span>${Object.values(country.languages).join(", ")}</span></div>
    </div>
    </li>`;
            })
            .join('');
};

function clearData() { 
    refs.list.innerHTML = "";
    refs.searchBox.focus();
};

function onFetchError() { 
    showLoader("remove");
    return Notiflix.Notify.failure("Oops, there is no country with that name");
};

function renderData(items) {
    showLoader("remove");
    
    if (items.length >= 10) {
        getWarning();
    }
    else if (items.length >= 2 && items.length < 10) {
        const markupList = getMarkupOfCountryList(items);
        refs.list.insertAdjacentHTML("beforeend", markupList);
    }
    else {
        const markupCountryCard = getMarkupOfCountryCard(items);
        refs.list.insertAdjacentHTML("beforeend", markupCountryCard);
    }
};
