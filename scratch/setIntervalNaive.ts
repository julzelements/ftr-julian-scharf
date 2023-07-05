const now = Date.now();

setInterval(() => {
  console.log("setInterval", Date.now() - now);
}, 1000);

// example output:
// setInterval 1002
// setInterval 2004
// setInterval 3006
// setInterval 4006
// setInterval 5007
// setInterval 6009
// setInterval 7010
// setInterval 8011
// setInterval 9012
// setInterval 10013
// setInterval 11015
// setInterval 12015
// setInterval 13016
// setInterval 14018
// setInterval 15019
// setInterval 16020
// setInterval 17022

// Slowly creeps out of sync with the actual time.

export {};
