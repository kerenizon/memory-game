const memoryObj = {
    // board,
    prevCard: {
        img:'',
        id:'',
    },
    player: {
        name:'',
        numOfWrongGuesses:0,
        time:'',
    },
    cardsImgs: {
        1: ['d','e','g','h','i','u'],
        2: ['bb','j','l','m','r','s','v','x','z'],
        3: ['a','aa','b','c','f','k','n','o','p','q','w','y']
    },
    clickCounter: 0,
    stopTimer: false,
}

const modalOuter = document.querySelector('.modalOuter');
const modalInner = document.querySelector('.modalInner');
const startBtn = document.querySelector('.startBtn');
const resetBtn = document.querySelector('.reset');
const message = document.querySelector('.message');
let isRunning = false;


///////////////////////////    pre-game    //////////////////////////////

function addMessage() {
    message.classList.add('open');
}

startBtn.addEventListener('click',function(e){
    modalOuter.classList.remove('open');
    memoryObj.initTimer();
    memoryObj.displayScore();
});

resetBtn.addEventListener('click',function(){
    message.classList.remove('open');
    memoryObj.stopTimer = true;
    memoryObj.initGame();
});

///////////////////////////    timer    //////////////////////////////
memoryObj.initTimer = () => {
    document.querySelector('.timer').innerHTML = '00 : 00 : 00';
    let date = new Date();   
    date.setHours(0,0,0,0);
    let milliseconds = Math.round(date.getMilliseconds()/100);
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    isRunning = true;
    memoryObj.stopTimer = false;
    
    let refInterval = setInterval(showTime,100);
    function showTime(){
        if (memoryObj.stopTimer){
            clearInterval(refInterval);
        }
        (isRunning) && milliseconds++;
        if (milliseconds === 10){
           seconds += 1;
           milliseconds = 0;
        }
        if (seconds === 60){
            minutes += 1;
            seconds = 0;
        }
        minutes = ('0'+ minutes).slice(-2);
        seconds = ('0'+ seconds).slice(-2);
        document.querySelector('.timer').innerHTML = `${minutes} : ${seconds} : ${milliseconds}`;
        minutes = parseInt(minutes);
        seconds = parseInt(seconds);
    }

}

//////////////////////////// select levels /////////////////////////////////


document.querySelector('.custom-select').addEventListener('click', function() {

    this.classList.toggle('open');
})

for (const option of document.querySelectorAll(".custom-option")) {
    option.addEventListener('click', function() {
        
        if (!this.classList.contains('selected')) {
            this.parentNode.querySelector('.custom-option.selected').classList.remove('selected');
        }
        this.classList.add('selected');
        this.closest('.custom-select').querySelector('.custom-select__trigger span').textContent = this.textContent;
        memoryObj.initBoard();
    })
    
}

//////////////////////////// init board /////////////////////////////////

memoryObj.initBoard = () => {
    document.querySelector('.guessesCounterNum').textContent = 0;
    const level = document.querySelector('.selected').innerHTML;
    let root = document.documentElement;
    switch(level){
        case 'level 1':
            root.style.setProperty('--numColumns', 4);
            root.style.setProperty('--numRows', 3);
            imgSrc = './imgs/cards/six_cards/';
            imgWidth = 250;
            imgHeight = 180;
            memoryObj.displayLevel(1,imgSrc,imgWidth,imgHeight);
            break;
        case 'level 2':
            root.style.setProperty('--numColumns', 6);
            root.style.setProperty('--numRows', 3);
            imgSrc = './imgs/cards/nine_cards/';
            imgWidth = 160;
            imgHeight = 180;
            memoryObj.displayLevel(2,imgSrc,imgWidth,imgHeight);
            break;
        case 'level 3':
            root.style.setProperty('--numColumns', 6);
            root.style.setProperty('--numRows', 4);
            imgSrc = './imgs/cards/twelve_cards/';
            imgWidth = 160;
            imgHeight = 130;
            memoryObj.displayLevel(3,imgSrc,imgWidth,imgHeight);
            break;
    }
}

memoryObj.displayLevel = (level,imgSrc,imgWidth,imgHeight) => {
    let root = document.documentElement;
    const board = document.querySelector('.board');
    board.textContent = '';
    let doubleArray = [...memoryObj.cardsImgs[level],...memoryObj.cardsImgs[level]];
    shuffleArray(doubleArray);

    for(let i=0; i < doubleArray.length; i++){
        const card = document.createElement('div');
        card.classList.add('card');
        card.setAttribute('data-id',i+1);

        const imgDiv = document.createElement('div');
        imgDiv.classList.add('imgDiv')
        imgDiv.setAttribute('data-id',i+1);
        const img = document.createElement('img');
        img.src = `${imgSrc}${doubleArray[i]}.jpg`;
        img.height = imgHeight;
        img.width = imgWidth;

        imgDiv.appendChild(img);
        card.appendChild(imgDiv);

        const frontDiv = document.createElement('div');
        frontDiv.classList.add('frontDiv');
        frontDiv.setAttribute('data-id',i+1);
        root.style.setProperty('--imgHeight', `${imgHeight}px`);
        root.style.setProperty('--imgWidth', `${imgWidth}px`);

        card.appendChild(frontDiv);
        board.appendChild(card);
    }
    memoryObj.flipCards();    
}

function shuffleArray (array){
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

//////////////////////////// flipping /////////////////////////////////

memoryObj.flipCards = () => {
    document.querySelectorAll('.card').forEach(el => el.addEventListener('click',function(e){
        el.classList.toggle('is-flipped');
        memoryObj.clickCounter += 1;
        switch(memoryObj.clickCounter){
            case 1:
                memoryObj.prevCard.img = el.firstChild.firstChild.src;
                memoryObj.prevCard.id = el.firstChild.dataset.id;
                break;
            case 2:
                memoryObj.clickCounter = 0;
                memoryObj.checkIfEqual(el.firstChild.firstChild.src,el.firstChild.dataset.id);
                break;
        }
    }))

}

//////////////////////////// checking if equal /////////////////////////////////

memoryObj.checkIfEqual = (img, id) => {
    document.querySelectorAll('.card').forEach(el => el.style['pointer-events'] = "none");
    let firstCard = [...document.querySelectorAll('.card')].filter(el => el.dataset.id === memoryObj.prevCard.id); 
    let secondCard = [...document.querySelectorAll('.card')].filter(el => el.dataset.id === id); 
    setTimeout(func,2000);
    function func(){
        if((img === memoryObj.prevCard.img)){
            firstCard[0].style.visibility = 'hidden';
            secondCard[0].style.visibility = 'hidden';
            document.querySelectorAll('.card').forEach(el => el.style['pointer-events'] = "all");
            memoryObj.checkIfWin();
        }else{
            firstCard[0].classList.toggle('is-flipped');
            secondCard[0].classList.toggle('is-flipped');
            document.querySelector('.guessesCounterNum').textContent = parseInt(document.querySelector('.guessesCounterNum').textContent) + 1;
            document.querySelectorAll('.card').forEach(el => el.style['pointer-events'] = "all");
        }
    }
}

//////////////////////////// checking if win /////////////////////////////////

memoryObj.checkIfWin = (img, id) => {
    let visibleCards = [...document.querySelectorAll('.card')].filter(el => el.style.visibility === '');
    if (visibleCards.length === 0){
        let gameTime = document.querySelector('.gameTime');
        let numGusses = document.querySelector('.numGusses');
        gameTime.textContent = document.querySelector('.timer').innerHTML;
        numGusses.textContent = document.querySelector('.guessesCounterNum').textContent;
        memoryObj.player.name = document.querySelector('.playerName').value;
        memoryObj.player.numOfWrongGuesses = numGusses.textContent;
        memoryObj.player.time = gameTime.textContent;
        console.log(memoryObj.player);
        // localStorage.setItem('1', JSON.stringify(memoryObj.player));

        isRunning = false;
        memoryObj.stopTimer = true;
        memoryObj.setHighScore();

        document.querySelector('.message').classList.remove('open');
        document.querySelector('.win').classList.add('open');
        modalOuter.classList.add('open');
        memoryObj.continueGame();       
    }
}

memoryObj.continueGame = () => {
    function closeModal() {
        modalOuter.classList.remove("open");
    }
      
    modalOuter.addEventListener("click", function (event) {
        const isOutside = !event.target.closest(".modalInner");
        if (isOutside) {
          closeModal();
        }
    });
      
    window.addEventListener("keydown", (e) => {
        if (event.key === "Escape") {
          closeModal();
        }
    });
}

memoryObj.displayScore = () => {
    let playerScore = JSON.parse(localStorage.getItem('1'));
    if (playerScore){
        document.querySelector('.playerNick').textContent = playerScore.name;
        document.querySelector('.playertime').textContent = playerScore.time ;
        document.querySelector('.playerGuesses').textContent = playerScore.numOfWrongGuesses ;
    }
}

memoryObj.setHighScore = () => {
    let prevPlayer = JSON.parse(localStorage.getItem('1'));
    console.log(prevPlayer);
    if(prevPlayer){
        if(memoryObj.player.numOfWrongGuesses < prevPlayer.numOfWrongGuesses){
            localStorage.removeItem('1');
            localStorage.setItem('1', JSON.stringify(memoryObj.player));
        }
    } else {
        console.log('hi');
        localStorage.setItem('1', JSON.stringify(memoryObj.player));
        console.log(localStorage.getItem('1'));
    }
}


//////////////////////////// init the game /////////////////////////////////

memoryObj.initGame = () => {
    modalOuter.classList.add('open');
    addMessage();

}
memoryObj.initGame();

