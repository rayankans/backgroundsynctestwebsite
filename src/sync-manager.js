
import { set as idbSet } from 'idb-keyval';

export async function registerSync(tag, attempts) {
  const registration = await navigator.serviceWorker.ready;
  const tags = await registration.sync.getTags();
  if (tags.includes(tag))
    throw new Error('Tag is already registered');
  
  await idbSet(tag, {numAttempts: 0, attempts});
  await registration.sync.register(tag);
}
