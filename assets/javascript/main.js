// Initialize Firebase
var config = {
apiKey: "AIzaSyDOALS0oj-trGzgTi0mv52GLgCtMvWIcMA",
authDomain: "multiplayer-rps-f65d5.firebaseapp.com",
databaseURL: "https://multiplayer-rps-f65d5.firebaseio.com",
projectId: "multiplayer-rps-f65d5",
storageBucket: "multiplayer-rps-f65d5.appspot.com",
messagingSenderId: "224283565186"
};
firebase.initializeApp(config);

let database = firebase.database();
let players = database.ref('/players');
let player1 = database.ref('/players/player1');
let player2 = database.ref('/players/player2');
let choice = database.ref('/choice');
let scoreboard = database.ref('/scoreboard');
let chat = database.ref('/chat');
let first_choice;
let second_choice;
let secondChoiceWins = 0;
let secondChoiceTies = 0;
let secondChoiceLosses = 0;

let player_1_name = '';
let player_2_name = '';

choice.set({
    firstChoice: '',
    secondChoice: ''
})

$('#submitfirstChoice').on('click', function() {
    event.preventDefault();
    player_1_name = $('#inputfirstChoice').val();
    $('.innerContent').empty();
    $('#firstChoice h1').html(player_1_name);
    $('#firstChoice').attr('data-playerPresent', 'yes');   
    player1.set(player_1_name);
    player1.onDisconnect(player_1_name = '').remove(resetGame());
})

$('#submitsecondChoice').on('click', function() {
    event.preventDefault();
    player_2_name = $('#inputsecondChoice').val();
    $('.innerContent').empty();
    $('#secondChoice h1').html(player_2_name);
    $('#secondChoice').attr('data-playerPresent', 'yes');
    player2.set(player_2_name);
    player2.onDisconnect(player_2_name = '').remove(resetGame());
    //.cancel
})

players.on('value', snapshot => {
    if (snapshot.child('player1').exists()) {
        player_1_name = snapshot.child('player1').val();
        $('#firstChoice .innerContent').empty();
        $('#firstChoice h1').html(player_1_name);
        player1.onDisconnect(resetGame());
    } else {
        $('#firstChoice h1').html('Player 1');
    }
    if (snapshot.child('player2').exists()) {
        player_2_name = snapshot.child('player2').val();
        $('#secondChoice .innerContent').empty();
        $('#secondChoice h1').html(player_2_name);
        player2.onDisconnect().remove(resetGame());
    } else {
        $('#secondChoice h1').html('Player 2');
    }
    if (snapshot.child('player2').exists() && snapshot.child('player1').exists() && $('#firstChoice').attr('data-playerPresent') === 'yes') {
        $('#firstChoice .innerContent').append($('<span class="button" id="chooseRockButton">Rock</span><span class="button" id="choosePaperButton">Paper</span><span class="button" id="chooseScissorsButton">Scissors</span>'));
        $('#firstChoice').attr('id', 'firstChoice');
        $('#secondChoice').attr('id', 'secondChoice');
    }
    if (snapshot.child('player2').exists() && snapshot.child('player1').exists() && $('#secondChoice').attr('data-playerPresent') === 'yes') {
        $('#secondChoice .innerContent').append($('<span>Please wait</span>'));
        $('#firstChoice').attr('id', 'firstChoice');
        $('#secondChoice').attr('id', 'secondChoice');
    }
});

// players.on('child_removed', snapshot => {
//     console.log(snapshot.val());
//     if (!snapshot.child('player1').exists()) {
//         $('#firstChoice h1').html('Player 1');
//     }
//     if (!snapshot.child('player2').exists()) {
//         $('#secondChoice h1').html('Player 2');
//     };
//     console.log(player_1_name);
//     console.log(player_2_name);
// })

const chooseRock = () => {
    choice.set({
        firstChoice: 'rock'
    })
    $('#firstChoice .innerContent').empty();
}

const choosePaper = () => {
    choice.set({
        firstChoice: 'paper'
    })
    $('#firstChoice .innerContent').empty();
}

const chooseScissors = () => {
    choice.set({
        firstChoice: 'scissors'
    })
    $('#firstChoice .innerContent').empty();
}

choice.child('firstChoice').on('value', function(snapshot) {
    first_choice = snapshot.val();
    if ($('#secondChoice').attr('data-playerPresent') === 'yes' && first_choice !== '') {
        $('#secondChoice .innerContent').append($('<span class="button" id="getRockButton">Rock</span><span class="button" id="getPaperButton">Paper</span><span class="button" id="getScissorsButton">Scissors</span>'));
    }
})

function getRock() {
    choice.set({
        firstChoice: first_choice,
        secondChoice: 'rock'
    });
    $('#secondChoice .innerContent').empty();
    if (first_choice === 'rock') {
        $('#arena .innerContent').html(`<h2>You both chose ${first_choice}, so it was a tie.</h2>`)
        secondChoiceTies++;
    }
    else if (first_choice === 'paper') {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1').html()} chose ${first_choice}</h2><h2>${$('#secondChoice h1').html()} chose rock.</h2>`)
        secondChoiceLosses++;
    }
    else {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1').html()} chose ${first_choice}</h2><h2>${$('#secondChoice h1').html()} chose rock.</h2>`);
        secondChoiceWins++;
    }
    updateScoreboard(secondChoiceWins, secondChoiceLosses, secondChoiceTies);
}

function getPaper() {
    choice.set({
        firstChoice: first_choice,
        secondChoice: 'paper'
    });
    $('#secondChoice .innerContent').empty();
    if (first_choice === 'paper') {
        $('#arena .innerContent').html(`<h2>You both chose ${first_choice}, so it was a tie!</h2>`)
        secondChoiceTies++;
    }
    else if (first_choice === 'scissors') {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1').html()} chose ${first_choice}</h2><h2>${$('#secondChoice h1').html()} chose paper.</h2>`)
        secondChoiceLosses++;
    }
    else {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1').html()} chose ${first_choice}</h2><h2>${$('#secondChoice h1').html()} chose paper.</h2>`);
        secondChoiceWins++;
    }
    updateScoreboard(secondChoiceWins, secondChoiceLosses, secondChoiceTies);
}

function getScissors() {
    choice.set({
        firstChoice: first_choice,
        secondChoice: 'scissors'
    });
    $('#secondChoice .innerContent').empty();
    if (first_choice === 'scissors') {
        $('#arena .innerContent').html(`<h2>You both chose ${first_choice}, so it was a tie!</h2>`)
        secondChoiceTies++;
    }
    else if (first_choice === 'rock') {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1').html()} chose ${first_choice}</h2><h2>${$('#secondChoice h1').html()} chose scissors.</h2>`)
        secondChoiceLosses++;
    }
    else {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1').html()} chose ${first_choice}</h2><h2>${$('#secondChoice h1').html()} chose scissors.</h2>`);
        secondChoiceWins++;
    }
    updateScoreboard(secondChoiceWins, secondChoiceLosses, secondChoiceTies);
}

const updateScoreboard = (secondChoiceWins, secondChoiceLosses, secondChoiceTies) => {
    scoreboard.set({
        second_choice_wins: secondChoiceWins,
        second_choice_losses: secondChoiceLosses,
        ties: secondChoiceTies
    })
}

scoreboard.on('value', function(snapshot) {
    
    if ($('#secondChoice').attr('data-playerPresent') === 'yes') {
        $('#secondChoice .innerContent').append($(`<span>Wins: ${snapshot.val().second_choice_wins}</span>`));
        $('#secondChoice .innerContent').append($(`<span>Losses: ${snapshot.val().second_choice_losses}</span>`));
        $('#secondChoice .innerContent').append($(`<span>Ties: ${snapshot.val().ties}</span>`));
        $('#arena .innerContent').append($('<span class="button" id="startNewGame">Play again?</span>'));

    } else if ($('#firstChoice').attr('data-playerPresent') === 'yes') {
        $('#firstChoice .innerContent').append($(`<span>Wins: ${snapshot.val().second_choice_losses}</span>`));
        $('#firstChoice .innerContent').append($(`<span>Losses: ${snapshot.val().second_choice_wins}</span>`));
        $('#firstChoice .innerContent').append($(`<span>Ties: ${snapshot.val().ties}</span>`));
        $('#arena .innerContent').append($('<span class="button" id="startNewGame">Play again?</span>'));
    }
})

const newGame = () => {
    $('.innerContent').empty();
    choice.set({
        firstChoice: '',
        secondChoice: ''
    })
    if ($('#firstChoice').attr('data-playerPresent') === 'yes') {
        $('#firstChoice .innerContent').append($('<span class="button" id="chooseRockButton">Rock</span><span class="button" id="choosePaperButton">Paper</span><span class="button" id="chooseScissorsButton">Scissors</span>'));
    }
}

const resetGame = () => {
    // $('#firstChoice .innerContent').empty();
    // $('#secondChoice .innerContent').empty();

    $('#firstChoice').attr('id', 'firstChoice');
    $('#secondChoice').attr('id', 'secondChoice');

    

    if ($('#firstChoice').attr('data-present') === 'no') {
        $('#firstChoice').append('<h1>Player 1</h1><div class="innerContent"><form><h2>Player 1: Enter Your Name</h2><input id="inputfirstChoice" val=""><br><span class="button" id="submitfirstChoice">Submit</span></form></div>');
    }

    if ($('#secondChoice').attr('data-present') === 'no') {
        $('#secondChoice').append('<h1>Player 2</h1><div class="innerContent"><form><h2>Player 2: Enter Your Name</h2><input id="inputsecondChoice" val=""><br><span class="button" id="submitsecondChoice">Submit</span></form></div>');
    }

}

$(document).on('click', '#submitChat', function () {
    let messageContent
    if ($('#firstChoice').attr('data-playerPresent') === 'yes' || $('#firstChoice').attr('data-playerPresent') === 'yes') {
        messageContent = `${player_1_name}: ${$('#message').val()}`;
    } else if ($('#secondChoice').attr('data-playerPresent') === 'yes' || $('#secondChoice').attr('data-playerPresent') === 'yes') {
        messageContent = `${player_2_name}: ${$('#message').val()}`;
    }
    chat.push(messageContent);
});

chat.on('child_added', function (snapshot) {
    $('#chatBox').append(`<div class='messageHistory'>${snapshot.val()}</div>`);
});

$(document).on('click', '#startNewGame', function() {
    newGame();
})

$(document).on('click', '#getRockButton', function() {
    getRock();
})

$(document).on('click', '#getPaperButton', function() {
    getPaper();
})

$(document).on('click', '#getScissorsButton', function() {
    getScissors();
})

$(document).on('click', '#chooseRockButton', function() {
    chooseRock();
})

$(document).on('click', '#choosePaperButton', function() {
    choosePaper();
})

$(document).on('click', '#chooseScissorsButton', function() {
    chooseScissors();
})

// starts at the bottom and scrolls until the height of the box is reached which is the case at default
$("#chatBox").animate({scrollTop: $(this).height() }, "slow"); // https://stackoverflow.com/questions/15629599/how-to-fix-the-scrollbar-always-at-the-bottom-of-a-div/15629743