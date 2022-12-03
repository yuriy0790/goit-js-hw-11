'use strict';
import axios from 'axios';

export class GetImages {
  #URL = 'https://pixabay.com/api/';
  #API_KEY = '31539344-c129af0d709d10cb9757ecef9';

  constructor() {
    this.page = 1;
    this.per_page = 40;
    this.totalHits = null;
    this.query = null;
  }

  fetchImages() {
    const searchParams = new URLSearchParams({
      key: this.#API_KEY,
      q: this.query,
      page: this.page,
      per_page: this.per_page,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
    });
    return axios.get(`${this.#URL}?${searchParams}`);
  }

  isEnd() {
    return this.page * this.per_page > this.totalHits;
  }
}
