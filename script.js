//variables -- defined globally = potential tight coupling/name collision issues

const API_KEY = "?api_key=f5050cde527a737b5e778272d9871dfb";
const baseUrl = "https://api.themoviedb.org/3/";
const searchButton = document.getElementById("searchButton");
const searchBar = document.getElementById("searchBar");
const url = "https://api.themoviedb.org/3/search/movie?api_key=f5050cde527a737b5e778272d9871dfb";
const searchForm = document.getElementById("searchNav");
const movieBlock = document.getElementById("searchOutput");
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
const fullReviewButton = document.getElementById("viewFullReview");
const reviewCloseButton = document.getElementById("closeReviews");
const finalOutput = document.getElementById("outputParent");

// Search for Movie Event Listener
if (searchButton != null) {
    searchButton.onclick = (event) => {
        event.preventDefault();
        if (searchBar.value === "") {
            alert("Please Enter a Movie Name");
        }
        else {
            getSearchedMovies(searchBar.value);
            const scrollTo = document.getElementById("searchOutput");
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

//Function that retrieves movies from API
function getSearchedMovies(movieName) {
    movieBlock.innerHTML = null;
    finalOutput.innerHTML = null;
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

// Gets the actors for chosen movie and displays on profile page.
function getActors(movieID) {
    const findActors = `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=f5050cde527a737b5e778272d9871dfb`;
    fetch(findActors)
        .then((res) => res.json())
        .then((actors) => {
            const foundActors = actors;
            const actorOutput = document.getElementById("actorsList");
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

// event listener for clicking on similar movies
if (document != null) {
    document.onclick = (event) => {
        const target = event.target;
        if (target.tagName.toLowerCase() === "img") {
            const movieID = target.dataset.movieId.replace(/\D/g, '');
            viewMovieProfile(movieID);
            console.log(movieID);
        }
    }
}

// fetches and stores movie data in local storage for the on-load function on profile page
function viewMovieProfile(movieID) {
    const findMovie = `https://api.themoviedb.org/3/movie/${movieID}?api_key=f5050cde527a737b5e778272d9871dfb`;
    fetch(findMovie)
        .then((res) => res.json())
        .then((movie) => {

            const foundMovie = {
                id: movieID,
                title: movie.title,
                poster: imageURL + movie.poster_path,
                tagline: movie.tagline,
                releaseDate: movie.release_date,
                rating: movie.vote_average,
                overview: movie.overview,
                backdrop: headerURL + movie.backdrop_path
            }

            // window.localStorage.setItem('movie', JSON.stringify(foundMovie));

            //need to work out how to send whole object through local storage to reduce code (being passed as reference not value)

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

// fetches and displays similar movies on movie profile page
//api request is currently returning an empty object when it was working previously.
function getSimilarMovies(movieID) {
    const similarMoviesOutput = document.getElementById("similarMoviesList");
    const similarURL = `https://api.themoviedb.org/3/movie/${movieID}/similar?api_key=f5050cde527a737b5e778272d9871dfb`;
    fetch(similarURL)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            const similarMovies = data;
            return similarMovies.results.map((movies) => {
                if (movies.poster_path) {
                    const similarMoviesLayout = `<li class="card movie-card">
                    <img class="card-img-top" src="${imageURL + movies.poster_path}" data-movie-id="${movies.id}">
                    <p id="film-name" class="bold">${movies.title}</p>
                    <button class="similar-movies-rating">${movies.vote_average}</button>
                </li>`

                    similarMoviesOutput.innerHTML += similarMoviesLayout;
                    return similarMoviesOutput;
                }
            });
        })
        .catch((err) => {
            console.log("error: ", err);
        })

}

//fetches reviews for movie clicked on
function getMovieReview(movieID) {
    const reviewURL = `https://api.themoviedb.org/3/movie/${movieID}/reviews?api_key=f5050cde527a737b5e778272d9871dfb`;
    fetch(reviewURL)
        .then((res) => res.json())
        .then((data) => {

            const reviewResults = data.results;
            if (reviewResults.length === 0) {
                document.getElementById("reviewOutput").style.textAlign = "center";
                document.getElementById("review-link").style.display ="none";
                reviewOutput.innerHTML = `
                <div class="col-12">
                    <p>Sorry there are currently no reviews avaliable for this movie</p>
                </div>`
            }
            else {
                const reviewResultsOutput = reviewResults.slice(0, 3);
                return reviewResultsOutput.map((reviews) => {
                    if (reviews.author_details.avatar_path != null) {

                        //required review variables
                        let reviewRating = reviews.author_details.rating;
                        const reviewUsername = reviews.author_details.username;
                        const reviewContent = reviews.content;
                        let reviewAvatar = reviews.author_details.avatar_path;

                        //validate avatar link
                        const linkValidate = reviewAvatar.substring(0, 35);
                        if(linkValidate == "/https://secure.gravatar.com/avatar"){
                            reviewAvatar = reviews.author_details.avatar_path.replace("/", "");
                        }
                        else{
                            reviewAvatar = "https://secure.gravatar.com/avatar" + reviewAvatar;
                        }

                        if (reviewRating == null) {
                            reviewRating = "n/a";
                        }
                        displayReviews(reviewAvatar, reviewRating, reviewUsername, reviewContent);
                    }
                })
            }
        })
        .catch((err) => {
            console.log("error: ", err);
        })
}

//displays reviews for chosen movie
function displayReviews(reviewAvatar, reviewRating, reviewUsername, reviewContent){
    const reviewOutput = document.getElementById("reviewOutput");
    reviewOutput.innerHTML += `
        <div id="user-input-header" class="col-4">
            <h6><img src="${reviewAvatar}"></img>${reviewUsername}
            </h6>
            <p id="reviewDate">Posted on: 11/2/2020
            <button id="review-rating">
            <i class="fa fa-star"></i>
            ${reviewRating}
            </button>
            </p>
        </div>
        <div id="user-input-content" class="col-7">
            <p id="content">${reviewContent}</p>
        </div>`
    
}

// opens full length reviews
if (fullReviewButton != null){
    fullReviewButton.onclick = () => {
        const reviewSection = document.getElementById("user-input-content");
        reviewSection.style.setProperty("max-height", "3000px");
        reviewSection.style.removeProperty("overflow");
        reviewSection.style.removeProperty("text-overflow");
        fullReviewButton.style.display = "none";
        reviewCloseButton.style.setProperty("display", "block");
    }
}

//closes full length reviews
if (reviewCloseButton != null){
    reviewCloseButton.onclick = () => {
        const reviewSection = document.getElementById("user-input-content");
        reviewSection.style.setProperty("max-height", "150px");
        reviewCloseButton.style.display = "none";
        fullReviewButton.style.setProperty("display", "block");

    }
}

//fetches and displays movies for each genre
function getGenre(genreID, genreTitle){
    const genreURL = baseUrl + "discover/movie" + API_KEY + "&with_genres=" + genreID;
    const listElement = document.createElement("ul");
    const imageRow = document.createElement("div");
    const rowTitle = document.createElement("h4");
    rowTitle.innerHTML = genreTitle;
    imageRow.setAttribute("id", "output");
    imageRow.classList.add("row", "card-wrapper", "scroll-menu");

    fetch(genreURL)
    .then((res) => res.json())
        .then((data) => {
            return data.results.map((movie) => {
                if (movie.poster_path) {
                    const homeLayout = `<li>
                                <img class="film-image" src=${imageURL + movie.poster_path} data-movie-id=${movie.id}/>
                                </li>`
                            listElement.innerHTML += homeLayout;
                }
                imageRow.appendChild(rowTitle)
                imageRow.appendChild(listElement);
                finalOutput.appendChild(imageRow);
                return finalOutput;
            });
        })
        .catch((err) => {
            console.log("error: ", err);
        })
}

// populates the home page
function loadHomePage(){
    const genreList = "genre/movie/list";
    const genreListURL = baseUrl + genreList + API_KEY;

    fetch(genreListURL)
    .then((res) => res.json())
        .then((data) => {
            return data.genres.map((genre) => {
                getGenre(genre.id, genre.name);
            });
        })
        .catch((err) => {
            console.log("error: ", err);
        })
}

// creating TV shows page

// function loadTvPage(){
//     const tvSearch = ["tv/airing_today", "tv/latest", "tv/popular", "tv/top_rated"];
//     tvSearch.map((search) => {
//         console.log(tvSearch);
//         getTvShows(search);
//     })
// }

// loadTvPage();

// function getTvShows(search){
//     const tvURL = baseUrl + search + API_KEY;
// }