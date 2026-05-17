const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/collections.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'collections.html'));
});

app.get('/about.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});


app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;

    const searchResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${query}&hasImages=true`
    );

    const searchData = await searchResponse.json();

    if (!searchData.objectIDs) {
      return res.json([]);
    }

    const objectIds = searchData.objectIDs.slice(0, 12);

    const artworks = await Promise.all(
      objectIds.map(async (id) => {
        const artworkResponse = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
        );

        return artworkResponse.json();
      })
    );

    res.json(artworks);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch artwork'
    });
  }
});


app.get('/api/collections', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('*');

    if (error) {
      throw error;
    }

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to fetch collections'
    });
  }
});


app.post('/api/collections', async (req, res) => {
  try {

    const {
      object_id,
      title,
      artist,
      image,
      category,
      notes
    } = req.body;

    const { data, error } = await supabase
      .from('collections')
      .insert([
        {
          object_id,
          title,
          artist,
          image,
          category,
          notes
        }
      ]);

    if (error) {
      throw error;
    }

    res.json({
      message: 'Artwork saved successfully',
      data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to save artwork'
    });
  }
});


app.delete('/api/collections/:id', async (req, res) => {
  try {

    const { id } = req.params;

    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({
      message: 'Artwork deleted successfully'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to delete artwork'
    });
  }
});

module.exports = app;

