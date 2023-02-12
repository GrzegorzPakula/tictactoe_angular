angular.module('ticTacToe', ['ngAnimate']).controller('TicTacToeController', function($timeout) {
    var ticTacToe = this; 
    ticTacToe.words = "Zagraj z komputerem";  
  
    ticTacToe.gameArr = [ 
      ' ', ' ', ' ',
      ' ', ' ', ' ',
      ' ', ' ', ' '
    ];
    ticTacToe.game = [
      ' ', ' ', ' ',
      ' ', ' ', ' ',
      ' ', ' ', ' '
    ];
    
    ticTacToe.moves = [];
    ticTacToe.reset = reset;
    ticTacToe.compFirst = compFirst; 
    ticTacToe.play = play; 
  
    var turn = true;
    var humanIsX = true; 
    
    function play(num) { 
      if (turn && moveIsAvailable(ticTacToe.gameArr, num)) { 
        ticTacToe.gameArr[num] = 'X'; 
        ticTacToe.game[num] = humanIsX? 'X':'O';
        turnOver(); 
      } else {
        ticTacToe.words = "Kliknąłeś w zapełnione pole!";
        return;
      }
      var result = winning(ticTacToe.gameArr, true, 0); 
      if (result === -10) {
        ticTacToe.words = humanIsX?"X wygrał.":"O wygrał."; 
        $timeout(reset, 2000); 
      } else if (result === 10) {
        ticTacToe.words = humanIsX?"O wygrał.":"X wygrał."; 
        $timeout(reset, 2000); 
      } else if (result === 0) {
        ticTacToe.words = "Remis"; 
        $timeout(reset, 2000); 
      } else { 
        var compy = compMove(); 
        ticTacToe.gameArr[compy] = 'O'; 
        ticTacToe.game[compy] = humanIsX? 'O':'X';
        if (winning(ticTacToe.gameArr) === 10) {
          ticTacToe.words = humanIsX?"O wygrał.":"X wygrał";
          $timeout(reset, 2000); 
        } else if (winning(ticTacToe.gameArr) === 0) {
          ticTacToe.words = 'Remis';
          $timeout(reset, 2000); 
        } else {
          turnOver();
        }
      }
    }
  
    function compFirst() { 
      if (ticTacToe.gameArr.indexOf('X') !== -1 || 
        ticTacToe.gameArr.indexOf('O') !== -1) {
        ticTacToe.words = "Gra w trakcie.";
        return;
      }
      humanIsX = false;
      ticTacToe.words = "Dobrze ja zacznę";
      turnOver();
      var compy = Math.floor(Math.random() * (3) + 1);
      if (compy === 1) {
        ticTacToe.gameArr[0] = 'O';
        ticTacToe.game[0] = 'X';
      } else if (compy === 2) {
        ticTacToe.gameArr[4] = 'O';
        ticTacToe.game[4] = 'X';
      } else if (compy === 3) {
        ticTacToe.gameArr[6] = 'O';
        ticTacToe.game[6] = 'X';
      } else if (compy = 4) {
        ticTacToe.gameArr[8] = 'O';
        ticTacToe.game[8] = 'X';
      }
      turnOver();
    }
  
    function compMove() {
      ticTacToe.moves = [];
      var move = undefined;
      var maxScore = -100;
      for (var i = 0; i < ticTacToe.gameArr.length; i++) { 
        if (moveIsAvailable(ticTacToe.gameArr, i)) { 
          var trialArray = copyArray(ticTacToe.gameArr); 
          trialArray[i] = 'O';
          var prediction = min(trialArray, 1); 
          if (prediction > maxScore) {
            maxScore = prediction; 
            move = i; 
          }
          ticTacToe.moves.push([i, maxScore]);
        }
      }
      return move;
    }
  
    function min(arr, turns) {
      if (winning(arr, false) === 0) {
        return 0; 
      } else if (winning(arr, false) === 10) { 
        return 10 - turns; 
      } else {
        var newTurns = 1 + turns;
        var minScore = 100; 
        for (var i = 0; i < arr.length; i++) {
          if (moveIsAvailable(arr, i)) { 
            var trialArray = copyArray(arr);
            trialArray[i] = 'X';
            var prediction = max(trialArray, newTurns); 
            if (prediction < minScore) { 
              minScore = prediction; 
            }
          }
        }
        return minScore;
      }
    }
  
    function max(arr, turns, originalMove) {
      if (winning(arr, true) === -10) { 
        return turns - 10; 
      } else if (winning(arr, false) === 0) { 
        return 0;
      } else {
        var newTurns = 1 + turns;
        var maxScore = -100; 
        for (var i = 0; i < arr.length; i++) {
          if (moveIsAvailable(arr, i)) { 
            var trialArray = copyArray(arr); 
            trialArray[i] = 'O';
            var prediction = min(trialArray, newTurns);
            if (prediction > maxScore) { 
              maxScore = prediction; 
            }
          }
        }
        return maxScore;
      }
    }
  
    function copyArray(arr) { 
      return arr.slice();
    }
  
    function noMoreMoves(arr) {
      return arr.indexOf(' ') === -1 ? true : false;
    }
  
    function moveIsAvailable(arr, move) { 
      return arr[move] === ' ' ? true : false;
    }
  
    function turnOver() { 
      turn = !turn;
    }
  
    function reset() { 
      turn = true;
      ticTacToe.gameArr = [
        ' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' '
      ];
      ticTacToe.game = [
        ' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' '
      ];
      ticTacToe.moves = [];
      humanIsX = true;
      ticTacToe.words = 'Zagraj ze mną jeszcze raz'
    }
  
    function winning(trialArray, x) { 
      var letter = undefined; 
      if (x) { 
        letter = 'X'
      } else {
        letter = 'O'
      }
      if (
        trialArray[0] === letter && // * * *
        trialArray[1] === letter && // ' ' '
        trialArray[2] === letter || // ' ' '
  
        trialArray[3] === letter && // ' ' '
        trialArray[4] === letter && // * * *
        trialArray[5] === letter || // ' ' '
  
        trialArray[6] === letter && // ' ' '
        trialArray[7] === letter && // ' ' '
        trialArray[8] === letter || // * * *
  
        trialArray[0] === letter && // * ' '
        trialArray[3] === letter && // * ' '
        trialArray[6] === letter || // * ' '
  
        trialArray[1] === letter && // ' * '
        trialArray[4] === letter && // ' * '
        trialArray[7] === letter || // ' * '
  
        trialArray[2] === letter && // ' ' *
        trialArray[5] === letter && // ' ' *
        trialArray[8] === letter || // ' ' *
  
        trialArray[0] === letter && // * ' '
        trialArray[4] === letter && // ' * '
        trialArray[8] === letter || // ' ' *
  
        trialArray[2] === letter && // ' ' *
        trialArray[4] === letter && // ' * '
        trialArray[6] === letter    // * ' '
      ) {
        if (x) {
          return -10;
        } else {
          return 10;
        }
      } else if (trialArray.indexOf(' ') === -1) {
        return 0;
  
      } else {
        return 'no';
      }
    }
  });