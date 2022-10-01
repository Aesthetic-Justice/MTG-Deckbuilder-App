//~~~~ Global variables ~~~~
let displayArt = document.getElementById('cardImage'); //Refers to the display columns in the middle and left of page
let displayName = document.getElementById('cardImage');
let displayType = document.getElementById('cardType');
let displayText = document.getElementById('cardText');
let displayPT = document.getElementById('cardPT');

let elSearchButton = document.getElementById('searchBtn');//Search button in the top right
let elSearchGrid = document.getElementById('searchGrid');//Grid on the right side which displays cards
let elAddToDeck = document.getElementById('btnAdd2Deck');//AddToDeck button
let elRemoveFromDeck = document.getElementById(`btnRmv2Deck`);//Remove from Deck button
let elDeckDisplay = document.getElementsByClassName('navbar-nav')[0];//NavBar on the left

let arrCardNames = [];//An array of all cards, containing; name, uri, and an image_uri array;
let arrDeck = [];//The user's decklist

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

            //Store the results of the API call within the AddToDeck button, for later use
            elAddToDeck.dataset.cardData = JSON.stringify(data);

            console.log(elAddToDeck.classList);

            //if the AddToDeck button isn't visible, make it visible
            if (elAddToDeck.classList[2] == 'invisible') {
                elAddToDeck.classList.remove('invisible');
                elAddToDeck.classList.add('visible');
                elRemoveFromDeck.classList.remove('invisible');
                elRemoveFromDeck.classList.add('visible');
            }
        })
}

//Takes a list of cardObjects from the included JSON(or API) and creates a grid
function createGrid(list) {
    while (elSearchGrid.childNodes.length > 0) {
        elSearchGrid.removeChild(elSearchGrid.firstChild);
    }
    let i2 = 0;//Variable used for grid width
    let rowEl = document.createElement('div');//blank row element
    for (let i of list) {
        if (!(`image_uris` in i)) {
            continue;
        }
        //Seperates items into rows
        if (i2 % 4 == 0) {//i2%X, X=GridWith
            rowEl = document.createElement('div');
            rowEl.classList.add(`row`);//bootstrap row
            elSearchGrid.append(rowEl);
            if (i2 == 20) { break; }//Y=MaxGridItems
        }
        let colEl = document.createElement('img');
        //Not every card image has a LowRez variant, so workaround
        colEl.src = i.image_uris.small;
        colEl.dataset.uri = i.uri;//add a link to this cardObject's API link to the element
        colEl.classList.add(`col-3`, `cardImage`);//bootstrap column
        rowEl.append(colEl);
        i2++;
    }
}

//~~~~ Run on Startup ~~~~
getCardList();

//~~~~ Event Listeners ~~~~
//on Clicking the search button in the top right
elSearchButton.addEventListener('click', function (event) {
    event.preventDefault();//Prevent reload page
    let searchTarget = document.getElementById('search').value.toLowerCase();//Grab search input
    let results = [];//create empty array, to be filled with cardObjects

    //This bundle of code does a server-side AutoComplete
    /*fetch(`https://api.scryfall.com/cards/autocomplete?q=`+searchTarget)
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
    }) */

    results = arrCardNames.filter(c => c.name?.toLowerCase().includes(searchTarget));//compares the value of the search input against the arr of cardNames and returns matches
    createGrid(results);//creates a grid of images based on the search results
})

//on clicking any card art in the search grid
elSearchGrid.addEventListener('click', function (event) {
    if (event.target.dataset.uri != null) {
        displayCard(event.target.dataset.uri);
    }
})

//if AddToDeck is clicked. Adds card + data to the NavBar
elAddToDeck.addEventListener('click', function (event) {
    //if 
    if (displayArt.src != null) {
        cardData = JSON.parse(event.target.dataset.cardData);//Grab card data
        if (arrDeck.length == 0) {
            console.log(`Deck Empty`);
            arrDeck[0] = ({ name: cardData.name, count: 1, art: cardData.image_uris });
            elCard = document.createElement('img');
            elCard.src = cardData.image_uris.small;
            elDeckDisplay.append(elCard);
            return;
        }
        if (arrDeck.filter(c => c.name.match(cardData.name))[0] == null) {
            console.log(`New Card`);
            arrDeck.push({ name: cardData.name, count: 1, art: cardData.image_uris });
            elCard = document.createElement('img');
            elCard.src = cardData.image_uris.small;
            elDeckDisplay.append(elCard);
        }
        else if (arrDeck.filter(c => c.name.match(cardData.name))[0].count < 4) {
            arrDeck[arrDeck.map(c=>c.name).indexOf(cardData.name)].count+=1;
            console.log(`Adding Card.\nCardCount = `+arrDeck[arrDeck.map(c=>c.name).indexOf(cardData.name)].count);
        }
        else{
                console.log(`Else or Too Many Cards`);
        }
        console.log(`the deck is:`);
        console.log(arrDeck);
        }
    })