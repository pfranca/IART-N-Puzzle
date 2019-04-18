function GUI($container, board, dimension, size, margin, speed, num_shuffles, solve_func) {
    this.$container = $container;
    console.log(this.$container);
    console.log(this.$container[0].attributes[0].value);
	this.dimension = dimension;
	this.size = size;
	this.margin = margin;
	this.speed = speed;
	//this.num_shuffles = num_shuffles;
    this.solve_func = solve_func;
    console.log(solve_func);
    this.puzzle = new NPuzzle(dimension, solve_func);
    this.puzzle.setBoard(board);
	this.drawBlocks();
	var self = this;
	
	$container.parent().find("#reset").on("click", function(){
        console.log(document.URL);
        
        let divId = self.$container[0].attributes[0].value;
        console.log(document.URL + ' #'+divId)
        $('#'+divId).load(document.URL + ' #'+divId);
    });

	$container.parent().find("#solve").on("click", function() {
        $container.parent().find("#elapsed").html("<< Solving... >>");
        let divId = self.$container[0].attributes[0].value;
        let idId = "algorithm"+divId;
        self.puzzle.setMethod(document.getElementById(idId).options[document.getElementById(idId).selectedIndex].value);
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

}

GUI.prototype.drawBlocks = function() {
    let divId = this.$container[0].attributes[0].value;
	for (var i = 0; i < this.dimension; i++) {
		for (var j = 0; j < this.dimension; j++) {
			if (!(this.puzzle.board[i][j] == 0)) {
				var id = this.puzzle.board[i][j];
				this.$container.append("<div id="+divId+"c"  + id + ">" + id + "</div>");
				var $e = this.$container.find("#"+divId+"c" + id);
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

GUI.prototype.move = function(id, direction) {
    let divId = this.$container[0].attributes[0].value;
	var block = this.$container.find("#" + divId + id);
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


GUI.prototype.solve = function(puzzle, path, callbackFunction) {
    //console.log(this.puzzle.getMethod());
    let divId = this.$container[0].attributes[0].value;
    let idId = "algorithm"+divId;
    this.puzzle.setMethod(document.getElementById(idId).options[document.getElementById(idId).selectedIndex].value);
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
