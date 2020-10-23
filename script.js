
const API_KEY = "?api_key=f5050cde527a737b5e778272d9871dfb";
const baseUrl = "https://api.themoviedb.org/3/";
const searchButton = document.getElementById("searchButton");
const searchBar = document.getElementById("searchBar");
const url = "https://api.themoviedb.org/3/search/movie?api_key=f5050cde527a737b5e778272d9871dfb";
const searchForm = document.getElementById("searchNav");
const movieBlock = document.getElementById("output");
const imageURL = "https://image.tmdb.org/t/p/w500";
const topRatedMoviesOutput = document.getElementById("topRatedOutput");
const topRatedURL = "https://api.themoviedb.org/3/movie/top_rated?api_key=f5050cde527a737b5e778272d9871dfb";
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");
let nextBtnID = 1;
// add document.ready function for populating page when loaded


// Search for Movie Event Listener
if (searchButton != null) {
    searchButton.onclick = (event) => {
        event.preventDefault();
        if (searchBar.value === "") {
            alert("Please Enter a Movie Name");
        }
        else {
            getSearchedMovies(searchBar.value);
        }
    }
}

//Event listener for next page on rating.html
if (nextBtn != null) {
    nextBtn.onclick = (event) => {
        event.preventDefault();
        nextPageResults();
    }
}

//event listener for previous page on rating.html
if (prevBtn != null) {
    prevBtn.onclick = (event) => {
        event.preventDefault();
        previousPageResults();
    }
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
function getMovieImages(data) {
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
    const outputTemplate = `
        <section>
            ${displayMovies(movies)}
        </section>`;
    newMovieElement.innerHTML = outputTemplate;
    return newMovieElement;
}

// Top Rated Movies Page -----------

//retrieves movie posters for top rated page when api request is successful
function getTopRatedMovieImages(data) {
    const topRatedMovies = data.results;
    const topRatedMovieDisplay = createMovieOutputSection(topRatedMovies);
    topRatedMoviesOutput.appendChild(topRatedMovieDisplay);

}

//Sends API request to retrieve top rated movies
function retrieveTopRatedMovies() {
    fetch(topRatedURL)
        .then((res) => res.json())
        .then(getTopRatedMovieImages)
        .catch((err) => {
            console.log("error");
        })
}

//updates the top rated movies output when next page is selected
function nextPageResults() {
    nextBtnID++;
    const newTopRatedURL = topRatedURL + "&page=" + nextBtnID;
    topRatedMoviesOutput.innerHTML = "";
    fetch(newTopRatedURL)
        .then((res) => res.json())
        .then(getTopRatedMovieImages)
        .catch((err) => {
            console.log("error");
        })
}

//updates the output when previous page is selected
function previousPageResults(){
    if (nextBtnID === 1){
        alert("There are no previous pages")
    }
    else{
    nextBtnID--;
    const newTopRatedURL = topRatedURL + "&page=" + nextBtnID;
    topRatedMoviesOutput.innerHTML = "";
    fetch(newTopRatedURL)
        .then((res) => res.json())
        .then(getTopRatedMovieImages)
        .catch((err) => {
            console.log("error");
        })
    }
}
