/**********
Date: 12/2/2024
Author: Zowie Beha
Class: CITW 165
Exercise: Class Project: Task 6
**********/  

$(function () {
    let $contactForm = $('form.contact-form');
    let $contactSenderField = $('form.contact-form input.email-sender');
    let $contactSubjectField = $('form.contact-form input.email-subject');
    let $contactBodyField = $('form.contact-form textarea.email-body');
    
    let $outputContainer = $('div.script-output');
    
    let $outputParagraph = $(
        `
        <p>
            <span class="bold">Sender:</span><span class="sender"></span>
            <br>
            <span class="bold">Subject:</span><span class="subject"></span>
            <br>
            <span class="bold">Body:</span><span class="body"></span>
        </p>
        `
    );
    
    $contactForm.on('submit', function(event) {
        // https://stackoverflow.com/questions/5963669/whats-the-difference-between-event-stoppropagation-and-event-preventdefault
        // preventDefault() prevents the default behavior the browser makes on that element,
        //  whereas stopPropagation() stops propagation in the capturing and bubbling phases
        // (there is no such thing as stopDefault().)
        event.preventDefault();
        
        /* Media query for programmatic css change */
        let screenWidth = $(window).width();
        if (screenWidth <= 544) {
            $outputContainer.css('width', '85%'); 
        } else {
            $outputContainer.css('width', '25%');
        }
        
        $outputContainer.html($outputParagraph);

        // Not sure why, but it seems elements created via jQuery
        //  don't exist during processing?
        // https://reddit.com/r/jquery/comments/8bpxak/why_i_cant_select_dynamically_added_element/?rdt=38584
        // console.log($outputParagraph.find('span.sender'));
        
        $outputContainer.find('span.sender').text($contactSenderField.val());
        $outputContainer.find('span.subject').text($contactSubjectField.val());
        $outputContainer.find('span.body').text($contactBodyField.val());   
    });
});