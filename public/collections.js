async function loadCollections() {

  await fetch('/api/collections')

  .then((result) => result.json())

  .then((resultJson) => {

    console.log(resultJson);

    const gallery =
      document.getElementById('savedGallery');

    gallery.innerHTML = '';

    resultJson.forEach((art) => {

      const card =
        document.createElement('div');

      card.className = 'card';

      card.innerHTML = `
        <img src="${art.image}">

        <h3>${art.title}</h3>

        <p>${art.artist}</p>

        <p><strong>Category:</strong> ${art.category}</p>

        <p>${art.notes || ''}</p>

        <button onclick="deleteArtwork(${art.id})">
          Delete
        </button>
      `;

      gallery.appendChild(card);
    });
  });
}


async function deleteArtwork(id) {

  await fetch(`/api/collections/${id}`, {

    method: 'DELETE'
  });

  loadCollections();
}


window.onload = loadCollections;