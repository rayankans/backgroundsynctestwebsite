importScripts('/util/setup.js');

self.addEventListener('install', event => {
  event.waitUntil(skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});

async function handleSync(tag) {
  const metadata = await idbGet(tag);
  const attempt = metadata.attempts[metadata.numAttempts];
  if (!attempt) {
    // default to success.
    await idbDel(tag);
    return;
  }

  metadata.numAttempts++;

  // TODO: Find a way to share the enum values between public/ and src/.
  if (attempt.action === 'success')
    await idbDel(tag);
  else
    await idbSet(tag, metadata);
  
  if (attempt.showNotification && Notification.permission === 'granted') {
    self.registration.showNotification('Fired ' + tag, {
      body: `attempt: ${metadata.numAttempts}`,  
    });
  }

  if (attempt.delayMs)
    await new Promise(r => setTimeout(r, attempt.delayMs));

  switch (attempt.action) {
    case 'success':
      return;
    case 'reject':
      throw new Error('Rejecting ' + tag);
    case 'timeout':
      await new Promise(() => {});
  }
}

self.addEventListener('sync', event => {
  event.waitUntil(handleSync(event.tag));
});
