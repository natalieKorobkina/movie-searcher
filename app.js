const title = document.getElementById('title-Id');
const submit = document.getElementById('btnSubmit');
const reset = document.getElementById('btnReset');
const content = document.getElementById('content-id');
const btnleft = document.getElementById('pgLeft');
const btnright = document.getElementById('pgRight');
const form = document.getElementById('form-id');
const resField = document.getElementById('calculations');
let sumResults = 0;
let pageNumber = 1;
let arrMovies = [];

function pageCulculator() {
  resField.innerHTML='';
  if (sumResults <= 10) {
    resField.insertAdjacentHTML('beforeend',`<div id='shres'>Showing results:<span> 1-${sumResults} of ${sumResults}</span></div>`);
    btnleft.classList.add('hidden');
    btnright.classList.add('hidden');
  } else if (pageNumber === 1) {
    btnleft.classList.add('hidden');
    resField.insertAdjacentHTML('beforeend',`<div id='shres'>Showing results:<span> 1-10 of ${sumResults}</span></div>`);
    btnright.classList.remove('hidden');
  } else if (sumResults/pageNumber <= 10) {
    resField.insertAdjacentHTML('beforeend',`<div id='shres'>Showing results:<span>${pageNumber*10-9}-${sumResults} of ${sumResults}</span></div>`);
      btnright.classList.add('hidden');
  } else {
    resField.insertAdjacentHTML('beforeend',`<div id='shres'>Showing results:<span>${pageNumber*10-9}-${pageNumber*10} of ${sumResults}</span></div>`);
    btnright.classList.remove('hidden');
  }
};

function reqPage() {
  fetch(`https://www.omdbapi.com/?apikey=ba5fc9b1&s=${title.value}&page=${pageNumber}`)
  .then(response => response.json())
  .then((json) => {
  arrMovies = json.Search; 
  arrMovies.forEach(el => {
    let picture = 'images/Movie.jpg';
    if (el.Poster != 'N/A') {
      picture = el.Poster;
    } 
    content.insertAdjacentHTML('beforeend',`<li><div><img src="${picture}" alt="${el.Title}" height="200" width="180"></div>
    <div class='title'>${el.Title}<div class='smaller'>${el.Type}</div><div class='add-content' data-movieid=${el.imdbID}>...</div></div>
    </li>`);
  });
  sumResults = parseInt(json.totalResults);
  pageCulculator();
  })
  .catch (() => {
    form.insertAdjacentHTML('afterend',`<div id='shres'>Sorry, we don't have results for you</div>`);
    resetContent();
  })

};

function resetContent() {
  content.innerHTML = '';
  //resField.innerHTML = '';
};

btnleft.addEventListener('click', (e) => {
  resetContent();
  pageNumber--;
  reqPage();
});

btnright.addEventListener('click', (e) => {
  resetContent();
  pageNumber++;
  reqPage();
  btnleft.classList.remove('hidden');
  if (sumResults/pageNumber <= 10) {
    btnright.classList.add('hidden');
  }
});

submit.addEventListener('click', (e) => {
  resetContent();
  e.preventDefault();
  reqPage();
});

reset.addEventListener('click', (e) => {
  resetContent();
});

content.addEventListener('click', (e) => {
    if((e.target.nodeName === "DIV") && (e.target.classList.contains('add-content'))) {
    let movieId = '';
    movieId = e.target.dataset.movieid;
    fetch(`https://www.omdbapi.com/?apikey=ba5fc9b1&i=${movieId}&plot=full`)
    .then(response => response.json())
    .then((json) => {
    e.target.innerHTML = "";
    e.target.insertAdjacentHTML('beforeEnd', `<div class='rel'>Released: ${json.Released}</div>
    <div>Actors: ${json.Actors} <div class='plot'>Plot: ${json.Plot}</div>Metascore: ${json.Metascore}</div>`);
    json.Ratings.forEach(el => {
      e.target.insertAdjacentHTML('beforeEnd', `<div>Rating ${el.Source}: ${el.Value}</div>`)
    });
    e.target.insertAdjacentHTML('beforeEnd', `<div class='received'>&#60;&#60;</div>`)
    });
    } 
  }); 

content.addEventListener('click', (e) => {
  if((e.target.nodeName === "DIV") && (e.target.classList.contains('received'))) {
    e.target.parentNode.innerHTML = "...";
  }
})