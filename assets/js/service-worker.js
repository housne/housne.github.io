---
---

importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

{% assign revision = site.time | date: '%s' %}

let pagesToCache = [{
  url: '/index.html'
}];

workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.NetworkFirst({
    cacheName: 'js-cache-{{revision}}'
  })
);

workbox.routing.registerRoute(
  // Cache CSS files.
  /\.css$/,
  // Use cache but update in the background.
  new workbox.strategies.StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: 'css-cache-{{revision}}',
  })
);

{% assign posts_to_cache = site.posts | slice: 0, 10 %}
{% for post in posts_to_cache %}
pagesToCache.push({url: "{{post.url}}"})
{% endfor %}

workbox.precaching.precacheAndRoute(pagesToCache);