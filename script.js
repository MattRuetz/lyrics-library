const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

// Base URI for API
const apiURL = 'https://api.lyrics.ovh';

// Fetch songs matching search term
const searchSongs = async (term) => {
    const data = await (await fetch(`${apiURL}/suggest/${term}`)).json();
    showData(data);
};

// Show search result data in DOM
const showData = (data) => {
    result.innerHTML = `
    <ul class="songs">
        ${data.data
            .map(
                (song) => `
        <li>
            <span><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button class="btn" data-artist="${song.artist.name}" data-songTitle="${song.title}" >
                Get Lyrics
            </button>
        </li>
        `
            )
            .join('')}
    </ul>`;

    if (data.prev || data.next) {
        more.innerHTML = `
    ${
        data.prev
            ? `<button onclick="getMoreSongs('${data.prev}')" class="btn">Prev</button>`
            : ''
    }
    ${
        data.next
            ? `<button onclick="getMoreSongs('${data.next}')" class="btn">Next</button>`
            : ''
    }
    `;
    }
};

// Get prev / next page of results
// REQUIRES CORS ANYWHERE
const getMoreSongs = async (url) => {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    showData(data);
};

// Fetch lyrics and add to DOM
const getLyrics = async (artist, songTitle) => {
    const data = await (
        await fetch(`${apiURL}/v1/${artist}/${songTitle}`)
    ).json();

    // replace \r & \n with HTML line breaks for proper display
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>`;

    more.innerHTML = '';
};

// Handle search button press
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();

    if (!searchTerm) {
        alert('Enter a search term!');
    } else {
        searchSongs(searchTerm);
    }
});

// Handle Get Lyrics button for certain song
result.addEventListener('click', (e) => {
    const clickedEl = e.target;

    if (clickedEl.tagName === 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songTitle');

        getLyrics(artist, songTitle);
    }
});
