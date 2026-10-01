(function () {
  const errors = {
    not_in_server: 'You need to join the Discord server before continuing.',
    missing_role: 'Your Discord account does not have the Client role.',
    cancelled: 'Discord login was cancelled. Please try again.',
    login_failed: 'Discord login could not be completed. Please try again.'
  };

  function showGate(message) {
    const error = document.getElementById('discordError');
    if (message) {
      error.textContent = message;
      error.hidden = false;
    }
  }

  const errorCode = new URLSearchParams(window.location.search).get('discord_error');
  fetch('/api/playbook/discord-session', { credentials: 'same-origin', cache: 'no-store' })
    .then(function (response) {
      if (!response.ok) {
        showGate(errors[errorCode] || 'Sign in with Discord to continue.');
        return;
      }
      document.documentElement.classList.remove('oa-locked');
      document.getElementById('discordCover').hidden = true;
    })
    .catch(function () {
      showGate('Discord access could not be verified. Please try again.');
    });
}());
