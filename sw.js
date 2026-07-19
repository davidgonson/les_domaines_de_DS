// Service worker — Les Domaines de DS
// Reçoit les notifications push envoyées par la fonction Supabase "send-push"
// et les affiche comme notifications système sur le téléphone.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'Les Domaines de DS', body: event.data ? event.data.text() : 'Nouvelle mise à jour' };
  }
  const title = data.title || 'Les Domaines de DS';
  const options = {
    body: data.body || '',
    icon: data.icon || undefined,
    badge: data.badge || undefined,
    tag: data.tag || undefined,       // regroupe/replace les notifs similaires au lieu d'empiler
    renotify: !!data.tag,
    data: { url: data.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Au clic sur la notification : on ramène l'app au premier plan (ou on l'ouvre si fermée)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
