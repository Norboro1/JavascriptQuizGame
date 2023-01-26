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

var timerDisplayEl = $("#timerDisplay");
var startButtonEl = $("#startButton");
var startDivEl = $("#start");
var questionDivEl = $("#questionDiv");
var formEl = $("#endScreen");
var scoreEl = $("#score");
var wrongEl = $("#wrong");
var correctEl = $("#correct");

var highScores = JSON.parse(localStorage.getItem('highScores'));

var timer;
var timeLeft = 60;
var correct = 0;
var questionNum = 0;

function loadQuestion(x){
    questionDivEl.empty();

    var questionEl = $("<h1>");
    questionEl.text(questions[x].question);
    questionDivEl.append(questionEl);

    var buttonWidth = 0;
        for (i in questions[x].choices) {
            var choicesButton = $("<button>");
            choicesButton.attr('data-choice-value', i);
            i++;
            choicesButton.text(i-- + ". " + questions[x].choices[i]);
            questionDivEl.append(choicesButton);
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

startButtonEl.on('click', function(){
    clearInterval(timer);
    timer = setInterval(function(){
        if(timeLeft <= 0){
            clearInterval(timer);
        }
        timerDisplayEl.text(timeLeft.toString());
        timeLeft -=1;
    }, 1000);

    startDivEl.hide();
    questionDivEl.show();

    loadQuestion(0);
});

questionDivEl.on('click', 'button', function (){
    wrongEl.hide();
    correctEl.hide();
    if(this.dataset.choiceValue == questions[questionNum].answer ){
        correct+=20;
        correctEl.show();
    } else {
        timeLeft-= 10;
        wrongEl.show();
    }

    questionNum++;
    if(questionNum < questions.length){
        loadQuestion(questionNum);
    } else {
        clearInterval(timer);
        questionDivEl.empty();
        questionDivEl.hide();
        $("button").css('min-width', '0px');
        scoreEl.text(correct.toString());
        formEl.show();
        setTimeout(function(){
            wrongEl.hide();
            correctEl.hide();
        }, 1000);
    }
    
});

formEl.on('click', 'button', function(event){
    event.preventDefault();
    var highScore = {
        initials: $("#initials").val(),
        score: correct
    }
    if(highScores != null){
        highScores.push(highScore);
    } else {
        highScores = [highScore];
    }
    
    localStorage.setItem('highScores', JSON.stringify(highScores));
});

questionDivEl.hide();
formEl.hide();
wrongEl.hide();
correctEl.hide();
