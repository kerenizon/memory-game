# Memory Game
https://animalsmemorygame.netlify.app
## memoryObj = {
    board,
    cards: [card{},..],
    card: {
        img,
        id,
        matchKeyColor,
    },
    player: {
        name,
        numOfWrongGuesses,
        time,
    },
    initGame(),
    displayLevel1(),
    displayLevel2(),
    displayLevel3(),
    clickCounter,
    checkMatch(),

## }

## Stages:

* landing page with start button
* start button trigger the next page (event listener to start button):

    overlay that ask for player name(basically there are two inner divs: 1. asking the name 2. congratulations in the end)

    board - grid display of 12 cards

    new-game reset button on the left above

    timer on the right above

    counter num of wrong guesses on the middle above

    advantage:

    levels, game themes, high score - saving the player name

## Pseudo-code:

1. overlay asking name, init board, init timer
2. adding event listeners to card: flipping animation

    adding event listener to new game reset button

    in addition: adding to levels menu and game themes.

3. counting clicks - every two clicks check match:

    if true -> shake the cards and remove them
    
    if false ->  
    * the game should pause for a second. During that second, the other cards are not clickable.
    * the cards' background change. 
    * incrementing the counter num of wrong guesses

4. when the board is empty trigger the overlay with congratulations!

