//~~~~ Global variables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let displayArt = document.getElementById('cardImage'); //Refers to the display columns in the middle and left of page
let displayName = document.getElementById('cardImage');
let displayType = document.getElementById('cardType');
let displayText = document.getElementById('cardText');
let displayPT = document.getElementById('cardPT');

let elSearchButton = document.getElementById('searchBtn');//Search button in the top right
let elSearchGrid = document.getElementById('searchGrid');//Grid on the right side which displays cards
let elAddToDeck = document.getElementById('btnAdd2Deck');//AddToDeck button
let elRemoveFromDeck = document.getElementById(`btnRmv2Deck`);//Remove from Deck button
let elSaveToDeck = document.getElementById(`btnSave2Deck`);//Save Deck to LocalStorage button
let elDeckDisplay = document.getElementsByClassName('navbar-nav')[0];//NavBar on the left

let arrCardNames = [];//An array of all cards, containing; name, uri, and an image_uri array;
let arrDeck = [];//The user's decklist
let cardCount = 0;//Total number of cards in deck

//~~~~ General Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
            if(data.power!=undefined){
            displayPT.textContent = data.power + '/' + data.toughness;}
            else{
                displayPT.textContent = ``;
            }

            //Store the results of the API call within the AddToDeck button, for later use
            elAddToDeck.dataset.cardData = JSON.stringify(data);

            //if the AddToDeck button isn't visible, those buttons visible
            if (elAddToDeck.classList[2] == 'invisible') {
                elAddToDeck.classList.remove('invisible');
                elAddToDeck.classList.add('visible');
                elRemoveFromDeck.classList.remove('invisible');
                elRemoveFromDeck.classList.add('visible');
                elSaveToDeck.classList.remove('invisible');
                elSaveToDeck.classList.add('visible');
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


//~~~~ NavBar related functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Update tracker for the number of cards in deck
function updateCardCount() {
    cardCount = 0;//Refresh cardcount
    let x=1;//

    for (let i of arrDeck) {//for every card in the deck
        cardCount += i.count;//add the number of that card in the deck to the total deck size
        elDeckDisplay.children[x].children[1].textContent=i.count;//Update NavBar count
        x++;
    }

    console.log(`Deck size = ` + cardCount);
}
//takes in a card and adds it to the NavBar
function addCardToNavbar(cardObject){
    elCardContainer = document.createElement(`li`);//create a container
    elCardContainer.classList.add(`nav-link`);

    elCardArt = document.createElement('img');//create a blank image element
    elCardArt.setAttribute(`width`,`80rem`);//set appropriate attributes
    elCardArt.setAttribute(`height`,`100rem`);
    elCardArt.setAttribute(`viewBox`,`0,0,700,700`);
    elCardArt.src = cardObject.art.large;//set the image
    
    elCardCount = document.createElement(`span`);//create a visual indicator for the number of this card in deck
    elCardCount.classList.add(`link-text`,`text-bg-dark`);
    elCardCount.textContent = cardObject.count;//set the value
    
    elCardContainer.append(elCardArt,elCardCount);//Add elements to container
    elDeckDisplay.insertBefore(elCardContainer, elDeckDisplay.lastChild.previousSibling);//Add container to NavBar
}

//Takes in a card, and removes the object from the corresponding slot in the navbar
function removeCardFromNavbar(cardObject){
    elDeckDisplay.removeChild(elDeckDisplay.children[1 + (arrDeck.map(c => c.name).indexOf(cardObject.name))]);
}

//Load deck from LocalStorage and push to NavBar
function loadDeck() {
    if (localStorage.getItem(`Deck`) === null) { return; }//Guard Clause; if there is no saved deck, exit
    arrDeck = JSON.parse(localStorage.getItem(`Deck`));//Load deck from LocalStorage to RAM
    if (elDeckDisplay.children.length > 2) {//If there are cards currently in the NavBar...
        do {
            elDeckDisplay.removeChild(lastChild.previousSibling);//Remove them(Leaving only the icons,first and last children)
        } while (elDeckDisplay.children.length > 2);
    }
    for (let i of arrDeck) {//For every card in the deck
        addCardToNavbar(i);
    }
}

//~~~~ Run on Startup ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
getCardList();
loadDeck();

//~~~~ Event Listeners ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Clicking the search button populates the search grid with relevant entries
elSearchButton.addEventListener('click', function (event) {
    event.preventDefault();//Prevent reload page
    let searchTarget = document.getElementById('search').value.toLowerCase();//Grab search input
    let results = [];//create empty array, to be filled with cardObjects

    //This bundle of code does a server-side AutoComplete. 
    //Its commented out because I got previously timed out while testing it, but it works perfectly
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
        return;
    }) */

    results = arrCardNames.filter(c => c.name?.toLowerCase().includes(searchTarget));//compares the value of the search input against the arr of cardNames and returns matches
    createGrid(results);//creates a grid of images based on the search results
})

//Clicking a card in the search grid pushes it to the main display
elSearchGrid.addEventListener('click', function (event) {
    if (event.target.dataset.uri != null) {
        displayCard(event.target.dataset.uri);
    }
})

//Clicking AddToDeck adds the card to the deck object and updates the NavBar respectively
elAddToDeck.addEventListener('click', function (event) {
    event.preventDefault();
    if (displayArt.src != null) {
        cardData = JSON.parse(event.target.dataset.cardData);//Grab card data
        if (arrDeck.filter(c => c.name?.match(cardData.name))[0] == null) {
            console.log(`New Card`);
            arrDeck.push({ name: cardData.name, count: 1, art: cardData.image_uris });
            addCardToNavbar(arrDeck.at(-1));
        }
        else if (arrDeck.filter(c => c.name.match(cardData.name))[0].count < 4) {
            console.log(cardData.name + ` count increased by 1.`);
            arrDeck[arrDeck.map(c => c.name).indexOf(cardData.name)].count += 1;
        }
        else {
            console.log(`Else or Too Many Cards`);
        }
        console.log(`the deck is:`);
        console.log(arrDeck);
        updateCardCount();
    }
})

//Clicking RemoveFromDeck removes one entry of the card from the deck and updates the NavBar respectively
elRemoveFromDeck.addEventListener(`click`, function (event) {
    event.preventDefault();
    if (arrDeck.length == 0) {//Guard Clause for empty deck
        console.log(`ERROR: Empty Deck!`);
        return;
    }

    cardData = JSON.parse(elAddToDeck.dataset.cardData);//Grab card data

    if(arrDeck.filter(c => c.name.match(cardData.name)).length<1){
        console.log(`ERROR: Card not in Deck!`);
        return;
    }

    //If there are multiples of the selected card in the deck
    if (arrDeck.filter(c => c.name.match(cardData.name))[0].count > 1) {
        //reduce cardcount by 1
        console.log(cardData.name + ` count reduced by 1.`);
        arrDeck[arrDeck.map(c => c.name).indexOf(cardData.name)].count -= 1;
    }

    //If there is only 1 copy of the card, delete the selected card from the deck
    else if (arrDeck.filter(c => c.name.match(cardData.name))[0].count === 1) {
        console.log(cardData.name + ` removed from deck.`);
        removeCardFromNavbar(arrDeck.filter(c => c.name.match(cardData.name))[0]);
        arrDeck.splice(arrDeck.map(c => c.name).indexOf(cardData.name), 1);//Remove entry from deck
    }

    console.log(`the deck is:`);
    console.log(arrDeck);
    updateCardCount();
})

//Clicking SaveToDeck saves the curent deck to LocalStorage destructively
elSaveToDeck.addEventListener(`click`, function (event) {
    event.preventDefault();
    localStorage.setItem(`Deck`, JSON.stringify(arrDeck));
})