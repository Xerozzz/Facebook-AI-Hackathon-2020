/**
 * @fileoverview
 * This file mainly serves as a module to make request to the wit ai api and return the request so as to make interfacing easier
 * Mainly require this file to have access to the main module wit
 * 
 */

require('dotenv').config();

// Import axios to use to make promised based request
const axios = require('axios');
axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.WIT_TOKEN}`;

const wit = {
    predict(sen){
        const url = 'https://api.wit.ai/message?v=20200609&q=';
        return axios
        .get(`${url}${sen}`)
        .then(
            function(res){
                return res.data;
            }
        );
    }
};

modules.export = wit;