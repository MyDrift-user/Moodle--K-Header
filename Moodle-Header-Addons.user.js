// ==UserScript==
// @name         gui5
// @namespace    gui5
// @description  Adds a direct link to important sites on the Moodle header
// @author       MyDrift (https://github.com/MyDrift-user/)
// @version      1.2.4
// @match        https://moodle.bbbaden.ch/*
// @icon         https://github.com/MyDrift-user/Moodle-Header-Addons/raw/main/header-icon.png
// @downloadURL  https://github.com/MyDrift-user/Moodle-Header-Addons/raw/test/Moodle-Header-Addons.user.js
// @updateURL    https://github.com/MyDrift-user/Moodle-Header-Addons/raw/test/Moodle-Header-Addons.user.js
// @run-at       document-end
// @grant        GM_listValues
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function() {
    'use strict';

    let isEditMode = false;
    let addHeaderElement;

    function createHeader(name, link) {
        try {
            var li = document.createElement('li');
            var a = document.createElement('a');

            var linkText = document.createTextNode(name);
            a.className = "nav-link";
            a.setAttribute('role', 'menuitem');
            a.href = '';
            a.title = name;
            a.appendChild(linkText);

            if (link !== "") {
                a.href = link;
            } else {
                a.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
                a.style.outline = 'none';
                a.style.pointerEvents = 'none';
            }

            li.appendChild(a);

            document.querySelector(".navbar .nav").appendChild(li);
            console.log("created", name);
        }
        catch (error) {
            console.error("[createHeader] name: ${name} link: ${link}", error);
        }
    }

    function deleteHeader(name) {
        var headerItems = document.querySelectorAll(".navbar .nav li a");
        headerItems.forEach(function(item) {
            if (item.textContent === name) {
                if (item.href !== 'https://moodle.bbbaden.ch/editmode') {
                    item.parentElement.remove();
                    console.log("deleted", name);
                }
            }
        });
    }

    function isHeaderAdded(name) {
        var headerItems = document.querySelectorAll(".navbar .nav li a");
        for (var i = 0; i < headerItems.length; i++) {
            if (headerItems[i].textContent === name) {
                return true;
            }
        }
        console.log("Header not found:", name);
        return false;
    }

    function showModal() {
        var modal = document.getElementById('headerCreationModal');
        modal.style.display = 'block';
    }

    function hideModal() {
        var modal = document.getElementById('headerCreationModal');
        modal.style.display = 'none';
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        var name = document.getElementById('headerName').value;
        var link = document.getElementById('headerLink').value;

        if (link !== "" && !link.startsWith("http://") && !link.startsWith("https://")) {
            link = "http://" + link;
        }

        createHeader(name, link);
        hideModal();
        saveConfiguration();
    }

    function createModal() {
        var modalHTML = `
            <div id="headerCreationModal" style="display:none; position: fixed; z-index: 1; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.4);">
                <div style="background-color: #fefefe; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">
                    <span style="color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer;" id="closeModalButton">&times;</span>
                    <form id="headerCreationForm">
                        <label for="headerName">Name:</label><br>
                        <input type="text" id="headerName" name="headerName"><br>
                        <label for="headerLink">Link:</label><br>
                        <input type="text" id="headerLink" name="headerLink"><br><br>
                        <input type="submit" value="Create">
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        var closeModalButton = document.getElementById('closeModalButton');
        closeModalButton.addEventListener('click', hideModal);

        document.getElementById('headerCreationForm').addEventListener('submit', handleFormSubmit);
    }

    function toggleEditMode() {
        isEditMode = !isEditMode;
        if (isEditMode) {
            showAddHeader();
            enableHeaderEditing();
        } else {
            hideAddHeader();
            disableHeaderEditing();
        }
        updateHeadersDisplay();
    }

    function showAddHeader() {
        if (!addHeaderElement) {
            addHeaderElement = document.createElement('li');
            var a = document.createElement('a');
            a.textContent = '+';
            a.href = 'https://moodle.bbbaden.ch/editmode';
            a.addEventListener('click', function(event) {
                event.preventDefault();
                showModal();
            });
            addHeaderElement.appendChild(a);
            document.querySelector(".navbar .nav").insertBefore(addHeaderElement, document.querySelector(".navbar .nav").firstChild);
        }
        addHeaderElement.style.display = 'block';
    }

    function hideAddHeader() {
        if (addHeaderElement) {
            addHeaderElement.style.display = 'none';
        }
    }

    function enableHeaderEditing() {
        document.querySelectorAll(".navbar .nav li a").forEach(function(item) {
            item.addEventListener('contextmenu', handleRightClick);
        });
    }

    function disableHeaderEditing() {
        document.querySelectorAll(".navbar .nav li a").forEach(function(item) {
            item.removeEventListener('contextmenu', handleRightClick);
        });
    }

    function handleRightClick(event) {
        event.preventDefault();
        var headerName = event.target.textContent;

        var newName = prompt("Enter new name", headerName);
        var newLink = prompt("Enter new link", event.target.href);

        if (newName && newLink) {
            deleteHeader(headerName);
            createHeader(newName, newLink);
            saveConfiguration();
        }
    }

    function saveConfiguration() {
        const headers = Array.from(document.querySelectorAll(".navbar .nav li a"))
                             .map(a => ({ name: a.textContent, link: a.href }));
        GM_setValue('headers', JSON.stringify(headers));
    }

    function loadConfiguration() {
        const headers = JSON.parse(GM_getValue('headers', '[]'));
        headers.forEach(header => {
            if (!isHeaderAdded(header.name)) {
                createHeader(header.name, header.link);
            }
        });
    }

    function updateHeadersDisplay() {
        Array.from(document.querySelectorAll(".navbar .nav li a")).forEach(a => {
            if (isEditMode) {
                a.classList.add('editable');
                a.addEventListener('click', deleteHeaderOnClick);
            } else {
                a.classList.remove('editable');
                a.removeEventListener('click', deleteHeaderOnClick);
            }
        });
    }

    function deleteHeaderOnClick(event) {
        if (isEditMode) {
            event.preventDefault();
            deleteHeader(event.target.textContent);
            saveConfiguration();
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.altKey && (e.key === 'q' || e.key === 'Q')) {
            toggleEditMode();
        }
    });

    const style = document.createElement('style');
    style.textContent = `
        .editable:hover {
            text-decoration: line-through;
        }
    `;
    document.head.appendChild(style);

    createModal();
    loadConfiguration();
    window.addEventListener('beforeunload', saveConfiguration);

    updateHeadersDisplay();
})();
