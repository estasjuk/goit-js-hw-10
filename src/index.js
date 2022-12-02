import './css/styles.css';
import { fetchCountries } from './js/fetchCountry';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const URL = "https://restcountries.com/v3.1/name";
const searchParams = "fields=name,capital,languages,population,flags";
const refs = {
    searchBox: document.querySelector("#search-box"),
    list: document.querySelector(".country-list"),
    info: document.querySelector(".country-info"),
};

refs.searchBox.addEventListener("input", debounce(onInput, DEBOUNCE_DELAY));


function onInput(e) {
    e.preventDefault();
    const country = e.target.value.trim();
        if (country.length === 0) { 
            clearData();
            return;
    }
        else fetchCountries(country)
            .then(renderData)
            .catch(onFetchError);

};


function getWarning() { 
    return Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
}

function getMarkupOfCountryList(countries) { 
    const markupList = countries
            .map(country => {
                return `<li>
    <div class="box"><img src="${country.flags.png}" alt="flag ${country.name.official}" width="120" /><h2>${country.name.official}</h2></div>
    </li>`;
            })
            .join('');
        refs.list.insertAdjacentHTML("beforeend", markupList);
}

function getMarkupOfCountryCard(countries) { 
    const markupCountryCard = countries
            .map(country => {
                return `<li>
    <div class="box"><img src="${country.flags.png}" alt="flag ${country.name.official}" width="120" /><h2>${country.name.official}</h2></div>
    <div class="country-info">
    <div class="prop"><h3 class="country-prop">Capital: </h3><span>${country.capital}</span></div>
    <div class="prop"><h3 class="country-prop">Population: </h3><span>${country.population}</span></div>
    <div class="prop"><h3 class="country-prop">Languages: </h3><span>${Object.values(country.languages)}</span></div>
    </div>
    </li>`;
            })
            .join('');
        refs.list.insertAdjacentHTML("beforeend", markupCountryCard);

}

function clearData() { 
    refs.list.innerHTML = "";
}

function onFetchError() { 
 return Notiflix.Notify.failure("Oops, there is no country with that name");
}

function renderData(items) {
    //console.log(items);
    clearData();
    if (items.length >= 10) {
        getWarning();    
    }
    else if (items.length >= 2 && items.length < 10) {
        getMarkupOfCountryList(items)
    }
    else {
        getMarkupOfCountryCard(items)
    }
}
