// ==UserScript==
// @name         Moodle Header Addons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a direct link to odaorg on the moodle header
// @author       MyDrift (https://github.com/MyDrift-user/)
// @match        https://moodle.bbbaden.ch/*
// @downloadURL  https://github.com/MyDrift-user/EditColumnContent/edit/main/moodle-header-addons.js
// @updateURL    https://github.com/MyDrift-user/EditColumnContent/edit/main/moodle-header-addons.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

console.log("Mahara");
    var li = document.createElement('li');
    var a = document.createElement('a');

    var linkText = document.createTextNode("Mahara");
    a.title = "Mahara";
    a.href = "https://portfolio.bbbaden.ch/";
    a.appendChild(linkText);

    li.appendChild(a);

    document.querySelector(".navbar .nav").appendChild(li);


console.log("UK");
    var li = document.createElement('li');
    var a = document.createElement('a');

    var linkText = document.createTextNode("ÜK");
    a.title = "ÜK";
    a.href = "https://odaorg.ict-bbag.ch/";
    a.appendChild(linkText);

    li.appendChild(a);

    document.querySelector(".navbar .nav").appendChild(li);
})();
