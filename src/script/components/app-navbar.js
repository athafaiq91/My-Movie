import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { searchMovie } from "../data/data-movie";

class AppNavbar extends HTMLElement {
    connectedCallback() {
        this.render();
    };

    render() {
        this.innerHTML = `
            <nav class="navbar navbar-light" style="background-color: #EAD196; font-family: 'Roboto Slab', serif;">
                <div class="container-fluid">
                    <h1 class="navbar-brand">My Movie</h1>
                    <form id="liveAlertPlaceholder" class="d-flex">
                        <input id="searchInput" class="form-control me-2" type="search" placeholder="Masukkan Judulnya" aria-label="Search">
                        <button id="searchButton" class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </nav>   
        `;
        const searchButton = this.querySelector('#searchButton');
        searchButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const searchInput = this.querySelector('#searchInput');
            const keyword = searchInput.value;
            if (keyword.trim().length >= 3) {
                await searchMovie(keyword);
            } else {
                alert('masukkan minimal 3 kata');
            };
        });
    };
};

customElements.define('app-navbar', AppNavbar);