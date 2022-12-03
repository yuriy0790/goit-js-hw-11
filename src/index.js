import './css/styles.css';
import countryCardMarkUp from './templates/country-card.hbs';
import countryListMarkUp from './templates/country-list.hbs';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(event) {
  if (!event.target.value) {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }
  const searchQuery = event.target.value.trim();
  fetchCountries(searchQuery).then(createMarkUp).catch(onFetchError);
}

function onFetchError(error) {
  console.log(error);
  if (error.message === '404') {
    Notiflix.Notify.failure('Oops, there is no country with that name');
  } else {
    Notiflix.Notify.failure('Oops, something going wrong');
  }
}

function createMarkUp(countryArray) {
  countryListEl.innerHTML = '';
  countryInfoEl.innerHTML = '';

  if (countryArray.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
    return;
  }
  if (countryArray.length >= 2) {
    countryListEl.innerHTML = countryListMarkUp(countryArray);
    return;
  }
  if (countryArray.length === 1) {
    countryInfoEl.innerHTML = countryCardMarkUp(countryArray[0]);
    return;
  }
}
