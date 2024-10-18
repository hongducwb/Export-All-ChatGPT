// ==UserScript==
// @name         ChatGPT Automation with Continuous Scrolling and Stop Button
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Click each anchor item, scroll, show progress, and download for ChatGPT.com
// @author       You
// @match        *://chatgpt.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let stopScript = false;  // Flag to stop the script

    // Create a container for displaying progress
    let progressBox = document.createElement("div");
    progressBox.style.position = "fixed";
    progressBox.style.top = "100px";
    progressBox.style.right = "10px";
    progressBox.style.zIndex = "1000";
    progressBox.style.padding = "10px";
    progressBox.style.background = "lightgray";
    progressBox.style.border = "1px solid black";
    progressBox.style.borderRadius = "5px";
    progressBox.innerHTML = "Progress: Waiting...";
    document.body.appendChild(progressBox);

    // Add "Run" and "Stop" buttons to the page
    let runButton = document.createElement("button");
    runButton.innerHTML = "Run";
    runButton.style.position = "fixed";
    runButton.style.top = "10px";
    runButton.style.right = "10px";
    runButton.style.zIndex = "1000";
    runButton.style.padding = "10px";
    runButton.style.background = "green";
    runButton.style.color = "white";
    document.body.appendChild(runButton);

    let stopButton = document.createElement("button");
    stopButton.innerHTML = "Stop";
    stopButton.style.position = "fixed";
    stopButton.style.top = "50px";
    stopButton.style.right = "10px";
    stopButton.style.zIndex = "1000";
    stopButton.style.padding = "10px";
    stopButton.style.background = "red";
    stopButton.style.color = "white";
    document.body.appendChild(stopButton);

    // Stop button functionality
    stopButton.addEventListener("click", function() {
        stopScript = true;
        alert('Script stopped.');
    });

    // Run button functionality
    runButton.addEventListener("click", async function() {
        stopScript = false;  // Reset stop flag when running
        progressBox.innerHTML = "Progress: Waiting...";

        // Scroll the vertical scrollbar to the bottom continuously until no change in position
        let scrollableContainer = document.querySelector('div.flex-col.flex-1.overflow-y-auto');

        if (scrollableContainer) {
            let lastScrollTop = -1;
            let reachedBottom = false;

            // Continuously scroll down until the bottom is reached
            while (!reachedBottom && !stopScript) {
                // Scroll down
                scrollableContainer.scrollTop = scrollableContainer.scrollHeight;

                // Wait for 1-2 seconds to allow for any new content to load
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Check if the scrollbar has moved since the last iteration
                if (scrollableContainer.scrollTop === lastScrollTop) {
                    reachedBottom = true;
                    console.log('Reached the bottom of the container.');
                } else {
                    lastScrollTop = scrollableContainer.scrollTop;
                }
            }
        }

        // Get all the <a> elements with the class and data-discover attribute
        let anchorItems = document.querySelectorAll('a.flex.items-center.gap-2.p-2[data-discover="true"]');
        let totalItems = anchorItems.length;
        console.log(`Total items found: ${totalItems}`);

        for (let i = 0; i < anchorItems.length; i++) {
            if (stopScript) break;  // Stop the script if stop flag is set

            let anchorItem = anchorItems[i];

            // Display progress
            console.log(`Downloading ${i + 1} of ${totalItems}`);
            progressBox.innerHTML = `Progress: Downloading ${i + 1} of ${totalItems}`; // Update the progress box

            // Click the anchor item
            anchorItem.click();

            // Wait for 5 seconds to allow the page to update
            await new Promise(resolve => setTimeout(resolve, 5000));

            // After waiting, try to click the download button within this scope
            let downloadButton = document.querySelector('a.convdown-probe');
            if (downloadButton) {
                downloadButton.click();
                console.log(`Clicked download for item ${i + 1}`);
            } else {
                console.log(`Download button not found for item ${i + 1}`);
            }

            // Wait for 3 seconds before moving to the next anchor
            await new Promise(resolve => setTimeout(resolve, 4000));
        }

        if (!stopScript) {
            progressBox.innerHTML = "Progress: Process completed";
        } else {
            console.log('Process was stopped by the user.');
            progressBox.innerHTML = "Progress: Stopped by user.";
        }
    });

})();
