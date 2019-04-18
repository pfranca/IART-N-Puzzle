
//Initialize a size*size filled board
function NPuzzle(size, method){
    this.size = size;
    this.board = [];
    this.path = [];
    this.previousMove = null;
    this.method = method;

    for(let i = 0; i<size; i++){
        this.board.push([]);
        for(let j = 0; j<size; j++){
            if(i == this.size-1 && j == this.size-1){
                this.board[i].push(0);
            } else{
                this.board[i].push(size*i+j+1);
            }
        }
    }
    
    //console.log(this.board);
};

NPuzzle.prototype.setBoard = function(board){
    this.board = board;
}

NPuzzle.prototype.setMethod = function(method){
    this.method = method;
}

NPuzzle.prototype.getMethod = function(){
    return this.method;
}

//kinda, like... a hacky javascript version of a copy constructor...
NPuzzle.prototype.getCopy = function(){
    let newInstance = new NPuzzle(this.size);
    for(let i = 0; i<this.size; i++){
        for(let j = 0; j<this.size; j++){
            newInstance.board[i][j] = this.board[i][j];
        }
    }
    for( let i = 0; i<this.path.length; i++){
        newInstance.path.push(this.path[i]);
    }
    return newInstance; 
};


//get the position of the "empty" cell
NPuzzle.prototype.getZeroPosition = function() {
    for(let i = 0; i<this.size; i++){
        for(let j = 0; j<this.size; j++){
            if(this.board[i][j] == 0){
                return [i, j];
            }
        }
    }
};

//swap two board cells
NPuzzle.prototype.swap = function(i1, j1, i2, j2){
    let aux = this.board[i1][j1];
    this.board[i1][j1] = this.board[i2][j2];
    this.board[i2][j2] = aux;
};

//get possible move for specific cell
NPuzzle.prototype.getMove = function(cell){
    let zeroPosition = this.getZeroPosition();
    let row = zeroPosition[0];
    let column = zeroPosition[1];

    if(row > 0 && cell == this.board[row-1][column]){
        return "down";
    } else if(row < this.size-1 && cell == this.board[row+1][column]){
        return "up";
    } else if(column > 0 && cell == this.board[row][column-1]){
        return "right";
    } else if(column < this.size-1 && cell == this.board[row][column+1]){
        return "left";
    }
};

//move a specific cell nad return the direction it was moved
NPuzzle.prototype.move = function(cell){    
    let move = this.getMove(cell);
    if(move != null){
        let zeroPosition = this.getZeroPosition();
        let row = zeroPosition[0];
        let column = zeroPosition[1];

        switch(move){
            case "left":
                this.swap(row, column, row, column + 1);
                break;
            case "right":
                this.swap(row, column, row, column - 1);
                break;
            case "up":
                this.swap(row, column, row + 1, column);
                break;
            case "down":
                this.swap(row, column, row - 1, column);
                break;
        }
        if(move != null){
            this.previousMove = cell;
        }
        return move;
    }
}

//check if the puzzle is in the final state;
NPuzzle.prototype.isFinal = function(){
    for(let i = 0; i<this.size; i++){
        for(let j = 0; j<this.size; j++){
            let cell = this.board[i][j];
            if(cell != 0){
                let finalRow = Math.floor((cell - 1) / this.size);
                let finalColumn = (cell - 1) % this.size;
                if (i != finalRow || j != finalColumn){
                    return false;
                } 
            }
        }
    }
    return true;
};

//get all possible moves from a given state of the board.
NPuzzle.prototype.getAllMoves = function(){
    let allMoves = [];
    for(let i = 0; i<this.size; i++){
        for(let j = 0; j<this.size; j++){
            let cell = this.board[i][j];
            if(this.getMove(cell) != null){
                allMoves.push(cell);
            }
        }
    }
    return allMoves;
};

NPuzzle.prototype.visit = function(){
    let children = [];
    let allMoves = this.getAllMoves();
    for(let i = 0; i<allMoves.length; i++){
        let move = allMoves[i];
        if(move != this.previousMove){
            let newInstance = this.getCopy();
            newInstance.move(move);
            newInstance.path.push(move);
            children.push(newInstance);
        }
    }
    return children;
};

//------------------------BFS-----------------------

NPuzzle.prototype.runBFS = function(){
    console.log("bfs logic");
    let initialState = this.getCopy();
    initialState.path = [];
    let nodes = [initialState];
    while(nodes.length > 0){
        let node = nodes[0];
        nodes.shift();
        if(node.isFinal()){
            return node.path;
        }
        nodes = nodes.concat(node.visit());
        //console.log(nodes);
    }
};

//-----------------------AStar------------------------

NPuzzle.prototype.runAStar = function(){
    console.log("AsTAR logic");
    let nodes = new MinHeap(null, function(a, b){
        return a.distance - b.distance;
    });
    this.path = [];
    nodes.push({puzzle : this, distance: 0});
    while(nodes.size() > 0){
        console.log(nodes.size());
        let node = nodes.pop().puzzle;
        if(node.isFinal()){
            return node.path;
        }
        let children = node.visit();
        for(let i= 0; i<children.length; i++){
            let child = children[i];
            let f = child.g() + child.h();
            nodes.push({puzzle : child, distance: f});
        }
    }
};

NPuzzle.prototype.g = function() {
    return this.path.length;
};


NPuzzle.prototype.getMisplaced = function(){
    console.log("h1");
    let count = 0;
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            let cell = this.board[i][j];
            if (cell != 0) {
                let originalRow = Math.floor((cell - 1) / this.size);
                let originalColumn = (cell - 1) % this.size;
                if (i != originalRow || j != originalColumn) count++;
            }
        }
    }    
    return count;
};

NPuzzle.prototype.getManhattan = function(){
    console.log("h2");
    let distance = 0;
    for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
            let cell = this.board[i][j];
            if (cell != 0) {
                let originalRow = Math.floor((cell - 1) / this.size);
                let originalColumn = (cell - 1) % this.size;
                distance += Math.abs(i - originalRow) + Math.abs(j - originalColumn);
            }
        }
    }    
    return distance;
};

NPuzzle.prototype.h = function(){
    if(this.method == "h1"){
        return this.getMisplaced();
    } //TODO:
    if(this.method == "h2"){
        return this.getManhattan();
    }
};

NPuzzle.prototype.solve = function(){
    if (this.method == "bfs"){
        return this.runBFS();
    } else{
        return this.runAStar();
    }
};




/**
 * @fileOverview Implementation of a min heap.  Allows a comparator 
 * to be provided so that the heap may contain objects that involve a 
 * more complex comparison.
 */

/**
 * Implementation of a min heap allowing for a comparator 
 * to be provided so that the heap may contain objects that involve a 
 * more complex comparison.
 * <br>
 * This constructor constructs a MinHeap instance and takes two optional 
 * parameters: an array and comparator.  If the array is provided, it 
 * will be used as the backing store for the heap. Therefore, all 
 * operations on the heap will be reflected in the provided array.
 * Usage
 * @example
 * Sample Usage:
	var heapq = new MinHeap();
	heapq.push(5);
	heapq.push(2);
	heapq.push(1);
	heapq.pop()); // returns 1
	heapq.pop()); // returns 2
 * @param array Array to use heapify or null to start with an empty
 * heap.
 * @param comparator alternate comparator used to compare each 
 * item within the heap.  If not provided, the default will perform
 * a simple comparison on the item.
 *
 * @returns instance of MinHeap
 * @constructor
 */
function MinHeap(array, comparator) {

    /**
     * Storage for heap. 
     * @private
     */
	this.heap = array || new Array();

    /**
     * Default comparator used if an override is not provided.
     * @private
     */
	this.compare = comparator || function(item1, item2) {
		return item1 == item2 ? 0 : item1 < item2 ? -1 : 1;
	};

    /**
     * Retrieve the index of the left child of the node at index i.
     * @private
     */
	this.left = function(i) {
		return 2 * i + 1;
	};
    /**
     * Retrieve the index of the right child of the node at index i.
     * @private
     */
	this.right = function(i) {
		return 2 * i + 2;
	};
    /**
     * Retrieve the index of the parent of the node at index i.
     * @private
     */
	this.parent = function(i) {
		return Math.ceil(i / 2) - 1;
	};

    /**
     * Ensure that the contents of the heap don't violate the 
     * constraint. 
     * @private
     */
	this.heapify = function(i) {
		var lIdx = this.left(i);
		var rIdx = this.right(i);
		var smallest;
		if (lIdx < this.heap.length
				&& this.compare(this.heap[lIdx], this.heap[i]) < 0) {
			smallest = lIdx;
		} else {
			smallest = i;
		}
		if (rIdx < this.heap.length
				&& this.compare(this.heap[rIdx], this.heap[smallest]) < 0) {
			smallest = rIdx;
		}
		if (i != smallest) {
			var temp = this.heap[smallest];
			this.heap[smallest] = this.heap[i];
			this.heap[i] = temp;
			this.heapify(smallest);
		}
	};

    /**
     * Starting with the node at index i, move up the heap until parent value
     * is less than the node.
     * @private
     */
	this.siftUp = function(i) {
		var p = this.parent(i);
		if (p >= 0 && this.compare(this.heap[p], this.heap[i]) > 0) {
			var temp = this.heap[p];
			this.heap[p] = this.heap[i];
			this.heap[i] = temp;
			this.siftUp(p);
		}
	};

    /**
     * Heapify the contents of an array.
     * This function is called when an array is provided.
     * @private
     */
	this.heapifyArray = function() {
		// for loop starting from floor size/2 going up and heapify each.
		var i = Math.floor(this.heap.length / 2) - 1;
		for (; i >= 0; i--) {
		//	jstestdriver.console.log("i: ", i);
			this.heapify(i);
		}
	};

	// If an initial array was provided, then heapify the array.
	if (array != null) {
		this.heapifyArray();
	}
	;
}

/**
 * Place an item in the heap.  
 * @param item
 * @function
 */
MinHeap.prototype.push = function(item) {
	this.heap.push(item);
	this.siftUp(this.heap.length - 1);
};

/**
 * Insert an item into the heap.
 * @param item
 * @function
 */
MinHeap.prototype.insert = function(item) {
    this.push(item);
};

/**
 * Pop the minimum valued item off of the heap. The heap is then updated 
 * to float the next smallest item to the top of the heap.
 * @returns the minimum value contained within the heap.
 * @function
 */
MinHeap.prototype.pop = function() {
	var value;
	if (this.heap.length > 1) {
		value = this.heap[0];
		// Put the bottom element at the top and let it drift down.
		this.heap[0] = this.heap.pop();
		this.heapify(0);
	} else {
		value = this.heap.pop();
	}
	return value;
};

/**
 * Remove the minimum item from the heap.
 * @returns the minimum value contained within the heap.
 * @function
 */
MinHeap.prototype.remove = function() {
    return this.pop();
};


/**
 * Returns the minimum value contained within the heap.  This will
 * not remove the value from the heap.
 * @returns the minimum value within the heap.
 * @function
 */
MinHeap.prototype.getMin = function() {
	return this.heap[0];
};

/**
 * Return the current number of elements within the heap.
 * @returns size of the heap.
 * @function
 */
MinHeap.prototype.size = function() {
	return this.heap.length;
};
