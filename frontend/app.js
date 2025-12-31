const api = (path) => fetch(path).then(r => r.json());

async function loadMovies() {
  const movies = await api('/api/movies');
  const grid = document.getElementById('movie-grid');
  grid.innerHTML = '';

  movies.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
            <img src="${m.image}" alt="${m.title}">
            <div class="card-body">
                <h3>${m.title}</h3>
                <p>${m.category}</p>
                <div class="rating">${m.rating} Match</div>
            </div>
        `;
    card.onclick = () => playMovie(m.title, m.id);
    grid.appendChild(card);
  });
}

async function playMovie(title, id) {
  console.log(`Playing ${title}...`);
  // Simulate API call to stream
  await api(`/api/stream/${id}`);
  alert(`Now Streaming: ${title}\n(Simulated Stream Started)`);
}

loadMovies();
