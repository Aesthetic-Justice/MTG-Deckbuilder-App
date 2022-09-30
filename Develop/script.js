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

function createGrid(list) {
    let i2 = 0;
    let rowEl = document.createElement('div');
    for (let i of list) {
        if (i2 % 3==0){
            rowEl = document.createElement('div');
            rowEl.classList.add(`row`);
            elSearchGrid.append(rowEl);
            if(i2==9){
                break;
            }
        }
        let colEl = document.createElement('img');
        if (i.image_uris.small) {
            colEl.src = i.image_uris.small;
        }
        else {
            colEl.src = i.image_uris.art_crop;
        }
        colEl.dataset.uri = i.uri;
        colEl.classList.add(`col-4`,`cardImage`);
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