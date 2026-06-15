self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data?.url as string | undefined) ?? '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((client) => 'focus' in client);
      if (existing && 'focus' in existing) {
        existing.focus();
        if ('navigate' in existing) return (existing as WindowClient).navigate(url);
        return;
      }
      return self.clients.openWindow(url);
    }),
  );
});
