/**********
Date: 12/2/2024
Author: Zowie Beha
Class: CITW 165
Exercise: Class Project: Task 6
**********/  


document.addEventListener("DOMContentLoaded", function() {
    const iconImages = document.querySelectorAll('div.icon img'); 
    const tooltipElement = document.getElementById('floating-tooltip');
    const tooltipTextElement = document.querySelector('#floating-tooltip .tooltip-text');
    const arrowElement = document.getElementById('floating-tooltip-arrow');
        
    function showTooltip() {
        tooltipElement.style.opacity = 1;
        tooltipElement.style.transform = 'scale(1)';
    }
    
    function hideTooltip() {
        tooltipElement.style.opacity = 0;
        tooltipElement.style.transform = 'scale(0)';
    }
       
    function computeHoveredTooltip(tooltipElement, tooltipTitleString, clientX, clientY, iconImageElement) {
        // Set tooltip text.
        tooltipTextElement.textContent = tooltipTitleString;
        
        // Pretend we have an element obj with getBoundingClientRect() defined,
        //  as computePosition() expects one.
        const virtualMouseElement = {
            getBoundingClientRect() {
                return {
                    width: 0,
                    height: 0,
                    x: clientX,
                    y: clientY,
                    left: clientX,
                    right: clientX,
                    top: clientY,
                    bottom: clientY
                };
            }
        };
        
        // Why does it suddenly work if I assign an initial value?
        // Probably to do with JS variable fundamentals...
        var tooltipY = 0;
        
        FloatingUIDOM.computePosition(virtualMouseElement, tooltipElement, {
            placement: "bottom",
            middleware: [
                FloatingUIDOM.offset(27),
                FloatingUIDOM.flip(),
                FloatingUIDOM.shift({padding: 5}),
                // Remove once separate arrow computation is fixed:
                FloatingUIDOM.arrow({element: arrowElement}),
            ]
        })
        .then(({ x, y, placement, middlewareData }) => {
            // Update tooltipY for the separate arrow calculation logic to see
            tooltipY = y;
            
            // Update tooltip position
            Object.assign(tooltipElement.style, {
                top: `${y}px`,
                left: `${x}px`
            });
            
            // Remove once separate arrow computation is fixed:
            // Accessing the data
            const {x: arrowX, y: arrowY} = middlewareData.arrow;
  
            const staticSide = {
                top: 'bottom',
                right: 'left',
                bottom: 'top',
                left: 'right',
            }[placement.split('-')[0]];
             
            // Update arrow position
            Object.assign(arrowElement.style, {
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                right: '',
                bottom: '',
                [staticSide]: '-4px',
            });
        });
        
        // Current implementation is a bit jittery. Also a bit buggy..
        // I'll need to consult the docs more thoroughly to
        //  learn how to fix.
        // Disabled atm due to glitchiness:
        // FloatingUIDOM.computePosition(iconImageElement, arrowElement, {
        //     placement: "bottom",
        //     middleware: [
        //         FloatingUIDOM.arrow({element: arrowElement}),
        //     ]
        // })
        // .then(({ x, y, placement, middlewareData }) => {
        //     // Update tooltip position
        //     Object.assign(arrowElement.style, {
        //         top: `${tooltipY - 4}px`,
        //         left: `${x}px`
        //     });
        // });
    }
    
 
    // function computeFocusedTooltip(tooltipElement, tooltipTitleString, iconImageElement) {
    //     // Set tooltip text.
    //     tooltipTextElement.textContent = tooltipTitleString;
        
    //     FloatingUIDOM.computePosition(iconImageElement, tooltipElement, {
    //         placement: "bottom",
    //         middleware: [
    //             FloatingUIDOM.offset(15),
    //             FloatingUIDOM.flip(),
    //             FloatingUIDOM.shift({padding: 5}),
    //             FloatingUIDOM.arrow({element: arrowElement}),
    //         ]
    //     })
    //     .then(({ x, y, placement, middlewareData }) => {
    //         // Update tooltip position
    //         Object.assign(tooltipElement.style, {
    //             top: `${y}px`,
    //             left: `${x}px`
    //         });
            
    //         const arrowX = middlewareData.arrow;
            
    //         // Update arrow position
    //         Object.assign(arrowElement.style, {
    //             top: `${-arrowElement.offsetHeight / 2}px`,
    //             left: `${arrowX}px`
    //         });
    //     });
    // }
    
    for (let index = 0; index < iconImages.length; index++) {
        const iconImageElement = iconImages[index];
        const tooltipTitleString = iconImageElement.getAttribute('data-tooltip');
        if (tooltipTitleString === null) {
            // Skip, as this image has no title
            continue;
        } else {
            // When mouse hovered over technology images, compute the tooltip position & title
            iconImageElement.addEventListener('mousemove', ({ clientX, clientY }) => {
                    computeHoveredTooltip(
                        tooltipElement,
                        tooltipTitleString,
                        clientX,
                        clientY,
                        iconImageElement
                    )
            });
            
            // // When keyboard focuses over technology images, compute relative to image,
            // //  not mouse hover.
            // // Without this, the tooltip won't compute itself and will
            // //    just appear in its default position with no text.
            // iconImageElement.addEventListener('focus', (event) => {
            //     computeFocusedTooltip(
            //         tooltipElement,
            //         tooltipTitleString,
            //         iconImageElement
            //     )
            // });
            
            [
                ['mouseenter', showTooltip],
                ['mouseleave', hideTooltip],
                ['focus', showTooltip],
                ['blur', hideTooltip],
            ]
            .forEach(([event, listener]) => {
                iconImageElement.addEventListener(event, listener);
            });
        }
    }
});