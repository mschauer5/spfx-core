import _ from 'lodash';
import URI from 'urijs';
import { global } from '../global';

const getCurrentPageHashUrl = (): string => {
  const url = window.location.href;
  if (url.indexOf('#') > -1) {
    return url.substring(url.indexOf('#'));
  } else {
    return '';
  }
};

const getCurrentPageUrl = (): string => {
  const url = window.location.href;
  if (url.indexOf('#') > -1) {
    return url.substring(0, url.indexOf('#'));
  } else {
    return url;
  }
};

const goToSPAUrl = () => {
  window.open(global.SPA_Url(), '_self');
};

const refresh = () => {
  sessionStorage.clear();
  window.location.reload();
};

const windowOpen = (url: string, newTab: boolean = false) => {
  const win = window.open(url, newTab ? '_blank' : '_self');
  win.focus();
};

const addNewRouteToUrl = (route: string, returnFullUrl = false) => {
  const uri = new URI();
  uri.hash(route);

  let rUrl = `${URI.decode(uri.href())}`;
  if (!returnFullUrl) {
    rUrl = rUrl.replace(global.Domain_Url(), '');
  }

  return rUrl;
};

const getQueryString = (name: string): string => {
  const url = new URL(window.location.href.replace('#', ''));
  const params = new URLSearchParams(url.search);
  return params.get(name);
};

const setQueryString = (name: string, value: any) => {
  const uri = new URI();
  const hash = uri.hash();

  uri.normalizeHash(); // remove hash from url

  if (value === undefined) {
    uri.removeQuery(name, value);
  } else {
    uri.setQuery(name, value);
  }

  const parsedUrl = URI.parse(uri.href());

  const queryStrings = URI.parseQuery(parsedUrl.query);
  const debugManifestsFile = queryStrings.debugManifestsFile;
  const loadSPFX = queryStrings.loadSPFX;
  const customActions = queryStrings.customActions;

  delete queryStrings.debugManifestsFile;
  delete queryStrings.loadSPFX;
  delete queryStrings.customActions;

  const url = parsedUrl.path;
  const r_uri = new URI(url);

  _.forOwn(queryStrings, function (value, key) {
    r_uri.addQuery(key, value);
  });

  if (debugManifestsFile) {
    r_uri.addQuery('debugManifestsFile', debugManifestsFile);
  }
  if (loadSPFX) {
    r_uri.addQuery('loadSPFX', loadSPFX);
  }
  if (customActions) {
    r_uri.addQuery('customActions', customActions);
  }

  const rUrl = `${URI.decode(r_uri.href())}${hash}`;

  window.history.replaceState({}, '', rUrl);
};

export const url = {
  getCurrentPageHashUrl,
  getCurrentPageUrl,
  goToSPAUrl,
  refresh,
  windowOpen,
  addNewRouteToUrl,
  getQueryString,
  setQueryString
};
