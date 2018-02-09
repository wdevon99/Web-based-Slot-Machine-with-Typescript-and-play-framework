//creating reel objects variables to hold reel objects (THESE ARE INSTANTIATED IN THE CONTROLLER CLASS)
let reel1: Reel;
let reel2: Reel;
let reel3: Reel;

//Getting the buttons by id and saving in to variables
let spinBtn = document.getElementById("btnSpin");
let btnBetOne = document.getElementById("btnBetOne");
let btnBetMax = document.getElementById("btnBetMax");
let btnAddCoin = document.getElementById("btnAddCoin");
let btnReset = document.getElementById("btnReset");
let btnStatistics = document.getElementById("btnStatistics");

//Getting the reels by text fields and labels and saving in to variables
let tfBets = document.getElementById("tfBets");
let tfCredits = document.getElementById("tfCredits");
let tfMessage = document.getElementById("tfMessage");


//Getting the reels by id and saving in to variables
let reel1HtmlObj = document.getElementById("reel1HtmlObj");
let reel2HtmlObj = document.getElementById("reel2HtmlObj");
let reel3HtmlObj = document.getElementById("reel3HtmlObj");

// Get the statsContainer
let statsContainer = document.getElementById('statsContainer');
// Get the elements in the statsContainer
let close = document.getElementById("close");
let tfWon = document.getElementById("tfWon");
let tfLost = document.getElementById("tfLost");
let tfNet = document.getElementById("tfNet");
let btnSave = document.getElementById("btnSave");
let msgSucess=document.getElementById("msgSucess");


//=============================================================  ISYMBOL INTERFACE =================================================================
interface ISymbol {

    //this method sets the image associated with one of the symbols in a reel
    setImage(s: String): void;

    //this method return the image
    getImage(): String;

    //this method which sets the value of the symbol
    setValue(v: number): void;

    //this method returns the value of the symbol.
    getValue(): number;

}


//=============================================================  SYMBOL CLASS =====================================================================
class Symbol implements ISymbol {


    //instance variables of the symbol class
    private url: string; //stores the location of the image
    private value: number; //stores the value accoiated with the image
    symbolName: string;//this holds the name of the symbol

    //the constructor of the symbol class
    constructor(symbolName: string, value: number) {
        this.setImage(symbolName);
        this.setValue(value);
    }

    //this methods are overidden methods of the isymbol interface
    setImage(symbolName: String): void {
        this.url = "assets/images/" + symbolName + ".png";
    }

    getImage(): String {
        return this.url; //to get the url of image
    }

    setValue(v: number): void {
        this.value = v;
    }

    getValue() {
        return this.value; //to get the value
    }


}

//=============================================================  REEL CLASS =====================================================================

class Reel {

    //this array is made to contontain symbol objects
    private static arrayOfSymbols = []; //the type is  symbols array

    private reelIntervalState; //this variable saves the state of the reel

    private _finalValue: number;//this variable is used to store the final url when the reel is stopped


    //reel constructor
    constructor() {
    }

    //this method adds the symbols the the arrayOfSymbols and returns it
    public static getArrayOfSymbols() {
        //pushing new symbol objects the the array of symbols
        this.arrayOfSymbols.push(new Symbol("redseven", 7));
        this.arrayOfSymbols.push(new Symbol("bell", 6));
        this.arrayOfSymbols.push(new Symbol("watermelon", 5));
        this.arrayOfSymbols.push(new Symbol("plum", 4));
        this.arrayOfSymbols.push(new Symbol("lemon", 3));
        this.arrayOfSymbols.push(new Symbol("cherry", 2));

        return this.arrayOfSymbols; //returning the filled array

    }

    //this function spin a single reel
    public spinAReel(anyReelHtmlObj, arrayOfSymbols: Symbol[]) {

        let self = this;//this is to avoid final

        this.reelIntervalState = intervalSetter();//this is to get the state so the the reels can be stopped

        function intervalSetter(): number {
            return setInterval(() => {

                let randomNumber = Math.floor(Math.random() * 6);//this will generate a random number between 1 and 6

                anyReelHtmlObj.src = arrayOfSymbols[randomNumber].getImage(); //setting the html obj with a random img src

                self._finalValue = arrayOfSymbols[randomNumber].getValue(); //getting the value of the finnaly left out symbols


            }, 80); //delay for 80 milli seconds
        }


    }

    stopAReel() {
        //This method will make the current reel stop spinning
        clearInterval(this.reelIntervalState);
    }

    //getters
    get getFinalValue(): number {
        return this._finalValue;
    }

}

//=============================================================  CONTROLLER CLASS =====================================================================


class Controller {

    //these static class varaible will hold the bet amount and credit amont in a single game
    static betAmount: number = 0;
    static creditAmount: number = 10;

    static totalBets: number = 0;
    static totalWonAmount: number = 0;

    static numGamesWon: number = 0;
    static numGamesLost: number = 0;

    //this variable is used a flag to check if bet max is already pressed
    static betMaxCount: number=0;

    //TODO

    //this function will start spinning the three reels
    static startSpinning() {

        //checking if credits is more than zero
        if (!(Controller.creditAmount > 0)) {

            alert("Credits should be more than zero to play : Use the ADD COIN button to add credits!")

        } else if (!(Controller.betAmount > 0)) {

            alert("Bets should be more than zero to play : Use the Bet one or BET MAX to bet!")

        } else {
            //getting the symbols array
            let symbolsArray = Reel.getArrayOfSymbols();

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
            Controller.betMaxCount=0;

        }


    }

    //this function stops the three reels from spinning
    static stopSpinningReels() {
        //this method will check if the player has won or lost and displays it.
        Controller.determineResult();

        //Stopping all three reels
        reel1.stopAReel()
        reel2.stopAReel()
        reel3.stopAReel()

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


    }

    //================= CALCULATION AREA ============================

    //this method will check if the player has won or lost and displays it.
    static determineResult() {

        let reel1Val: number = reel1.getFinalValue;
        let reel2Val: number = reel2.getFinalValue;
        let reel3Val: number = reel3.getFinalValue;

        //this condition checks if all thee reels have the same symbol
        if (reel1Val == reel2Val && reel1Val == reel3Val) {

            //this method calcalte the final won amount and also update Ui
            let wonAmount = Controller.calculateWonAmountAndUpdateUI(reel1Val);

            //incrementing the num of games won variable
            Controller.numGamesWon++;

            tfMessage.innerHTML = "YOU WIN";
            alert("You win with ALL symbols matching! And you won $" + wonAmount)


            //this condition checks if 1st two reel are same or 1st and 3rd reels are with same valued symbols
        } else if (reel1Val == reel2Val || reel1Val == reel3Val) {

            //incrementing the num of games won variable
            Controller.numGamesWon++;

            //this method calcalte the final won amount and also update Ui
            let wonAmount = Controller.calculateWonAmountAndUpdateUI(reel1Val);
            tfMessage.innerHTML = "YOU WIN";
            alert("You win with TWO symbols matching! And u won $" + wonAmount)


            //this condition check if the second and third reel have the same symbol value
        } else if (reel2Val == reel3Val) {

            //incrementing the num of games won variable
            Controller.numGamesWon++;

            //this method calcalte the final won amount and also update Ui
            let wonAmount = Controller.calculateWonAmountAndUpdateUI(reel2Val);

            tfMessage.innerHTML = "YOU WIN";
            alert("You win with TWO symbols matching! And u won $" + wonAmount);

        } else {
            //incrementing the num of games Lost variable
            Controller.numGamesLost++;

            tfMessage.innerHTML = "YOU LOST";
            alert("You Lost!")

            //resetting the bet amount to zero
            Controller.betAmount = 0;
            //== updating UI ==
            tfBets.value = 0;
        }

    }

    //===========

    //this method calcalte the final won amount and also update Ui -- it also return the won amount
    static calculateWonAmountAndUpdateUI(val: number): number {

        //calculating won amount
        let wonAmount = val * Controller.betAmount;

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


        return wonAmount;//return the won amount
    }

    //=============================================

    //this method will add 1 credits to the bet area
    static betOne(): void {

        //checcking if credits is more than 0
        if (Controller.creditAmount > 0) {
            //decrementing the credit amount
            --Controller.creditAmount;
            //incrementing the bet amount
            ++Controller.betAmount;
        } else {
            alert("You can not bet one : Credits are over ,press add coin button to add coins!")
        }


        //== updating ui ==
        //setting with credit amount
        tfCredits.value = Controller.creditAmount;
        //setting with bet amount
        tfBets.value = Controller.betAmount;

    }



    //this method will add 3 credits to the bet area
    static betMax(): void {

        //checcking if credits is more than 0
        if (Controller.creditAmount > 3) {

            //checking if the bet max button is already clicked once
            if (Controller.betMaxCount==0){

                //decrementing the credit amount
                Controller.creditAmount -= 3;
                //incrementing the bet amount
                Controller.betAmount += 3;

                Controller.betMaxCount=1;

            }else {

                alert("You can not bet max twice in a single game !")
            }

        } else {
            alert("You can not bet max : Credits are less than three ,press add coin button to add coins!")
        }


        //== updating ui ==
        //setting with credit amount
        tfCredits.value = Controller.creditAmount;
        //setting with bet amount
        tfBets.value = Controller.betAmount;

    }

    //this method will add 1 credits to the credit area each time the add coin button is pressed
    static addCoin(): void {

        //incrementing the credits
        ++Controller.creditAmount;
        //== updating ui ==
        //setting with credit amount
        tfCredits.value = Controller.creditAmount;

    }

    //this method will add 1 credits to the credit area each time the add coin button is pressed
    static reset(): void {


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

    }

    //this method will take go to the stats page and draws pie chart
    static viewStatistics(): void {

        //checking if the player has played atleast one game
        if (!(Controller.numGamesLost >0 || Controller.numGamesWon>0)){

            alert("Player must play at least one game to view stats!")

        }else {

            // Load google charts
            google.charts.load('current', {'packages': ['corechart']});
            google.charts.setOnLoadCallback(drawChart);

            // Draw the chart and set the chart values
            function drawChart() {
                var data = google.visualization.arrayToDataTable([
                    ['Task', 'Games won/lost'],
                    ['Number of games WON', Controller.numGamesWon],
                    ['Number of games LOST', Controller.numGamesLost],

                ]);

                // Optional; add a title and set the width and height of the chart
                var options = {'title': 'Number of games won/lost', 'width': 550, 'height': 400};
                // Display the chart inside the <div> element with id="piechart"
                var chart = new google.visualization.PieChart(document.getElementById('piechart'));
                chart.draw(data, options);
            }

            //Updating UI Values
            tfWon.value = Controller.numGamesWon;
            tfLost.value = Controller.numGamesLost;
            tfNet.value = (Controller.totalWonAmount - Controller.totalBets ) / (Controller.numGamesWon + Controller.numGamesLost);

            //making the stats part visible
            statsContainer.style.display = "block";

        }

    }


    //this method will make a player object which can be used to save stats to fire base
    static savePlayerStats(): void {

        //creating a player object
        let playerObject = new Player(Controller.numGamesWon, Controller.numGamesLost, Controller.totalBets, Controller.totalWonAmount);

        //creating a date and time object
        let currentdate = new Date();

        //making a string of the date
        let date = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear();
        //making a string of the time
        let time = currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"

            + currentdate.getSeconds();

        // =================== FIRE BASE Database CONNECTIVITY ===================
        //Creating a fire base reference
        let firebaseRef = firebase.database().ref();

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

        msgSucess.style.display="block";

    }


}


//=================================================================  PLAYER CLASS  =========================================================================
class Player {

    //instance variables of the player
    private _numGamesWon: number;
    private _numGamesLost: number;
    private _totalBets: number;
    private _totalWonAmount: number;
    private _netCreditsPerGame: number;


//player constructor
    constructor(numGamesWon: number, numGamesLost: number, totalBets: number, _totalWonAmount: number) {

        this._numGamesWon = numGamesWon;
        this._numGamesLost = numGamesLost;
        this._totalBets = totalBets;
        this._totalWonAmount = _totalWonAmount;

    }

    //this method calculates the number of credits netted per game
    calculateNetCreditsPerGame(): number {
        return this._netCreditsPerGame = (this._totalWonAmount - this._totalBets) / (this._numGamesWon + this._numGamesLost);
    }

    //getters
    public get getNumGamesWon(): number {
        return this._numGamesWon;
    }

    get getNumGamesLost(): number {
        return this._numGamesLost;
    }

    get getTotalBets(): number {
        return this._totalBets;
    }

    get getTotalWonAmount(): number {
        return this._totalWonAmount;
    }

    get getNetCreditsPerGame(): number {
        return this._netCreditsPerGame;
    }


}

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
    msgSucess.style.display="none";
}
// When the user clicks anywhere outside of the statsContainer, closeStatsContainer it
window.onclick = function (event) {
    if (event.target == statsContainer) {
        statsContainer.style.display = "none";
        msgSucess.style.display="none";
    }
}






