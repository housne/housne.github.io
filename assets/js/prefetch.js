(function() {
  function preFetch(sourceURL) {
    const source = document.createElement('link');
    source.href = sourceURL;
    source.rel = 'prefetch';
    document.head.appendChild(source);
  }
  const fetchedURL = [];
  const pageLinks = document.querySelectorAll('a');
  pageLinks.forEach(link => {
    const url = link.href;
    if (!url || (!url.startsWith('/') && !url.startsWith(window.location.origin))) {
      return;
    }
    if (url === window.location.origin + window.location.pathname || url === window.location.pathname) {
      return;
    }
    if (fetchedURL.indexOf(url) > -1) {
      return;
    }
    link.addEventListener('mouseenter', () => {
      if (fetchedURL.indexOf(url) > -1) {
        return;
      }
      preFetch(url);
      fetchedURL.push(url);
    })
  })
  
})()