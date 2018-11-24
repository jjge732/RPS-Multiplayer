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


$('#submitPlayer-1').on('click', function() {
    event.preventDefault();
    player_1_name = $('#inputPlayer-1').val();
    $('.innerContent').empty();
    $('#player-1 h1').html(player_1_name);
    $('#player-1').attr('data-playerPresent', 'yes');   
    player1.set(player_1_name);
    player1.onDisconnect().remove();
})

$('#submitPlayer-2').on('click', function() {
    event.preventDefault();
    player_2_name = $('#inputPlayer-2').val();
    $('.innerContent').empty();
    $('#player-2 h1').html(player_2_name);
    $('#player-2').attr('data-playerPresent', 'yes');
    player2.set(player_2_name);
    player2.onDisconnect().remove();
})

players.on('value', function(snapshot) {
    if (snapshot.child('player1').exists()) {
        player_1_name = snapshot.child('player1').val();
        $('#player-1 .innerContent').empty();
        $('#player-1 h1').html(player_1_name);
    }
    if (snapshot.child('player2').exists()) {
        player_2_name = snapshot.child('player2').val();
        $('#player-2 .innerContent').empty();
        $('#player-2 h1').html(player_2_name);
    }
    if (snapshot.child('player2').exists() && snapshot.child('player1').exists() && $('#player-1').attr('data-playerPresent') === 'yes') {
        $('#player-1 .innerContent').append($('<span onclick="chooseRock()">Rock</span><span onclick="choosePaper()">Paper</span><span onclick="chooseScissors()">Scissors</span>'));
        $('#player-1').attr('id', 'firstChoice');
        $('#player-2').attr('id', 'secondChoice');
    }
    if (snapshot.child('player2').exists() && snapshot.child('player1').exists() && $('#player-2').attr('data-playerPresent') === 'yes') {
        $('#player-2 .innerContent').append($('<span>Please wait</span>'));
        $('#player-1').attr('id', 'firstChoice');
        $('#player-2').attr('id', 'secondChoice');
    }
})

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
    $('#player-1 .innerContent').empty();
}

choice.child('firstChoice').on('value', function(snapshot) {
    first_choice = snapshot.val();
    if ($('#secondChoice').attr('data-playerPresent') === 'yes') {
        $('#secondChoice .innerContent').append($('<span onclick="getRock()">Rock</span><span onclick="getPaper()">Paper</span><span onclick="getScissors()">Scissors</span>'));
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
        $('#arena .innerContent').append($('<span id="startNewGame" onclick="newGame()">Play again?</span>'));

    } else if ($('#firstChoice').attr('data-playerPresent') === 'yes') {
        $('#firstChoice .innerContent').append($(`<span>Wins: ${snapshot.val().second_choice_losses}</span>`));
        $('#firstChoice .innerContent').append($(`<span>Losses: ${snapshot.val().second_choice_wins}</span>`));
        $('#firstChoice .innerContent').append($(`<span>Ties: ${snapshot.val().ties}</span>`));
        $('#arena .innerContent').append($('<span id="startNewGame" onclick="newGame()">Play again?</span>'));
    }
})

const newGame = () => {
    $('.innerContent').empty();
    choice.set({
        firstChoice: '',
        secondChoice: ''
    })
    if ($('#firstChoice').attr('data-playerPresent') === 'yes') {
        $('#firstChoice .innerContent').html($('<span onclick="chooseRock()">Rock</span><span onclick="choosePaper()">Paper</span><span onclick="chooseScissors()">Scissors</span>'));
    }
}

$('#submitChat').on('click', function () {
    let messageContent
    if ($('#player-1').attr('data-playerPresent') === 'yes' || $('#firstChoice').attr('data-playerPresent') === 'yes') {
        messageContent = `${player_1_name}: ${$('#message').val()}`;
    } else if ($('#player-2').attr('data-playerPresent') === 'yes' || $('#secondChoice').attr('data-playerPresent') === 'yes') {
        messageContent = `${player_2_name}: ${$('#message').val()}`;
    }
    chat.push(messageContent);
});

chat.on('child_added', function (snapshot) {
    $('#chatBox').append(`<div class='messageHistory'>${snapshot.val()}</div>`);
});