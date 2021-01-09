let playerHave = document.getElementById("have");
let dealerHave = document.getElementById("dealer");
let hit = document.getElementById("hit");
let hold = document.getElementById("hold");
let score = document.getElementById("score");
let playerDiv = document.getElementById("playerDiv");
let dealerDiv = document.getElementById("dealerCardDiv");
let statsDiv = document.getElementById("stats");
let gameDiv = document.getElementById("game");
let buttonsDiv = document.getElementById("buttons");
let menuDiv = document.getElementById("menu");
let startButton = document.getElementById("start");
let restartButton = document.getElementById("restart");
let bid = document.getElementById("bid");
let over = document.getElementById("over");
let overText = document.getElementById("overText");
let oldScore = document.getElementById("oldScore");
let clickSound = document.createElement("audio");

let state;  //Either game, menu or start - string
let money;  //Currency (global)
let deck;   //Overall cards dealt
let cards;  //Cards dealt to the player
let dealerCards;    //Cards dealt to the dealer
let playerPoints;   //Points in a turn - player
let dealerPoints;   //Point in a turn - dealer
let hittable;   //The button can be pressed
let lost;   //End game - lost
let won;    //End game - won
let inGame; //The user started playing (has money)
let playerTurn; //The player can bid and hit or hold

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function clear() {
    while(playerDiv.hasChildNodes()) {
        playerDiv.removeChild(playerDiv.firstChild);
    }
    while(dealerDiv.hasChildNodes()) {
        dealerDiv.removeChild(dealerDiv.firstChild);
    }
}

function activate() {
    hit.classList.remove("inactive");
    hold.classList.remove("inactive");
}

function incavtivate() {
    hit.className = "inactive";
    hold.className = "inactive";
}

function update() {
    if(state == "menu") {
        hideGame();
        clear();
        menuDiv.style.display = "flex";
        over.style.display = "none";
        oldScore.innerHTML = money;
        return;
    }
    playerHave.innerHTML = playerPoints;
    dealerHave.innerHTML = dealerPoints;
    score.innerHTML = "Money: " + money;
    if(!hittable) {
        incavtivate();
    } else {
        activate();
    }
    if(!playerTurn) {
        if(!lost && !won) {
            setTimeout(dealerTime, 750);
        } else if(lost) {
            startButton.classList.remove("inactive");
            lostFun();
        } else {
            startButton.classList.remove("inactive");
            winFun();
        }
    } 
}

function hideGame() {
    statsDiv.style.display = "none";
    gameDiv.style.display = "none";
    buttonsDiv.style.display = "none";
}

function showGame() {
    statsDiv.style.display = "flex";
    gameDiv.style.display = "flex";
    buttonsDiv.style.display = "flex";
}

this.onload = function () {
    state = "start";    //In menu, before playing
    startButton.className = "inactive"; //Cannon continue, not started playing
    inGame = false; //The user has not yet started playing
    playerTurn = false; //the player cant bid
    clickSound.src = "dealSound.wav";
    hideGame();
};

startButton.onclick = function () {
    if(inGame && money) {
        showGame();
        start();
    }
};

restartButton.onclick = function() {
    showGame();
    restart();
    start();
    inGame = true;
    startButton.classList.remove("inactive");
};

function start() {
    state = "game";
    playerPoints = 0;
    dealerPoints = 0;
    cards = [];
    dealerCards = [];
    deck = [];
    hittable = true;
    playerTurn = true;
    won = false;
    lost = false;
    menuDiv.style.display = "none";
    activate();
    verify();
    update();
}

function restart() {
    money = 500;
}

hit.onclick = function () {
    if(hittable == true) {
        clickSound.play();
        let c = playerDiv.appendChild(document.createElement("div"));
        c.className = "card";
        cards.push(c);
        let n;
        while(deck.indexOf(n=getRandomInt(52)+1) != -1) {;}
        let value = n % 13 + 1;
        deck.push(n);
        c.appendChild(document.createTextNode(value));
        c.style.animation = 'rotate 300ms ease-in-out';
        playerPoints += value;
        if(playerPoints > 21) {
            hittable = false;
            playerTurn = false;
            lost = true;
        } else if(playerPoints == 21) {
            hittable = false;
            playerTurn = false;
            won = true;
        }
        update();
    }
};

hold.onclick = function() {
    if(hittable) {
        hittable = false;
        playerTurn = false;
        update();
    } 
};

function dealerTime() {
    let drawing;
    if (dealerPoints > playerPoints && playerPoints < 21) {
        drawing = false;
    } else if(dealerPoints < 15 || dealerPoints < playerPoints && playerPoints < 21) {
        drawing = true;
    } else if (dealerPoints < 17) {
        if(getRandomInt(10) + 1 < 8) {
            drawing = true;
        } else {
            drawing = false;
        }
    } else if(dealerPoints < 21) {
        if(getRandomInt(10) + 1 < 2) {
            drawing = true;
        } else {
            drawing = false;
        }
    } else {
        drawing = false;
    }

    if(drawing) {
        clickSound.play();
        let c = dealerDiv.appendChild(document.createElement("div"));
        c.className = "card";
        dealerCards.push(c);
        let n;
        while(deck.indexOf(n=getRandomInt(52)+1) != -1) {;}
        let value = n % 13 + 1;
        deck.push(n);
        c.appendChild(document.createTextNode(value));
        c.style.animation = 'rotate 300ms ease-in-out';
        dealerPoints += value;
        update();
    } else {
        if(dealerPoints > playerPoints && dealerPoints <= 21) {
            lost = true;
            lostFun();
        } else {
            won = true;
            winFun();
        }
    }
}

function lostFun() {
    money -= parseInt(bid.value);
    state = "menu";
    over.style.display = "block";
    overText.innerHTML = "You lost " + bid.value + "!";
    if(!money) {
        startButton.className = "inactive";
    }
    score.innerHTML = "Money: " + money;
    setTimeout(update, 1500);
}

function winFun() {
    money += parseInt(bid.value);
    state = "menu";
    over.style.display = "block";
    overText.innerHTML = "You won " + bid.value + "!";
    score.innerHTML = "Money: " + money;
    setTimeout(update, 1500);
}

function verify() {
    if((parseInt(bid.value) > money || !parseInt(bid.value)) && playerTurn) {
        hittable = false;
    } else {
        hittable = true;
    }
    update();
};

bid.oninput = verify;