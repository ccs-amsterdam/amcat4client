import Axios from "axios";

/* 
 * Helper functions to call the AmCAT API. 
 * All functions return promises. 
 * [WvA] Note that they log errors to console by default, not sure that's the best solution. 
 */

function login(host, username, password) {
    let url = host + "/auth/token/";
    return Axios.get(url, {
        auth: {
            username: username,
            password: password
        }
    }).catch(console.log);
}

function _get(user, index, url) {
    var config = { headers: { 'Authorization': "Bearer " + user.token } };
    url = user.host + (index?"/index/"+index:"") + url;
    return Axios.get(url, config).catch(console.log);
}

function getIndices(user) {
    return _get(user, null, "/index/")
}
function getFields(user, index) {
    return _get(user, index, "/fields");
}

function getFieldValues(user, index, field) {
    return _get(user, index, "/fields/" + field + "/values");
}

function getDocument(user, index, doc_id) {
    return _get(user, index, "/documents/" + doc_id)
}


function query(user, index, body) {
    let url = user.host + "/index/" + index + "/query";
    var config = { headers: { 'Authorization': "Bearer " + user.token } };
    return Axios.post(url, body, config).catch(console.log);
}

function aggregate(user, index, body) {
    let url = user.host + "/index/" + index + "/aggregate";
    var config = { headers: { 'Authorization': "Bearer " + user.token } };
    return Axios.post(url, body, config).catch(console.log);
}

export { login, getIndices, query, getFields, getDocument, getFieldValues, aggregate };
