import fetchCountries from './fetchCountries.js';
import countryListItemsTemplate from '../template/country-list-item.hbs';
import countriesListTemplate from '../template/countries-list.hbs';
import PNotify from '../../node_modules/pnotify/dist/es/PNotify.js';
import debounce from 'lodash.debounce';
import '../styles.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  countryList: document.querySelector('#country-list'),
  searchInput: document.querySelector('.search__input'),
};

refs.searchForm.addEventListener('submit', event => {
  event.preventDefault();
});

refs.searchForm.addEventListener(
  'input',
  debounce(e => {
    searchFormInputHandler(e);
  }, 1000),
);

function searchFormInputHandler(e) {
  const searchQuery = e.target.value;

  clearListItems();

  fetchCountries(searchQuery).then(data => {
    const markup = buildListItemMarkup(data);
    const renderCountriesList = buildCountriesList(data);

    if (data.length > 10) {
      PNotify.error({
        title: 'Oh No!',
        text: 'Too many matches found.Please enter a more specific query',
      });
    }
    if (data.length >= 2 && data.length <= 10) {
      insertListItem(renderCountriesList);
    }
    if (data.length === 1) {
      insertListItem(markup);
    }
    if (!data.length) {
      alert('Ничего не найдено.Корректно введите запрос');
    }
  });
}

function insertListItem(items) {
  refs.countryList.insertAdjacentHTML('beforeend', items);
}

function buildCountriesList(items) {
  return countriesListTemplate(items);
}

function buildListItemMarkup(items) {
  return countryListItemsTemplate(items);
}

function clearListItems() {
  refs.countryList.innerHTML = '';
}

// searchForm.addEventListener('input', e => e.preventDefault());
// searchInput.addEventListener('input', e => e.preventDefault());
