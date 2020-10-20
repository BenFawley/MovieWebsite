
const API_KEY = "https://api.themoviedb.org/3/movie/550?api_key=f5050cde527a737b5e778272d9871dfb";
const baseUrl = "https://api.themoviedb.org/3/";

document.getElementById("click").onclick = fetch ("https://api.themoviedb.org/3/movie/550?api_key=f5050cde527a737b5e778272d9871dfb")
.then((res) => res.json())
.then((data) => {
    document.getElementById("output").innerHTML = data;
    console.log(data);
})
//when logged in = rate movies, add to watch later

