//creating reel objects variables to hold reel objects (THESE ARE INSTANTIATED IN THE CONTROLLER CLASS)
var reel1;
var reel2;
var reel3;
//Getting the buttons by id and saving in to variables
var spinBtn = document.getElementById("btnSpin");
var btnBetOne = document.getElementById("btnBetOne");
var btnBetMax = document.getElementById("btnBetMax");
var btnAddCoin = document.getElementById("btnAddCoin");
var btnReset = document.getElementById("btnReset");
var btnStatistics = document.getElementById("btnStatistics");
//Getting the reels by text fields and labels and saving in to variables
var tfBets = document.getElementById("tfBets");
var tfCredits = document.getElementById("tfCredits");
var tfMessage = document.getElementById("tfMessage");
//Getting the reels by id and saving in to variables
var reel1HtmlObj = document.getElementById("reel1HtmlObj");
var reel2HtmlObj = document.getElementById("reel2HtmlObj");
var reel3HtmlObj = document.getElementById("reel3HtmlObj");
// Get the statsContainer
var statsContainer = document.getElementById('statsContainer');
// Get the elements in the statsContainer
var close = document.getElementById("close");
var tfWon = document.getElementById("tfWon");
var tfLost = document.getElementById("tfLost");
var tfNet = document.getElementById("tfNet");
var btnSave = document.getElementById("btnSave");
var msgSucess = document.getElementById("msgSucess");
//=============================================================  SYMBOL CLASS =====================================================================
var Symbol = (function () {
    //the constructor of the symbol class
    function Symbol(symbolName, value) {
        this.setImage(symbolName);
        this.setValue(value);
    }
    //this methods are overidden methods of the isymbol interface
    Symbol.prototype.setImage = function (symbolName) {
        this.url = "assets/images/" + symbolName + ".png";
    };
    Symbol.prototype.getImage = function () {
        return this.url; //to get the url of image
    };
    Symbol.prototype.setValue = function (v) {
        this.value = v;
    };
    Symbol.prototype.getValue = function () {
        return this.value; //to get the value
    };
    return Symbol;
}());
//=============================================================  REEL CLASS =====================================================================
var Reel = (function () {
    //reel constructor
    function Reel() {
    }
    //this method adds the symbols the the arrayOfSymbols and returns it
    Reel.getArrayOfSymbols = function () {
        //pushing new symbol objects the the array of symbols
        this.arrayOfSymbols.push(new Symbol("redseven", 7));
        this.arrayOfSymbols.push(new Symbol("bell", 6));
        this.arrayOfSymbols.push(new Symbol("watermelon", 5));
        this.arrayOfSymbols.push(new Symbol("plum", 4));
        this.arrayOfSymbols.push(new Symbol("lemon", 3));
        this.arrayOfSymbols.push(new Symbol("cherry", 2));
        return this.arrayOfSymbols; //returning the filled array
    };
    //this function spin a single reel
    Reel.prototype.spinAReel = function (anyReelHtmlObj, arrayOfSymbols) {
        var self = this; //this is to avoid final
        this.reelIntervalState = intervalSetter(); //this is to get the state so the the reels can be stopped
        function intervalSetter() {
            return setInterval(function () {
                var randomNumber = Math.floor(Math.random() * 6); //this will generate a random number between 1 and 6
                anyReelHtmlObj.src = arrayOfSymbols[randomNumber].getImage(); //setting the html obj with a random img src
                self._finalValue = arrayOfSymbols[randomNumber].getValue(); //getting the value of the finnaly left out symbols
            }, 80); //delay for 80 milli seconds
        }
    };
    Reel.prototype.stopAReel = function () {
        //This method will make the current reel stop spinning
        clearInterval(this.reelIntervalState);
    };
    Object.defineProperty(Reel.prototype, "getFinalValue", {
        //getters
        get: function () {
            return this._finalValue;
        },
        enumerable: true,
        configurable: true
    });
    //this array is made to contontain symbol objects
    Reel.arrayOfSymbols = []; //the type is  symbols array
    return Reel;
}());
//=============================================================  CONTROLLER CLASS =====================================================================
var Controller = (function () {
    function Controller() {
    }
    //TODO
    //this function will start spinning the three reels
    Controller.startSpinning = function () {
        //checking if credits is more than zero
        if (!(Controller.creditAmount > 0)) {
            alert("Credits should be more than zero to play : Use the ADD COIN button to add credits!");
        }
        else if (!(Controller.betAmount > 0)) {
            alert("Bets should be more than zero to play : Use the Bet one or BET MAX to bet!");
        }
        else {
            //getting the symbols array
            var symbolsArray = Reel.getArrayOfSymbols();
            //creating reel objects
            reel1 = new Reel();
            reel2 = new Reel();
            reel3 = new Reel();
            //calling the spinARell method for all three reels
            reel1.spinAReel(reel1HtmlObj, symbolsArray);
            reel2.spinAReel(reel2HtmlObj, symbolsArray);
            reel3.spinAReel(reel3HtmlObj, symbolsArray);
            //disabling the spin button so it can be pressed only once
            spinBtn.disabled = true;
            //disabling the rest button so it can not be pressed while spiining
            btnReset.disabled = true;
            //disabling other buttons
            btnAddCoin.disabled = true;
            btnStatistics.disabled = true;
            btnBetOne.disabled = true;
            btnBetMax.disabled = true;
            //updating ui message
            tfMessage.innerHTML = "SPINNING...";
            Controller.betMaxCount = 0;
        }
    };
    //this function stops the three reels from spinning
    Controller.stopSpinningReels = function () {
        //this method will check if the player has won or lost and displays it.
        Controller.determineResult();
        //Stopping all three reels
        reel1.stopAReel();
        reel2.stopAReel();
        reel3.stopAReel();
        //enableing the spin button
        spinBtn.disabled = false;
        //enabling the bet max button
        btnBetMax.disabled = false;
        //enabling the rest button
        btnReset.disabled = false;
        //enabling other buttons
        btnAddCoin.disabled = false;
        btnStatistics.disabled = false;
        btnBetOne.disabled = false;
    };
    //================= CALCULATION AREA ============================
    //this method will check if the player has won or lost and displays it.
    Controller.determineResult = function () {
        var reel1Val = reel1.getFinalValue;
        var reel2Val = reel2.getFinalValue;
        var reel3Val = reel3.getFinalValue;
        //this condition checks if all thee reels have the same symbol
        if (reel1Val == reel2Val && reel1Val == reel3Val) {
            //this method calcalte the final won amount and also update Ui
            var wonAmount = Controller.calculateWonAmountAndUpdateUI(reel1Val);
            //incrementing the num of games won variable
            Controller.numGamesWon++;
            tfMessage.innerHTML = "YOU WIN";
            alert("You win with ALL symbols matching! And you won $" + wonAmount);
            //this condition checks if 1st two reel are same or 1st and 3rd reels are with same valued symbols
        }
        else if (reel1Val == reel2Val || reel1Val == reel3Val) {
            //incrementing the num of games won variable
            Controller.numGamesWon++;
            //this method calcalte the final won amount and also update Ui
            var wonAmount = Controller.calculateWonAmountAndUpdateUI(reel1Val);
            tfMessage.innerHTML = "YOU WIN";
            alert("You win with TWO symbols matching! And u won $" + wonAmount);
            //this condition check if the second and third reel have the same symbol value
        }
        else if (reel2Val == reel3Val) {
            //incrementing the num of games won variable
            Controller.numGamesWon++;
            //this method calcalte the final won amount and also update Ui
            var wonAmount = Controller.calculateWonAmountAndUpdateUI(reel2Val);
            tfMessage.innerHTML = "YOU WIN";
            alert("You win with TWO symbols matching! And u won $" + wonAmount);
        }
        else {
            //incrementing the num of games Lost variable
            Controller.numGamesLost++;
            tfMessage.innerHTML = "YOU LOST";
            alert("You Lost!");
            //resetting the bet amount to zero
            Controller.betAmount = 0;
            //== updating UI ==
            tfBets.value = 0;
        }
    };
    //===========
    //this method calcalte the final won amount and also update Ui -- it also return the won amount
    Controller.calculateWonAmountAndUpdateUI = function (val) {
        //calculating won amount
        var wonAmount = val * Controller.betAmount;
        //summing up the total credits won
        Controller.totalWonAmount += wonAmount;
        //summing up the total bets
        Controller.totalBets += Controller.betAmount;
        //resetting the bet amount to zero
        Controller.betAmount = 0;
        //adding the won amount to the credits are
        Controller.creditAmount += wonAmount;
        //== updating UI ==
        tfBets.value = 0;
        tfCredits.value = Controller.creditAmount;
        return wonAmount; //return the won amount
    };
    //=============================================
    //this method will add 1 credits to the bet area
    Controller.betOne = function () {
        //checcking if credits is more than 0
        if (Controller.creditAmount > 0) {
            //decrementing the credit amount
            --Controller.creditAmount;
            //incrementing the bet amount
            ++Controller.betAmount;
        }
        else {
            alert("You can not bet one : Credits are over ,press add coin button to add coins!");
        }
        //== updating ui ==
        //setting with credit amount
        tfCredits.value = Controller.creditAmount;
        //setting with bet amount
        tfBets.value = Controller.betAmount;
    };
    //this method will add 3 credits to the bet area
    Controller.betMax = function () {
        //checcking if credits is more than 0
        if (Controller.creditAmount > 3) {
            //checking if the bet max button is already clicked once
            if (Controller.betMaxCount == 0) {
                //decrementing the credit amount
                Controller.creditAmount -= 3;
                //incrementing the bet amount
                Controller.betAmount += 3;
                Controller.betMaxCount = 1;
            }
            else {
                alert("You can not bet max twice in a single game !");
            }
        }
        else {
            alert("You can not bet max : Credits are less than three ,press add coin button to add coins!");
        }
        //== updating ui ==
        //setting with credit amount
        tfCredits.value = Controller.creditAmount;
        //setting with bet amount
        tfBets.value = Controller.betAmount;
    };
    //this method will add 1 credits to the credit area each time the add coin button is pressed
    Controller.addCoin = function () {
        //incrementing the credits
        ++Controller.creditAmount;
        //== updating ui ==
        //setting with credit amount
        tfCredits.value = Controller.creditAmount;
    };
    //this method will add 1 credits to the credit area each time the add coin button is pressed
    Controller.reset = function () {
        //setting to the orginal credita amount
        Controller.creditAmount += Controller.betAmount;
        //setting the bet amount to zero
        Controller.betAmount = 0;
        //== updating ui ==
        //setting with credit amount
        tfCredits.value = Controller.creditAmount;
        //setting with bet amount
        tfBets.value = Controller.betAmount;
        //enableing the spin button
        spinBtn.disabled = false;
        //enabling the bet max button
        btnBetMax.disabled = false;
    };
    //this method will take go to the stats page and draws pie chart
    Controller.viewStatistics = function () {
        //checking if the player has played atleast one game
        if (!(Controller.numGamesLost > 0 || Controller.numGamesWon > 0)) {
            alert("Player must play at least one game to view stats!");
        }
        else {
            // Load google charts
            google.charts.load('current', { 'packages': ['corechart'] });
            google.charts.setOnLoadCallback(drawChart);
            // Draw the chart and set the chart values
            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Task', 'Games won/lost'],
                    ['Number of games WON', Controller.numGamesWon],
                    ['Number of games LOST', Controller.numGamesLost],
                ]);
                // Optional; add a title and set the width and height of the chart
                var options = { 'title': 'Number of games won/lost', 'width': 550, 'height': 400 };
                // Display the chart inside the <div> element with id="piechart"
                var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                chart.draw(data, options);
            }
            //Updating UI Values
            tfWon.value = Controller.numGamesWon;
            tfLost.value = Controller.numGamesLost;
            tfNet.value = (Controller.totalWonAmount - Controller.totalBets) / (Controller.numGamesWon + Controller.numGamesLost);
            //making the stats part visible
            statsContainer.style.display = "block";
        }
    };
    //this method will make a player object which can be used to save stats to fire base
    Controller.savePlayerStats = function () {
        //creating a player object
        var playerObject = new Player(Controller.numGamesWon, Controller.numGamesLost, Controller.totalBets, Controller.totalWonAmount);
        //creating a date and time object
        var currentdate = new Date();
        //making a string of the date
        var date = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear();
        //making a string of the time
        var time = currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        // =================== FIRE BASE Database CONNECTIVITY ===================
        //Creating a fire base reference
        var firebaseRef = firebase.database().ref();
        //pushing a player object as a JSON to firebase
        firebaseRef.push({
            Player_Statistics: {
                date: date,
                time: time,
                Number_of_games_won: playerObject.getNumGamesWon,
                Number_of_games_lost: playerObject.getNumGamesLost,
                Credits_netted_per_game: playerObject.calculateNetCreditsPerGame()
            }
        });
        msgSucess.style.display = "block";
    };
    //these static class varaible will hold the bet amount and credit amont in a single game
    Controller.betAmount = 0;
    Controller.creditAmount = 10;
    Controller.totalBets = 0;
    Controller.totalWonAmount = 0;
    Controller.numGamesWon = 0;
    Controller.numGamesLost = 0;
    //this variable is used a flag to check if bet max is already pressed
    Controller.betMaxCount = 0;
    return Controller;
}());
//=================================================================  PLAYER CLASS  =========================================================================
var Player = (function () {
    //player constructor
    function Player(numGamesWon, numGamesLost, totalBets, _totalWonAmount) {
        this._numGamesWon = numGamesWon;
        this._numGamesLost = numGamesLost;
        this._totalBets = totalBets;
        this._totalWonAmount = _totalWonAmount;
    }
    //this method calculates the number of credits netted per game
    Player.prototype.calculateNetCreditsPerGame = function () {
        return this._netCreditsPerGame = (this._totalWonAmount - this._totalBets) / (this._numGamesWon + this._numGamesLost);
    };
    Object.defineProperty(Player.prototype, "getNumGamesWon", {
        //getters
        get: function () {
            return this._numGamesWon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "getNumGamesLost", {
        get: function () {
            return this._numGamesLost;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "getTotalBets", {
        get: function () {
            return this._totalBets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "getTotalWonAmount", {
        get: function () {
            return this._totalWonAmount;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "getNetCreditsPerGame", {
        get: function () {
            return this._netCreditsPerGame;
        },
        enumerable: true,
        configurable: true
    });
    return Player;
}());
//=====================================================================  EVENT HANDLING ============================================================================
//defining the on click events for buttons
spinBtn.addEventListener("click", Controller.startSpinning);
btnBetOne.addEventListener("click", Controller.betOne);
btnBetMax.addEventListener("click", Controller.betMax);
btnAddCoin.addEventListener("click", Controller.addCoin);
btnReset.addEventListener("click", Controller.reset);
btnStatistics.addEventListener("click", Controller.viewStatistics);
btnSave.addEventListener("click", Controller.savePlayerStats);
//defining the on click events for reels
reel1HtmlObj.addEventListener("click", Controller.stopSpinningReels);
reel2HtmlObj.addEventListener("click", Controller.stopSpinningReels);
reel3HtmlObj.addEventListener("click", Controller.stopSpinningReels);
//defining the on click events for stats pop up buttons
close.onclick = function () {
    statsContainer.style.display = "none";
    msgSucess.style.display = "none";
};
// When the user clicks anywhere outside of the statsContainer, closeStatsContainer it
window.onclick = function (event) {
    if (event.target == statsContainer) {
        statsContainer.style.display = "none";
        msgSucess.style.display = "none";
    }
};
