// ==UserScript==
// @name         Moodle Header Addons
// @namespace    Moodle Header Addons
// @description  Adds a direct link to important sites on the Moodle header
// @author       MyDrift (https://github.com/MyDrift-user/)
// @version      1.3
// @match        https://moodle.bbbaden.ch/*
// @icon         https://github.com/MyDrift-user/Moodle-Header-Addons/raw/main/header-icon.png
// @downloadURL  https://github.com/MyDrift-user/Moodle-Header-Addons/raw/main/Moodle-Header-Addons.user.js
// @updateURL    https://github.com/MyDrift-user/Moodle-Header-Addons/raw/main/Moodle-Header-Addons.user.js
// @run-at       document-end
// @grant        GM_listValues
// @grant        GM_getValue
// ==/UserScript==

function createHeader(name, link) {
    try {
        var li = document.createElement('li');
        var a = document.createElement('a');

        var linkText = document.createTextNode(name);
        a.className = "nav-link";
        a.setAttribute('role', 'menuitem');
        a.title = name;
        a.href = link;
        a.appendChild(linkText);

        li.appendChild(a);

        document.querySelector(".navbar .nav").appendChild(li);
        console.log("created", name);
    }
    catch (error) {
        console.error("[createHeader] name: ${name} link: ${link}", error);
    }
}

function addLinkToList(listSelector, linkText, linkHref) {
        var list = document.querySelector(listSelector);
        if (list) {
            var listItem = document.createElement('li');
            var link = document.createElement('a');
            link.href = linkHref;
            link.textContent = linkText;
            listItem.appendChild(link);
            list.appendChild(listItem);
        } else {
            console.error('List not found:', listSelector);
        }
    }

// Adding new links
// The selector targets the 'ul' element within the specific 'div' you provided
addLinkToList('.card-body .no-overflow ul', 'OdaOrg', 'https://odaorg.ict-bbag.ch/');
addLinkToList('.card-body .no-overflow ul', 'LearningView', 'https://learningview.org/app/#!/');

createHeader("Mahara", "https://portfolio.bbbaden.ch/");
createHeader("OdaOrg", "https://odaorg.ict-bbag.ch/");
createHeader("LearningView", "https://learningview.org/app/#!/");

// Get all keys from the storage
var keys = GM_listValues();

// Iterate over each key
keys.forEach(function(key) {
  // Get the value for the current key
  var value = GM_getValue(key);

  // Run a command with the key and value
  // Replace the console.log with your desired command
  console.log("Key: " + key + ", Value: " + value);
  createHeader(key, value);
});
