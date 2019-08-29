(function(global) {
  global.GH = {
    search: function(algoliaId, algoliaSearchKey, indexName) {
      const searchClient = algoliasearch(algoliaId, algoliaSearchKey);
      const search = instantsearch({
        searchClient,
        indexName: indexName,
        routing: true
      });
      search.addWidget(
        instantsearch.widgets.searchBox({
          container: '#search-form',
          showReset: false,
          placeholder: '搜索文章'
        })
      );
      search.addWidget(
        instantsearch.widgets.poweredBy({
          container: '#powered-by',
        })
      );
      // Create the render function
      const renderInfiniteHits = (renderOptions, isFirstRender) => {
        const {
          hits,
          widgetParams,
          showPrevious,
          isFirstPage,
          showMore,
          isLastPage,
        } = renderOptions;

        if (isFirstRender) {
          const ul = document.createElement('div');
          ul.className = 'post-list';
          const previousButton = document.createElement('button');
          previousButton.className = 'previous-button btn';
          previousButton.style.display = 'none';
          previousButton.textContent = '上一页';

          previousButton.addEventListener('click', () => {
            showPrevious();
          });

          const nextButton = document.createElement('button');
          nextButton.className = 'next-button btn';
          nextButton.style.display = 'none';
          nextButton.textContent = '加载更多';

          nextButton.addEventListener('click', () => {
            showMore();
          });

          widgetParams.container.appendChild(previousButton);
          widgetParams.container.appendChild(ul);
          widgetParams.container.appendChild(nextButton);

          return;
        }

        widgetParams.container.querySelector('.previous-button').style.display = isFirstPage ? 'none' : 'block';
        widgetParams.container.querySelector('.next-button').style.display = isLastPage ? 'none' : 'block';

        widgetParams.container.querySelector('.post-list').innerHTML = `
          ${hits
            .map(
              item =>
                `<article class="post">
                  <h1 class="title"><a href="${item.url}">${instantsearch.highlight({ attribute: 'title', hit: item })}</a></h1>
                  <div class="summary">${item.excerpt_html}</div>
                </article>`
            )
            .join('')}
        `;
      };

      // Create the custom widget
      const customInfiniteHits = instantsearch.connectors.connectInfiniteHits(
        renderInfiniteHits
      );

      // Instantiate the custom widget
      search.addWidget(
        customInfiniteHits({
          container: document.querySelector('#search-results'),
          showPrevious: true,
        })
      );
      return search;
    }
  }
})(this);