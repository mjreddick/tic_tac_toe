(function(){
	angular
		.module('ticTacToeApp')
		.factory('GameBoard', GameBoardFunc);

	GameBoardFunc.$inject = ['MinorBoard'];

	function GameBoardFunc(MinorBoard) {

		var PLAYER_PIECE = [1, 2];
		var MESSAGES = ['Play On!', 'Red Wins!', 'Blue Wins!', "Cat's Game"];
		var CELL_STATE = ['unselected-cell', 'x-cell', 'o-cell'];

		var GameBoard = function() {
			//private variables
			var self = this;

			//properties
			// self.minorBoards = new Array(9);
			// self.currentPlayer = null;
			// self.gameState = null;

			self.gameState = {minorBoards: new Array(9),
							currentPlayer: null,
							gameStatus: null};
			

			//methods
			// self.init = init;
			// self.resetBoard = resetBoard;
			self.makeMove = makeMove;
			// self.moveMade = moveMade;
			self.checkForWin = checkForWin;
			self.changePlayer = changePlayer;
			self.getPlayerPiece = getPlayerPiece;
			self.getCellState = getCellState;
			self.isPlayable = isPlayable;
			self.setActiveState = setActiveState;

			//initialization

			
			(function init() {
				for(var i = 0; i < self.gameState.minorBoards.length; i++) {
						self.gameState.minorBoards[i] = new MinorBoard();
						self.gameState.minorBoards[i].active = 1;
					}
				self.gameState.currentPlayer = 0;
				self.gameState.gameStatus = 0;

				// this.gameState = 0;
				// currentPlayer = 0;

			})()

			//method declarations

			function makeMove(boardIndex, cellIndex) {
				if(self.gameState.minorBoards[boardIndex].cells[cellIndex] === 0 
					&& self.gameState.minorBoards[boardIndex].active 
					&& self.gameState.gameStatus === 0) 
				{
					self.gameState.minorBoards[boardIndex].cells[cellIndex] = self.getPlayerPiece();
					self.gameState.minorBoards[boardIndex].status = self.checkForWin(self.gameState.minorBoards[boardIndex].cells);// might need two win checkers
					// self.parentBoard.moveMade(cellPosition);
					self.gameState.gameStatus = self.checkForWin(self.gameState.minorBoards);
					self.changePlayer();
					self.setActiveState(cellIndex);
					
				}
			}

			function getCellState(boardIndex, cellIndex) {
				return CELL_STATE[self.gameState.minorBoards[boardIndex].cells[cellIndex]];
			}

			function isPlayable(minorBoard) {
				//Tells you if any spaces are left that can be moved to
				//on a minor board
				for(var i = 0; i < minorBoard.cells.length; i++) {
					if(minorBoard.cells[i] === 0) {
						return true;
					}
				}
				return false;
			}

			function setActiveState(index) {
				if(isPlayable(self.gameState.minorBoards[index])) {
					//set all minorboards active to false
					//except the one at index
					for(var i = 0; i < self.gameState.minorBoards.length; i++) {
						if(i === index) {
							self.gameState.minorBoards[i].active = true;
						}
						else {
							self.gameState.minorBoards[i].active = false;
						}
					}
				}
				else {
					//set all cells boardActive to true unless they aren't playable
					for(var i = 0; i < self.gameState.minorBoards.length; i++) {
						self.gameState.minorBoards[i].active = isPlayable(self.gameState.minorBoards[i]);
					}

				}

			}

			function getPlayerPiece() {
				return PLAYER_PIECE[self.gameState.currentPlayer]
			}

			// function resetBoard() {
			// 	for(var i = 0; i < self.cells.length; i++) {
			// 			self.cells[i].init();
			// 			self.cells[i].active = 1;
			// 		}
			// 	self.gameState = 0;
			// 	currentPlayer = 0;
			// }

			function changePlayer() {
				self.gameState.currentPlayer = (self.gameState.currentPlayer + 1) % PLAYER_PIECE.length;
			}

			// function moveMade(index) {
			// 	self.gameState = self.checkForWin(self.cells); 
			// 	self.changePlayer();
			// 	if(self.cells[index].isPlayable()) {
			// 		//set all cells boardActive to false
			// 		//except cells[index] which gets set to true
			// 		for(var i = 0; i < self.cells.length; i++) {
			// 			if(i === index) {
			// 				self.cells[i].setActive(true);
			// 			}
			// 			else {
			// 				self.cells[i].setActive(false);
			// 			}
			// 		}
			// 	}
			// 	else {
			// 		//set all cells boardActive to true
			// 		for(var i = 0; i < self.cells.length; i++) {
			// 			self.cells[i].setActive(true);
			// 		}

			// 	}
			// }


			function checkForWin(arr) {
				//returns a 0 for no win, 1 for X win, 2 for O win, and 3 for cat's game
				//fix this and all should be well!!!
				var cells = new Array(arr.length);
				if(typeof(arr[0]) === "object") {
					//this means you're being passed an array of minor boards
					for(var i = 0; i < arr.length; i ++) {
						cells[i] = arr[i].status;
					}
				}

				else {
					cells = arr;
				}

				for(var i = 0; i < 3; i++) {
					//check verticle
					if(		cells[i]		=== cells[i + 3]
						&& 	cells[i + 3]	=== cells[i + 6] 
						&& 	cells[i]		!== 0) 
					{
						return cells[i];
					}
					//check horizontal
					var j = i * 3;
					if(		cells[j]		=== cells[j + 1] 
						&& 	cells[j + 1]	=== cells[j + 2] 
						&& 	cells[j]		!== 0) 
					{
						return cells[j];
					}
				}
				//check diagonals
				if(		cells[0] === cells[4] 
					&&	cells[4] === cells[8] 
					&&	cells[0] !== 0)
				{
					return cells[0];
				}
				if(		cells[2] === cells[4] 
					&&	cells[4] === cells[6] 
					&&	cells[2] !== 0) 
				{
					return cells[2];
				}

				for(var i = 0; i < cells.length; i++) {
					if(cells[i] === 0) {
						return 0;
					}
				}
				return 3;
			}
		}
		return GameBoard;
	}
})()