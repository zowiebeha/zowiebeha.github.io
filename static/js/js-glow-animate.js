const anchorId = 'js-glow-animate';
const anchorElement = document.getElementById(anchorId);

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

function revertAnimation() {
    /*
        [question]:
        Why does getPropertyValue exist?
        [answer]:
        Maybe to offer a better interface that maps
        .. to CSS property identifiers rather than their JavaScript object property key representations.
    */
    const computedAnchorStyles = getComputedStyle(anchorElement);
    const currentTextShadowValue = computedAnchorStyles.getPropertyValue('text-shadow');
    
    if (currentTextShadowValue == "") {
        throw new Error(`\`text-shadow\` CSS property has no value for element with id ${anchorId}.`);
    }
    
    const currentTextShadowValueConstituents = currentTextShadowValue.split(' ');
    const textShadowXOffset = currentTextShadowValueConstituents[0];
    const textShadowYOffset = currentTextShadowValueConstituents[1];
    
    // Now that we have our info from the current glow animation state,
    // .. we may safely remove it and start the dynamic revert animation.
    anchorElement.classList.remove('hover:glow');
    
    /*
        Fulfills the format consumed by Element.animate():
            https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
    */
    const keyframeObject = [
        {
            // A fallback for older browsers which don't support color deconstruction:
            textShadow: "0 0 0 var(--color-white);",
            // --color-off-white2 points to a deconstructed and darkend version of --color-white:
            textShadow: `${textShadowXOffset} ${textShadowYOffset} 0 var(--color-off-white2)`,
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
    anchorElement.classList.add('hover:glow');
});

anchorElement.addEventListener('mouseleave', () => {
    const animation = revertAnimation();
    
    animation.addEventListener('animationend', () => {
        
    });
    // wait for animation to complete
    // add the hover listener back again
});