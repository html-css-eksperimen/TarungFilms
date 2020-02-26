// File utils.js
// Membuat fungsi debounce  terpisah untuk
// menunda eksekusi proses selama beberapa detik
// https://www.30secondsofcode.org/js/s/debounce/
export const debounceProcess = (funcCallback, delay = 1000) => {
    let idTimeout;
    const fungsiTimeout = (...args) => {
        // jika timeout tidak kosong,hapus timeout sebelumnya
        if (idTimeout) {
            clearTimeout(idTimeout);
        }

        idTimeout = setTimeout(() => {
            funcCallback(...args);
        }, delay);
    };

    return fungsiTimeout;
};

export const dummyExport = 'hello';
