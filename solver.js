
function solve(){
    readBoard(); 
    if(!checkBoard()){
        return;
    }
    fillPosibleValues();
    while(processPossibleValues());
    if(solved()){
        showMessage("Solved",false);
        return;
    }
    console.log("Performing trail and error", BOARD);
    //If there is no cell with only one possible val, and the board is not sorted. Perform trial and error
    performTrialAndError();
    if(solved()){
        showMessage("Solved",false);
        return;
    }
    showMessage("Could not solve the ",true);
}

/**
 * 
 * Assume the value and try to solve the  board, if not a valid guess, try with next val
 */
function performTrialAndError(){
    var i=0, j=0;

    while( i> -1 && j > -1 && i< CELL_COUNT && j < CELL_COUNT){

        var currentcell = BOARD[i][j];
        //user input
        if(currentcell.userInput || currentcell.sureVal){
            j++;
            if( j == CELL_COUNT){
                j =0;
                i +=1;
            }
            if(i == CELL_COUNT ){
                break;
            }
            continue;
        }
        
        //blank
        currentcell.val = findNextVal( currentcell);
        fillCellVal(currentcell);
        if(! currentcell.val ){
            var pCell = prevCell(currentcell);
            if(!pCell){
                break;
            }
            i = pCell.i;
            j = pCell.j;
            continue;
        }
        j +=1;
        if( j == CELL_COUNT){
            j = 0;
            i +=1;
        }
        if(i == CELL_COUNT){
            break;
        }
    }
    //solve
}

/**
 * Checks whether a board is completely filled
 * @returns 
 */
function solved(){
    for(var i=0; i< CELL_COUNT; i++){
        for(var j=0;j< CELL_COUNT; j++){
            if(!BOARD[i][j].val) {
                return false;
            }
        }
    }
    return true;
}

/**
 * If possible values has only one val, set the val and exclde the val from 
 * realted cells
 * @returns 
 */
function processPossibleValues(){
    var hasChange = false;
    for(var i=0;i< CELL_COUNT;i++){
        for(var j=0; j< CELL_COUNT; j++){
            var cell = BOARD[i][j];
            if(cell.userInput || cell.val) continue;            
            if(cell.possibleValues.length == 1){
                cell.val = cell.possibleValues[0];
                cell.possibleValues = [];
                fillCellVal(cell);
                cell.sureVal = true;
                hasChange = clearPossibleVals(cell) || hasChange;
            }
        }
    }
    return hasChange;
}

/**
 * This function removes the cell value from possibleValues of realted  row, column and box 
 * @param {*} cell 
 * @returns 
 */
function clearPossibleVals( cell){
    var deleted = false;
    for(var i= 0; i< CELL_COUNT;i++ ){
        var lengthBeforeDelete= BOARD[cell.i][i].possibleValues.length + BOARD[i][cell.j].possibleValues.length;
        removeElement(BOARD[cell.i][i].possibleValues, cell.val);
        removeElement(BOARD[i][cell.j].possibleValues, cell.val); 
        var lengthAfterDelete= BOARD[cell.i][i].possibleValues.length + BOARD[i][cell.j].possibleValues.length;
        deleted = lengthBeforeDelete != lengthAfterDelete || deleted;
        //3*3 delete
    }
    //check group
    if(CELL_COUNT != 9)
        return deleted;
    var iGroup = Math.floor(cell.i/3);
    var jGroup = Math.floor(cell.j/3);

    var sIndexI =  iGroup * 3;
    var sIndexJ = jGroup * 3;

    for(var i=sIndexI; i< sIndexI+3; i++){
        for(var j=sIndexJ; j< sIndexJ+3; j++){
            removeElement(BOARD[i][j].possibleValues, cell.val);
        }
    }
    return deleted;
}

/**
 * this functiosn removes a given value from an array
 * @param {*} array 
 * @param {*} val 
 */
function removeElement(array, val){
    const index = array.indexOf(val);
    if (index > -1) { // only splice array when item is found
        array.splice(index, 1); // 2nd parameter means remove one item only
    }
}

/**
 * This function finds out all the possible values for all cells excpt user inputs
 */
function fillPosibleValues(){ 
    for(var i=0;i<CELL_COUNT;i++){
        for(var j=0;j<CELL_COUNT;j++){
            var cell = BOARD[i][j];
            cell.possibleValues = [];
            if(cell.userInput){
                continue;
            }
            for(var k=1;k<=CELL_COUNT;k++){
                if(isValueAllowedAtIndex(i,j,k)){
                    cell.possibleValues.push(k);
                }
            }
        }
    }
}

/**
 * This function used to get the possible value for given cell
 * @param {*} currentcell 
 * @returns 
 */
function findNextVal( currentcell){
    //var val = CELL_COUNT+1;
    for(var i=0;i<currentcell.possibleValues.length; i++ ){
        if(currentcell.val>= currentcell.possibleValues[i])
            continue;
        if(!isValueAllowedAtIndex(currentcell.i, currentcell.j, currentcell.possibleValues[i]))
            continue;
        //assumes the values are already in sorted order
        return  currentcell.possibleValues[i];//val = Math.min(val, currentcell.possibleValues[i]);
    }
    
    return 0;// CELL_COUNT < val? 0: val;
}

/**
 * This function use to identify the previouse cell which can be edited/increamented. 
 * @param {*} cell 
 * @returns 
 */
function prevCell( cell){
    var j = cell.j - 1;
    var i = cell.i;  
    if(j < 0){
        j = CELL_COUNT-1;
        i -=1;
    } 
    if( i == -1){
        return false;
    }
    if(BOARD[i][j].userInput || BOARD[i][j].sureVal){
        return prevCell( BOARD[i][j]);
    }
    return BOARD[i][j];

}

/**
 * This method used to find the new empty cell which can be filled
 * @param {*} cell 
 * @returns 
 */
function nextEmptyCell( cell){
    var j = cell.j +1;
    var i = cell.i;
    if(j == CELL_COUNT){
        j = 0;
        i +=1;
    }
    if(i == CELL_COUNT){
        return false;
    }
    return BOARD[i][j];

    return false;
}

/**
 * This function validates the current board
 * @returns 
 */
function checkBoard(){
    for(var i=0;i<CELL_COUNT;i++){
        for(var j=0; j< CELL_COUNT;j++){
            if(!isValueAllowedAtIndex(i,j,BOARD[i][j].val))
                return false;
        }
    }
    return true;
}

/**
 * This function validates whether a number is allowed at a given cell (index)
 * @param {*} m 
 * @param {*} n 
 * @param {*} val 
 * @returns 
 */
function isValueAllowedAtIndex( m, n,val){
    if(!val) return true;
    if(!val)
        return true;
    //check right
    for(var i=0;i< CELL_COUNT; i++){
        if(i == m) continue;
        if(BOARD[i][n].val == val){
            //markErrorCell(i,n);
            return false;
        }
    }
    //check bootm
    for(var i=0;i< CELL_COUNT; i++){
        if(i == n) continue;
        if(BOARD[m][i].val == val){            
            //markErrorCell(m,i);
            return false;
        }
    }
    //check group
    if(CELL_COUNT != 9)
        return true;
    var iGroup = Math.floor(m/3);
    var jGroup = Math.floor(n/3);

    var sIndexI =  iGroup * 3;
    var sIndexJ = jGroup * 3;

    for(var i=sIndexI; i< sIndexI+3; i++){
        for(var j=sIndexJ; j< sIndexJ+3; j++){
            if(i==m && j== n) continue;
            if(BOARD[i][j].val == val){
                //markErrorCell(i,j);
                return false;
            }
        }
    }

    return true;
}
