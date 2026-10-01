(function () {
  const errors = {
    not_in_server: "You need to join the Discord server before continuing.",
    missing_role: "Your Discord account does not have the Client role.",
    missing_client_role: "Your Discord account does not have the Client role.",
    cancelled: "Discord login was cancelled. Please try again.",
    discord_denied: "Discord login was cancelled. Please try again.",
    login_failed: "Discord login could not be completed. Please try again.",
    token_exchange_failed: "Discord login could not be completed. Please try again.",
    server_not_configured: "Discord login is not configured yet."
  };

  function showGate(message) {
    const error = document.getElementById("discordError");
    const cover = document.getElementById("discordCover");
    if (cover) cover.hidden = false;
    document.documentElement.classList.add("oa-locked");
    if (error && message) {
      error.textContent = message;
      error.hidden = false;
    }
  }

  function openPlaybook() {
    document.documentElement.classList.remove("oa-locked");
    const cover = document.getElementById("discordCover");
    if (cover) cover.hidden = true;
  }

  const params = new URLSearchParams(window.location.search);
  const errorCode = params.get("discord_error") || params.get("auth_error");

  fetch("/api/playbook/discord-session", { credentials: "same-origin", cache: "no-store" })
    .then(function (response) {
      if (!response.ok) {
        showGate(errors[errorCode] || "Sign in with Discord to continue.");
        return null;
      }
      return response.json();
    })
    .then(function (data) {
      if (!data) return;
      if (data.authenticated) openPlaybook();
      else showGate(errors[errorCode] || "Sign in with Discord to continue.");
    })
    .catch(function () {
      showGate("Discord access could not be verified. Please try again.");
    });
})();