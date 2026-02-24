/**********
Date: 12/2/2024
Author: Zowie Beha
Class: CITW 165
Exercise: Class Project: Task 6
**********/  

(() => {
    // This will only work when files are served via a server.
    // The browser blocks cross origin requests, so fetch won't be able
    //      to access the json file without something like Apache,
    //      IIS, VSCode's Live Server, etc.
    
    const configFilePath = 'public/static/js/vendor/assets/particles-config.json';

    /* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
    particlesJS.load('particles-js', configFilePath, function () {
        console.log('callback - particles.js config loaded');
    });
})();