
const API_KEY = "?api_key=f5050cde527a737b5e778272d9871dfb";
const baseUrl = "https://api.themoviedb.org/3/";
const searchButton = document.getElementById("searchButton");
const searchBar = document.getElementById("searchBar");
const url = "https://api.themoviedb.org/3/search/movie?api_key=f5050cde527a737b5e778272d9871dfb";
const searchForm = document.getElementById("searchNav");
const movieBlock = document.getElementById("output");
const imageURL = "https://image.tmdb.org/t/p/w500";

// add document.ready function for populating page when loaded


// Search for Movie Event Listener
searchButton.onclick = (event) => {
    event.preventDefault();
    getSearchedMovies(searchBar.value);
}

//Function that retrieves movies from API
function getSearchedMovies(movieName) {
    movieBlock.innerHTML = null;
    const newUrl = url + "&query=" + movieName;
    fetch(newUrl)
        .then((res) => res.json())
        .then(getMovieImages)
        .catch((err) => {
            console.log("error");
        })
        searchForm.reset();
        }

//Retrieves poster path from API request to display images
function getMovieImages(data){
    const movies = data.results;
    const movieDisplay = createMovieOutputSection(movies);
    movieBlock.appendChild(movieDisplay);
}

//Function that displays the movie from the results array
function displayMovies(results) {
    return results.map((movie) => {
        if (movie.poster_path) {
            return `<img src=${imageURL + movie.poster_path} movie-id=${movie.id}/>`
        }
    })
}

//Creates an element to dump results from search
function createMovieOutputSection(movies) {
    const newMovieElement = document.createElement("div");
    newMovieElement.setAttribute("class", "movieDisplay");
    const outputTemplate = `
        <section>
            ${displayMovies(movies)}
        </section>`;
    newMovieElement.innerHTML = outputTemplate;
    return newMovieElement;
}
