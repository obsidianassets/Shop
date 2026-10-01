(function () {
  const blockedEvents = ['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart'];
  const editableSelector = 'input, textarea, [contenteditable]';

  function isEditable(event) {
    return event.composedPath().some(function (node) {
      return node instanceof Element && node.matches(editableSelector);
    });
  }

  blockedEvents.forEach(function (eventName) {
    document.addEventListener(eventName, function (event) {
      if (!isEditable(event)) event.preventDefault();
    });
  });
}());
