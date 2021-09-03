export const createAmcatSession = (Amcat) => {
  return {
    type: 'CREATE_AMCAT_SESSION',
    payload: Amcat,
  };
};

export const deleteAmcatSession = () => {
  return {
    type: 'DELETE_AMCAT_SESSION',
  };
};

export const selectAmcatIndex = (index) => {
  return {
    type: 'SELECT_AMCAT_INDEX',
    payload: index,
  };
};

export const setAmcatIndices = (indices) => {
  return {
    type: 'SET_AMCAT_INDICES',
    payload: indices,
  };
};

export const selectDocument = (document) => {
  return {
    type: 'SELECT_ROW',
    payload: document,
  };
};

export const setDocuments = (documents) => {
  return {
    type: 'SET_DOCUMENTS',
    payload: documents,
  };
};

export const uploadDocuments = (documents) => {
  return {
    type: 'UPLOAD_DOCUMENTS',
    payload: documents,
  };
};

export const setTokenIndices = (tokenIndices) => {
  return {
    type: 'SET_TOKEN_INDICES',
    payload: tokenIndices,
  };
};

export const toggleAnnotations = (spanAnnotation) => {
  return {
    type: 'TOGGLE_ANNOTATIONS',
    payload: spanAnnotation,
  };
};

export const rmAnnotations = (spanAnnotation) => {
  return {
    type: 'RM_ANNOTATIONS',
    payload: spanAnnotation,
  };
};

export const clearSpanAnnotations = () => {
  return {
    type: 'CLEAR_SPAN_ANNOTATIONS',
  };
};

export const setCodes = (codes) => {
  return {
    type: 'SET_CODES',
    payload: codes,
  };
};

export const appendCodeHistory = (code, n = 5) => {
  return {
    type: 'APPEND_CODE_HISTORY',
    payload: { code: code, n: n },
  };
};

export const setIndexFields = (fields) => {
  return {
    type: 'SET_INDEX_FIELDS',
    payload: fields,
  };
};

export const setFieldValues = (fieldValues) => {
  return {
    type: 'SET_FIELD_VALUES',
    payload: fieldValues,
  };
};

export const setQueryString = (query) => {
  return {
    type: 'SET_QUERY_STRING',
    payload: query,
  };
};

export const setAllUsers = (users) => {
  return {
    type: 'SET_ALL_USERS',
    payload: users,
  };
};
