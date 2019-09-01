import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { keys as idbKeys, del as idbDel } from 'idb-keyval';

ReactDOM.render(<App />, document.getElementById('root'));

navigator.serviceWorker.register('/sw.js');

async function initializeState() {
  const registration = await navigator.serviceWorker.ready;
  const tags = new Set(await registration.sync.getTags());

  for (var idbKey of await idbKeys()) {
    if (!tags.has(idbKey)) {
      idbDel(idbKey);
    }
  }
}
initializeState();
