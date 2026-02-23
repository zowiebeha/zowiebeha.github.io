/**********
Date: 12/2/2024
Author: Zowie Beha
Class: CITW 165
Exercise: Class Project: Task 6
**********/  

// TSParticles does not currently support an editor.
// This may change in the future.

(async () => {
    // https://stackoverflow.com/questions/78654485/tsparticles-not-rendering-particles-options-json-load-complete-no-errors
    // loadAll needed for some reason
    await loadAll(tsParticles);
    
    await tsParticles
        .load({
            id: "tsparticles",
            url: "scripts/vendor/assets/particlesjs-config.json",
        })
        .then((container) => {
            showEditor(container).top().right().theme("dark");
        });
})();