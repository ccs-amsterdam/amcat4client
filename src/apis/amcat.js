import Axios from 'axios';

export default async function newAmcatSession(host, email, password) {
  const response = await Axios.get(`${host}/auth/token/`, {
    auth: { username: email, password: password },
  });
  return new Amcat(host, email, response.data.token);
}

class Amcat {
  constructor(host, email, token) {
    this.host = host;
    this.email = email;
    this.api = Axios.create({
      baseURL: host,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // GET
  getIndices() {
    return this.api.get(`/index/`);
  }
  getIndex(index) {
    return this.api.get(`/index/${index}`);
  }
  getFields(index) {
    return this.api.get(`/index/${index}/fields`);
  }
  getFieldValues(index, field) {
    return this.api.get(`/index/${index}/fields/${field}/values`);
  }
  getDocument(index, doc_id) {
    return this.api.get(`/index/${index}/documents/${doc_id}`);
  }

  getQuery(
    index,
    q,
    fields,
    scroll = '2m',
    per_page = 100,
    params = {},
    filters = {}
  ) {
    params['scroll'] = scroll; // for scrolling, update with id obtained from results.meta.scroll_id
    params['per_page'] = per_page;
    if (fields) params['fields'] = fields.join(',');
    if (q) params['q'] = q;
    if (filters) params = { ...params, ...filters };
    return this.api.get(`/index/${index}/query`, { params });
  }

  postQuery(
    index,
    q,
    fields,
    scroll = '2m',
    per_page = 100,
    params = {},
    filters = {}
  ) {
    params['scroll'] = scroll;
    params['per_page'] = per_page;
    if (fields) params['fields'] = fields.join(',');
    if (q) params['q'] = q;
    if (filters) params['filters'] = { ...filters };

    return this.api.post(`/index/${index}/query`, { ...params });
  }

  // POST
  createIndex(name, guestRole = 'NONE') {
    const body = { name: name };
    if (guestRole !== 'NONE') body.guest_role = guestRole;
    return this.api.post(`/index/`, body);
  }
  createDocuments(name, documentList) {
    // documentList should be an array of objects with at least the fields title, date and text
    return this.api.post(`/index/${name}/documents`, documentList);
  }

  // DELETE
  deleteIndex(index) {
    return this.api.delete(`/index/${index}`);
  }

  // CREATE USER
  createUser(
    username,
    pass,
    role,
    giveAccess = false,
    index = null,
    params = {}
  ) {
    params['email'] = username;
    params['password'] = pass;
    params['global_role'] = role;
    if (giveAccess) {
      params['index_access'] = true;
      params['index'] = index;
    }
    return this.api.post('/users/', { ...params });
  }

  // GET USERS
  getUsers() {
    return this.api.get(`/users/all`);
  }

  // GET USERS
  deleteUser(email) {
    return this.api.delete(`/users/${email}`);
  }

  // MODIFY USER
  modifyUser(
    oldEmail,
    email = null,
    password = null,
    index = null,
    role = null,
    params = {}
  ) {
    if (email) params['email'] = email;
    if (password) params['password'] = password;
    if (index) params['index'] = index;
    if (role) params['global_role'] = role;

    return this.api.put(`/users/${oldEmail}`, params);
  }
}
