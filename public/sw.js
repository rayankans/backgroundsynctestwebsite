importScripts('/util/setup.js');

self.addEventListener('install', event => {
  event.waitUntil(skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

self.addEventListener('sync', event => {
  console.log(event.tag);
});
