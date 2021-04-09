/* globals require */
console.log("Hello, Airtable");

// load the airtable library, call it "Airtable"
var Airtable = require("airtable");

// use the airtable library to get a variable that represents one of our bases
// We needed to put in the right apiKey and
// base ID here!
var base = new Airtable({ apiKey: "keyg7YwjXlqgZ9xMq" }).base(
  "appLJD6pXCFJCcXTI"
);

// Get the "songs" table from the base, specify the view to be "View 2" (which is FILTERED for indie songs and SORTED by rating) and specify the callback functions that will receive each page of data
base("songs").select({
  // add your view in here
  view: "Grid view"
}).eachPage(gotPageOfData, gotAllData);

// an empty array to hold our people data
let songs = [];

// callback function that receives each page of data (considered here as records) and adds them to our list of songs
function gotPageOfData(records, fetchNextPage) {
  console.log("gotPageOfData()");
  console.log("There are "+records.length+" items in records");
  // This takes the list of records and add them to the songs array
  songs.push(...records);
  // request more pages
  fetchNextPage();
}

// call back function that is called when ALL pages are loaded
function gotAllData(err) {
  console.log("gotAllData()");

  // report an error, you'd want to do something better than this in production
  if (err) {
    console.log("error loading data");
    console.error(err);
    return;
  }

  // call function to show the data
  showData();
}

// show the data on the page
function showData() {
  console.log("showData()");

  // find the shelf element
  const songsContainer = document.querySelector("#container");

  // loop through all the people listed in the Airtable data. Inside is the code we are applying for EACH person in the list of people.
  songs.forEach((song) => {

    // Print out what a single songs's data feidls looks like
    console.log("SHOWING THE SONG")
    console.log(song.fields);


    /** CREATE CONTAINER */
    const songContainer = document.createElement("div");
    songContainer.classList.add("songContainer");

    /*******************
    ADD THE TITLE
    *******************/

    const titleElement = document.createElement("h2");
    titleElement.innerText = song.fields.title;
    songContainer.appendChild(titleElement);
    
    /*******************
    ADD ARTIST TITLE
    *******************/

    const artistElement = document.createElement("p");
    artistElement.innerText = song.fields.artist;
    songContainer.appendChild(artistElement);

    /*******************
    ADD SONG RATING
    *******************/

    let ratingElement = document.createElement("p");
    ratingElement.innerText = "Rating: "+ song.fields.rating;
    
    songContainer.appendChild(ratingElement);


    /*******************
    ADD GENRES
    *******************/

    let genresList = song.fields.genres;

    genresList.forEach(function(genre){
      const genreElement = document.createElement("span");
      genreElement.classList.add("genreTag");
      genreElement.innerText = genre;
      songContainer.appendChild(genreElement);
      // TODO: Add this genre name as a class to the songContainer

      songContainer.classList.add(genre);

    });


    /***********
     TODO: CREATE FILTER-BY-GENRE FUNCTIONALITY
     **********/

     let classicalButton = document.getElementById('showClassicalButton');
    classicalButton.addEventListener("click", function(){
      if (songContainer.classList.contains('classical')){
        songContainer.style.display = "block";
      } else {
        songContainer.style.display = "none";
      }
    });
     
    let indieButton = document.getElementById('showIndieButton');
    indieButton.addEventListener("click", function(){
      if (songContainer.classList.contains('indie')){
        songContainer.style.display = "block";
      } else {
        songContainer.style.display = "none";
      }
    });

    let dreampopButton = document.getElementById('showDreampopButton');
    dreampopButton.addEventListener("click", function(){
      if (songContainer.classList.contains('dreampop')){
        songContainer.style.display = "block";
      } else {
        songContainer.style.display = "none";
      }
    });
    let popButton = document.getElementById('showPopButton');
    popButton.addEventListener("click", function(){
      if (songContainer.classList.contains('pop')){
        songContainer.style.display = "block";
      } else {
        songContainer.style.display = "none";
      }
    });

    let resetButtton = document.getElementById('resetButton');
    resetButtton.addEventListener("click", function(){
        songContainer.style.display = "block";
    });

    songsContainer.appendChild(songContainer);

  });
}

let sortHighLow = document.getElementById('sortHighLow');
sortHighLow.addEventListener("click", function(){
    // Clear the container div (remove all the previous elements)
    const songsContainer = document.querySelector("#container");
    songsContainer.innerHTML = "";
    // Sort the songs array according to rating from high to low
    sortRatingHighLow();
    showData();
});


function sortRatingHighLow(){
  songs.sort(function(a, b) {
    // For any two songs in the songs array, compare them by their rating number
    return b.fields.rating - a.fields.rating;
  });
}


let sortLowHigh = document.getElementById('sortLowHigh');
sortLowHigh.addEventListener("click", function(){
    // Clear the container div (remove all the previous elements)
    const songsContainer = document.querySelector("#container");
    songsContainer.innerHTML = "";
    // Sort the songs array according to rating from low to high
    sortRatingLowHigh();
    showData();
});


function sortRatingLowHigh(){
  songs.sort(function(a, b) {
    // For any two songs in the songs array, compare them by their rating number
    // (NOTE THE ORDER HAS SWITCHED)
    return a.fields.rating - b.fields.rating;
  });
}

