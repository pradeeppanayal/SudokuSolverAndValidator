// A $( document ).ready() block.


CELL_COUNT = 9;
BOARD =[]

$( document ).ready(function() {
    $('#solve').click(function(e){
        if(e)
            e.preventDefault();
        reset();
        solve();
    });
    $('#new').click(function(e){
        reset();
        const q = getRandom();
        renderToBoard(q);
    });
    $('#custom').click(function(){        
       $('#dlg').show();
    });
    $("#loadConfirm").click(function(){

        reset();
        loadUserBoard();     
        $('#dlg').hide();
    });
    $('#check').click(function(){
        reset();
        readBoard();
        if(solved()){
            showMessage("Valid");
        }else{
            showMessage("Invalid board",false);
        }
    });
});

function showMessage(msg,isError){
    if(isError)
        $('#msg').html("<i style='color:red;'>"+msg+"</i>");
    else
        $('#msg').html("<i style='color:green;'>"+msg+"</i>");

}

function fillCellVal(cell){
    var id = asId(cell.i, cell.j);
    $('#'+id).val(cell.val);
}

function reset(){
    showMessage("");
    $('.errorCell').removeClass('errorCell');
    $('.userinput').removeClass('userinput');
}
function markErrorCell(i, j){
    var id = asId(i,j);
    $('#'+id).addClass('errorCell');
}

function asId(i, j){
    return  'cell-'+ (i*CELL_COUNT +j);
}

/**
 * Read the board to an array of objects
 */
function readBoard(){
    var vals = [];
    for(var i=0;i<CELL_COUNT;i++){
        row = []
        for(var j=0; j<CELL_COUNT;j++){
            var id =asId(i,j);
            var val = $('#'+id).val();
            var item = {i,j,val:0};
            if(val){
                item['val'] = parseInt(val);
                item['userInput'] = true;
                $('#'+asId(i,j)).addClass('userinput');
            }

            row.push(item)            
        }
        vals.push(row);
    }
    BOARD = vals;
}

function renderToBoard(q){
    if(!q || q.length != CELL_COUNT*CELL_COUNT){    
        showMessage("Invalid input provide :"+ q,true);
        return;
    }
    for(var i=0;i< CELL_COUNT;i++){
        for(var j=0;j<CELL_COUNT;j++){
            var index = i*CELL_COUNT+j;
            var val = parseInt(q[index]);
            var cellid = '#'+asId(i,j);
            $(cellid).val('');
            if(val) {     
                $(cellid).val(val);
                $(cellid).addClass('userinput');
            }
        }
    }
}

function loadUserBoard(){
    renderToBoard($('#useinputboard').val());
}

