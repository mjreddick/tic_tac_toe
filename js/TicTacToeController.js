(function() {
	angular
		.module('ticTacToeApp')
		.controller('TicTacToeController', TicTacToeController);

	TicTacToeController.$inject = ['GameBoard'];

	function TicTacToeController(GameBoard) {
		this.gameName = "tic tac toe";
		this.activeBoard = new GameBoard();
		
		this.activeBoard.init();
	}
})();