import createAutoKomplit from './autokomplit';
import { fetchKapalPerang } from './http';

const renderOption = kapalItem => {
    return /* html */ `
        <div>${kapalItem.model} ${kapalItem.starship_class} Class</div>
    `;
};

const onOptionSelected = () => {};

const getInputValue = kapalItem => {
    return kapalItem.model;
};

createAutoKomplit({
    root: document.querySelector('.autocomplete'),
    renderopt: renderOption,
    onoptionselect: onOptionSelected,
    inputvalue: getInputValue,
    fetchpencarian: fetchKapalPerang,
});
