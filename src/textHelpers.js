const textToURLparam = (key, inputText) => {
  let encodedKey = encodeURIComponent(key);
  let encodedInput = encodeURIComponent(inputText);
  let urlAddendum = `${encodedKey}=${encodedInput}&`;
  return urlAddendum
}

const isNum = (k) => {
  return +k !== NaN
}

const stateToURL = (music) => {
  clearQueryStr();
  console.log("HEY")
  let queryString = "#"
  let atLeastOne = false;
  for (let i = 0; i < music.length; i++) {
    if (music[i].text) {
      atLeastOne = true;
      queryString += textToURLparam(music[i].key, music[i].text);
    }
  }
  if (atLeastOne) {
    queryString = queryString.substring(0, queryString.length - 1);
  }
  window.history.pushState(null, null, queryString);
}

const clearQueryStr = () => {
  window.history.pushState(null, null, '/');
}


const stateFromURL = (defaultArr) => {
  let queryString = window.location.href.split("#")[1]
  if (!queryString) return
  let arr = queryString.split("&")
  for (let i = 0; i < arr.length; i++) {
    let pair = arr[i]
    let [k, v] = pair.split("=").map(x => decodeURIComponent(x))
    if (isNum(k)) {
      defaultArr[i] = {text: v, editable: false}
    }
  }
  return defaultArr
}

export {
  stateFromURL,
  clearQueryStr,
  stateToURL,
};

