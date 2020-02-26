import axios from 'axios';
import APIKEY from './Konstans';

const axiosInstance = axios.create({ timeout: 5 * 60000 });

const headerRequest = {
    Accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
};

export const fetchPencarianFilm = async stringPencarian => {
    const optionReqGet = {
        params: {
            apikey: APIKEY,
            s: stringPencarian,
        },
        headers: headerRequest,
    };

    let arrayResultCari = [];
    try {
        const response = await axiosInstance.get(
            'https://www.omdbapi.com',
            optionReqGet,
        );

        if (response.status === 200) {
            const dataresult = response.data;
            if (dataresult.Search) {
                arrayResultCari = dataresult.Search;
            }
        }
    } catch (err) {
        console.warn(err);
    }

    // Return menghasilkan pending Promise
    return arrayResultCari;
};

export const fetchDetailFilm = async movieItem => {
    const idMovie = movieItem.imdbID;

    const optionRequest = {
        method: 'get',
        url: 'https://www.omdbapi.com',
        params: {
            apikey: APIKEY,
            i: idMovie,
        },
        headers: headerRequest,
    };

    let resultData = '';
    try {
        const response = await axiosInstance(optionRequest);
        if (response.status === 200) {
            const dataresult = response.data;
            if (dataresult) {
                resultData = dataresult;
            }
        }
    } catch (err) {
        console.warn(err);
    }

    return resultData;
};

export async function fetchKapalPerang() {
    const optionRequest = {
        method: 'get',
        url: 'https://swapi.co/api/starships',
        headers: headerRequest,
    };

    let resultData = '';
    try {
        const response = await axiosInstance(optionRequest);
        if (response.status === 200) {
            if (response.data) {
                resultData = response.data.results;
            }
        }
    } catch (err) {
        console.warn(err);
    }

    return resultData;
}
