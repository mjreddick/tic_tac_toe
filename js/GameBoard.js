(function(){
	angular
		.module('ticTacToeApp')
		.factory('GameBoard', GameBoardFunc);

	GameBoardFunc.$inject = ['MinorBoard', '$firebase'];

	function GameBoardFunc(MinorBoard, $firebase) {

		var URL = "https://3-t.firebaseio.com";
		var PLAYER_PIECE = [1, 2];
		var MESSAGES = ['Play On!', 'Red Wins!', 'Blue Wins!', "Cat's Game"];
		var CELL_STATE = ['unselected', 'x-selected', 'o-selected'];
		var MINORBOARD_STATE = ['minor-no-win', 'x-minor-win','o-minor-win', 'minor-cat-game'];
		var ACTIVE_STYLES = ['x-active', 'o-active'];
		var DISPLAY_STYLES = ['show-top', 'show-back'];
		var CHAT_STYLES = ['show-top', 'show-back', 'show-front'];

		var GameBoard = function() {
			//capture variable
			var self = this;

			//private variables
			var displayState = 0; //0 is start screen, 1 is game board
			var chatDisplay = 0; //0 is no chat, 1 is game chat, 2 is global chat

			//public properties
			self.gameState = null;
			self.localPlayer = null;
			self.playerName = "";
			self.waiting = false;
			self.gameChat = null;
			self.globalChat = null;
			self.gameChatMessage = "";
			self.globalChatMessage = "";

			//public methods
			self.makeMove = makeMove;
			self.getPlayerPiece = getPlayerPiece;
			self.getCellState = getCellState;
			self.getMinorBoardStyle = getMinorBoardStyle;
			self.playerNameSubmitted = playerNameSubmitted;
			self.getDisplayState = getDisplayState;
			self.winningMessage = winningMessage;
			self.resetGame = resetGame;
			self.sendGameChatMessage = sendGameChatMessage;
			self.getChatDisplayState = getChatDisplayState;
			self.switchToGlobalChat = switchToGlobalChat;
			self.switchToGameChat = switchToGameChat;
			self.sendGlobalChatMessage = sendGlobalChatMessage;


			//initialization
			//Note: initialization happens after a player enters their name
			function init() {
				var gameNum = null;
				var ref = new Firebase(URL + "/numplayers");
				var numPlayersRef = $firebase(ref);
				numPlayersRef
					.$transaction(updateNumPlayers)
					.then(initGame);

				//init helper functions
				function updateNumPlayers(numPlayers) {
					if(!numPlayers) {
						return 1;
					}
					return numPlayers + 1;
				}

				function initGame(snapShot) {
					var numPlayers = snapShot.val();
					gameNum = Math.floor((numPlayers - 1) / 2);
					self.localPlayer = (numPlayers - 1) % 2;
					self.gameState = getGameState();
					self.gameChat = getgameChat();
					self.globalChat = getGlobalChat();
					self.gameState.$loaded().then(initGameState);

					// self.globalChat.$add({name: self.playerName, message: "This is a Test"})

					// initGame helper functions

					function getGameState(){
						var ref = new Firebase(URL + "/game" + gameNum);
						var gameState = $firebase(ref).$asObject();
						return gameState;
					}

					function getgameChat(){
						var ref = new Firebase(URL + "/chat" + gameNum);
						var gameChat = $firebase(ref).$asArray();
						gameChat.$watch(scrollGameChat);
						return gameChat;

						function scrollGameChat() {
							setTimeout(function(){
								var elem = document.getElementById("game-chat-display");
								elem.scrollTop = elem.scrollHeight;
							}, 500);
						}
					}

					function getGlobalChat(){
						var ref = new Firebase(URL + "/globalchat");
						var globalChat = $firebase(ref).$asArray();
						globalChat.$watch(scrollGlobalChat);
						return globalChat;

						function scrollGlobalChat() {
							setTimeout(function(){
								var elem = document.getElementById("global-chat-display");
								elem.scrollTop = elem.scrollHeight;
							}, 500);
						}
					}

					function initGameState() {
						if(self.gameState.gameStatus === undefined) {
							self.gameState.minorBoards = new Array(9);
							for(var i = 0; i < self.gameState.minorBoards.length; i++) {
									self.gameState.minorBoards[i] = new MinorBoard();
									self.gameState.minorBoards[i].active = true;
								}
							self.gameState.currentPlayer = 0;
							self.gameState.gameStatus = 0;
							self.gameState.numPlayers = 1;
							self.gameState.playerNames = [];
							self.gameState.scores = [0, 0];
						}
						else {
							self.gameState.numPlayers = 2;
						}
						self.gameState.playerNames[self.localPlayer] = self.playerName;
						self.gameState.$save();
					}
				}
			};

			//method declarations
			function playerNameSubmitted() {
				if(self.playerName.length > 0) {
					self.waiting = true;
					init();
				}
			}

			function makeMove(boardIndex, cellIndex) {
				if(self.gameState.minorBoards[boardIndex].cells[cellIndex] === 0 
					&& self.gameState.minorBoards[boardIndex].active 
					&& self.gameState.gameStatus === 0
					&& self.localPlayer === self.gameState.currentPlayer) 
				{
					self.gameState.minorBoards[boardIndex].cells[cellIndex] = self.getPlayerPiece();
					self.gameState.minorBoards[boardIndex].status = checkForWin(self.gameState.minorBoards[boardIndex].cells);
					var winner = checkForWin(self.gameState.minorBoards);
					self.gameState.gameStatus = winner;
					if(winner !== 0) {
						// game over
						for(var i = 0; i < self.gameState.minorBoards.length; i++) {
							//set all minor boards to inactive
							self.gameState.minorBoards[i].active = false;
						}
						self.gameState.currentPlayer = null; //this way no one is the current player 
						if(winner === 1 || winner === 2) {
							self.gameState.scores[winner - 1]++;
						}
					}
					else {
						changePlayer();
						setActiveState(cellIndex);
					}
					
					self.gameState.$save();
					
				}
			}

			function getDisplayState() {
				if(self.gameState === null){
					displayState = 0;
				}
				else { 
					if (typeof self.gameState.numPlayers === "undefined") {
						displayState = 0;
					}
					else if(self.gameState.numPlayers === 2){
						displayState = 1;
					}
					else {
						displayState = 0;
					}
				}
				return DISPLAY_STYLES[displayState];
			}

			function getChatDisplayState() {
				if(self.gameState === null){
					chatDisplay = 0;
				}
				else { 
					if (typeof self.gameState.numPlayers === "undefined") {
						chatDisplay = 0;
					}
					else if(self.gameState.numPlayers === 2){
						if(chatDisplay === 0){
							chatDisplay = 1;
						}	
					}
					else {
						chatDisplay = 0;
					}
				}
				return CHAT_STYLES[chatDisplay];
			}


			function getPlayerPiece() {
				return PLAYER_PIECE[self.gameState.currentPlayer]
			}

			function getCellState(boardIndex, cellIndex) {
				return CELL_STATE[self.gameState.minorBoards[boardIndex].cells[cellIndex]];
			}

			function getMinorBoardStyle(boardIndex) {
				var minorBoard = self.gameState.minorBoards[boardIndex];
				var styles = []
				styles.push(MINORBOARD_STATE[minorBoard.status])
				if(minorBoard.active) {
					styles.push(ACTIVE_STYLES[self.gameState.currentPlayer]);
				}
				return styles;
			}

			function winningMessage() {
				var winner = null;
				if(self.gameState){
					winner = self.gameState.gameStatus;
					if(winner === 3) {
						return "Cat's Game!"
					}
					else if(winner === 1 || winner == 2) {
						return self.gameState.playerNames[winner - 1] + " Wins!";
					}
				}
				return "";
			}

			function resetGame() {
				for(var i = 0; i < self.gameState.minorBoards.length; i++) {
						self.gameState.minorBoards[i].active = true;
						self.gameState.minorBoards[i].status = 0;
						for(var j = 0; j < self.gameState.minorBoards[i].cells.length; j++) {
							self.gameState.minorBoards[i].cells[j] = 0;
						}
					}
				self.gameState.currentPlayer = Math.floor(Math.random() * 2);
				self.gameState.gameStatus = 0;
				self.gameState.$save();
			}

			function sendGameChatMessage() {
				if(self.gameChatMessage.length > 0){
					self.gameChat.$add({name: self.playerName, message: self.gameChatMessage});
					self.gameChatMessage = "";
				}
			}

			function sendGlobalChatMessage() {
				if(self.globalChatMessage.length > 0){
					self.globalChat.$add({name: self.playerName, message: self.globalChatMessage});
					self.globalChatMessage = "";
				}
			}

			function switchToGlobalChat() {
				chatDisplay = 2;
			}

			function switchToGameChat() {
				chatDisplay = 1;
			}

			//Private method declarations
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

			function changePlayer() {
				self.gameState.currentPlayer = (self.gameState.currentPlayer + 1) % PLAYER_PIECE.length;
			}

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
					if(cells[i] === cells[i + 3] && cells[i + 3] === cells[i + 6] && cells[i] !== 0) 
					{
						return cells[i];
					}
					//check horizontal
					var j = i * 3;
					if(cells[j] === cells[j + 1] && cells[j + 1] === cells[j + 2] && cells[j] !== 0) 
					{
						return cells[j];
					}
				}
				//check diagonals
				if(cells[0] === cells[4] &&	cells[4] === cells[8] && cells[0] !== 0)
				{
					return cells[0];
				}
				if(cells[2] === cells[4] &&	cells[4] === cells[6] && cells[2] !== 0) 
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