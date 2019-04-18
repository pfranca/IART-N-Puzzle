Direction = {
	LEFT: "left",
	RIGHT: "right",
	UP: "up",
	DOWN: "dow"
};

function NPuzzle(size, solve_func) {
	this.board = [];
	this.path = [];
	this.size = size;
	this.solve_func = solve_func;
	this.lastMove = null;
	for (var i = 0; i < size; i++) {
		this.board.push([]);
		for (var j = 0; j < size; j++) {
			if (i == this.size - 1 && j == this.size - 1) {
				this.board[i].push(0);
			} else {
				this.board[i].push(size * i + j + 1);
			}
		}
	}
};

NPuzzle.prototype.setBoard = function(board){
    this.board = board;
}

NPuzzle.prototype.setMethod = function(method){
    this.solve_func = method;
}

// Get the (x, y) position of the blank space
NPuzzle.prototype.getZeroPos = function() {
	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
			if (this.board[i][j] == 0) {
				return [i, j];
			}
		}
	}
};

// Swap two items on a bisizeal array
NPuzzle.prototype.swap = function(i1, j1, i2, j2) {
	var temp = this.board[i1][j1];
	this.board[i1][j1] = this.board[i2][j2];
	this.board[i2][j2] = temp;
}

// Return the direction that a piece can be moved, if any
NPuzzle.prototype.getMove = function(piece) {
	var blankSpacePosition = this.getZeroPos();
	var line = blankSpacePosition[0];
	var column = blankSpacePosition[1];
	if (line > 0 && piece == this.board[line-1][column]) {
		return Direction.DOWN;
	} else if (line < this.size - 1 && piece == this.board[line+1][column]) {
		return Direction.UP;
	} else if (column > 0 && piece == this.board[line][column-1]) {
		return Direction.RIGHT;
	} else if (column < this.size - 1 && piece == this.board[line][column+1]) {
		return Direction.LEFT;
	}
};

// Move a piece, if possible, and return the direction that it was moved
NPuzzle.prototype.move = function(piece) {
	var move = this.getMove(piece);
	if (move != null) {
		var blankSpacePosition = this.getZeroPos();
		var line = blankSpacePosition[0];
		var column = blankSpacePosition[1];
		switch (move) {
		case Direction.LEFT:
			this.swap(line, column, line, column + 1);
			break;
		case Direction.RIGHT:
			this.swap(line, column, line, column - 1);
			break;
		case Direction.UP:
			this.swap(line, column, line + 1, column);
			break;
		case Direction.DOWN:
			this.swap(line, column, line - 1, column);
			break;
		}
		if (move != null) {
			this.lastMove = piece;
		}
		return move;
	}
};

NPuzzle.prototype.isGoalState = function() {
	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
			var piece = this.board[i][j];
			if (piece != 0) {
				var originalLine = Math.floor((piece - 1) / this.size);
				var originalColumn = (piece - 1) % this.size;
				if (i != originalLine || j != originalColumn) return false;
			}
		}
	}
	return true;
};

// Return a copy of current puzzle
NPuzzle.prototype.getCopy = function() {
    var newNPuzzle = new NPuzzle(this.size);
    newNPuzzle.solve_func = this.solve_func;
	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
			newNPuzzle.board[i][j] = this.board[i][j];
		}
	}
	for (var i = 0; i < this.path.length; i++) {
		newNPuzzle.path.push(this.path[i]);
	}
	return newNPuzzle;
};

// Return all current allowed moves
NPuzzle.prototype.getAllowedMoves = function() {
	var allowedMoves = [];
	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
			var piece = this.board[i][j];
			if (this.getMove(piece) != null) {
				allowedMoves.push(piece);
			}
		}
	}
	return allowedMoves;
};

NPuzzle.prototype.visit = function() {
	var children = [];
	var allowedMoves = this.getAllowedMoves();
	for (var i = 0; i < allowedMoves.length; i++)  {
		var move = allowedMoves[i];
		if (move != this.lastMove) {
			var newInstance = this.getCopy();
			newInstance.move(move);
			newInstance.path.push(move);
			children.push(newInstance);
		}
	}
	return children;
};

NPuzzle.prototype.solveBFS = function() {
	var startingState = this.getCopy();
	startingState.path = [];
	var states = [startingState];
	while (states.length > 0) {
        console.log("BFSSSSSSSSSSSSSS");
        //console.log(state);
        var state = states[0];
        console.log(state);
		states.shift();
		if (state.isGoalState()) {
			return state.path;
		}
		states = states.concat(state.visit());
	}
};

NPuzzle.prototype.g = function() {
	return this.path.length;
};

NPuzzle.prototype.getManhattanDistance = function() {
    console.log("MANHATAN");
	var distance = 0;
	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
			var piece = this.board[i][j];
			if (piece != 0) {
				var originalLine = Math.floor((piece - 1) / this.size);
				var originalColumn = (piece - 1) % this.size;
				distance += Math.abs(i - originalLine) + Math.abs(j - originalColumn);
			}
		}
	}
	return distance;
};

NPuzzle.prototype.countMisplaced = function() {
    console.log("MISPLACED");
	var count = 0;
	for (var i = 0; i < this.size; i++) {
		for (var j = 0; j < this.size; j++) {
			var piece = this.board[i][j];
			if (piece != 0) {
				var originalLine = Math.floor((piece - 1) / this.size);
				var originalColumn = (piece - 1) % this.size;
				if (i != originalLine || j != originalColumn) count++;
			}
		}
	}	
	return count;
}

NPuzzle.prototype.h = function() {
	if (this.solve_func == "A*: Misplaced tiles") {
		return this.countMisplaced();
	} else {
		return this.getManhattanDistance();
	}
};

NPuzzle.prototype.solveA = function() {
    console.log("ASTAR");
	var states = new MinHeap(null, function(a, b) {
		return a.distance - b.distance;
	});
	this.path = [];
	states.push({puzzle: this, distance: 0});
	while (states.size() > 0) {
        //console.log("AQUIIIIIIIIIIII")
        var state = states.pop().puzzle;
        console.log(state);
		if (state.isGoalState()) {
			return state.path;
		}
		var children = state.visit();
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var f = child.g() + child.h();
			states.push({puzzle : child, distance: f});
		}
	}
};

NPuzzle.prototype.solve = function() {
	if (this.solve_func == "BFS") {
		return this.solveBFS();
	} else {
		return this.solveA();
	}
};
