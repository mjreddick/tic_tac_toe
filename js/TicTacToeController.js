(function() {
	angular
		.module('ticTacToeApp')
		.controller('TicTacToeController', TicTacToeController);

	TicTacToeController.$inject = ['GameBoard'];

	function TicTacToeController(GameBoard) {
		this.gameName = "tic tac toe";
		this.gameBoard = new GameBoard(9, 9);
		
	}
})();