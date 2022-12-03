import { GetImages } from './getImages';
import renderMarkup from '../templates/imageCard.hbs';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.photo-card a', {
  captionsData: 'alt',
  captionDelay: 250,
});
const getImages = new GetImages();
const searchFormEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

// =============================search============================

const onFormSubmit = async e => {
  e.preventDefault();
  if (!searchFormEl.elements.searchQuery.value) {
    Notiflix.Notify.failure('Enter search query!');
    return;
  }
  getImages.query = searchFormEl.elements.searchQuery.value;
  getImages.page = 1;

  try {
    const response = await getImages.fetchImages();

    if (response.data.total === 0) {
      searchFormEl.elements.searchQuery.value = ' ';
      loadMoreButton.classList.add('is-hidden');
      galleryEl.innerHTML = '';
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    getImages.totalHits = response.data.totalHits;
    if (response.data.totalHits <= getImages.per_page) {
      loadMoreButton.classList.add('is-hidden');
    } else {
      loadMoreButton.classList.remove('is-hidden');
    }
    Notiflix.Notify.success(
      `Hooray! We found ${response.data.totalHits} images.`
    );
    galleryEl.innerHTML = renderMarkup(response.data.hits);
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure(console.log(error));
  }
};

// =============================load more============================

const onBtnClick = async () => {
  if (getImages.isEnd()) {
    loadMoreButton.classList.add('is-hidden');
    Notiflix.Notify.failure(
      "Were sorry, but you've reached the end of search results."
    );
    return;
  }
  getImages.page += 1;

  try {
    const response = await getImages.fetchImages();
    getImages.totalHits = response.data.totalHits;

    galleryEl.insertAdjacentHTML('beforeend', renderMarkup(response.data.hits));
    lightbox.refresh();
  } catch (error) {
    console.log(error);
  }

  //   =================scroll===============
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

searchFormEl.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', onBtnClick);
