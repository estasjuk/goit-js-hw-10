export function fetchCountries(name) { 
    const URL = "https://restcountries.com/v3.1/name";
    const searchParams = "fields=name,capital,languages,population,flags";
    return fetch(`${URL}/${name}?${searchParams}`)
        .then(response => response.json())
};


