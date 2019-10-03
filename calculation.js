
 var currentquestion = 0,
     counterLimite = 0,
     score = 0,
     submt = true,
     picked;

 $(document).ready(function ($) {


     function htmlEncode(value) {
         return $(document.createElement('div')).text(value).html();
     }


     function addChoices(choices) {
         if (typeof choices !== "undefined" && $.type(choices) == "array") {
             $('#choice-block').empty();
             for (var i = 0; i < choices.length; i++) {
                 $(document.createElement('li')).addClass('choice choice-box').attr('data-index', i).text(choices[i]).appendTo('#choice-block');
             }
         }
     }

     function nextQuestion() {
        currentquestion = generateRandom(1, 4);// change 
        submt = true;
         $('#explanation').empty();
         $('#question').text(quiz[currentquestion]['question']);
         $('#pager').text('আপনি 5 টি প্রশ্নের মধ্যে এখন ' + Number(counterLimite + 1) +' নং প্রশ্নের উত্তর দিবেন');
         if (quiz[currentquestion].hasOwnProperty('image') && quiz[currentquestion]['image'] != "") {
             if ($('#question-image').length == 0) {
                 $(document.createElement('img')).addClass('question-image').attr('id', 'question-image').attr('src', quiz[currentquestion]['image']).attr('alt', htmlEncode(quiz[currentquestion]['question'])).insertAfter('#question');
             } else {
                 $('#question-image').attr('src', quiz[currentquestion]['image']).attr('alt', htmlEncode(quiz[currentquestion]['question']));
             }
         } else {
             $('#question-image').remove();
         }
         addChoices(quiz[currentquestion]['choices']);
         setupButtons();


     }


     function processQuestion(choice) {
         if (quiz[currentquestion]['choices'][choice] == quiz[currentquestion]['correct']) {
             $('.choice').eq(choice).css({
                 'background-color': '#50D943'
             });
             var rightAu = new Audio("audio/Correct-answer-sound-effects.mp3");
             rightAu.play();
             $('#explanation').html('<strong>আপনি সঠিক উত্তর প্রদান করেছেন।</strong> ');
             score++;
         } else {
             $('.choice').eq(choice).css({
                 'background-color': '#D92623'
             });
             var wrongAu = new Audio("audio/Wrong-answer-sound-effect.mp3");
             wrongAu.play();
             $('#explanation').html('<strong>আপনি ভুল উত্তর প্রদান করেছেন। সঠিক উত্তর: </strong> ' + htmlEncode(quiz[currentquestion]['explanation']));
         }
         counterLimite++;
         //currentquestion++;
         $('#submitbutton').html('পরের প্রশ্ন &raquo;').on('click', function () {
             if (counterLimite == 5) {
                 endQuiz();
                 $('.reStartTime').show();
             } else {
                 $(this).text('উত্তর যাচাই করেন').css({
                     'color': '#222'
                 }).off('click');
                 nextQuestion();
             }
         })
     }


     function setupButtons() {
         $('.choice').on('mouseover', function () {
             $(this).css({
                 'background-color': '#e1e1e1'
             });
         });
         $('.choice').on('mouseout', function () {
             $(this).css({
                 'background-color': '#1B232F'
             });
         })
         $('.choice').on('click', function () {
             picked = $(this).attr('data-index');
             $('.choice').removeAttr('style').off('mouseout mouseover');
             $(this).css({
                 'border-color': '#222',
                 'font-weight': 700,
                 'color' : 'green',
                 'background-color': '#c1c1c1'
             });
             //nextQuestion();
             if (submt) {
                 submt = false;
                 $('#submitbutton').css({
                     'color': '#000'
                 }).on('click', function () {
                     $('.choice').off('click');
                     $(this).off('click');
                     processQuestion(picked);
                 });
             }
         })
     }


     function endQuiz() {
         $('#pager').hide();
         $('#explanation').empty();
         //$('#prize').empty();
         $('#question').empty();
         $('#choice-block').empty();
         $('#submitbutton').remove();
         $('#question').text("আপনি 5 টি প্রশ্নের মধ্যে " + score + " টিতে সঠিক উত্তর প্রদান করেছেন। ধন্যবাদ।");

          if(score >= 5 ){
            $('#question').text("অভিনন্দন, আপনি পুরস্কার জিতে নিয়েছেন।");
            var congraAu = new Audio("audio/congratulations.mp3");
            congraAu.play();
          }
         
          $(document.createElement('h2')).css({
             'text-align': 'center',
             'font-size': '4em'
         }).text(Math.round(score / 5 * 100) + '%').insertAfter('#question');
     }



     function init() {
         //add title
         if (typeof quiztitle !== "undefined" && $.type(quiztitle) === "string") {
             $(document.createElement('h1')).text(quiztitle).appendTo('.row #frame');
         } else {
             $(document.createElement('h1')).text("Quiz").appendTo('.row #frame');
         }

         //add pager and questions
         if (typeof quiz !== "undefined" && $.type(quiz) === "array") {
             //add pager
             $(document.createElement('p')).addClass('pager').attr('id', 'pager').text('আপনি 5 টি প্রশ্নের মধ্যে এখন 1 নং প্রশ্নের উত্তর দিবেন').appendTo('.row #frame');
             //add first question
             $(document.createElement('h2')).addClass('question').attr('id', 'question').text(quiz[0]['question']).appendTo('.row #frame');
             //add image if present
             if (quiz[0].hasOwnProperty('image') && quiz[0]['image'] != "") {
                 $(document.createElement('img')).addClass('question-image').attr('id', 'question-image').attr('src', quiz[0]['image']).attr('alt', htmlEncode(quiz[0]['question'])).appendTo('.row #frame');
             }
             $(document.createElement('p')).addClass('explanation').attr('id', 'explanation').html('&nbsp;').appendTo('.row #frame');

             //questions holder
             $(document.createElement('ol')).attr('id', 'choice-block').appendTo('.row #frame');
             //add choices
             addChoices(quiz[0]['choices']);

             //add submit button
             $(document.createElement('div')).addClass('choice-box').attr('id', 'submitbutton').text('উত্তর যাচাই করেন').css({
                 'font-weight': 700,
                 'color': '#222',
                 'padding': '30px 0'
             }).appendTo('.row #frame');

             setupButtons();
         }
     }

     init();
 });




 // timer function

    $('.reStartTime').on('click', function(){
        window.location.reload(true);
    });


    $('.startTime').on('click', function(){
        
        $('.startTime').hide();

        function countdown( elementName, minutes, seconds )
        {
            function endQuiz() {
                $('#pager').hide();
                $('#explanation').empty();
                //$('#prize').empty();
                $('#frame h2').html('');
                $('#question').empty();
                $('#choice-block').empty();
                $('#submitbutton').remove();
                $('#question').text("আপনি 5 টি প্রশ্নের মধ্যে " + score + " টিতে সঠিক উত্তর প্রদান করেছেন। ধন্যবাদ।");
       
                //  if(score >= 5 ){
                //    $('#question').text("অভিনন্দন, আপনি পুরস্কার জিতে নিয়েছেন।");
                //    var congraAu = new Audio("audio/congratulations.mp3");
                //    congraAu.play();
                //  }
                
                 $(document.createElement('h2')).css({
                    'text-align': 'center',
                    'font-size': '4em'
                }).text(Math.round(score / 5 * 100) + '%').insertAfter('#question');
            }
            
            var element, endTime, hours, mins, msLeft, time;
        
            function twoDigits( n )
            {
                return (n <= 9 ? "0" + n : n);
            }
        
            function updateTimer()
            {
                msLeft = endTime - (+new Date);
                if ( msLeft < 1000 ) {
                    endQuiz();
                    $('.reStartTime').show();
                    element.innerHTML = '<span style="font-size:18px; color:red;">আপনার প্রদত্ত সময় শেষ হয়ে গিয়েছে! </span>';
                    //counterLimite = 5;
                    //nextQuestion();
                } else {
                    time = new Date( msLeft );
                    hours = time.getUTCHours();
                    mins = time.getUTCMinutes();
                    element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
                    setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
                }
            }
        
            element = document.getElementById( elementName );
            endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
            updateTimer();
            
        }
    
    countdown( "countdown", 0, 40 );
    //countdown( "countdown2", 100, 0 );

    //$('.reStartTime').show();
    $('#frame').show();
    
    
    //setTimeout(function(){ window.location.reload(true); }, 7000);

    });
    //====================end================
    
    
    $('.reStartTime').hide();

    $('#frame').hide();




    //===========video===========
    var video = document.getElementById("myVideo");
    var btn = document.getElementById("myBtn");

    function myFunction() {
    if (video.paused) {
        video.play();
        btn.innerHTML = "Pause";
    } else {
        video.pause();
        btn.innerHTML = "Play";
    }
    }
    
    
    //============prevent repeted question================
    function generateRandom(min, max) {
        var num = Math.floor(Math.random() * (max - min + 1)) + min;
        var existArr = [];
        existArr.push(num);
        return ( $.inArray( num, existArr ) ) ? generateRandom(min, max) : num;
    }



