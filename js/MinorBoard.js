(function(){
	angular
		.module('ticTacToeApp')
		.factory('MinorBoard', MinorBoardFunc);

	function MinorBoardFunc() {
		//0 = blank space, 1 = X, 2 = O
		// state: 0 no winner, 1 X wins, 2 O wins
		var CELL_STATE = ['unselected-cell', 'x-cell', 'o-cell'];
		

		var MinorBoard = function(parentBoard, size) {
			//variables
			this.cells = new Array(size);
			// this.currentPlayer = 0;
			this.state = 0;
			this.parentBoard = parentBoard;
			this.active = true;

			//methods
			this.makeMove = makeMove;
			this.init = init;
			// this.getPlayerPiece = getPlayerPiece;
			// this.changeTurn = changeTurn;
			this.getCellState = getCellState;
			this.checkForWin = checkForWin;
			this.getGameMessage = getGameMessage;
			this.isPlayable = isPlayable;
			this.setActive = setActive;
			this.valueOf = valueOf;

			this.init();

			function init() {
				for(var i = 0; i < this.cells.length; i++) {
					this.cells[i] = 0;
				}
			}

			function valueOf() {
				return this.state;
			}

			function checkForWin() {
				if(this.state === 0){
					return this.parentBoard.checkForWin(this.cells);
				}
				return this.state;

			}

			function makeMove(cellPosition) {
				if(this.cells[cellPosition] === 0 && this.active && this.parentBoard.gameState === 0) {
					this.cells[cellPosition] = this.parentBoard.getPlayerPiece();
					this.state = this.checkForWin();
					this.parentBoard.moveMade(cellPosition);
				}
			}

			// function getPlayerPiece() {
			// 	return this.parentBoard.getPlayerPiece();
			// }

			

			function getCellState(cellPosition) {
				return CELL_STATE[this.cells[cellPosition]];
			}

			
			function getGameMessage() {
				return MESSAGES[this.gameState];
			}

			function isPlayable() {
				for(var i = 0; i < this.cells.length; i++) {
					if(this.cells[i] === 0) {
						return true;
					}
				}
				return false;
			}

			function setActive(bool) {
				if(bool && this.isPlayable()) {
					this.active = true;
				}
				else{
					this.active = false;
				}
			}
		}

		return MinorBoard;
	}
})();