//Game
var newGame = game()
const startButton = document.getElementById('startButton')
const p = document.getElementById('data')
var loseAudio = new Audio('./audio/loseSound.mp4');
var winAudio = new Audio('./audio/winSound.mp4');

//Listeners
var rightListener = async function (event) {
    await flashColor(event.currentTarget, 75)
    rightColorClicked()
};

var wrongListener = async function (event) {
    await flashColor(event.currentTarget, 75)
    wrongColorClicked()
};

//Vars
let order = []
let score = 0
let sequenceNumber = 0
let level = 0

//StartGame functions
function startGame() {
    newGame = game()
    sequenceNumber = 3
    score = 0
    level = 1
    p.textContent = ""
    newGame.next()
}

function continueGame() {
    newGame = game()
    p.textContent = "Muito bem!"
    newGame.next()
}


//Game Function
async function* game() {
    const colors = returnArrayColors()
    order = []

    //Raffling...
    for(i = 0; i < sequenceNumber; i++){
        order.push(Math.floor(Math.random() * 4))
    }
    startButton.disabled = true
    await delay(2000)
    
    //Shining...
    for(i in order){
        const myColor = colors[order[i]]
        await flashColor(myColor, 500);
        await delay(100)
    }
    cleanColors(colors)
    startButton.disabled = false
    startButton.textContent = "Reset"

    //Getting results...
    for(i in order){
        const myColor = colors[order[i]]
        addListeners(myColor, colors)
        yield
        removeListeners(myColor, colors)
    }
    
    sequenceNumber = sequenceNumber + 2
    level++
    winAudio.play()
    return continueGame()

}


//Assist functions
function delay(time) {
    return new Promise((resolve) => {setTimeout(resolve, time)});
}

function shineColor(color){
    let id = color.id
    color.className = id + " selected"
}

function turnOffColor(color){
    let id = color.id
    color.className = id
}

function cleanColors(colors) {
    for(i in colors) {
        let id = colors[i].id
        colors[i].className = id
    }
}

async function flashColor(color, time) {
    shineColor(color)
    await delay(time)
    turnOffColor(color)
}

function addListeners(rightColor, colors) {
    for(i in colors) {
        if (colors[i] === rightColor) {
            colors[i].addEventListener(('click'), rightListener)
        } else{
            colors[i].addEventListener(('click'), wrongListener)
        }
    }
}

function removeListeners(rightColor, colors) {
    for(i in colors) {
        if (colors[i] === rightColor) {
            colors[i].removeEventListener(('click'), rightListener)
        } else{
            colors[i].removeEventListener(('click'), wrongListener)
        }
    }
}

function rightColorClicked() {
    score++
    newGame.next()
}

function wrongColorClicked() {
    const colors = returnArrayColors()
    for(i in colors) {
        var oldColor = colors[i];
        var newColor = oldColor.cloneNode(true);
        oldColor.parentNode.replaceChild(newColor, oldColor);
    }
    loseAudio.play()
    p.textContent = "Você errou! Pontuação: " + score + ", chegando ao nível " + level
    newGame.return(0)
}

function returnArrayColors() {
    const blue = document.getElementById('blue')
    const yellow = document.getElementById('yellow')
    const red = document.getElementById('red')
    const green = document.getElementById('green')
    return [blue, yellow, red, green]
}
