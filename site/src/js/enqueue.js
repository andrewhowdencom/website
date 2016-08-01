window._enqueue = [];

// Queue the required events.
window._enqueueMethod = function(e) {
  window._enqueue.push(e);
}
document.addEventListener('alerts.lc.add', window._enqueueMethod);
