let currentArtworks = [];

async function searchArtworks() {

  try {

    const response = await fetch(
      `/api/search?q=${document.getElementById('searchInput').value}`
    );

    const resultJson = await response.json();

    console.log(resultJson);

    currentArtworks =
      resultJson.data || resultJson;

    console.log(currentArtworks.length);

    const gallery =
      document.getElementById('gallery');

    gallery.innerHTML = '';

    const departmentCounts = {};

    const validArtworks =
      currentArtworks.filter(
        (art) => art.primaryImageSmall
      );

    validArtworks.forEach((art) => {

      if (departmentCounts[art.department]) {

        departmentCounts[art.department]++;

      } else {

        departmentCounts[art.department] = 1;
      }

      const card =
        document.createElement('div');

      card.className = 'card';

      card.innerHTML = `
        <img src="${art.primaryImageSmall}">

        <h3>${art.title}</h3>

        <p>${art.artistDisplayName || 'Unknown Artist'}</p>

        <p>${art.objectDate || ''}</p>

        <select id="category-${art.objectID}">
          <option>Favorites</option>
          <option>Study List</option>
          <option>Inspiration</option>
        </select>

        <textarea
          id="notes-${art.objectID}"
          placeholder="Notes"
        ></textarea>

        <button onclick="saveArtworkById(${art.objectID})">
          Save
        </button>
      `;

      gallery.appendChild(card);
    });

    createChart(departmentCounts);

    createSwiper(validArtworks);

  } catch (error) {

    console.error(error);
  }
}


function saveArtworkById(id) {

  const art =
    currentArtworks.find(
      artwork => artwork.objectID === id
    );

  if (art) {

    saveArtwork(art);
  }
}


async function saveArtwork(art) {

  await fetch('/api/collections', {

    method: 'POST',

    body: JSON.stringify({

      object_id: art.objectID,

      title: art.title,

      artist: art.artistDisplayName,

      image: art.primaryImageSmall,

      category:
        document.getElementById(
          `category-${art.objectID}`
        ).value,

      notes:
        document.getElementById(
          `notes-${art.objectID}`
        ).value
    }),

    headers: {
      'content-type': 'application/json'
    }
  });

  alert('Artwork Saved!');
}


function createChart(departments) {

  const labels =
    Object.keys(departments);

  const data =
    Object.values(departments);

  const canvas =
    document.getElementById(
      'departmentChart'
    );

  if (
    window.departmentChart
    instanceof Chart
  ) {

    window.departmentChart.destroy();
  }

  window.departmentChart =
    new Chart(canvas, {

      type: 'bar',

      data: {

        labels: labels,

        datasets: [{

          label:
            'Artworks by Department',

          data: data
        }]
      },

      options: {

        responsive: true,

        plugins: {

          legend: {
            display: true
          }
        }
      }
    });
}


function createSwiper(artworks) {

  const swiperWrapper =
    document.getElementById(
      'swiperWrapper'
    );

  swiperWrapper.innerHTML = '';

  artworks.forEach((art) => {

    const slide =
      document.createElement('div');

    slide.className =
      'swiper-slide';

    slide.innerHTML = `
      <img src="${art.primaryImageSmall}">
    `;

    swiperWrapper.appendChild(slide);
  });

  if (window.swiperInstance) {

    window.swiperInstance.destroy(
      true,
      true
    );
  }

  window.swiperInstance =
    new Swiper('.swiper', {

      loop: true,

      autoplay: {
        delay: 2000
      },

      pagination: {
        el: '.swiper-pagination'
      }
    });
}
