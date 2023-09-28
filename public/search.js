document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('results');
  
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const searchQuery = document.getElementById('searchQuery').value;
  
      fetch('/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ searchQuery })
      })
      .then(response => response.json())
      .then(movies => {
        resultsContainer.innerHTML = '';
  
        if (movies.length > 0) {
          movies.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
  
            movieElement.innerHTML = `
              <h2>${movie.Title} (${movie.Year}) - ${movie.Type}</h2>
              <img src="${movie.Poster}" alt="${movie.Title} Poster">
              <button class="favorite" data-title="${movie.Title}" data-year="${movie.Year}" data-type="${movie.Type}" data-poster="${movie.Poster}">Favorite</button>
            `;
  
            resultsContainer.appendChild(movieElement);
          });
  
          document.querySelectorAll('.favorite').forEach(button => {
            button.addEventListener('click', function() {
              const title = this.getAttribute('data-title');
              const year = this.getAttribute('data-year');
              const type = this.getAttribute('data-type');
              const poster = this.getAttribute('data-poster');
  
              fetch('/favorite', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, year, type, poster })
              })
              .then(response => {
                if (response.ok) {
                  console.log('Favorite saved successfully');
                } else {
                  console.error('Error saving favorite:', response.statusText);
                }
              })
              .catch(error => {
                console.error('Error saving favorite:', error);
              });
            });
          });
        } else {
          resultsContainer.innerHTML = '<p>No results found</p>';
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });
  