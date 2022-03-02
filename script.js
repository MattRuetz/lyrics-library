const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

const searchSongs = async (term) => {
    data = await (await fetch(`${apiURL}/suggest/${term}`)).json();
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
            <button class="btn" data-artist="${song.artist.name} data-songtitle="${song.title}" >
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
const getMoreSongs = async (url) => {
    res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    data = await res.json();
    showData(data);
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchTerm = search.value.trim();

    if (!searchTerm) {
        alert('Enter a search term!');
    } else {
        searchSongs(searchTerm);
    }
});
