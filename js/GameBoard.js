(function(){
	angular
		.module('ticTacToeApp')
		.factory('GameBoard', GameBoardFunc);

	GameBoardFunc.$inject = ['MinorBoard'];

	function GameBoardFunc(MinorBoard) {

		var PLAYER_PIECE = [1, 2];
		var MESSAGES = ['Play On!', 'Red Wins!', 'Blue Wins!', "Cat's Game"];

		var GameBoard = function(boardSize, minorBoardSize) {
			//properties
			this.cells = new Array(boardSize);
			this.currentPlayer = 0;
			this.gameState = 0;
			
			//methods
			this.init = init;
			this.resetBoard = resetBoard;
			this.moveMade = moveMade;
			this.checkForWin = checkForWin;
			this.changePlayer = changePlayer;
			this.getPlayerPiece = getPlayerPiece;

			//initialization
			this.init();

			//method declarations
			function init() {
				for(var i = 0; i < this.cells.length; i++) {
						this.cells[i] = new MinorBoard(this, minorBoardSize);
						this.cells[i].active = 1;
					}
				// this.gameState = 0;
				// currentPlayer = 0;

			}

			function getPlayerPiece() {
				return PLAYER_PIECE[this.currentPlayer]
			}

			function resetBoard() {
				for(var i = 0; i < this.cells.length; i++) {
						this.cells[i].init();
						this.cells[i].active = 1;
					}
				this.gameState = 0;
				currentPlayer = 0;
			}

			function changePlayer() {
				this.currentPlayer = (this.currentPlayer + 1) % PLAYER_PIECE.length;
			}

			function moveMade(index) {
				this.gameState = this.checkForWin(this.cells); 
				this.changePlayer();
				if(this.cells[index].isPlayable()) {
					//set all cells boardActive to false
					//except cells[index] which gets set to true
					for(var i = 0; i < this.cells.length; i++) {
						if(i === index) {
							this.cells[i].setActive(true);
						}
						else {
							this.cells[i].setActive(false);
						}
					}
				}
				else {
					//set all cells boardActive to true
					for(var i = 0; i < this.cells.length; i++) {
						this.cells[i].setActive(true);
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