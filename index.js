
const searchInput = document.getElementById('search-input')
const displayMovies = document.getElementById('display-movies')
const displayWatchList = document.getElementById('display-watchlist')
const watchList = JSON.parse(localStorage.getItem("watchList")) || [];

if (displayMovies) {
    displayMovies.innerHTML = `
        <i class="fa-solid fa-film"></i>
        <h2 class="start">Start Exploring</h2>
    `
} else if (displayWatchList) {
        renderWatchList()
    }


document.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(watchList)

    displayMovies.innerHTML = ''
    console.log(searchInput.value)
    
    fetch(`http://www.omdbapi.com/?i=tt3896198&apikey=5ba9bc9b&s=${searchInput.value}`)
        .then(res => res.json())
        .then(data => { 
            console.log(data)
            const searchResults = data.Search

            if (data.Response ==="True") {
            displayMovies.classList.remove('not-found')
            displayMovies.classList.add('movies')
           let html = ''
            for(let movie of searchResults) {
                getMovieInfo(movie.imdbID)
                
            } 
        } else {
            displayMovies.classList.remove('movies')
            displayMovies.classList.add('not-found')
                displayMovies.innerHTML = `
                <p class="not-found-message">Unable to find what you’re looking for. Please try another search.</p>
                `

            }
            

        })

})

document.addEventListener('click', (e) => {
    if (e.target.closest('.add')) {
        const movieId = e.target.closest('.add').dataset.id
        addToWatchlist(movieId)
    }
})

if (displayWatchList) {
    
    document.addEventListener('click', (e) => {

    if (e.target.closest('.remove')) {
        console.log('clicked!')
        const movieId = e.target.closest('.remove').dataset.id
        const index = watchList.findIndex(movie => movie.imdbID === movieId)
        if (index !== -1) {
            watchList.splice(index, 1)
            localStorage.setItem('watchList', JSON.stringify(watchList))
            console.log(`Removed movie with ID: ${movieId}`)
        }
    }
    renderWatchList()
})

}




function getMovieInfo(id) {
    fetch(`http://www.omdbapi.com/?apikey=5ba9bc9b&i=${id}`)
    .then(res => res.json())
    .then(data => { 
        console.log(data)
        let html = ''
        html +=
            `
                <div class="main-movie-con">
                    <div class="img-movie-container">
                        <img src="${data.Poster}"/>
                    </div>
                    <div class="movie-info-con">
                        <div class="movie-title-data">
                            <h1>${data.Title}</h1>
                            <span><i class="fa-solid fa-star"></i> ${data.imdbRating}</span>
                            
                        </div>
                        <div class="meta">
                        <span>${data.Year}</span>
                        <span>${data.Runtime}</span>
                        <span>${data.Genre}</span>
                        
                        <span id="add-btn" class="add" data-id="${data.imdbID}"><i class="fa-solid fa-circle-plus"></i> Watchlist</span>
                        </div>
                        <p>${data.Plot}</p>
                    </div>
                    
                </div>
                
                `

 
  displayMovies.innerHTML += html 
                               


    })


}



function addToWatchlist(id) {
    fetch(`http://www.omdbapi.com/?apikey=5ba9bc9b&i=${id}`)
        .then(res => res.json())
        .then(data => {
            // Prevent duplicates
            const alreadyInList = watchList.some(movie => movie.imdbID === data.imdbID)
            if (!alreadyInList) {
                watchList.push(data)
                localStorage.setItem("watchList", JSON.stringify(watchList))
                console.log('Added to watchlist:', data.Title)
            } else {
                console.log('Already in watchlist:', data.Title)
            }
           
        })
  
    

}


function renderWatchList() {
    const myWatchList = JSON.parse(localStorage.getItem("watchList")) || []
    let html = ''
    for (let movies of myWatchList) {
        html += `
                <div class="main-movie-con">
                    <div class="img-movie-container">
                        <img src="${movies.Poster}"/>
                    </div>
                    <div class="movie-info-con">
                        <div class="movie-title-data">
                            <h1>${movies.Title}</h1>
                            <span><i class="fa-solid fa-star"></i> ${movies.imdbRating}</span>
                            
                        </div>
                        <div class="meta">
                        <span>${movies.Year}</span>

                        <span>${movies.Runtime}</span>
                        <span>${movies.Genre}</span>

                        <span id="remove-btn" class="remove" data-id="${movies.imdbID}"><i class="fa-solid fa-circle-minus"></i> Remove</span>
                        </div>
                        <p>${movies.Plot}</p>
                    </div>
                    
                </div>
                
                `

        }

            displayWatchList.innerHTML = html


}




