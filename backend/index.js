const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const promMid = require('express-prometheus-middleware');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Prometheus Metrics Middleware
app.use(promMid({
  metricsPath: '/metrics',
  collectDefaultMetrics: true,
  requestDurationBuckets: [0.1, 0.5, 1, 1.5],
}));

// Mock Data: Movies
const movies = [
  { id: 1, title: 'Stranger Things', category: 'Sci-Fi', rating: 9.8, image: 'https://via.placeholder.com/300x169/000000/FFFFFF?text=Stranger+Things' },
  { id: 2, title: 'The Crown', category: 'Drama', rating: 9.0, image: 'https://via.placeholder.com/300x169/000000/FFFFFF?text=The+Crown' },
  { id: 3, title: 'Black Mirror', category: 'Sci-Fi', rating: 8.9, image: 'https://via.placeholder.com/300x169/000000/FFFFFF?text=Black+Mirror' },
  { id: 4, title: 'Money Heist', category: 'Thriller', rating: 9.5, image: 'https://via.placeholder.com/300x169/000000/FFFFFF?text=Money+Heist' },
  { id: 5, title: 'Dark', category: 'Sci-Fi', rating: 9.7, image: 'https://via.placeholder.com/300x169/000000/FFFFFF?text=Dark' },
  { id: 6, title: 'Narcos', category: 'Crime', rating: 9.2, image: 'https://via.placeholder.com/300x169/000000/FFFFFF?text=Narcos' }
];

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'StreamHub' }));

app.get('/api/movies', (req, res) => {
  res.json(movies);
});

// Simulate Video Streaming
app.get('/api/stream/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const movie = movies.find(m => m.id === id);
  if (!movie) return res.status(404).send('Movie not found');

  // Simulate buffering/streaming delay
  setTimeout(() => {
    res.json({ streamUrl: `https://mock-stream.com/watch/${id}`, status: 'playing', bitrate: '1080p' });
  }, 300);
});

// Serve static frontend
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`StreamHub backend listening on ${port}`));
