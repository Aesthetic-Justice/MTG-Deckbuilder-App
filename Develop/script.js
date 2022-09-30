//~~~~ Global variables ~~~~
let displayArt = document.getElementById('cardImage');
let displayName = document.getElementById('cardImage');
let displayType = document.getElementById('cardType');
let displayText = document.getElementById('cardText');
let displayPT = document.getElementById('cardPT');
let elSearchButton = document.getElementById('searchBtn');
let elSearchGrid = document.getElementById('searchGrid');
let arrCardNames = [];//An array of all cards, containing; name, uri, and an image_uri array;

//~~~~ Functions ~~~~~~~~~~~
function getCardList() {//fetches the card data stored in trimmedList.json and stores it in RAM
    fetch('Develop\\trimmedList.json')
        .then((response) => response.json())
        .then((json) => arrCardNames = json)
}

//Takes a API link to a specific card and displays it in the center of the page
function displayCard(uri) {
    fetch(uri)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
            //The elements below refer to the main display elements on the page
            displayArt.src = data.image_uris.normal;
            displayName.textContent = data.name;
            displayType.textContent = data.type_line;
            displayText.textContent = data.oracle_text;
            displayPT.textContent = data.power + '/' + data.toughness;
        })
}

//Takes a list of cardObjects from the included JSON(or API) and creates a grid
function createGrid(list) {
    elSearchButton.innerHTML="";//Wipes the search grid
    let i2 = 0;//Variable used for grid width
    let rowEl = document.createElement('div');//blank row element
    for (let i of list) {
        //Seperates items into rows
        if (i2 % 4==0){//i2%X, X=GridWith
            rowEl = document.createElement('div');
            rowEl.classList.add(`row`);//bootstrap row
            elSearchGrid.append(rowEl);
            //if(i2==Y){break;}//Y=MaxGridItems
        }
        let colEl = document.createElement('img');
        //Not every card image has a LowRez variant, so workaround
        if (i.image_uris.small) {
            colEl.src = i.image_uris.small;
        }
        else {
            colEl.src = i.image_uris.normal;
        }
        colEl.dataset.uri = i.uri;//add a link to this cardObject's API link to the element
        colEl.classList.add(`col-3`,`cardImage`);//bootstrap column
        rowEl.append(colEl);
        i2++;
    }
}

//~~~~ Run on Startup ~~~~
getCardList();

//~~~~ Event Listeners ~~~~
elSearchButton.addEventListener('click', function (event) {
    event.preventDefault();//Prevent reload page
    let searchTarget = document.getElementById('search').value;//Grab search input
    let results=[];//create empty array, to be filled with cardObjects
    
    //This bundle of code does a server-side AutoComplete
     fetch(`https://api.scryfall.com/cards/autocomplete?q=`+searchTarget)
    .then(function(response){
        return response.json();
    })
    .then(function (data){
        for(let cardName of data.data){//data.data is an array of card names that are similar to searchTarget
            if(arrCardNames.filter(c => c.name?.includes(cardName)).length!=0){
                results.push(arrCardNames.filter(c => c.name?.includes(cardName)));//this fills results with cardObjects that include cardNames
            }
        }
        displayCard(results);//then call createGrid to fill the search Grid with the resulting cardObjects
    })


    
})

elSearchGrid.addEventListener('click', function (event) {
    if (event.target.dataset.uri != null) {
        displayCard(event.target.dataset.uri);
    }
})