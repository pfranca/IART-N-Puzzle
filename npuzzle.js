
//Initialize a size*size filled board
function NPuzzle(size){
    this.size = size;
    this.board = [];
    this.path = [];
    this.previousMove = null;

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
NPuzzle.prototype.isCompleted = function(){
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