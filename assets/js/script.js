//declare questions array with preset questions, choices, and the correct answer index.
let questions = [
    {
        question: "Inside which HTML element do we put the JavaScript?",
        choices: ["<js>","<script>","<scripting>","<javascript>"],
        answer: 1
    },
    {
        question: "The condition in an if / else statement is enclosed with __________.",
        choices: ["quotes","curly brackets","parenthesis","square brackets"],
        answer: 2
    },
    {
        question: "How do you write \"Hello World\" in an alert box?",
        choices: ["alertBox(\"Hello World\");"," msgBox(\"Hello World\");","msg(\"Hello World\");","alert(\"Hello World\");"],
        answer: 3
    },
    {
        question: "How to write an IF statement in JavaScript?",
        choices: ["if (i == 5)","if i == 5 then","if i = 5 then","if i = 5"],
        answer: 0
    },
    {
        question: "How does a FOR loop start?",
        choices: ["for (i = 0; i <= 5; i++)","for (i = 0; i <= 5)","for i = 1 to 5","for (i <= 5; i++)"],
        answer: 0
    },
]

//declare variables for all HTML elements needed
var timerDisplayEl = $("#timerDisplay");
var startButtonEl = $("#startButton");
var startDivEl = $("#start");
var questionDivEl = $("#questionDiv");
var formEl = $("#endScreen");
var scoreEl = $("#score");
var wrongEl = $("#wrong");
var correctEl = $("#correct");
var highScoresEl = $("#highScores");
var highScoresListEl = $("#highScoresList");
var refreshButton = $("#refresh");
var clearScoresButton = $("#clearScores");
var showHighScoresLink = $("#showHighScores");

//get highscores array from local storage
var highScores = JSON.parse(localStorage.getItem('highScores'));

//declare variables for timer, number of correct answers, and global questionNumber to track which question player is on.
var timer;
var timeLeft = 60;
var correct = 0;
var correctInterval = 100/questions.length;
var questionNum = 0;

//compare score function for use in sorting high scores.
function compareScore(a, b){
    return b.score - a.score;
}

//function to easily hide all elements from main section 
function hideAll(){
    startDivEl.hide();
    questionDivEl.hide();
    highScoresEl.hide();
    formEl.hide();
    wrongEl.hide();
    correctEl.hide();
}

//function to render and show high scores list
function renderHighScores(){
    if(highScores != null){
        highScores.sort(compareScore);
        for(i in highScores){
            var scoreLineEl = $("<li>");
            i++;
            scoreLineEl.text(i-- + ". " + highScores[i].initials + " - " + highScores[i].score);
            highScoresListEl.append(scoreLineEl);
        }
    } else {
        var scoreLineEl = $("<li>");
        scoreLineEl.text("There are no scores yet!");
        highScoresListEl.append(scoreLineEl);
    }
    

    highScoresEl.show();
}

//function to load a random question
function loadRandomQuestion(){
    //clear question div HTML
    questionDivEl.empty();
    //get random number based on length of questions array and store in global variable
    var x = Math.floor(Math.random() * questions.length);
    questionNum = x;
    //create h1 element which displays the question
    var questionEl = $("<h1>");
    questionEl.text(questions[x].question);
    questionDivEl.append(questionEl);
    //loop through answer choices, give each a data value based on its index, and render a button for each
    var buttonWidth = 0;
    for (i in questions[x].choices) {
        var choicesButton = $("<button>");
        choicesButton.attr('data-choice-value', i);
        i++;
        choicesButton.text(i-- + ". " + questions[x].choices[i]);
        questionDivEl.append(choicesButton);
        //this effectively makes each buttons width the same as the largest one by comparing each new button to the last and setting min-width based on the largest.
        if(buttonWidth != 0){
            if (choicesButton.outerWidth() > buttonWidth){
                $("button").css('min-width', choicesButton.outerWidth()+'px');
            } else {
                $("button").css('min-width', buttonWidth+'px');
            }
        }
    
        buttonWidth = choicesButton.outerWidth();
    }

    
}

//Listener to start game upon clicking start button
startButtonEl.on('click', function(){
    clearInterval(timer);
    //set timer for game. at 0 will stop timer and render final score screen.
    timerDisplayEl.text(timeLeft.toString());
    timer = setInterval(function(){
        if(timeLeft <= 0){
            clearInterval(timer);
            timerDisplayEl.text('0');
            questionDivEl.empty();
            questionDivEl.hide();
            //This line clears the min-width property that was set to make all question buttons equal size.
            $("button").css('min-width', '0px');
            scoreEl.text(correct.toString());
            formEl.show();
            //hides the "correct/incorrect" divs after 1 second
            setTimeout(function(){
                wrongEl.hide();
                correctEl.hide();
        }   , 1000);
        }
        timeLeft -=1;
        timerDisplayEl.text(timeLeft.toString());
    }, 1000);

    //renders question div and loads a random question.
    startDivEl.hide();
    questionDivEl.show();

    loadRandomQuestion();
});

//Listener on answering question to either load new question or go to final screen
questionDivEl.on('click', 'button', function (){
    //hide "correct/wrong" message from previous answer
    wrongEl.hide();
    correctEl.hide();
    //Check if answer is correct, if so add score based on 100 maximum (5 questions means 20 per question, etc.). subtracts from timer if incorrect. displays Correct or Wrong div.
    if(this.dataset.choiceValue == questions[questionNum].answer ){
        correct+=correctInterval;
        correctEl.show();
    } else {
        timeLeft-= 10;
        wrongEl.show();
    }
    //remove the question from array to prevent repeating or infinite loop
    questions.splice(questionNum, 1);
    //If array is not empty (all questions answered) will load a new one, otherwise stop timer and render final score screen
    if(questions.length > 0){
        loadRandomQuestion();
    } else {
        clearInterval(timer);
        questionDivEl.empty();
        questionDivEl.hide();
        $("button").css('min-width', '0px');
        scoreEl.text(Math.round(correct).toString());
        formEl.show();
        setTimeout(function(){
            wrongEl.hide();
            correctEl.hide();
        }, 1000);
    }
});

//Listener for form submit button to store score and initials in variable and local storage, then render highScores screen
formEl.on('click', 'button', function(event){
    event.preventDefault();
    //Check if initials input is valid (not empty and only letters)
    if($("#initials").val() == "" || !/^[a-zA-Z]+$/.test($("#initials").val())){
        alert("Please enter valid initials");
        return;
    }
    //set highscore variable to initials based on input and final score
    var highScore = {
        initials: $("#initials").val().toUpperCase(),
        score: correct
    }
    //If highScores is null (there is nothing in local storage), starts a new array with current score, otherwise pushes current score into existing array.
    if(highScores != null){
        highScores.push(highScore);
    } else {
        highScores = [highScore];
    }
    
    formEl.hide();

    //store scores in local storage and render high scores screen
    localStorage.setItem('highScores', JSON.stringify(highScores));
    renderHighScores();
});

//Listener for "Go back" button on highScores screen which simply reloads the entire page.
refreshButton.on('click', function(){
    location.reload();
});

//Listener for "Clear high scores" button on highScores screen to clear scores from local storage as well as the ul that displays them.
clearScoresButton.on('click', function(){
    highScores = null;
    localStorage.clear('highScores');
    highScoresListEl.empty();
    renderHighScores();
});

//Listener for "View high scores" header link which stops the timer and renders the high scores screen
showHighScoresLink.on('click', function(event){
    event.preventDefault();
    clearInterval(timer);
    hideAll();
    highScoresListEl.empty();
    renderHighScores();
})

//hide all main elements and show start screen.
hideAll();
startDivEl.show();