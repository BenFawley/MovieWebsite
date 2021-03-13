//variables -- defined globally = potential tight coupling/name collision issues

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
const trailerModal = document.getElementById("modal");
const closeModalButton = document.getElementById("close");
const modalContent = document.getElementById("modal-content");
const upcomingMovieOutput = document.getElementById("upcomingMovieOutput");
const upcomingMovieURL = "https://api.themoviedb.org/3/movie/upcoming?api_key=f5050cde527a737b5e778272d9871dfb";
const popularMoviesURL = "https://api.themoviedb.org/3/movie/popular?api_key=f5050cde527a737b5e778272d9871dfb";
const selectedMovieOutput = document.getElementById("selectedMovieContent");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("previous");
const headerURL = "https://image.tmdb.org/t/p/w1280";
const trailerButton = document.getElementById("trailerButton");
let nextBtnID = 1;


// Search for Movie Event Listener
if (searchButton != null) {
    searchButton.onclick = (event) => {
        event.preventDefault();
        if (searchBar.value === "") {
            alert("Please Enter a Movie Name");
        }
        else {
            getSearchedMovies(searchBar.value);
            const scrollTo = document.getElementById("output");
            scrollTo.scrollIntoView({
                behavior: "smooth"
            });
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

// //event listener for previous page on rating.html
if (prevBtn != null) {
    prevBtn.onclick = (event) => {
        event.preventDefault();
        previousPageResults();
    }
}

if (trailerButton != null) {
    trailerButton.onclick = () => {
        const movieID = target.dataset.movieId;
        retrieveMovieTrailer(movieID);
    }
}

if (trailerButton != null) {
    trailerButton.onclick = (event) => {
        const selected = document.getElementById("poster");
        const loadMovieID = selected.dataset.movieId;
        retrieveMovieTrailer(loadMovieID);

    }
}


//modal close button functionality
if (closeModalButton != null) {
    closeModalButton.onclick = function () {
        trailerModal.style.display = "none";
        document.getElementById("overlay").classList.remove("active");
        modalContent.innerHTML = null;
    }
}

//populates home page with popular movies when loaded
function populateHomePage() {
    fetch(popularMoviesURL)
        .then((res) => res.json())
        .then(getMovieImages)
        .catch((err) => {
            console.log("error: ", err);
        })
}

//Function that retrieves movies from API
function getSearchedMovies(movieName) {
    movieBlock.innerHTML = null;
    const newUrl = url + "&query=" + movieName;
    fetch(newUrl)
        .then((res) => res.json())
        .then(getMovieImages)
        .catch((err) => {
            console.log("error: ", err);
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
            return `<div class = "image">
                        <img class="film-image" src=${imageURL + movie.poster_path} data-movie-id=${movie.id}/>
                    </div>`
        }
    })
}

//Creates an element to dump results from search
function createMovieOutputSection(movies) {
    const newMovieElement = document.createElement("div");
    const outputTemplate = `
        <section id = "movieOutput" class = "row">
            ${displayMovies(movies)}
        </section>`;
    newMovieElement.innerHTML = outputTemplate;
    return newMovieElement;
}

// --------- Top Rated Movies Page -----------

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
            console.log("error: ", err);
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
            console.log("error: ", err);
        })
}

//updates the output when previous page is selected
function previousPageResults() {
    if (nextBtnID === 1) {
        alert("There are no previous pages")
    }
    else {
        nextBtnID--;
        const newTopRatedURL = topRatedURL + "&page=" + nextBtnID;
        topRatedMoviesOutput.innerHTML = "";
        fetch(newTopRatedURL)
            .then((res) => res.json())
            .then(getTopRatedMovieImages)
            .catch((err) => {
                console.log("error: ", err);
            })
    }
}

//retrieves the movie trailer related to the selected video
function retrieveMovieTrailer(movieID) {
    const trailerURL = baseUrl + "movie/" + movieID + "/videos" + API_KEY;
    fetch(trailerURL)
        .then((res) => res.json())
        .then((data) => {
            if (data.results.length == 0) {
                alert("This trailer is currently unavailable, Sorry for any inconvenience caused")
            }
            else {
                for (i = 0; i < data.results.length; i++) {
                    if (data.results[i].type.toLowerCase() === "trailer") {
                        const trailerKey = data.results[i].key;
                        trailerModal.style.display = "block";
                        document.getElementById("overlay").classList.add("active");
                        modalContent.innerHTML = null;
                        const iframeContainer = document.createElement("div");
                        iframeContainer.classList.add("iframeContainer");
                        const newIframe = createIframe(trailerKey);
                        iframeContainer.appendChild(newIframe);
                        modalContent.appendChild(iframeContainer);
                    }
                }
            }
        })
        .catch((err) => {
            console.log("error: ", err);
        })
}

//creates an iframe to store the selected movie trailer
function createIframe(trailerKey) {
    const iframe = document.createElement("iframe");
    iframe.classList.add("responsive-iframe");
    iframe.src = `https://www.youtube.com/embed/${trailerKey}`
    iframe.allowFullscreen = true;

    return iframe;
}

//---------- Upcoming.html page -----------

//Sends API request to retrieve upcoming movies
function getUpcomingMovies() {
    fetch(upcomingMovieURL)
        .then((res) => res.json())
        .then((data) => {
            const upcomingMovies = data.results;
            const upcomingMovieDisplay = createMovieOutputSection(upcomingMovies);
            upcomingMovieOutput.appendChild(upcomingMovieDisplay);
        })
        .catch((err) => {
            console.log("error: ", err);
        })
}

// function loadMovieDetails(movieID){
//     // const newMovieID = movieID.replace(/\D/g,'');
//     const findMovieURL = `https://api.themoviedb.org/3/movie/${movieID}?api_key=f5050cde527a737b5e778272d9871dfb`;
//     fetch(findMovieURL)
//         .then((res) => res.json())
//         .then((movie) => {
//             const movieProfileResults = movie;
//             // const results = data.results;
//             // const newDisplay = createMovieInfoPage(results);
//             // selectedMovieOutput.appendChild(newDisplay);
//             console.log(movie);
//             console.log(movieProfileResults);
//             console.log(movieProfileResults.overview);
//             console.log(movieProfileResults.vote_average);
//             // console.log(movie.backdrop_path);
//         })
//         .catch((err) => {
//             console.log("error: ", err);
//     })
// }

// loadMovieDetails(587807);


function getActors(movieID) {
    const findActors = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=f5050cde527a737b5e778272d9871dfb`;
    fetch(findActors)
        .then((res) => res.json())
        .then((actors) => {
            const foundActors = actors;
            const actorOutput = document.getElementById("actorsList");
            console.log(foundActors.cast);
            return foundActors.cast.map((cast) => {
                if (cast.known_for_department == "Acting") {
                    const actorLayout = `<li class="card actor-card">
                    <img class="card-img-top" src=${imageURL + cast.profile_path} data-actor-id=${cast.id}>
                    <p class="bold">${cast.name}</p>
                    <p class="actor-name">${cast.character}</p>
                    </li>`
                    
                    actorOutput.innerHTML += actorLayout;
                    return actorOutput;
                }
            });
        })
        .catch((err) => {
            console.log("error: ", err);
        })
}

if (document != null) {
    document.onclick = (event) => {
        const target = event.target;
        if (target.tagName.toLowerCase() === "img") {
            const movieID = target.dataset.movieId.replace(/\D/g, '');
            viewMovieProfile(movieID);
        }
    }
}

function viewMovieProfile(movieID) {
    const findMovie = `https://api.themoviedb.org/3/movie/${movieID}?api_key=f5050cde527a737b5e778272d9871dfb`;
    fetch(findMovie)
        .then((res) => res.json())
        .then((movie) => {

            const foundMovie = {
                id: movieID,
                title: movie.original_title,
                poster: imageURL + movie.poster_path,
                tagline: movie.tagline,
                releaseDate: movie.release_date,
                rating: movie.vote_average,
                overview: movie.overview,
                backdrop: headerURL + movie.backdrop_path
            }

            // window.localStorage.setItem('movie', JSON.stringify(foundMovie));

            //need to work out how to send whole object through local storage to reduce code

            localStorage.setItem('title', foundMovie.title);
            localStorage.setItem('posterURL', foundMovie.poster);
            localStorage.setItem('overview', foundMovie.overview);
            localStorage.setItem('date', foundMovie.releaseDate);
            localStorage.setItem('tagline', foundMovie.tagline);
            localStorage.setItem('rating', foundMovie.rating);
            localStorage.setItem('backdrop', foundMovie.backdrop);
            localStorage.setItem('id', foundMovie.id);

            location.assign("movieprofile.html");


        })
        .catch((err) => {
            console.log("error: ", err);
        })
}
