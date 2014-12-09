(function(){
	angular
		.module('ticTacToeApp')
		.factory('MinorBoard', MinorBoardFunc);

	function MinorBoardFunc() {
		//0 = blank space, 1 = X, 2 = O
		// state: 0 no winner, 1 X wins, 2 O wins
		var CELL_STATE = ['unselected-cell', 'x-cell', 'o-cell'];
		

		var MinorBoard = function(parentBoard, size) {
			//private variables
			var self = this;

			//properties
			self.cells = new Array(size);
			// self.currentPlayer = 0;
			self.state = 0;
			self.parentBoard = parentBoard;
			self.active = true;

			//methods
			self.makeMove = makeMove;
			self.init = init;
			// self.getPlayerPiece = getPlayerPiece;
			// self.changeTurn = changeTurn;
			self.getCellState = getCellState;
			self.checkForWin = checkForWin;
			self.getGameMessage = getGameMessage;
			self.isPlayable = isPlayable;
			self.setActive = setActive;
			self.valueOf = valueOf;

			self.init();

			function init() {
				for(var i = 0; i < self.cells.length; i++) {
					self.cells[i] = 0;
				}
			}

			function valueOf() {
				return self.state;
			}

			function checkForWin() {
				if(self.state === 0){
					return self.parentBoard.checkForWin(self.cells);
				}
				return self.state;

			}

			function makeMove(cellPosition) {
				if(self.cells[cellPosition] === 0 && self.active && self.parentBoard.gameState === 0) {
					self.cells[cellPosition] = self.parentBoard.getPlayerPiece();
					self.state = self.checkForWin();
					self.parentBoard.moveMade(cellPosition);
				}
			}

			// function getPlayerPiece() {
			// 	return self.parentBoard.getPlayerPiece();
			// }

			

			function getCellState(cellPosition) {
				return CELL_STATE[self.cells[cellPosition]];
			}

			
			function getGameMessage() {
				return MESSAGES[self.gameState];
			}

			function isPlayable() {
				for(var i = 0; i < self.cells.length; i++) {
					if(self.cells[i] === 0) {
						return true;
					}
				}
				return false;
			}

			function setActive(bool) {
				if(bool && self.isPlayable()) {
					self.active = true;
				}
				else{
					self.active = false;
				}
			}
		}

		return MinorBoard;
	}
})();