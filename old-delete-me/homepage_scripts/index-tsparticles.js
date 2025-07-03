/**********
Date: 12/2/2024
Author: Zowie Beha
Class: CITW 165
Exercise: Class Project: Task 6
**********/  

document.addEventListener('DOMContentLoaded', async function() {
    // This will only work when files are served via a server.
    // The browser blocks cross origin requests, so fetch won't be able
    //      to access the json file without something like Apache,
    //      IIS, VSCode's Live Server, etc.
    const response = await fetch('scripts/vendor/assets/tsparticles-config.json');
    const pjsConfigJson = await response.json();

    // https://stackoverflow.com/questions/78654485/tsparticles-not-rendering-particles-options-json-load-complete-no-errors
    // loadAll needed for some reason

    await loadAll(tsParticles);
    
    await tsParticles
        .load({
            id: "tsparticles",
            options: pjsConfigJson,
        })
        .then(container => {
            console.log("callback - tsparticles config loaded");
        })
        .catch(error => {
            console.error(error);
        });
});