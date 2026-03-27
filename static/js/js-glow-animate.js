const anchorElement = document.getElementById('js-glow-animate');

/*
    Adding class a.hover:glow is not necessary, since
    we could use the cascade such that a.unhover:unglow
    overrides a.hover:glow declarations, and a.hover:glow is to
    only animate when the element is hovered.
    
    This would be very implicit though, given how the behavior is holistically
    spread across multiple files. The following isolates behavior control to
    our JavaScript file, and thus is more explicit.
    
    This is also a solid reason as to why tight coupling of HTML/CSS/JS is better.
*/

/*

We must dynamically animate from the last keyframe of the glow animation
when we want to reverse the glow upon unhover. 

This is because animations require a hard-coded `from | 0%` value,
which we want to be dynamic.

Thus JavaScript is required to achieve this effect.

*/

function getComputedTextShadowValue(element) {
    const computedStyles = getComputedStyle(element);
    /*
        [question]:
        Why does getPropertyValue exist?
        [answer]:
        Maybe to offer a better interface that maps
        .. to CSS property identifiers rather than their JavaScript object property key representations.
    */
    const currentTextShadowValue = computedStyles.getPropertyValue('text-shadow');
    
    return currentTextShadowValue;
}

/*
    We could use CSS to animate these keyframes,
    enabling them to play upon hover by adding a .hover\:glow class once the hidden animation occurs,
    and upon the first mouse hover.
    
    This would be a hassle to manage however, as we would need to first get the text shadow value from the
    glow animation, and then ensure the glow animation is removed?
*/
function showTextShadow(element) {
    if (currentTextShadowValue == "") {
        throw new Error(`\`text-shadow\` property not present in computed styles for element ${element}.`);
    }
    
    /*
        Fulfills the format consumed by Element.animate():
            https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
    */
    const keyframeObject = [
        {
            // A fallback for older browsers which don't support color deconstruction:
            textShadow: "0 0 0 var(--color-white);",
            // --color-off-white2 points to a deconstructed and darkend version of --color-white:
            // textShadow: `${textShadowXOffset} ${textShadowYOffset} 0 var(--color-off-white2)`,
            textShadow: currentTextShadowValue,
        },
        
        { textShadow: "0 0 0 transparent" },
    ];
    const timingObject = {
        duration: 1000, // <- Milliseconds
        iterations: 1,
        fill: "forwards",
    };
    
    const animation = anchorElement.animate(keyframeObject, timingObject);
    
    return animation;
}

/*
 * Retrieves the current text shadow of an element,
 * then pauses all animations on the element & animates from
 * the retrieved text shadow values to a transparent shadow
 * 
 * Over-engineering at its finest :)
 */
function hideTextShadow(element) {
    debugger;

    const currentTextShadowValue = getComputedTextShadowValue(element);
    
    if (currentTextShadowValue == "") {
        throw new Error(`\`text-shadow\` property not present in computed styles for element ${element}.`);
    }
    
    // We need not parse the text-shadow value ourselves.
    // We can just use it directly in the `from` animation keyframe data structure.
    
    // ----------------------
    // Parse text-shadow value:
    // [ text-shadow-string1, text-shadow-string2, ... ]
    // const currentTextShadowsFromValue = currentTextShadowValue.split(',');
    // Keep in mind:
    //  For some reason, the color value is placed at the beginning
    //  ... when a text shadow is retrieved via JavaScript...
    //  [question]: Why?
    // [ [text-shadow-string1-constituents], [text-shadow-string2-constituents] ]
    // const currentTextShadowsConstituents = currentTextShadowsFromValue.map((value) => value.split(' '));
    // for (const textShadowConsitutentArray of currentTextShadowsConstituents) {
    //     const blurRadius = textShadowConsitutentArray.pop();
    //     const textShadowYOffset = textShadowConsitutentArray.pop();
    //     const textShadowXOffset = textShadowConsitutentArray.pop();
        
    //     const color = textShadowConsitutentArray.join('');
    // }
    // ---------------------
    
    // Now that we have our info from the current glow animation state,
    // .. we may safely remove it and start the dynamic revert animation.
    
    
    // We need not pause animations which also act upon the textShadow,
    // for we specify that our animation is to replace other animations which act upon the same value.
    // If they are played via CSS or if the other animations are played via JS and have a composite setting
    // .. that doesn't replace, ours will win.
    
    // consideration:how to retain the state of the old animation such that there is no possibility of
    // rendering a frame where the original animation has stopped and reverts back to the original style..?
    
    // ----------------------
    // May become relevant if this library becomes heavily used and must become
    // more generally suited: the options parameter w/ the subtree property.
    // const currentAnimations = element.getAnimations();
    // currentAnimations.forEach(animation => {
    //     const keyframeEffect = animation.effect;
       
        // detect whether or not the animation effect contains a textShadow property key in its keyframes
        // stop it if it does (or remove it somehow to allow the other properties to animate?)
        // proceed with our own animation
        
        // Maybe I can make my own animation override the existing ones? somehow within the options of
        // .. the Element.animate() method?
        // the `composite` option for .animate() does default to replace. Does this apply to non-JS animations played via CSS?
        // Answer: Yes.
        
        // Under what conditions will Animation.effect be null?
    //     if (keyframeEffect === null) return;
    // });
    // currentAnimations.map((animation) => animation.stop());
    // ----------------------
    
    /*
        Fulfills the format consumed by Element.animate():
            https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
    */
    const keyframeObject = [
        {
            // A fallback for older browsers which don't support color deconstruction:
            textShadow: "0 0 0 var(--color-white);",
            // --color-off-white2 points to a deconstructed and darkend version of --color-white:
            // textShadow: `${textShadowXOffset} ${textShadowYOffset} 0 var(--color-off-white2)`,
            textShadow: currentTextShadowValue,
        },
        
        { textShadow: "0 0 0 transparent" },
    ];
    const timingObject = {
        duration: 1000, // <- Milliseconds
        iterations: 1,
        fill: "forwards",
    };
    
    const animation = anchorElement.animate(keyframeObject, timingObject);
    
    return animation;
}

anchorElement.addEventListener('mouseenter', () => {
}, { once: true });

// how to handle animations stepping overriding one another's properties?
anchorElement.addEventListener('mouseleave', () => {
    debugger;
    const animation = hideAnimatedTextShadows(anchorElement);
    
    animation.addEventListener('animationend', () => {
    });
    // wait for animation to complete
    // add the hover listener back again
});