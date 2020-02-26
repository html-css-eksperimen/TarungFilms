// MEMBUAT FUNGSI AUTOCOMPLETE YANG DI LEPAS DARI APP JS UTAMA
import { debounceProcess } from './utils';

const setDaftarHasilPencarian = (
    data,
    dropdownEl,
    resultEl,
    inputSearch,
    renderopt,
    onoptionselect,
    inputvalue,
) => {
    const inputPencarian = inputSearch;
    const hasilPencarianEl = resultEl;
    const renderOption = renderopt;
    const onOptionSelected = onoptionselect;
    const getInputValue = inputvalue;

    const listItems = [...data];

    if (!listItems.length) {
        dropdownEl.classList.remove('is-active');
        return;
    }

    hasilPencarianEl.innerHTML = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const item of listItems) {
        const optionEl = document.createElement('a');

        optionEl.innerHTML = renderOption(item);
        optionEl.classList.add('dropdown-item');

        hasilPencarianEl.append(optionEl);

        // tambah event listener click ketika dropdown dipilih
        // matikan dropdown
        optionEl.addEventListener('click', () => {
            dropdownEl.classList.remove('is-active');
            inputPencarian.value = getInputValue(item);

            // Ketika pilihan dipilih, proses ke callback
            // onOptionSelected
            onOptionSelected(item);
        });
    }

    dropdownEl.classList.add('is-active');
};

const createAutoKomplit = ({
    root,
    renderopt,
    onoptionselect,
    inputvalue,
    fetchpencarian,
}) => {
    const rootEl = root;
    const renderOption = renderopt;
    const onOptionSelected = onoptionselect;
    const getInputValue = inputvalue;
    const fetchPencarian = fetchpencarian;

    rootEl.innerHTML = /* html */ `
    <label><b>Mulai Pencarian Disini</b></label>
    <input class="input is-primary inputsearch"/>
    <progress class="progress is-small is-primary loaderbar" max="100">15%</progress>
    <div class="dropdown" id="dropsearch">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`;

    const inputPencarianPertama = rootEl.querySelector('.inputsearch');
    const dropdownEl = rootEl.querySelector('#dropsearch');
    const hasilPencarianEl = rootEl.querySelector('.results');
    const loaderbar = rootEl.querySelector('.loaderbar');
    loaderbar.classList.add('hideloader');

    const onInputDebounced = async event => {
        const stringCari = event.target.value;
        // await untuk mendapatkan hasil promise dari fetch async await
        loaderbar.classList.remove('hideloader');
        const dataHasilCari = await fetchPencarian(stringCari);
        loaderbar.classList.add('hideloader');

        setDaftarHasilPencarian(
            dataHasilCari,
            dropdownEl,
            hasilPencarianEl,
            inputPencarianPertama,
            renderOption,
            onOptionSelected,
            getInputValue,
        );
    };

    // bisa dengan input event dan change event
    inputPencarianPertama.addEventListener(
        'input',
        debounceProcess(onInputDebounced, 2000),
    );

    // untuk handle klik di luar list dropdown sehingga
    // drop down bisa langsung ditutup
    document.addEventListener('click', ({ target }) => {
        if (!rootEl.contains(target)) {
            dropdownEl.classList.remove('is-active');
        }
    });
};

export default createAutoKomplit;
