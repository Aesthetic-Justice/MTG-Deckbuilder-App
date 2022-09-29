//~~~~ Global variables ~~~~
let requestURL = "";
let displayArt = document.getElementById('cardImage');
let displayName = document.getElementById('cardImage');
let displayType = document.getElementById('cardType');
let displayText = document.getElementById('cardText');
let displayPT = document.getElementById('cardPT');
let arrCardNames = [];

//~~~~ Functions ~~~~~~~~~~~
function pullCard(cardName) {
}

fetch('Develop\\trimmedList.json')
    .then((response) => response.json())
    .then((json) => arrCardNames = json)
    .then(function () {
        fetch(arrCardNames[0].uri)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                displayArt.src = data.image_uris.normal;
                displayName.textContent = data.name;
                displayType.textContent = data.type_line;
                displayText.textContent = data.oracle_text;
                displayPT.textContent = data.power + '/' + data.toughness;
            })
    })
    /*.then(function () {
  let trimmedList = document.createElement('a');
    trimmedList.href = window.URL.createObjectURL(new Blob([JSON.stringify(arrCardNamesNew)], { type: "text/plain" }));
    trimmedList.download = 'trimmedList.json';
    trimmedList.click();
}) */



//~~~~ Event Listeners ~~~~
