import "bootstrap/dist/css/bootstrap.min.css";

class PopularMovies extends HTMLElement {
    connectedCallback() {
        this.render();
    };
    
    render() {
        this.innerHTML = `
            <div class="p-1" id="AppHeader" style="font-family: 'Roboto Slab', serif;">
                <h2 class="py-3 px-1"><a href="" style="color: black;">Most Popular</a></h2>
                <div class="main" id="MovieContainer"></div>
            </div>
        `;
    };
};

customElements.define('popular-movies', PopularMovies);