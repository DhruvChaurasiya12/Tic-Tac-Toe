let choices = document.querySelectorAll(".choice-button");

choices.forEach((choice)=>{
    choice.addEventListener("click", ()=>{
        let choiceID = choice.getAttribute("id");
        let userChoice = choiceID=="choice-x" ? "X" : "O";
        localStorage.setItem("userChoice",userChoice);
    });
});


let userChoice = localStorage.getItem("userChoice");
userChoice = (userChoice=="" || userChoice=="X" || userChoice==undefined) ? "X":"O";
let compChoice = userChoice=="X" ? "O" : "X";


let passCount = 0;
let boxes = document.querySelectorAll(".box");

let boxSelected = [];
for(let i=0;i<9;i++) boxSelected[i] = false;


const winPatterns = [
    [0,1,2], 
    [3,4,5], 
    [6,7,8], 
    [0,3,6], 
    [1,4,7], 
    [2,5,8], 
    [0,4,8], 
    [2,4,6]
];



boxes.forEach((box)=>{
    box.addEventListener("click",()=>{
        let boxIndex = box.getAttribute("id");
        boxIndex = Number(boxIndex)-1;

        if(!boxSelected[boxIndex]){
            boxSelected[boxIndex] = true;
            passCount++;
            box.innerText = userChoice;
            startGame(userChoice, compChoice);
        }
    });
});


let gameTurn = document.getElementById("turn");


function startGame(userChoice, compChoice){
    if(gameCompleted()) {
        endGame(userChoice);
        return;
    }
    gameTurn.innerText = `${compChoice} turn`;

    setTimeout(() => {
        computerChance(compChoice);

        if(gameCompleted()) endGame(compChoice);
        else gameTurn.innerText = `${userChoice} turn`;
    }, 1000);
}


function computerChance(compChoice){

    if(passCount==9) return;
    passCount++;

    let boxIndex = "";
    while(true){
        boxIndex=Math.floor(Math.random() * 9);
        if(!boxSelected[boxIndex]) break;
    }

    boxes[boxIndex].innerText = compChoice;
    boxSelected[boxIndex]=true;
}


function gameCompleted(){
    for(let pattern of winPatterns){
        if (boxes[pattern[0]].innerText !== "" &&
            boxes[pattern[0]].innerText === boxes[pattern[1]].innerText &&
            boxes[pattern[1]].innerText === boxes[pattern[2]].innerText) {
            return true;
        }        
    }
    if(passCount==9) endGame("tie");
    else return false;
}




function endGame(winner){

    boxes.forEach((box,boxIndex)=>{
        if(!boxSelected[boxIndex]) box.disabled = true;
    })

    if(winner==userChoice){
        let userScore = document.querySelector("#user-score");
        userScore.innerText = Number(userScore.innerText) + 1;
    }
    else if(winner==compChoice){
        let compScore = document.querySelector("#comp-score");
        compScore.innerText = Number(compScore.innerText) + 1;
    }
    else{
        let tieScore = document.querySelector("#tie-score");
        tieScore.innerText = Number(tieScore.innerText) + 1;
    }

    setTimeout(()=>{
        if(winner==userChoice) alert("You won");
        else if(winner == compChoice) alert("Oops Computer won!");
        else alert("It's a tie!");
    }, 1000);
}


let resetButton = document.getElementById("reset-button");


function reset(){
    passCount=0;
    boxes.forEach((box, boxIndex)=>{
        boxSelected[boxIndex] = false;
        box.disabled = false;
        box.innerText="";
    })
}

resetButton.addEventListener("click",()=>{
    reset();
})


let restartButton = document.querySelector("#restart");
restartButton.addEventListener("click",()=>{
    localStorage.removeItem("userChoice");
})