var Module = (function() {

    var playerinput1 = "";
    var playerinput2 = "";

    //----------|
    // PAGES....|
    //----------|
    //Storing each container as a
    // Start Page:
    var startPage = $("#start");

    // Board page:
    var boardPage = $("#board");

    // Finished page
    var finishPage = $("#finish");

    $(document).ready(function() {
        // Initially hide all pages:
        hideAllPages();
        start.switchOn();
        $(".button").click(btnClicked);
        $("li.box").click(boxClicked);
        $("li.box").mouseover(mouseEnterBox).mouseleave(mouseLeaveBox);

    });


    // -------------|
    // CONSTRUCTORS:|
    // -------------|

    // Contructor page
    function Page(page) {
        this.page = page;
        this.isOn = false;
    }

    // Switch the page on:
    Page.prototype.switchOn = function() {
        this.isOn = true;
        this.page.show();
    };

    // Switch the page off:
    Page.prototype.switchOff = function() {
        this.isOn = false;
        this.page.hide();
    };

    // Creating objects from the constructor above:
    var start = new Page(startPage);

    // BOARD CONSTRUCTOR
    var board = new Page(boardPage);

    // FINISH CONSTRUCTOR
    var finish = new Page(finishPage);

    // The first player object:
    var player_O = {
        // name is stored in the global variables up top.
        name: playerinput1,
        // Keeping track of if it is the player's turn.
        turn: false,
        // The path to the svg image that shows up when hovering on an empty box.
        floatImage: "img/o.svg",
        // Class name for when a box is filled:
        boxFill: "box-filled-1",
        // Keeps track of if the player has won or not.
        winner: false
    };

    // The second player object:
    var player_X = {
        name: playerinput2,
        turn: false,
        floatImage: "img/x.svg",
        boxFill: "box-filled-2",
        winner: false
    };

    // Board constructor:
    function Board() {
        this.boxCollection = $.makeArray($("li.box"));
    }

    // This constructor is for switching players:
    Board.prototype.switchPlayer = function() {
        // If player O has the turn, remove that state from him and hand it over
        // to the other player
        if (player_O.turn) {
            player_X.turn = true;
            player_O.turn = false;
        } else if (player_X.turn) {
            player_O.turn = true;
            player_X.turn = false;
        } else if (!player_X.turn && !player_O.turn) {
            player_O.turn = true;
        }
    };

    // Create an instance of the board constructor.
    var mainBoard = new Board();


    // Creates a pattern and is stored until we want to check if a certain pattern
    // has come from the users playing:
    Board.prototype.patterns = function(first, second, third, playerFillClass) {
        // Store the user argument in a variable called playerClass.
        var playerClass = playerFillClass;
        // Create an array by assigning a variable to it.
        var pattern = [];
        // Push whatever part of the boxCollection that we give as arguments on the function.
        pattern.push(this.boxCollection[first - 1]);
        pattern.push(this.boxCollection[second - 1]);
        pattern.push(this.boxCollection[third - 1]);

        // Variable to be incremented everytime a match in the three long array is found.
        var patternCount = 0;
        // 1. Use the pattern array as a jquery object and go through it ->
        $(pattern).each(function() {
            // 2. -> to check if one of the playerfillclasses matches.
            if ($(this).hasClass(playerClass)) {
                // Increment patternCount to keep check on how many boxes are found
                // to be clicked:
                patternCount++;
            }
        });
        // If three patterns are found in the pattern search, we have found
        // the pattern and returns the pattern function true.
        if (patternCount === 3) {
            return true;
        } else {
            // If we do not match the pattern, return the function false
            return false;
        }
    };

    // -------------|
    // FUNCTIONS:---|
    // -------------|

    // Hide all pages for simplicity:
    function hideAllPages() {
        start.switchOff();
        board.switchOff();
        finish.switchOff();
    }


    // ---------------------------|
    // EVENT HANDLER FUNCTIONS:---|
    // ---------------------------|

    // When any of the two buttons (start and restart) are clicked, this function runs:
    function btnClicked() {
        // No matter what page we are using, toggle player 1's active class.
        $("#player1").toggleClass("active");
        //if the start page is currently showing, make it do what
        // it's supposed to do, switch the current page off and turn the board on:
        if (start.isOn) {
            // Initially giving the list item that shows whose player's turn it is
            start.switchOff();
            board.switchOn();
            player_O.turn = true;
            player_O.name = $("#playerinput1").val();
            player_X.name = $("#playerinput2").val();
        } else if (finish.isOn) {
            // run the reset function:
            reset();
        }
    }

    // Resets every value
    function reset() {
        // Remove the player names specified by the user(s):
        player_O.name = "";
        player_X.name = "";

        // Removes the necessary classes for every box:
        $("li.box").each(function() {
            $(this).removeClass("clicked");
            $(this).removeClass("box-filled-2");
            $(this).removeClass("box-filled-1");
        });

        // Player X is not starting:
        player_X.turn = false;
        // Player O is:
        player_O.turn = true;

        // If player O won, that means that we need to
        // toggle player 2's active class, if not, toggle player 1's class.
        //
        if (player_O.winner) {
            $("#player2").toggleClass("active");
        } else if (player_X.winner) {
            $("#player1").toggleClass("active");
        }

        // No one is the winner in the beginning of the game:
        player_X.winner = false;
        player_O.winner = false;

        // Switch the finish page off and switch the board on:
        finish.switchOff();
        board.switchOn();

    }

    // When any box is clicked:
    function boxClicked() {

        // Add the class of clicked to the clicked box:
        $(this).addClass("clicked");

        // If the box is already filled, don't to anything and return the function early
        if ($(this).hasClass("box-filled-1") || $(this).hasClass("box-filled-2")) {
            return;
        }
        // Based on which turn it is, fill the box with respective classes:
        if (player_O.turn) {
            $("#player1").toggleClass("active");
            $("#player2").toggleClass("active");
            $(this).addClass(player_O.boxFill);
        } else if (player_X.turn) {
            $("#player2").toggleClass("active");
            $("#player1").toggleClass("active");
            $(this).addClass(player_X.boxFill);
        }

        // 1. If any of the win patterns are filled by player O:
        if (mainBoard.patterns(1, 2, 3, "box-filled-1") ||
            mainBoard.patterns(4, 5, 6, "box-filled-1") ||
            mainBoard.patterns(7, 8, 9, "box-filled-1") ||
            mainBoard.patterns(1, 5, 9, "box-filled-1") ||
            mainBoard.patterns(3, 5, 7, "box-filled-1") ||
            mainBoard.patterns(1, 4, 7, "box-filled-1") ||
            mainBoard.patterns(2, 5, 8, "box-filled-1") ||
            mainBoard.patterns(3, 6, 9, "box-filled-1")) {

            // 2. Set player O to the winner and switch the board off
            // and turn the finish page on:
            player_O.winner = true;
            board.switchOff();
            finish.switchOn();

            // 1. If any of the win patterns are filled by player X:
        } else if (
            mainBoard.patterns(1, 2, 3, "box-filled-2") ||
            mainBoard.patterns(4, 5, 6, "box-filled-2") ||
            mainBoard.patterns(7, 8, 9, "box-filled-2") ||
            mainBoard.patterns(1, 5, 9, "box-filled-2") ||
            mainBoard.patterns(3, 5, 7, "box-filled-2") ||
            mainBoard.patterns(1, 4, 7, "box-filled-2") ||
            mainBoard.patterns(2, 5, 8, "box-filled-2") ||
            mainBoard.patterns(3, 6, 9, "box-filled-2")) {

            // 2. Set player X to the winner and switch the board off
            // and the turn the finish page on:
            player_X.winner = true;
            board.switchOff();
            finish.switchOn();

        }
        // Removing the classes if a game was prevoiously played.
        $("#finish").removeClass("screen-win-one");
        $("#finish").removeClass("screen-win-two");
        // If it's a draw: only Switch page:
        if (isDraw()) {
            board.switchOff();
            finish.switchOn();
        }

        // if player O is the winner add appropriate classes and styles:
        if (player_O.winner) {
            $("#finish").addClass("screen-win-one");
            // if the player has not specified a name, just show "winner"
            if (player_O.name === "") {
                $("p.message").text("Winner!");
            }
            // if the player has specified a name, display it:
            else {
                $("p.message").text(player_O.name + " is the winner!");
            }
            $(".screen").css({
                "background": "#ffa005",
                "color": "white"
            });

        } else if (player_X.winner) {
            $("#finish").addClass("screen-win-two");
            if (player_X.name === "") {
                $("p.message").text("Winner!");
            } else {
                $("p.message").text(player_X.name + " is the winner!");
            }
            $(".screen").css({
                "background": "#3b8ac1",
                "color": "#fff"
            });
        }
        // if it's a draw, just add the right text and styles.
        else if (isDraw()) {
            $("p.message").text("It's a draw!");
            $(".screen").css({
                "background": "#2ecc71",
                "color": "#fff"
            });
        }



        // Switch players once everything else has ran:
        mainBoard.switchPlayer();
    }

    // Function to be called when the user moves the mouse over a box.
    function mouseEnterBox() {
        // If the mouse enters the box and it is already picked, return the function early
        if ($(this).hasClass("box-filled-1") || $(this).hasClass("box-filled-2")) {
            return;
        }

        // If it is player O's turn, give it the float image.
        if (player_O.turn) {
            $(this).css({
                'background-image': "url(" + player_O.floatImage + ")"
            });
            // If it is player X's turn, give it the float image.
        } else if (player_X.turn) {
            $(this).css({
                "background-image": "url(" + player_X.floatImage + ")"
            });
        }
    }

    // Function for when the user moves the mouse out of the box:
    function mouseLeaveBox() {
        if (player_O.turn) {
            $(this).css({
                "background-image": ""
            });
        } else if (player_X.turn) {
            $(this).css({
                "background-image": ""
            });
        }
    }

    // Is it a draw?
    function isDraw() {
        // Variable for keeping count on how many boxes that have been clicked.
        var fillCount = 0;
        //1. For each box
        $("li.box").each(function() {
            // 2. Increment the fillCount variable:
            if ($(this).hasClass("clicked")) {
                fillCount++;
            }
        });

        // If the fillcount is nine, that means that the whole board is filled,
        // in that case, we'll return the function isDraw()(?) to true.
        if (fillCount === 9) {
            return true;
        }
        // If it is not, return the function isDraw()(?) false
        else {
            return false;
        }
    }


}());
