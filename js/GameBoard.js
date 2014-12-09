(function(){
	angular
		.module('ticTacToeApp')
		.factory('GameBoard', GameBoardFunc);

	GameBoardFunc.$inject = ['MinorBoard'];

	function GameBoardFunc(MinorBoard) {

		var PLAYER_PIECE = [1, 2];
		var MESSAGES = ['Play On!', 'Red Wins!', 'Blue Wins!', "Cat's Game"];

		var GameBoard = function(boardSize, minorBoardSize) {
			//private variables
			var self = this;

			//properties
			self.cells = new Array(boardSize);
			self.currentPlayer = 0;
			self.gameState = 0;
			

			//methods
			self.init = init;
			self.resetBoard = resetBoard;
			self.moveMade = moveMade;
			self.checkForWin = checkForWin;
			self.changePlayer = changePlayer;
			self.getPlayerPiece = getPlayerPiece;

			//initialization
			self.init();

			//method declarations
			function init() {
				for(var i = 0; i < self.cells.length; i++) {
						self.cells[i] = new MinorBoard(self, minorBoardSize);
						self.cells[i].active = 1;
					}
				// this.gameState = 0;
				// currentPlayer = 0;

			}

			function getPlayerPiece() {
				return PLAYER_PIECE[self.currentPlayer]
			}

			function resetBoard() {
				for(var i = 0; i < self.cells.length; i++) {
						self.cells[i].init();
						self.cells[i].active = 1;
					}
				self.gameState = 0;
				currentPlayer = 0;
			}

			function changePlayer() {
				self.currentPlayer = (self.currentPlayer + 1) % PLAYER_PIECE.length;
			}

			function moveMade(index) {
				self.gameState = self.checkForWin(self.cells); 
				self.changePlayer();
				if(self.cells[index].isPlayable()) {
					//set all cells boardActive to false
					//except cells[index] which gets set to true
					for(var i = 0; i < self.cells.length; i++) {
						if(i === index) {
							self.cells[i].setActive(true);
						}
						else {
							self.cells[i].setActive(false);
						}
					}
				}
				else {
					//set all cells boardActive to true
					for(var i = 0; i < self.cells.length; i++) {
						self.cells[i].setActive(true);
					}

				}
			}


			function checkForWin(cells) {
				//returns a 0 for no win, 1 for X win, 2 for O win, and 3 for cat's game

				for(var i = 0; i < 3; i++) {
					//check verticle
					if(		cells[i].valueOf()		=== cells[i + 3].valueOf() 
						&& 	cells[i + 3].valueOf()	=== cells[i + 6].valueOf() 
						&& 	cells[i].valueOf()		!== 0) 
					{
						return cells[i].valueOf();
					}
					//check horizontal
					var j = i * 3;
					if(		cells[j].valueOf()		=== cells[j + 1].valueOf() 
						&& 	cells[j + 1].valueOf()	=== cells[j + 2].valueOf() 
						&& 	cells[j].valueOf()		!== 0) 
					{
						return cells[j].valueOf();
					}
				}
				//check diagonals
				if(		cells[0].valueOf() === cells[4].valueOf() 
					&&	cells[4].valueOf() === cells[8].valueOf() 
					&&	cells[0].valueOf() !== 0)
				{
					return cells[0].valueOf();
				}
				if(		cells[2].valueOf() === cells[4].valueOf() 
					&&	cells[4].valueOf() === cells[6].valueOf() 
					&&	cells[2].valueOf() !== 0) 
				{
					return cells[2].valueOf();
				}

				for(var i = 0; i < cells.length; i++) {
					if(cells[i].valueOf() === 0) {
						return 0;
					}
				}
				return 3;
			}
		}
		return GameBoard;
	}
})()