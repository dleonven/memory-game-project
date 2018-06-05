/*This file has to be in the SAME directory as the .htmls it wants to controll*/

/*
  I helped myself with:
  https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
  and with the Udacity classes.
*/

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/restaurant.html',
        '/css/styles.css',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js',
        '/data/restaurants.json',
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
        '/img/8.jpg',
        '/img/9.jpg',
        '/img/10.jpg'
      ]);
    })
  );
});



self.addEventListener('fetch', function(event) {
  event.respondWith(

    /*I match the request with what is in the cache and return
    that response, and if it's not in the cache, it is requested
    from the network.

    As this is a 'static project' (no further data or images are going
    to be included/removed, nor files changed (eg CSS)), then this is all we need.
    */
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })


  );



});
