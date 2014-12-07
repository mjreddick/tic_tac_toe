(function() {
	angular
		.module('ticTacToeApp')
		.controller('TicTacToeController', TicTacToeController);

	TicTacToeController.$inject = ['MinorBoard'];

	function TicTacToeController(MinorBoard) {
		this.gameName = "tic tac toe";
		this.activeBoard = new MinorBoard();
		
		this.activeBoard.init();
	}
})();