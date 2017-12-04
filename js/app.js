
var cards = ["fa-diamond", "fa-diamond",
"fa-paper-plane-o", "fa-paper-plane-o",
"fa-anchor", "fa-anchor",
"fa-bolt", "fa-bolt",
"fa-cube", "fa-cube",
"fa-leaf", "fa-leaf",
"fa-bicycle", "fa-bicycle",
"fa-bomb", "fa-bomb"];

var openedCards = [];
var moveCounter = 0;
var matches = 0;
var sec = 0;
var clicks = 0;
var timer;

//when the player clicks the restart icon, set a new game
$(".restart").children().click(function(){
  newGame();
});

$(".card").click(function(){

  clicks++;

  //start timer when the first card is clicked
  if(clicks==1){
    //start timer
    timer = setInterval( function(){
      $("#seconds").html(pad(++sec%60));
      $("#minutes").html(pad(parseInt(sec/60,10)));
    }, 1000);
  }

  //if there weren't opened cards...open the clicked card
  if(openedCards.length==0){
    openCard($(this));
  }

  //if there was already an opened card
  else if(openedCards.length==1){

    //if the new card clicked card is different from the opened card
    if(differentCards(openedCards[0],$(this))){

      //counts as a move
      addMove();

      //open the new clicked card
      openCard($(this));

      //remove stars every 8 moves
      if(moveCounter % 8 == 0){
        if($(".stars").children().length > 1){
          $(".stars").children().last().remove();
        }
      }

      //now the two different cards are opened
      //if they match, lock cards
      if(match(openedCards[0], openedCards[1])){

        lockCards(openedCards[0], openedCards[1]);

        //if player wins..show modal
        if(matches==8){
          gameFinished();
        }
      }

      //if they didnt match, hide them
      else {
        setTimeout(function() {
          hide(openedCards[0], openedCards[1]);
        }, 1000);
      }
    }
  }
});

//when the player clicks 'yes' in the congrats modal, set a new game
$("#yes").click(function(){
  newGame();
});

function newGame(){

  //reset timer
  sec = 0;
  clearInterval(timer);
  $("#seconds").html("00");
  $("#minutes").html("00");

  //reset clicks
  clicks = 0;

  //reset matches
  matches = 0;

  //reset moveCounter
  moveCounter = 0;
  $(".moves").html(moveCounter);

  //set to 3 stars
  $(".stars").children().remove();
  for (var i = 0; i < 3; i++) {
    $(".stars").append("<li><i class='fa fa-star'></i></li>");
  }

  //reset openedCards
  openedCards = [];
  $(".card").removeClass("match open show");
  $(".card").children().removeClass();
  $(".card").children().addClass("fa");

  //shuffle cards
  shuffle(cards);

  //list with the children of all cards (the i's)
  var icards = $(".card").children();

  //loop through the cards
  for (var i = 0; i < icards.length; i++) {

    //add the card type to the cards
    icards.eq(i).addClass(cards[i]);
  }
}

//method that hides two cards
function hide(card1, card2){

  //hide the cards
  card1.removeClass("open show");
  card2.removeClass("open show");

  //reset opened cards list
  openedCards = [];
}

//method that "opens" a card
function openCard(card){

  //show the card
  card.addClass("open show");

  //add card to the opened cards list
  openedCards.push(card);
}

//return true when cards match, false if they don't
function match(card1, card2){

  var cardType1 = card1.children()[0].className;
  var cardType2 = card2.children()[0].className;

  if(cardType1==cardType2){
    matches++;
    return true;
  }
  else return false;
}

//method that locks cards to the matched state
function lockCards(card1, card2){
  card1.addClass("match");
  card2.addClass("match");

  //reset the opened cards list
  openedCards = [];
}

/*returns true if 2 cards are different (to handle the case when
the player clicks the same card)*/
function differentCards(card1, card2){
  if(card1.children()[0]!=card2.children()[0]){
    return true;
  }
  else return false;
}

/*method called when the player wins.
stops timer and sets modal variables*/
function gameFinished(){

  //stops timer
  clearInterval(timer);

  //sets modal variables
  $("#minutesSpan").html(parseInt(sec/60,10));
  $("#secondsSpan").html(sec%60);
  $("#movesSpan").html(moveCounter);
  $("#starsSpan").html($(".stars").children().length);

  //show modal
  $("#myModal").modal("show");
}

//method that displays the number of moves
function addMove(){
  moveCounter++;
  $(".moves").html(moveCounter);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


/*for the timer
taken from https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript*/
function pad ( val ) {
  return val > 9 ? val : "0" + val;
}
