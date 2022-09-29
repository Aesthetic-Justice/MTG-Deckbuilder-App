//~~~~ Global variables ~~~~
let displayArt = document.getElementById('cardImage');
let displayName = document.getElementById('cardImage');
let displayType = document.getElementById('cardType');
let displayText = document.getElementById('cardText');
let displayPT = document.getElementById('cardPT');
let elSearchButton = document.getElementById('searchBtn');
let elSearchGrid = $('#searchGrid');
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
            console.log(`hello world`);
            displayArt.src = data.image_uris.normal;
            displayName.textContent = data.name;
            displayType.textContent = data.type_line;
            displayText.textContent = data.oracle_text;
            displayPT.textContent = data.power + '/' + data.toughness;
        })
}

function createGrid(list) {
    let i2 = 2;
    let rowEl = $('<div>');
    for (let i of list) {
        if (i2 !== 2) { i2++ }
        else {
            i2 = 0;
            rowEl = $('<div>');
            rowEl.attr(`class`,`row`);
            elSearchGrid.append(rowEl);
        }
        let colEl = $('<img>');
        if (i.image_uris.small) {
            colEl.attr(`src`,i.image_uris.small);
        }
        else {
            colEl.attr(`src`,i.image_uris.crop);
        }
        colEl.data("uri",i.uri);
        colEl.attr(`class`,`col-4`);
        rowEl.append(colEl);
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

elSearchGrid.on('click', '.col-4', function (event) {
    if (event.target.dataset.uri != null) {
        displayCard(event.target.dataset.uri);
    }
})