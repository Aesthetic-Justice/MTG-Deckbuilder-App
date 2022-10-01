//~~~~ Global variables ~~~~
let displayArt = document.getElementById('cardImage');
let displayName = document.getElementById('cardImage');
let displayType = document.getElementById('cardType');
let displayText = document.getElementById('cardText');
let displayPT = document.getElementById('cardPT');
let elSearchButton = document.getElementById('searchBtn');
let elSearchGrid = document.getElementById('searchGrid');
let arrCardNames = [];

//~~~~ Functions ~~~~~~~~~~~
function pullCard(cardName) {
}

function getCardList() {
    fetch('Develop\\trimmedList.json')
        .then((response) => response.json())
        .then((json) => arrCardNames = json)
}

function displayCard(uri) {
    fetch(uri)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
            displayArt.src = data.image_uris.normal;
            displayName.textContent = data.name;
            displayType.textContent = data.type_line;
            displayText.textContent = data.oracle_text;
            displayPT.textContent = data.power + '/' + data.toughness;
        })
}

//Takes a list of cardObjects from the included JSON(or API) and creates a grid
function createGrid(list) {
    while(elSearchGrid.childNodes.length>0){
        elSearchGrid.removeChild(elSearchGrid.firstChild);
    }
    let i2 = 0;//Variable used for grid width
    let rowEl = document.createElement('div');//blank row element
    for (let i of list) {
        console.log(i);
        if (!(`image_uris` in i)){
            continue;
        }
        //Seperates items into rows
        if (i2 % 4==0){//i2%X, X=GridWith
            rowEl = document.createElement('div');
            rowEl.classList.add(`row`);//bootstrap row
            elSearchGrid.append(rowEl);
            if(i2==20){break;}//Y=MaxGridItems
        }
        let colEl = document.createElement('img');
        //Not every card image has a LowRez variant, so workaround
        colEl.src = i.image_uris.small;
        colEl.dataset.uri = i.uri;//add a link to this cardObject's API link to the element
        colEl.classList.add(`col-6`,`cardImage`);//bootstrap column
        rowEl.append(colEl);
        i2++;
    }
}

//~~~~ Run on Startup ~~~~
getCardList();

//~~~~ Event Listeners ~~~~
elSearchButton.addEventListener('click', function (event) {
    event.preventDefault();
    let searchTarget = document.getElementById('search').value;
    let results = arrCardNames.filter(c => c.name?.toLowerCase().includes(searchTarget));
    createGrid(results);
})

elSearchGrid.addEventListener('click', function (event) {
    if (event.target.dataset.uri != null) {
        displayCard(event.target.dataset.uri);
    }
})