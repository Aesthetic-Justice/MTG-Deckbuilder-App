//~~~~ Global variables ~~~~
let elSearchGrid = document.getElementById('galleryGrid');//Grid display
let cardDatabase;//Object of the whole database
let pageNumber=0;//Current Page Number

//~~~~ Functions ~~~~~~~~~~~
function populateGallery() {//fetches the card data stored in trimmedList.json and stores it in RAM
    fetch('Develop\\trimmedList.json')
        .then((response) => response.json())
        .then((json) => arrCardNames = json)
        .then(function(data){//data refers to an object of all the card data
            cardDatabase = data;
            let i2 = 0;//Variable used for grid width
            let gridWidth = 4;//Set Grid Width
            let gridSize = 200;//Set number of cards per page
            let rowEl = document.createElement('div');//blank row element
            for (let i of cardDatabase) {
                if (!(`image_uris` in i)) {
                    continue;
                }
                //Seperates items into rows
                if (i2 % gridWidth == 0) {
                    rowEl = document.createElement('div');
                    rowEl.classList.add(`row`);//bootstrap row
                    elSearchGrid.append(rowEl);
                    if (i2 == gridSize) { break; }//Y=MaxGridItems
                }
                let colEl = document.createElement('img');
                //Not every card image has a LowRez variant, so workaround
                colEl.src = i.image_uris.large;
                colEl.dataset.uri = i.uri;//add a link to this cardObject's API link to the element
                colEl.classList.add(`col-3`, `cardImage`);//bootstrap column
                rowEl.append(colEl);
                i2++;
            }
        })
}

//WIP
function nextPage(){
    pageNumber++;
}

//~~~~ Run on Startup ~~~~
populateGallery();