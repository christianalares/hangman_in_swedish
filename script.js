(function($) {
    var Hangman = {
        // ----------------------------------------
        // Init
        // ----------------------------------------
        init: function() {
            var self = this;

            // Reset everything
            self.resetParameters();

            // Set the array of availible words
            self.fetchWords(function() {
                // Choose a random word from that array
                self.chooseWord();

                // Bind events
                self.bindEvents();

                // Render the "_ _ _ _"-word on the page
                self.renderWord();
            });
        },

        // ----------------------------------------
        // Bind events
        // ----------------------------------------
        bindEvents: function() {
            $(document).on('keydown', this.guessChar);
            $('.game-over button, .game-won button').on('click', this.init.bind(this));
        },

        // ----------------------------------------
        // Reset all parameters and hide certain things
        // ----------------------------------------
        resetParameters: function() {
            this.wrongGuessedLetters = [];
            this.words = [];
            this.correctWord = [];
            $('.wrong-letters').html('');
            $('.wrong-wrap div, .game-over, .game-won').hide();
        },

        // ----------------------------------------
        // Create words
        // ----------------------------------------
        fetchWords: function(cb) {
            var self = this;
            // this.words = ['TEST', 'HEJSAN', 'CHOKLADBOLL', 'SVEJ'];
            // this.words = ['HEJE'];

            $.ajax({
                url: 'words.txt',
                success: function(data) {
                    self.words = data.split('\n');
                }
            }).done(function() {
                cb.call();
            });

            // self.words = ['TJENA', 'HEJ'];
            // console.log( self.words );

        },

        // ----------------------------------------
        // Select word
        // ----------------------------------------
        chooseWord: function() {
            // Take a random number from 0 - this.words.length and select that index from this.words
            this.correctWord = this.words[Math.floor(Math.random() * this.words.length)];
        },

        // ----------------------------------------
        // Render the invisible word
        // ----------------------------------------
        renderWord: function() {
            var $word = $('.word');
            $word.html('');

            for (var i = 0; i < this.correctWord.length; i++) {
                $word.prepend('<span class="char">&nbsp;</span>');
            }

        },

        // ----------------------------------------
        // Guess character
        // ----------------------------------------
        guessChar: function(e) {
            var self = Hangman;


            // var charsAllowed = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'å', 'ä', 'ö'];
            // var keyPressed = e.key.toLowerCase();

            var charsAllowed = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 219, 222, 186];
            var keyPressed = e.originalEvent.keyCode;

            var letterPressed = self.parseKey(keyPressed);

            // If the pressed key is not in the array below will return -1 (it is not allowed)
            if( charsAllowed.indexOf(keyPressed) !== -1 ) {
                self.checkChar(letterPressed);
            }
        },

        // ----------------------------------------
        // Parse keyCode to letter
        // ----------------------------------------
        parseKey: function(keyCode) {
            switch(keyCode) {
                case 65: return 'a'; break;
                case 66: return 'b'; break;
                case 67: return 'c'; break;
                case 68: return 'd'; break;
                case 69: return 'e'; break;
                case 70: return 'f'; break;
                case 71: return 'g'; break;
                case 72: return 'h'; break;
                case 73: return 'i'; break;
                case 74: return 'j'; break;
                case 75: return 'k'; break;
                case 76: return 'l'; break;
                case 77: return 'm'; break;
                case 78: return 'n'; break;
                case 79: return 'o'; break;
                case 80: return 'p'; break;
                case 81: return 'q'; break;
                case 82: return 'r'; break;
                case 83: return 's'; break;
                case 84: return 't'; break;
                case 85: return 'u'; break;
                case 86: return 'v'; break;
                case 87: return 'w'; break;
                case 88: return 'x'; break;
                case 89: return 'y'; break;
                case 90: return 'z'; break;
                case 219: return 'å'; break;
                case 222: return 'ä'; break;
                case 186: return 'ö'; break;
                default: return;
            }
        },

        // ----------------------------------------
        // Checking the guessed char
        // ----------------------------------------
        checkChar: function(char) {
            var letters = this.correctWord.toLowerCase().split('');
            var correctChars = [];

            for (var i = 0; i < letters.length; i++) {
                if (char === letters[i]) {
                    // Add the correct guess span jQuery object to correctChars array
                    correctChars.push( $('.char:nth-child(' + (i + 1) + ')').addClass('done') );
                }
            }

            // Loop through the correctChars array and add the guessed letter to it
            for (var i = 0; i < correctChars.length; i++) {
                correctChars[i].text(char);
            }

            // If the correctChars array is empty then the user guessed wrong (since there hasn't been pushed anything to it)
            if(correctChars.length === 0) {
                this.wrongLetter(char);
            }

            // If the length of '.char.done' is 0 then the word is completed
            if( $('.char:not(.done)').length === 0 ) {
                $(document).off('keydown');
                $('.game-won').fadeIn();
            }
        },

        // ----------------------------------------
        // When user types the wrong letter
        // ----------------------------------------
        wrongLetter: function(char) {
            if( this.wrongGuessedLetters.indexOf(char) === -1 ) {
                this.wrongGuessedLetters.push(char);
                $('.wrong-letters').append('<span>'+ char +'</span>');
                this.renderMan(this.wrongGuessedLetters.length);
            }
            else {
                // this.flashScreen();
            }

            if(this.wrongGuessedLetters.length === 10) {
                $(document).off('keydown');
                $('.game-over').fadeIn().find('.correct-word').text('Rätt ord: ' + this.correctWord);
            }
        },

        // ----------------------------------------
        // Render the hangman
        // ----------------------------------------
        renderMan: function(i) {
            $('.wrong' + i).fadeIn('fast');
        }
    }

    Hangman.init();

    // $(document).on('keydown', function(e) {
    //     console.log( e.key, e.keyCode );
    // });
})(jQuery);
