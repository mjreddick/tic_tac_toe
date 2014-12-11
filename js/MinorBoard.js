(function(){
	angular
		.module('ticTacToeApp')
		.factory('MinorBoard', MinorBoardFunc);

	function MinorBoardFunc() {
		// in cells: 0 = blank space, 1 = X, 2 = O
		// status: 0 no winner, 1 X wins, 2 O wins		

		var MinorBoard = function() {//(parentBoard, size) {

			//properties
			// 0 = blank space, 1 = X, 2 = O
			this.cells = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			// 0 no winner, 1 X wins, 2 O wins
			this.status = 0;
			//keeps track of whether or not the board can be played on
			this.active = true;
		}

		return MinorBoard;
	}
})();