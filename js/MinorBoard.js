(function(){
	angular
		.module('ticTacToeApp')
		.factory('MinorBoard', MinorBoardFunc);

	function MinorBoardFunc() {
		//0 = blank space, 1 = X, 2 = O
		var CELL_STATE = ['unselected-cell', 'x-cell', 'o-cell'];
		var PLAYER_PIECE = [1, 2];
		var MESSAGES = ['Play On!', 'Red Wins!', 'Blue Wins!', "Cat's Game"];

		var MinorBoard = function() {
			//variables
			this.cells = new Array(9);
			this.currentPlayer = 0;
			this.gameState = 0;

			//methods
			this.makeMove = makeMove;
			this.init = init;
			this.getPlayerPiece = getPlayerPiece;
			this.changeTurn = changeTurn;
			this.getCellState = getCellState;
			this.checkForWin = checkForWin;
			this.getGameMessage = getGameMessage;

			function init() {
				for(var i = 0; i < this.cells.length; i++) {
					this.cells[i] = 0;
				}
			}

			function makeMove(cellPosition) {
				if(this.cells[cellPosition] === 0 && this.gameState === 0) {
					this.cells[cellPosition] = this.getPlayerPiece();
					this.changeTurn();
					this.gameState = this.checkForWin();

				}
			}

			function getPlayerPiece() {
				return PLAYER_PIECE[this.currentPlayer];
			}

			function changeTurn() {
				this.currentPlayer = (this.currentPlayer + 1) % PLAYER_PIECE.length;
			}

			function getCellState(cellPosition) {
				return CELL_STATE[this.cells[cellPosition]];
			}

			function checkForWin() {
				//returns a 0 for no win, 1 for X win, 2 for O win, and 3 for cat's game

				for(var i = 0; i < 3; i++) {
					//check verticle
					if(		this.cells[i].valueOf()		=== this.cells[i + 3].valueOf() 
						&& 	this.cells[i + 3].valueOf()	=== this.cells[i + 6].valueOf() 
						&& 	this.cells[i].valueOf()		!== 0) 
					{
						return this.cells[i].valueOf();
					}
					//check horizontal
					var j = i * 3;
					if(		this.cells[j].valueOf()		=== this.cells[j + 1].valueOf() 
						&& 	this.cells[j + 1].valueOf()	=== this.cells[j + 2].valueOf() 
						&& 	this.cells[j].valueOf()		!== 0) 
					{
						return this.cells[j].valueOf();
					}
				}
				//check diagonals
				if(		this.cells[0].valueOf() === this.cells[4].valueOf() 
					&&	this.cells[4].valueOf() === this.cells[8].valueOf() 
					&&	this.cells[0].valueOf() !== 0)
				{
					return this.cells[0].valueOf();
				}
				if(		this.cells[2].valueOf() === this.cells[4].valueOf() 
					&&	this.cells[4].valueOf() === this.cells[6].valueOf() 
					&&	this.cells[2].valueOf() !== 0) 
				{
					return this.cells[2].valueOf();
				}

				for(var i = 0; i < this.cells.length; i++) {
					if(this.cells[i].valueOf() === 0) {
						return 0;
					}
				}
				return 3;
			}
		}

		function getGameMessage() {
			return MESSAGES[this.gameState];
		}


		return MinorBoard;
	}
})();