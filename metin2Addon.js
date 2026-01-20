// ==UserScript==
// @name         Metin2 deposit
// @namespace    http://tampermonkey.net/
// @version      2025-10-25
// @description  try to take over the world!
// @author       You
// @match        https://de-shop-metin2.gameforge.com/depotitems/index?__token=*
// @icon         https://gf1.geo.gfsrv.net/cdn98/191b803adbf82f4b8febe3a2c38c2c.ico
// @grant        GM_notification
// @grant        GM.notification
// @grant		 window.close
// @grant		 GM_setValue
// @grant		 GM_getValue
// @grant		 window.onurlchange
// ==/UserScript==

//TODO:
	// Add git link to tamperMonkey
	// Remember last selected item even after page reload
	// Auto redeem last selected item on page load - 1
	// Add button to stop script - 2
	// Refine UI
	// Add Readme with instructions
	// Craft a request to redeem multiple items at once - 3

// data-server-name data-server-id
const serverDict = {
	Germania: '70',
	Teutonia: '71',
	Europe: '502',
	Italia: '503',
	Iberia: '506',
	Azreal: '523',
};

//data-player-name
function mySelector(playerName, serverName) {
	return `[data-player-name="${playerName}"][data-server-id="${serverDict[serverName]}"]`;
}

async function redemItem(itemName) {
	// get item and click deposit
	const itemElement = document.querySelectorAll(
		`[data-sort-name="${itemName}"]`
	)[0];
	const depositButton = itemElement.querySelector('button');
	depositButton.click();

	// wait for modal to appear
	await new Promise((r) => setTimeout(r, 1000));

	const submit = document
		.getElementById('itemBuy')
		.querySelector('#distributionLink');

	console.log('Submitting deposit', submit);
	submit.click();
}

function showToast(message, color, duration = 3000) {
	const toast = document.createElement('div');
	toast.textContent = message;
	toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: ${color || 'black'};
        color: white;
        padding: 16px;
        border-radius: 4px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;

	document.body.appendChild(toast);

	setTimeout(() => {
		toast.remove();
	}, duration);
}

function infoToast(message, duration = 3000) {
	showToast(message, 'green', duration);
}

function errorToast(message, duration = 3000) {
	showToast(message, 'red', duration);
}

function showModal() {
	const modal = document.createElement('div');

	modal.style.cssText = `
        position: fixed;
		top: 20px;
        background-color: gray;
        color: white;
		width: 250px;
        border-radius: 4px;
        z-index: 10000;
        font-family: Arial, sans-serif;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
		max-height: 200px;
   		left: 50%;
    	transform: translate(-50%, 0);
		overflow-y: auto;
    `;

	//get item count and  name
	const items = Array.from(document.querySelectorAll('[data-sort-name]')).map(
		(e) => e.getAttribute('data-sort-name')
	);

	const itemCount = {};
	items.forEach((item) => {
		if (itemCount[item]) {
			itemCount[item]++;
		} else {
			itemCount[item] = 1;
		}
	});


	const sortedItems = Object.entries(itemCount).sort((a, b) => b[1] - a[1]);
	const ul = document.createElement('ul');
	for (const [itemName, count] of sortedItems) {
		const li = document.createElement('li');
		li.style.cursor = 'pointer';
		li.setAttribute('item-name', itemName);
		li.textContent = `${itemName}: ${count}`;
		li.onclick = () => {
			redemItem(itemName);
			GM_setValue('item', itemName);
			console.log('Clicked on', itemName);
		};
		ul.appendChild(li);
	}

	//ul list of items in modal
	modal.appendChild(ul);

	document.body.appendChild(modal);
}

(async function () {
	'use strict';
	console.log('Last value stored', GM_getValue('item', null));

if (window.onurlchange === null) {
    // feature is supported
    window.addEventListener('urlchange', (info) => console.log('tooooo'));
}

	showModal();

	// if 

	//after item is redeemed, dont forget what item is selected

	// EDGE CASES
	//inform if item wasnt found
	//inform if item was already redeemed
})();
