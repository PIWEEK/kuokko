import * as l from "lodash";

import url from "url";
import qs from "querystring";

function composeUrl(suffix, params=null) {
  const _url = url.parse(window.kuokkoConfig.baseUrl);
  _url.pathname = suffix;

  if (params) {
    _url.search = qs.stringify(params)
  }

  return url.format(_url);
}

function makeSearch(title) {
  const url = composeUrl("/recipes", {title});

  const request = new Request(url, {
    method: "GET",
    mode: "cors"
  });

  return fetch(request).then((response) => {
    return response.json();
  });
}

function getRecipe(id) {
  const url = composeUrl(`/recipes/${id}`);

  const request = new Request(url, {
    method: "GET",
    mode: "cors"
  });

  return fetch(request).then((response) => {
    return response.json();
  });
}

export function search(name) {
  return makeSearch(name).then((results) => {
    return Promise.all(results.map(({id}) => getRecipe(id)));
  });
}
