window._enqueue = [];

// Queue the required events.
document.addEventListener('alerts.lc.add', function(e) {
  window._enqueue.push(e);
});
