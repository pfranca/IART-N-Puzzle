function PuzzleGUI($container, dimension, size, margin, speed, num_shuffles, solve_func) {
	this.$container = $container;
	this.dimension = dimension;
	this.size = size;
	this.margin = margin;
	this.speed = speed;
	this.num_shuffles = num_shuffles;
    this.solve_func = solve_func;
    console.log(solve_func);
    this.puzzle = new NPuzzle(dimension, solve_func);
    this.puzzle.setBoard([[1,2,3],[5,0,6],[4,7,8]]);
	this.drawBlocks();
	var self = this;
	var shuffleFunc = function() {
		$container.parent().find("#shuffle").attr("disabled", "disabled");
		$container.parent().find("#solve").attr("disabled", "disabled");
		self.shuffle(self.puzzle, self.num_shuffles, function() {
			$container.parent().find("#shuffle").removeAttr("disabled");
			$container.parent().find("#solve").removeAttr("disabled");
		});
	}; 
	$container.parent().find("#shuffle").on("click", shuffleFunc);
    //shuffleFunc();
	$container.parent().find("#solve").on("click", function() {
        $container.parent().find("#elapsed").html("<< Solving... >>");
        self.puzzle.setMethod(document.getElementById("algorithm").options[document.getElementById("algorithm").selectedIndex].value);
		var start_time = new Date();
		var path = self.puzzle.solve();
		var elapsed = (new Date() - start_time) / 1000.0;
		$container.parent().find("#elapsed").html(elapsed);
		$container.parent().find("#shuffle").attr("disabled", "disabled");
		$container.parent().find("#solve").attr("disabled", "disabled");
		self.solve(self.puzzle, path, function() {
			$container.parent().find("#shuffle").removeAttr("disabled");
			$container.parent().find("#solve").removeAttr("disabled");
		});
	});
	$container.find("div").on("click", function() {
		var id = $(this).attr("id");
		var num = parseInt(id.slice(1));
		var direction = self.puzzle.move(num);
		if (direction != null) {
			self.move(id, direction);
		}
	});
}

PuzzleGUI.prototype.drawBlocks = function() {
	for (var i = 0; i < this.dimension; i++) {
		for (var j = 0; j < this.dimension; j++) {
			if (!(this.puzzle.board[i][j] == 0)) {
				var id = this.puzzle.board[i][j];
				this.$container.append("<div id='c" + id + "'>" + id + "</div>");
				var $e = this.$container.find("#c" + id);
				$e.css("left", j * (this.size + this.margin));
				$e.css("top", i * (this.size + this.margin));
				$e.css("width", this.size + "px");
				$e.css("height", this.size + "px");
				$e.css("font-size", this.size * 0.7);
			} 
		}
		this.$container.append("<br/>");
	}
	this.$container.css("width", (this.size + this.margin) * this.dimension);
	this.$container.css("height", (this.size + this.margin) * this.dimension);	
}

PuzzleGUI.prototype.move = function(id, direction) {
	var block = this.$container.find("#" + id);
	var distance = this.size + this.margin;
	switch (direction) {
		case "left":
			block.animate({
				left:"-=" + distance + "px"
			}, this.speed);
			break;
		case "right":
			block.animate({
				left:"+=" + distance + "px"
			},  this.speed);
			break;
		case "up":
			block.animate({
				top:"-=" + distance + "px"
			}, this.speed);
			break;
		case "down":
			block.animate({
				top:"+=" + distance + "px"
			}, this.speed);
			break;
	}
}

PuzzleGUI.prototype.randomMove = function(puzzle, lastMove) {
	var allowedMoves = puzzle.getAllMoves();
	var rand;
	do {
		rand = Math.floor(Math.random() * allowedMoves.length);
	} while (lastMove == allowedMoves[rand]);
	var movingBlock = allowedMoves[rand];
	var direction = puzzle.move(movingBlock);
	this.move("c" + movingBlock, direction);
	return movingBlock;
}

PuzzleGUI.prototype.shuffle = function(puzzle, times, callbackFunction, lastMove) {
	if (times <= 0) {
		callbackFunction();
		return;
	}
	var movedBlock = this.randomMove(puzzle, lastMove);
	var self = this;
	setTimeout(function() {
		self.shuffle(puzzle, times - 1, callbackFunction, movedBlock);
	}, this.speed);
}

PuzzleGUI.prototype.solve = function(puzzle, path, callbackFunction) {
    //console.log(this.puzzle.getMethod());
    this.puzzle.setMethod(document.getElementById("algorithm").options[document.getElementById("algorithm").selectedIndex].value);
   // console.log(this.puzzle.getMethod());
	if (path.length == 0) {
		callbackFunction();
		return;
	}
	var movingBlock = path.shift();
	var direction = puzzle.move(movingBlock);
	this.move("c" + movingBlock, direction);
	var self = this;
	setTimeout(function() {
		self.solve(puzzle, path, callbackFunction);
	}, this.speed);
}
