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
let choice = database.ref('/choice');
let scoreboard = database.ref('/scoreboard');
let first_choice;

$('#submitPlayer-1').on('click', function() {
    event.preventDefault();
    let playerName = $('#inputPlayer-1').val();
    $('#player-1 .innerContent').empty();
    $('#player-1 h1').html(playerName);
    let player_2 = '';
    if ($('#player-2').attr('data-playerPresent') === 'yes') {
        players.set({
            player2: player_2
        })
    }
    players.set({
        player1: playerName,
        player2: player_2
    });
    scoreboard.set({
        secondChoiceWins: 0,
        secondChoiceLosses: 0,
        secondChoiceTies: 0
    })
    $('#player-1').attr('data-playerPresent', 'yes');
    if ($('#player-2').attr('data-playerPresent') === 'yes') {
        $('#player-2 .innerContent').append($('<span onclick="chooseRock()">Rock</span><span onclick="choosePaper()">Paper</span><span onclick="chooseScissors()">Scissors</span>'));
        $('#player-2').attr('id', 'firstChoice');
        $('#player-1').attr('id', 'secondChoice');
    }
})

$('#submitPlayer-2').on('click', function() {
    event.preventDefault();
    let playerName = $('#inputPlayer-2').val();
    $('#player-2 .innerContent').empty();
    $('#player-2 h1').html(playerName);
    let player_1 = '';
    if ($('#player-1').attr('data-playerPresent') === 'yes') {
        players.set({
            player1: player_1
        })
    }
    players.set({
        player1: player_1,
        player2: playerName,
    });
    scoreboard.set({
        secondChoiceWins: 0,
        secondChoiceLosses: 0,
        secondChoiceTies: 0
    })
    $('#player-2').attr('data-playerPresent', 'yes');
    if ($('#player-1').attr('data-playerPresent') === 'yes') {
        $('#player-1 .innerContent').append($('<span onclick="chooseRock()">Rock</span><span onclick="choosePaper()">Paper</span><span onclick="chooseScissors()">Scissors</span>'));
        $('#player-1').attr('id', 'firstChoice');
        $('#player-2').attr('id', 'secondChoice');
    }
})

const chooseRock = () => {
    choice.set({
        firstChoice: 'rock'
    })
    $('#firstChoice').empty();
    $('#secondChoice').append($('<span onclick="getRock()">Rock</span><span onclick="getPaper()">Paper</span><span onclick="getScissors()">Scissors</span>'));
}

const choosePaper = () => {
    choice.set({
        firstChoice: 'paper'
    })
    $('#firstChoice .innerContent').empty();
    $('#secondChoice').append($('<span onclick="getRock()">Rock</span><span onclick="getPaper()">Paper</span><span onclick="getScissors()">Scissors</span>'));
}

const chooseScissors = () => {
    choice.set({
        firstChoice: 'scissors'
    })
    $('#firstChoice .innerContent').empty();
    $('#secondChoice').append($('<span onclick="getRock()">Rock</span><span onclick="getPaper()">Paper</span><span onclick="getScissors()">Scissors</span>'));
}

choice.on('value', function(snapshot) {
    first_choice = snapshot.val().firstChoice;
    console.log(first_choice);
})

function getRock() {

    if (first_choice === 'rock') {
        $('#arena .innerContent').html(`<h2>You both chose ${first_choice}, so it was a tie!</h2>`)
        secondChoiceTies++;
    }
    else if (first_choice === 'paper') {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1')} chose ${first_choice}</h2><h2>${$('#secondChoice h1').html()} chose paper!</h2>`)
        secondChoiceLosses++;
    }
    else {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1')} chose ${first_choice}/h2><h2>${$('#secondChoice h1').html()} chose scissors!</h2>`);
        secondChoiceWins++;
    }
    updateScoreboard(secondChoiceWins, secondChoiceLosses, secondChoiceTies)
}

function getPaper() {
     if (first_choice === 'paper') {
        $('#arena .innerContent').html(`<h2>You both chose ${first_choice}, so it was a tie!</h2>`)
        secondChoiceTies++;
    }
     else if (first_choice === 'scissors') {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1')} chose ${first_choice}</h2><h2>${$('#secondChoice h1').html()} chose scissors!</h2>`)
        secondChoiceLosses++;
     }
     else {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1')} chose ${first_choice}/h2><h2>${$('#secondChoice h1').html()} chose rock!</h2>`);
        secondChoiceWins++;
     }
     updateScoreboard(secondChoiceWins, secondChoiceLosses, secondChoiceTies)
}

function getScissors() {
     if (first_choice === 'scissors') {
        $('#arena .innerContent').html(`<h2>You both chose ${first_choice}, so it was a tie!</h2>`)
        secondChoiceTies++;
    }
     else if (first_choice === 'rock') {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1')} chose ${first_choice}</h2><h2>${$('#secondChoice h1').html()} chose rock!</h2>`)
        secondChoiceLosses++;
    }
     else {
        $('#arena .innerContent').html(`<h2>${$('#firstChoice h1')} chose ${first_choice}/h2><h2>${$('#secondChoice h1').html()} chose paper!</h2>`);
        secondChoiceWins++;
     }
     updateScoreboard(secondChoiceWins, secondChoiceLosses, secondChoiceTies)
}

const updateScoreboard = (secondChoiceWins, secondChoiceLosses, secondChoiceTies) => {
    console.clear();
    console.log('User secondChoiceWins: ' + secondChoiceWins);
    console.log('User secondChoiceLosses: ' + secondChoiceLosses);
    console.log('User secondChoiceTies: ' + secondChoiceTies);
    document.getElementById('secondChoiceWins').textContent = 'User secondChoiceWins: ' + secondChoiceWins;
    document.getElementById('secondChoiceLosses').textContent = 'User secondChoiceLosses: ' + secondChoiceLosses;
    document.getElementById('secondChoiceTies').textContent = 'User secondChoiceTies: ' + secondChoiceTies;
}
