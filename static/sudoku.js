//game data
var game = {
	initialData :
		{ maxNum : 9, empty: false },
	nums : "123456789", maxNum : 9,
	numCount : 81, boxLen : 3,
	solvedCount : 0, 
	board : []
}
	
function possibleNums(board, id, not){
	var id = id.split(","), bLen = game.boxLen, not = ((not === undefined)? "" : not ), ans = "", nums = game.nums, data = game.boxData, id0ModBL = (id[0] % game.boxLen), id1ModBL = (id[1] % game.boxLen);
	for(var i=1; i<=game.maxNum; i++){
		if(i != id[1]){
			not+=(board[id[0]-1][i-1]);
		}
		if(i != id[0]){
			not+=(board[i-1][id[1]-1])
		}
	}
	for(var i in data){
		if(data[i].indexOf(id[0]) > -1){
			var range =data[i], lst = "";
			var min = Math.floor((id[1]-1) / bLen)
			var splice1 = (id0ModBL == 0)? (game.boxLen -1) : (id0ModBL -1) ;
			var splice2 = (id1ModBL == 0)? (game.boxLen -1) : (id1ModBL -1) ;
			for(var r in range){
				var tempLst = (board[range[r]-1]).slice();
				tempLst = tempLst.slice(bLen*min, (bLen*min)+bLen);
				if(r == splice1){
					tempLst.splice(splice2, 1);
				}
				not+=(tempLst.join(""))
			}
			break;
		}
	}
	
	for(var i in nums){
		if(not.indexOf(nums[i]) < 0){
			ans+=(nums[i])
		}
	}
	return ans;
}

function getBoxParameters(){
	var bLen = game.boxLen;
	var newArr = [[""]];
	for(var i=1; i<=game.maxNum; i++){
		newArr[newArr.length -1] += String(i);
		if(i != 1 && i % bLen == 0){
			newArr.push([""]);
		}
	}
	game.boxData = newArr;
}

//returns a number converted to it's id equivalent. returns NaN if the number is invalid.
function numToId(num){
	var count = 0;
	for(var x=1; x<=game.maxNum; x++){
		for(var y=1; y<=game.maxNum; y++){
			count++;
			if(count == num){
				return (x+","+y);
			}
		}	
	}
}
//returns the number located at a specified id
function getValue(board, id){
	return (board[id.charAt(0) -1][id.charAt(2) -1]);
}

function setNum(board, id, val){
	board[Number(id.charAt(0))-1].splice(Number(id.charAt(2))-1, 1, val);
	return board;
}

function setAllPossibleNums(board){
	board = (board == undefined)? game.board : board ;
	var solvable = false;
	for(var i=1; i<=game.numCount; i++){
		var id = numToId(Number(i));
		if(getValue(board, id) == ""){
			var possi = possibleNums(board, id)
			if(possi.length == 1){
				game.board = setNum(game.board, id, possi);
				solvable = true;
			}
		}
	}
	if(!isComplete(board) && solvable){
		setAllPossibleNums(board, true);
	}
	return {board: board, changed: solvable, error: false};
}

function getEmptyCells(board){
	board = (board == undefined)? game.board : board ;
	var idList = [];
	for(var i=1; i<=game.numCount; i++){
		var id = numToId(i);
		var val = getValue(board, id).trim();
		if(val == ""){ idList.push(id) }
	}
	return idList;
}

function isBoardCorrect(board){
	for(var i = 1; i<=game.numCount; i++){
		var id = numToId(Number(i));
		var ans = possibleNums(board, id)
		var val = getValue(board, id);
		if(ans != val){
			return false;
		}
	}
	return true;
}

function changeSudokuMode(num){
	game.maxNum = num;
	game.numCount = (num*num);
	game.boxLen = Math.floor(Math.sqrt(num));
	game.nums = "";
	for(var i = 1; i<=num; i++){
		game.nums += (String(i));
	}
}

function generateEmptyBoard(){
	var n = game.maxNum, newBoard = [];
	for(var r=1; r<=n; r++){
		newBoard.push([]);
		for(var c=1; c<=n; c++){
			newBoard[r -1].push("");
		}
	}
	game.board = newBoard;
}

function formatBoard(board_){
	var board = [];
	for(var i in board_){
		board.push((board_[i]).slice());
	}
	var isRegular = (game.maxNum == 9);
	var data = game.boardData;
	var nums = (game.nums).split("");
	var count = Math.floor((game.numCount - ((isRegular)? Math.floor(Math.random() *7 +19) : 7)) / 2);
	for(var i = 1; i<=count;){
		var outerIndex = nums[Math.floor(Math.random() *nums.length)];
		var innerIndex = nums[Math.floor(Math.random() *nums.length)];
		var val = (board[outerIndex-1][innerIndex-1]);
		if(board[outerIndex-1][innerIndex-1] == ""){	continue; }
		board = setNum(board, outerIndex+","+innerIndex, "");
		for(var d in data[val]){
			if(data[val][d] == outerIndex+","+innerIndex){
				data[val][d] = "";
			}
		}

		outerIndex = ((game.maxNum-outerIndex)+1), innerIndex = ((game.maxNum-innerIndex)+1);
		var val = (board[outerIndex-1][innerIndex-1]);
		board = setNum(board, outerIndex+","+innerIndex, "");
		for(var d in data[val]){
			if(data[val][d] == outerIndex+","+innerIndex){
				data[val][d] = "";
			}
		}
		
		i++;
	}
	return board;
}

function isComplete(board){
	return (getEmptyCells(board).length < 1)? true : false ;
}

function getBoardData(board){
	var ans = {}
	for(var n =1; n<=game.numCount; n++){
		var id = numToId(n);
		var val = getValue(board, id);
		if(ans[val] === undefined){
			ans[val] = [id];
		}else{
			(ans[val]).push(id);
		}
	}
	return ans
}

function getNumCount(board){
	var count = 0;
	for(var r in board){
		for(var c in board[r]){
			count = (board[r][c] == "")? count : count+1;
		}
	}
	return count;
}

function initialize(board){
	if(!isComplete(board)){
		var solved = setAllPossibleNums(board);
		if(!isComplete(solved.board)){
			var solved = solve(solved.board);
		}
		if(solved.error){
			message(["Invalid Puzzle","Wrong Clues Given"]);
		}else{
			game.boardData = getBoardData(solved.board)
			game.board = solved.board;
			if(game.initialData.empty && game.numCount > 0){
				displayBoard(formatBoard(solved.board));
			}else{
				displayBoard(solved.board);
			}
		}
	}
};
	
function solve(board){
	var empty = getEmptyCells(board), possi = [], error = false;
	for(var i in empty){
		possi.push([empty[i], possibleNums(board, empty[i])]);
	}
	var possiMaxIndex = (possi.length-1);
	possi = sort(possi, {sortType: "len", isNested: true, nestIndex: 1});//contains data on possible numbers. Each element stored as [position ID, position's possible numbers].
	var not = [], p = 0;
	while(p <= possiMaxIndex){
		var ans = randIndex(possibleNums(board, possi[p][0], not[p]));
 		if(isNaN(ans)){
 			if(p == 0){
 				error = true;
 				break;
 			}
			var prevVal = possi[p-1][2];
			board = setNum(board, possi[p][0], "");
			not[p -1] = (not[p -1] === undefined || not[p -1] == "")? prevVal : (not[p -1]+prevVal);
			not = not.slice(0, p);
 			p--;
 			continue;
 		}
 		board = setNum(board, possi[p][0], ans);
		possi[p][2] = ans;
		p++;
	}
	return({ board : board, moves: p, error: error});
	
	function randIndex(from){
		return ((from == "")? NaN : from[Math.floor(Math.random() *from.length)]);
	}
}

function sort(arr, data){
	var type = String(data.sortType).trim().toLowerCase();
	var deep = (deep == true)? true : false ;
	function which(x){
		return ((data.sortType.indexOf("len") == 0)? String(x).length : Number(x));	
	}
	var sorted = false;
	while(!sorted){
		var changes = 0;
		for(var i in arr){
			var nI = Number(i);
			if(nI == arr.length -1){
				continue;
			}
			var curr = arr[nI], nxt = arr[nI+1];
			var curr_ = (data.isNested)? curr[data.nestIndex] : curr ;
			var nxt_ = (data.isNested)? nxt[data.nestIndex] : nxt ;
			if(which(curr_) > which(nxt_)){
				arr[nI] = nxt;
				arr[nI +1] = curr;
				changes++;
			}
		}
		if(changes == 0){ sorted = true}
	}
	return arr;
}

function run(go, change){
	var go = (go === undefined)? true : go ;
	var change = (change === undefined)? true : change ;
	var data = game.initialData;
	changeSudokuMode(data.maxNum)
	if(change){
		changeSudokuDisplay(data.maxNum);
	}
	if(data.empty){
		generateEmptyBoard();
	}else{
		getBoard();
	}
	if(go){
		getBoxParameters();
		initialize(game.board);
	}
}
run();

/*Code for interaction with the DOM*/
function displayBoard(board){
	message();
	var count = getNumCount(board);
	$(".sudoku .row .cell").css({"background-color" : "silver"});
	for(var r in board){
		for(var c in board[r]){
			$(".sudoku .row").eq(r).find(".cell").eq(c).html(board[r][c]).attr("editable",(board[r][c] == "")? "true" : "false").css({"font-weight":(count <= (game.numCount /2))? "bold" : "normal"});
		}
	}
	game.solvedCount++
}

function emptyBoard(){
	var len = $(".sudoku .row").length;
	for(var r = 0; r<len; r++){
		for(var c = 0; c<len; c++){
			$(".sudoku .row").eq(r).find(".cell").eq(c).html("");
		}
	}
}

$(".buttons > .left, .buttons > .right").on("click.up", function(e){
	e.stopPropagation();
	if($(this).css("box-shadow") != "none"){ return; }
	var isCheat = (($(this).html()).indexOf("Cheat") >= 0), curr = $(this);
	$(this).css({"box-shadow":"inset 0px -10px 10px 10px rgba(250, 250, 250, .2)"});
	$(this).siblings().css({"box-shadow":"none"});
	$(".extra .button").off("click.run");
	$(".buttons .extra .button1").text("9 * 9");
	$(".buttons .extra .button2").text("4 * 4");
 	$(".buttons .extra").children().not(".text").css("display","block");
	$(".buttons > .left, .buttons > .right").addClass("other");
	$(".extra").animate({"bottom":"-100%"},50, function(){
		setTimeout(function(){
			$(".extra .text").text("Select "+((isCheat)? "Solving" : "Playing")+" Mode")
			$(".extra").animate({"bottom":"100%"},50);
		},100);
	});
	$("body").one("click.down", function(e){
		$(".buttons > .left, .buttons > .right").removeClass("other");
		$(".extra").animate({"bottom":"-100%"}, 100);
		$(curr).css({"box-shadow":"none"});
	});
	$(".extra .button").on("click.run", function(e){
		e.stopPropagation();
		var maxNum = $(this).text().charAt(0), empty = (isCheat)? false : true;
		game.initialData.maxNum = Number(maxNum);
		game.initialData.empty = empty;
		emptyBoard();
		$(".buttons > .left, .buttons > .right").removeClass("other");
		$(".extra").animate({"bottom":"-100%"}, 100);
		$(".extra .button").off("click.run");
		$(curr).css({"box-shadow":"none"});
		if(empty){
			run();
			$(".buttons .big").addClass("other");
			$(".buttons .big").on("click.verify", function(){
				var currBoard = getBoard(true);
				if(isBoardCorrect(currBoard)){
					$(".buttons .big").removeClass("other");
					message(["Correct Answer","Well Done"], true);
					$(".buttons .big").off("click.verify");
				}else{
					message(["Incorrect Answer",,"Quit"]);
					$(".messageBox span button").on("click.quit", function(){
						$(".buttons .big").removeClass("other");
						$(".buttons .big").off("click.verify");
						displayBoard(game.board);
						colorWrongCells()
					});
				}
			});
			return;
		}else{ run(false); }
		$(".buttons .big").addClass("other");
		$(".buttons .big").one("click", function(){
			$(".buttons .big").removeClass("other");
			if(maxNum == "9"){
				message("Thinking...");
				setTimeout(function(){
					run(true, false);
				},20);
			}else{
				run(true, false);
			}
		});
	});
});

function getBoard(noChange){
	var noChange = (noChange === undefined)? false : true ;
	var newArr = [];
	var len = $(".sudoku .row").length
	for(var r=0; r<len; r++){
		newArr.push([]);
		for(var c=0; c<len; c++){
			var val = $(".sudoku .row").eq(r).find(".cell").eq(c).text();
			newArr[newArr.length -1].push(val);
		}
	}
	if(noChange){ return newArr }else{
		game.board = newArr;
	}
}

function changeSudokuDisplay(num){
	$(".sudoku .row, .numbers .cell").remove();
	var classes = ["4","9"];
	for(var c in classes){
		if(num == Number(classes[c])){
			$(".sudoku").addClass("sudoku"+classes[c]);
		}else{
			$(".sudoku").removeClass("sudoku"+classes[c]);
		}
	}
	for(var r = 0; r < num; r++){
		$(".sudoku").append("<span class='row'></span>");
		$(".sudoku .row").last().css({"height":(314/num)+"px"});
		for(var c = 0; c < num; c++){
			var left = (c == 0)? 0 : ((314 / num) * c);
			if(r == 0){
				$(".numbers").append("<span class='cell' style='left:"+left+"px; width:"+(314/num)+"px;'>"+(c+1)+"</span>")
			}
		$(".sudoku .row").last().append("<span class='cell'></span>");
		$(".sudoku .row .cell").last().css({"left":left, "width":(314/num)+"px"});
		}
	}
	
	$(".sudoku .row .cell").on("click.edit", function(e){ handleEdit(e, this); });
}

$(".sudoku .row .cell").on("dblclick.edit", function(){ $(this).text("") });

function handleEdit(e, curr){
	$(".sudoku .row .cell").css({"background-color":"silver"});
	$(curr).css({"background-color":"grey"});
	if($(curr).attr("editable") == "false" && game.solvedCount > 1){	
		$(".numbers").animate({"top":"275px"},100);
		return;	
	}
	$(".numbers .cell").off("click.change");
	$(".sudoku .row .cell").off("click.delete");
	$(".numbers").animate({"top":"322px"},100);
	changeNum(e);
	$(curr).one("click.delete", function(){
		$(this).text("").css("background-color","silver");
		$(".numbers .cell").off("click.change");
		$(".numbers").animate({"top":"275px"},100);
		$(this).off("click.delete");
		colorWrongCells();
	});
	$(curr).one("mouseout", function(e){
		$(this).off("click.delete");
		var t = e.relatedTarget;
		if($(t).parent().hasClass("numbers") || $(t).hasClass("numbers") ){
			return;
		}
		if(!($(t).hasClass("cell") && $(t).parent().hasClass("row"))){
			$(".numbers").animate({"top":"275px"},100);
		}
		$(this).css({"background-color":"silver"});
	});
};

function changeNum(boardE){
	$(".numbers .cell").one("click.change", function(numE){
		$(".numbers").animate({"top":"275px"},100);
		var curr = $(boardE.target);
		$(boardE.target).off("click.delete");
		var index = Number($(".sudoku .cell").index(curr))+1;
		var id = numToId(index);
		var val = $(numE.target).text().trim();
		$(curr).text(val).css({"font-weight":"normal"});
		if(game.initialData.empty){
			colorWrongCells();
		}
	});
};

function colorWrongCells(){
	var currBoard = getBoard(true);
	for(var i = 1; i <= game.numCount; i++){
		var id = numToId(i);
		var possi = possibleNums(currBoard, id);
		var val = getValue(currBoard,id);
		$(".sudoku .row").eq(id[0]-1).find(".cell").eq(id[2]-1).css({"color":(possi.indexOf(val) > -1)? "black" : "red"});
	}
}

function message(msg, isGood){
	var isGood = (isGood == true)? true : false ;
	var isArr = (typeof msg == "object");
	var has2 = (isArr && msg[1] != undefined);
	var has3 = (isArr && msg[2] != undefined);
	$(".messageBox").css({"display":((msg == undefined)? "none" : "block" )}).find("span").html(((isArr)? msg[0] : msg)+((has2)? ("<b style='color:"+((isGood)? 'blue' : 'red')+";'>"+msg[1]+"</b>") : "")+((has3)? ("<button>"+msg[2]+"</button>") : ""));
	if(msg != undefined){
		var hei = Number($(".messageBox span").innerHeight());
		$(".messageBox span").css({"top" : "calc(50% - "+(hei/2)+"px"});
	}
	if(msg == undefined){return;}
	$("body").on("touchstart.msg",function(e){
		var origin = e.target;
		if($(origin).hasClass("big") || $(origin).text() == "Quit"){
			return
		}
		$(".messageBox span button").off("click.quit");
		$(".messageBox").css({"display":"none"});
		$("body").off("click.msg");
	});
}


/*Everything below here is for testing*/
function divList(lst, modify, a){
	var strList = "", a = (a === undefined)? ".." : a;
	for(var x in lst){
		for(var y in lst[x]){
			strList+=((lst[x][y] == "" && modify)? a : (lst[x][y] == "")? a : lst[x][y]);
 			strList+=((y == lst[x].length-1)? "" : (modify)? (((Number(y)+1) % game.boxLen == 0)? " | " : ",") : " | ");
		}
		if(modify && (Number(x+1)) % game.boxLen == 0 && (Number(x)+1) != game.maxNum){
			var div = "\n";
			for(var i in game.nums){
				div+=("---")
			}
			strList+=div
		}
		strList+="\n"
	}
	return strList;
}