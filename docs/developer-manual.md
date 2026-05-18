# Developer Manual 

## Overview

Art Explorer is a full-stack web application that allows users to search for artwork using The Metropolitan Museum of Art API, visualize artwork data, and save favorite artwork into a Supabase database. 

The application was built using: 
- Node.js
- Express.js
- Supabase
- Chart.js
- Swiper.js

# Installation 

## Clone Repository 
```bash
git clone YOUR_GITHUB_REPOSITORY_LINK
```

## Install Dependencies
```bash
npm install
```

# Environment Variables 
Create a `.env` file in the project root directory.

Add:
```env
SUPABASE_URL=
SUPABASE_KEY=
```

# Running the Application 
Start the server with: 

```bash
node index.js
```

Then open:

```txt
http://localhost:3000
```
# API Endpoints 

## GET /api/search

Retrieves artwork data from The Metropolitan Museum of Art API.

Example:

```txt
/api/search?q=cat
```

## GET /api/collections

Retrieves saved artwork from the Supabase database.

## POST /api/collections

Saves artwork to the database.

Example request body:

```json
{
  "object_id": 123,
  "title": "Artwork Title",
  "artist": "Artist Name",
  "image": "image-url",
  "category": "Favorites",
  "notes": "This is my favorite"
}
```
## DELETE /api/collections/:id

Deletes artwork from the database.

# Front-End Libraries

## Chart.js
Used to visualize artwork department statistics.

## Swiper.js
Used to create the artwork image carousel

# Testing

Testing was completed manually through:
- browser testing
- API endpoint testing
- database testing

No automated testing was implemented. 

# Known Bugs

- Some artist searches may return limited results due to limitations with The Metropolitan Museum of Art API.
- Some artworks may not contain images or complete metadata (ex: Artist Name)

# Future Development

Potential future improvements include:
- User authentication
- Improved mobile responsiveness
- Artwork detail pages
- Filtering by department
