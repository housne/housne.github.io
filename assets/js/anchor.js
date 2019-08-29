(function() {
  function addAnchor(headingEl) {
    const id = headingEl.getAttribute('id');
    const anchorLink = document.createElement('a');
    anchorLink.href = '#' + id;
    anchorLink.className = "heading-anchor"
    headingEl.classList.add('has-anchor');
    headingEl.prepend(anchorLink)
  }
  window.addEventListener('DOMContentLoaded', function() {
    const postContentEl = document.getElementById('page-content');
    const headings = postContentEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(function(headingEl) {
      addAnchor(headingEl);
    })
  })
})()