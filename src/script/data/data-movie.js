import axios from "axios";
import { API_KEY, BASE_URL, IMG_URL } from "./api";

const getPopularMovies = async () => {
    try {
        currentQuery = '';
        const maxPagesToFetch = 100;
        if (currentPage <= maxPagesToFetch) {
            const response = await axios.get(`${BASE_URL}/movie/popular?page=${currentPage}&api_key=${API_KEY}`);
            const { results, total_pages } = response.data;

            if (results) {
                renderMovie(results, currentPage, total_pages);
                updatePagination();
            } else {
                console.log('Data not found');
            }
        } else {
            console.log('Reached maximum pages to fetch.');
        }
    } catch (error) {
        console.error('Failed to fetch popular movies', error);
    }
};


const searchMovie = async (q) => {
    try {
        const response = await axios.get(`${BASE_URL}/search/movie?query=${q}&page=${currentPage}&api_key=${API_KEY}`);
        const { results, total_pages } = response.data;

        if (results && results.length > 0) {
            currentQuery = q;
            totalPages = total_pages;
            renderMovie(results, currentPage, totalPages);
            updatePagination();
        } else {
            console.log('Data not found.');
        }
    } catch (error) {
        console.error('Failed to fetch movies', error);
    }
};


const renderMovie = (results) => {
    const movieContainer = document.getElementById('MovieContainer');
    movieContainer.innerHTML = '';
    const placeholderImageUrl = 'https://placehold.co/397x595';
    const numRows = 5;
    const numCols = 4;

    const formatReleaseDate = (rawDate) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const [year, month, day] = rawDate.split('-');
        const dateObject = new Date(year, month - 1, day);
        return dateObject.toLocaleDateString('id-ID', options);
    };

    const getColor = (voteAverage) => {
        const roundedVote = Math.round(voteAverage * 10) / 10;
        return (roundedVote >= 8) ? 'high-rating' : (roundedVote >= 5) ? 'medium-rating' : 'low-rating';
    };
    
    for (let i = 0; i < numRows; i++) {
        const rowContainer = document.createElement('div');
        rowContainer.classList.add('row', 'mb-4', 'g-2');
        for (let j = 0; j < numCols; j++) {
            const index = i * numCols + j;
            if (index < results.length) {
                const movie = results[index];
                const movieCard = document.createElement('div');
                movieCard.classList.add('col-12', 'col-md-6', 'col-lg-3', 'mb-4');
                if (movie) {
                    const posterPath = movie.poster_path;
                    const posterUrl = posterPath ? `${IMG_URL}/${posterPath}` : placeholderImageUrl;
                    const voteAverage = (Math.round(movie.vote_average * 10) / 10).toFixed(1);
                    const colorRate = getColor(movie.vote_average);
                    movieCard.innerHTML = `
                        <div class="card h-100 position-relative" style="background-color: #EAD196;">
                            <img src="${posterUrl}" class="card-img-top" alt="${movie.title} Poster">
                            <div class="card-body fw-bold bg-opacity-25">
                                <h5 class="card-title text-center mb-5"><strong>${movie.title}</strong></h5>
                                <p class="card-text movie-date position-absolute bottom-0 start-0 m-3" style="color: #454545;"><i>${formatReleaseDate(movie.release_date)}</i></p>
                                <p class="card-text movie-rate ${colorRate} position-absolute bottom-0 end-0 m-3 pe-2">${voteAverage}</p>
                            </div>
                            <div class="card-overview">
                                <h5 class="card-title overview-title">Overview</h5>
                                <p class="card-text overview">${movie.overview}</p>
                            </div>
                        </div>
                    `;
                    rowContainer.appendChild(movieCard);
                } else {
                    movieCard.innerHTML = `
                        <div class="card h-100 position-relative">
                            <img src="${placeholderImageUrl}" class="card-img-top" alt="${movie.title}">
                            <div class="card-body fw-bold bg-opacity-25">
                                <h5 class="card-title text-center mb-5"><strong>${movie.title}</strong></h5>
                                <p class="card-text movie-date text-muted position-absolute bottom-0 start-0 m-3"><i>${formatReleaseDate(movie.release_date)}</i></p>
                                <p class="card-text movie-rate ${colorRate} position-absolute bottom-0 end-0 m-3 pe-2">${voteAverage}</p>
                            </div>
                            <div class="card-overview">
                                <h5 class="card-title overview-title">Overview</h5>
                                <p class="card-text overview">${movie.overview}</p>
                            </div>
                        </div>
                    `;
                };
                rowContainer.appendChild(movieCard);
            };
        };
        movieContainer.appendChild(rowContainer);
    };
};

let currentPage = 1;
let currentQuery = '';
let totalPages = 100;

const renderPagination = () => {
    const paginationElement = document.createElement('div');
    paginationElement.classList.add('pagination', 'd-flex', 'justify-content-center', 'align-items-center');
    paginationElement.innerHTML = `
        <div class="page mx-2" id="prev">Previous Page</div>
        <div class="current mx-2" id="current">${currentPage}</div>
        <div class="page mx-2" id="next">Next Page</div>
    `;
    const prevPageElement = paginationElement.querySelector('#prev');
    const nextPageElement = paginationElement.querySelector('#next');
    prevPageElement.addEventListener('click', () => {
        if (currentPage > 1) {
            handlePageClick('prev');
        };
    });
    nextPageElement.addEventListener('click', () => {
        if (currentPage < totalPages) {
            handlePageClick('next');
        };
    });
    document.body.appendChild(paginationElement);
    updatePagination();
};

const updateCurrentPage = (position) => {
    if (position === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (position === 'next' && currentPage < totalPages) {
        currentPage++;
    };
};

const handlePageClick = (position) => {
    updateCurrentPage(position);
    if (currentQuery) {
        searchMovie(currentQuery);
    } else {
        getPopularMovies();
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

const updatePagination = () => {
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    const current = document.getElementById('current');
    current.innerText = currentPage;
    if (currentPage <= 1) {
        prev.classList.add('disabled');
        next.classList.remove('disabled');
    } else if (currentPage >= totalPages) {
        prev.classList.remove('disabled');
        next.classList.add('disabled');
    } else {
        prev.classList.remove('disabled');
        next.classList.remove('disabled');
    }
};

renderPagination();

export { getPopularMovies, renderMovie, searchMovie };