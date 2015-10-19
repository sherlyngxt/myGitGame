

//Note: This game is designed by laptop users with mousepads and no mouse.
//Kindly play it on a laptop with mousepad as well. If played using a mouse, it might be too easy.


//http://speckyboy.com/demo/windmill-demo/index.html


require.config({
    paths: {"jsaSound": "http://animatedsoundworks.com:8001"}
});


require(
    ["jsaSound/jsaModels/jsaFMnative2"],
    function (nativeFactory) {
            
        console.log("yo, I'm alive!");


        var paper = new Raphael(document.getElementById("mySVGCanvas"));

        // Made the dimensions of the paper variables so that they can be referred to for the background.
        var pWidth = paper.canvas.offsetWidth;
        var pHeight = paper.canvas.offsetHeight;

        // Gave the game a nice background by creating a rectangle that covers the paper and filling it with an online image
        var background = paper.rect(0,0,pWidth,pHeight).attr({
            fill:"url(http://heartfelt.med.ubc.ca/files/2012/07/wood-background.png)"
        });

        var counter; // Counts clicks on target object  
        var totalcount;
        var time = 0; // Set the time at the start of the game

        // startButton with text on top
        var startButton = paper.circle(300, 200, 40);
        var startText = paper.text(300, 200, 'START');

        // Styled the startButton
        startButton.attr({
            stroke: "black",
            fill: "white",
            "stroke-width":3
        });

        // Styled the text of the startButton
        startText.attr({
            stroke: "navy",
            "font-family": "phosphate",
            "font-size": 22
        })
        
        // Start button is hidden during the game 
        startButton.hide();
        startText.hide();

        // Unhides the start button
        var ready = function(){
            startButton.show();
            startText.show();
        }

        // Create the target rectangle and put it "off screen" where it can't be seen until the game starts
        var target = paper.rect(-100, -100, 100, 100);


        var soundplay = function(){

                native.setParam("play", 1);
                native.setParam("Release Time", 0.05);
                
                var soundOff = setTimeout(function(){
                    native.setParam("play", 0);
                }, 100);  

        }


        // Called when the start button is clicked to hide the startButton and begin the game
        var start = function(){

            // Created a prompt with the game instructions and for users to select their difficulty level from 1-3
            var difficulty = prompt("~WELCOME TO CLICK THE SQUARE~\nHow to play:\nClick the moving target as many times as you can.\nYou have 10 seconds!\n\nPlease enter the difficulty level:\n1 = Easy\n2 = Moderate\n3 = Extreme", "1");
           

            console.log("Game is starting!");

            // Unhides startButton and the text
            startButton.hide();
            startText.hide();

            var backgroundSound = new Audio('resources/harp.wav');
            backgroundSound.play();
        

            // Sets counter to zero at the start of game
            counter = 0;

            // Time count increases by 1 every 1 second
            var myTicker = setInterval( function(){
                time++;  // same as: time = time +1
                console.log(time + " seconds have passed.");
            }, 1000);

            // 10 seconds after start button is clicked: timer stops, targer movement stops
            var reset = setTimeout(function(){
                clearInterval(myTicker);
                clearInterval(moveSquare);
                backgroundSound.pause();

                console.log("10 seconds have passed. Timer is reset.");

                // Moves the target off screen
                target.attr({
                    x: -100,
                    y: -100
                });

                // startButton appears back on screen
                ready();    

                // Informs the user on the results of the game
                confirm("You clicked on the square " + counter + " times!");

            }, 10000);



                // Scaled the level of difficulty of the game based one the levels of 1-3
                if(difficulty === '1') { // At the easiest level, the target is biggest. It moves and changes direction at the slowest rate
                    rate = 20;
                    timesquare = 160;
                    timechange = 1100;
                    target.attr({ 
                        'width': 100,
                        'height': 100,
                        stroke: "black",
                        fill: "url(http://i1.cpcache.com/product_zoom/641778516/navy_blue_white_stripes_shower_curtain.jpg?color=White&height=460&width=460&padToSquare=true)"
                    })
                }

                if(difficulty === '2') {
                    rate = 25;
                    timesquare = 140;
                    timechange = 1050;
                    target.attr({
                        'width': 85,
                        'height': 75,
                        stroke: "black",
                        fill: "url(http://www.hawthornethreads.com/images/riley_blake_designs/300/riley_blake_designs_house_designer_chevron_in_black_and_gold.png)"
                    })
                }

                if(difficulty === '3') { // At the extreme level, the target is biggest. It moves and changes direction at the fastest rate
                    rate = 30;
                    timesquare = 120;
                    timechange = 1000;
                    target.attr({
                        'width': 70,
                        'height': 70,
                        stroke: "black",
                        fill: "url(https://s-media-cache-ak0.pinimg.com/236x/1c/1b/ee/1c1bee05155846a8abbb8ef88434c2d2.jpg)"
                    })                  
                }

                target.xrate = rate;
                target.yrate = rate;

                // Established a random starting position for the target
                target.xpos = randInt(0,500);
                target.ypos = randInt(0,300);

            // Made the target be in constant motion around the screen, frequently changing direction
            var moveSquare = setInterval( function(){

                target.xpos = target.xpos + target.xrate;
                target.ypos = target.ypos + target.yrate;

                target.attr({
                    x: target.xpos,
                    y: target.ypos
                });    
            
            // Created boundaries for the target to move so that it will not move out of the screen
                if (target.ypos >= 300) {
                    target.yrate = -rate
                }
                
                if (target.ypos <= 0) {
                    target.yrate = rate
                }

                if (target.xpos >= 500) {
                    target.xrate = -rate
                }
                
                if (target.xpos <= 0) {
                    target.xrate = rate
                }

            // target moves at a different speed depending on difficulty level
            },timesquare);

            // Made the target change direction randomly at different intervals (timechange) and rates (rate) depending on difficulty level
            var changeDirection = setInterval( function(){
                target.yrate = randInt(-rate*1.5,rate*1.5);
                target.xrate = randInt(-rate*1.5,rate*1.5);
            },timechange);

        }


        // Counts the number of clicks on the target
        var clickSquare = function(){
            counter++;
            console.log("You have clicked on the square " + counter + " times.");
            soundplay();
        }

        // Created addEventListeners to both the startButton and the startText so that the game will load when any part of the button is clicked
        startButton.node.addEventListener('click', start);
        startText.node.addEventListener('click', start);

        // Return a random integer between m and n inclusive
        var randInt = function (m, n){
            var range = n-m+1;
            var frand = Math.random()*range;
            return m+Math.floor(frand);
        }

        // When target is clicked, clickSquare function is activated to count the number of clicks on target
        target.node.addEventListener('click', clickSquare);

        // startButton appears once page is loaded
        ready();


    var native = nativeFactory();
        native.setParam("play", 0);    //or// native.setParamNorm("play", 0.000);
        native.setParamNorm("Carrier Frequency", 0.48);    //or// native.setParamNorm("Carrier Frequency", 0.300);
        native.setParamNorm("Modulation Index", 0.05);    //or// native.setParamNorm("Modulation Index", 0.010);
        native.setParamNorm("Modulator Frequency", 0.7);    //or// native.setParamNorm("Modulator Frequency", 0.150);
        native.setParam("Gain", 0.7);    //or// native.setParamNorm("Gain", 0.250);
        native.setParam("Attack Time", 0.05);    //or// native.setParamNorm("Attack Time", 0.050);
        native.setParam("Release Time", 0.05);    //or// native.setParamNorm("Release Time", 0.333);


    }
);





