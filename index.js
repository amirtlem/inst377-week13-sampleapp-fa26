const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/public', express.static('public'));

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/search', async (req, res) => {
  try {
    const query = req.query.q;

    const searchResponse = await fetch (
       `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&artistOrCulture=true&q=${query}`
    );
    const searchData = await searchResponse.json();

    const objectIDs = searchData.objectIDs
    ? searchData.objectIDs.slice(0,12)
    : [];

    const artworks = await Promise.all(
      objectIDs.map(async (id) => {

        const response = await fetch(
            `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
        );
        return response.json();
      })
    );

     res.json(artworks);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: 'Search failed'
    });
  }
});


app.get('/api/departments', async (req, res) => {
  try {

    const response = await fetch(
      'https://collectionapi.metmuseum.org/public/collection/v1/departments'
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch departments'
    });
  }
});


app.get('/api/collections', async (req, res) => {
  const { data, error } = await supabase
    .from('collections')
    .select();

    if (error) {
      res.status(500).json(error);

    } else {
      res.json(data);
    }
  });

app.post('/api/collections', async (req, res) => {
  const {
    object_id,
    title,
    artist,
    image,
    category,
    notes
  } = req.body;

  const { data, error} = await supabase
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
    ])
    .select();

    if (error) {
      res.status(500).json(error);
    } else {
      res.json(data);
    }
  });

  app.delete('/api/collections/:id', async (req, res) => {
    const { id } = req.params;

    const {error} = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

      if (error) {
        res.status(500).json(error);

      } else {
        res.json({
          message: ' Artwork deleted succesfully'
        });
      }

    });
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

