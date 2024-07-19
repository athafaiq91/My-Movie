import { getPopularMovies,} from "../data/data-movie.js";
import '../components/app-navbar.js';
import '../components/popular-movies.js';

const main = async () => {
    document.addEventListener('DOMContentLoaded', async () => {
        await getPopularMovies();
    });
};

export default main;