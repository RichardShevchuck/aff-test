(function () {
  'use strict';

  var OFFER_URL = 'https://example.com/register?offer=test';
  var CLICKID_ALIASES = { sub1: 'clickid' };
  var STORAGE_KEY = 'preland_params';

  function readParams() {
    var current = new URLSearchParams(window.location.search);
    var stored = {};
    try { stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) {}

    var params = {};
    Object.keys(stored).forEach(function (k) { params[k] = stored[k]; });
    current.forEach(function (v, k) { if (v !== '') params[k] = v; });

    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params)); } catch (e) {}
    return params;
  }

  function buildUrl(base, params) {
    var url;
    try { url = new URL(base, window.location.href); } catch (e) { return base; }

    Object.keys(params).forEach(function (k) {
      if (!url.searchParams.has(k)) url.searchParams.set(k, params[k]);
    });
    Object.keys(CLICKID_ALIASES).forEach(function (target) {
      var src = params[CLICKID_ALIASES[target]];
      if (src && !url.searchParams.has(target)) url.searchParams.set(target, src);
    });
    return url.toString();
  }

  var params = readParams();
  var finalUrl = buildUrl(OFFER_URL, params);

  function apply() {
    document.querySelectorAll('[data-offer]').forEach(function (a) { a.href = finalUrl; });

    if (params.debug === '1') {
      var d = document.getElementById('debug');
      if (d) { d.hidden = false; d.textContent = 'offer link: ' + finalUrl; }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply);
  else apply();

  window.PrelandParams = { params: params, offerUrl: finalUrl };
})();
