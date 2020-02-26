// Hasil Refactor dari fungsi App JS Sebelumnya
import createAutoKomplit from './autokomplit';
import { fetchDetailFilm, fetchPencarianFilm } from './http';

// Opsi untuk menampilkan daftar pilihan
const renderOption = filmItem => {
    // cek gambar ada isinya atau tidak
    const urlGambar = filmItem.Poster === 'N/A' ? '' : filmItem.Poster;
    return /* html */ `
        <img src="${urlGambar}"/>
        ${filmItem.Title} (${filmItem.Year})
    `;
};

// Fungsi untuk menampilkan halaman detail
const getTampilanDetailTemplate = filmDetail => {
    // ambil beberapa nilai detail dari film
    let stringNilaiDolar = '0';
    let numberNilaiDolar = 0;
    let numberMetascore = 0;
    let floatImdbRating = 0.0;
    let numberImdbVote = 0;

    if (filmDetail.BoxOffice !== 'N/A') {
        stringNilaiDolar = filmDetail.BoxOffice.replace(/\$/g, '').replace(
            /,/g,
            '',
        );
        numberNilaiDolar = parseInt(stringNilaiDolar, 10);
    }

    if (filmDetail.Metascore !== 'N/A') {
        numberMetascore = parseInt(filmDetail.Metascore, 10);
    }

    if (filmDetail.imdbRating !== 'N/A') {
        floatImdbRating = parseFloat(filmDetail.imdbRating);
    }

    if (filmDetail.imdbVotes !== 'N/A') {
        const stringImdbVote = filmDetail.imdbVotes.replace(/,/g, '');
        numberImdbVote = parseInt(stringImdbVote, 10);
    }

    // Hitung jumlah penghargaan
    let jumlahPenghargaan = 0;
    const arrayAwards = filmDetail.Awards.split(' ');
    // dengan forEach
    // arrayAwards.forEach(word => {
    //     const nilaiAngka = parseInt(word, 10);
    //     const isNilaiNan = Number.isNaN(nilaiAngka);
    //     if (!isNilaiNan) {
    //         jumlahPenghargaan += nilaiAngka;
    //     }
    // });

    // dengan reduce
    jumlahPenghargaan = arrayAwards.reduce((accum, valueword) => {
        const nilaiAngka = parseInt(valueword, 10);
        const isNilaiNan = Number.isNaN(nilaiAngka);
        if (!isNilaiNan) {
            return accum + nilaiAngka;
        }
        return accum;
    }, 0);

    return /* html */ `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${filmDetail.Poster}" loading="lazy" height="200">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${filmDetail.Title}</h1>
                    <h4>${filmDetail.Genre}</h4>
                    <p>${filmDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value="${jumlahPenghargaan}" class="notification is-primary">
            <p class="title">${filmDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value="${numberNilaiDolar}" class="notification is-primary">
            <p class="title">${filmDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value="${numberMetascore}" class="notification is-primary">
            <p class="title">${filmDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value="${floatImdbRating}" class="notification is-primary">
            <p class="title">${filmDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value="${numberImdbVote}" class="notification is-primary">
            <p class="title">${filmDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};

// Object data perbandingan
const sideMovieComparison = {
    leftmoviedata: '',
    rightmoviedata: '',
};

// Ubah tampilan perbandingan film
const setPerbandinganFilm = () => {
    const listStatistikKiri = document.querySelectorAll(
        '#left-summary .notification',
    );

    const listStatistikKanan = document.querySelectorAll(
        '#right-summary .notification',
    );

    listStatistikKiri.forEach((leftStatEl, index) => {
        const rightStatEl = listStatistikKanan[index];

        const leftSideValue = leftStatEl.dataset.value;
        const rightSideValue = rightStatEl.dataset.value;

        if (parseFloat(rightSideValue) > parseFloat(leftSideValue)) {
            leftStatEl.classList.remove('is-primary');
            leftStatEl.classList.add('is-warning');
        } else {
            rightStatEl.classList.remove('is-primary');
            rightStatEl.classList.add('is-warning');
        }
    });
};

// Aksi ketika film dalam dropdown dipilih
const onMovieSelect = async (movieItem, summaryel, sides) => {
    // ambil detail film
    const filmDetail = await fetchDetailFilm(movieItem);

    const templateDetail = getTampilanDetailTemplate(filmDetail);
    const summaryEl = summaryel;
    summaryEl.innerHTML = templateDetail;

    if (sides === 'left') {
        sideMovieComparison.leftmoviedata = filmDetail;
    } else {
        sideMovieComparison.rightmoviedata = filmDetail;
    }

    if (
        sideMovieComparison.leftmoviedata &&
        sideMovieComparison.rightmoviedata
    ) {
        setPerbandinganFilm();
    }
};

// Untuk auto complete sebelah kiri
function onOptionSelectedLeftSummary(movie) {
    const tutorialEl = document.querySelector('.tutorial');
    tutorialEl.classList.add('is-hidden');

    const summaryEl = document.querySelector('#left-summary');
    onMovieSelect(movie, summaryEl, 'left');
}

// Untuk auto complete sebelah kanan
function onOptionSelectedRightSummary(movie) {
    const tutorialEl = document.querySelector('.tutorial');
    tutorialEl.classList.add('is-hidden');

    const summaryEl = document.querySelector('#right-summary');
    onMovieSelect(movie, summaryEl, 'right');
}

// Input value untuk ditampilkan ke dalam daftar input html
const getInputValue = movie => {
    return movie.Title;
};

// Konfigurasi autocomplete
const autoCompleteConfig = {
    renderopt: renderOption,
    inputvalue: getInputValue,
    fetchpencarian: fetchPencarianFilm,
};

// Buat dua buah autocomplete di index.html
createAutoKomplit({
    ...autoCompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onoptionselect: onOptionSelectedLeftSummary,
});

createAutoKomplit({
    ...autoCompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onoptionselect: onOptionSelectedRightSummary,
});
