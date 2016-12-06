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

            var charsAllowed = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'å', 'ä', 'ö'];
            var keyPressed = e.key.toLowerCase();

            // If the pressed key is not in the array below will return -1 (it is not allowed)
            if( charsAllowed.indexOf(keyPressed) !== -1 ) {
                self.checkChar(keyPressed);
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
                $('.game-over').fadeIn();
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
})(jQuery);
