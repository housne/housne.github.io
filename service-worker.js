importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

const revision = "v1.0";

workbox.routing.registerRoute(
  /\.js$/,
  new workbox.strategies.NetworkFirst({
    cacheName: "js-cache-" + revision
  })
);

// jsdelivr cdn
workbox.routing.registerRoute(
  new RegExp("https?://cdn.jsdelivr.net/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "cdn-cache-" + revision
  })
);

// fanfou api
workbox.routing.registerRoute(
  new RegExp("https?://api.fanfou.com/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "fanfou-cache-" + revision
  })
);

// cloudinary cdn
workbox.routing.registerRoute(
  new RegExp("https://res.cloudinary.com/"),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: "cloudinary-cache-" + revision
  })
);

workbox.routing.registerRoute(
  // Cache CSS files.
  /\.css$/,
  // Use cache but update in the background.
  new workbox.strategies.StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: "css-cache-" + revision,
  })
);

workbox.routing.registerRoute(
  // Cache image files.
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  // Use the cache if it's available.
  new workbox.strategies.CacheFirst({
    // Use a custom cache name.
    cacheName: 'image-cache' + revision,
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images.
        maxEntries: 20,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);

workbox.routing.setDefaultHandler(
  new workbox.strategies.NetworkFirst({
    options: [
      {
        networkTimeoutSeconds: 5
      }
    ]
  })
);