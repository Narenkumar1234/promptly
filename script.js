const SITES = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    note: "Opens homepage. Full auto-submit blocked by browser policy.",
    buildUrl: () => "https://chatgpt.com/"
  },
  {
    id: "claude",
    name: "Claude",
    note: "Opens Claude. Manual paste may be required.",
    buildUrl: () => "https://claude.ai/new"
  },
  {
    id: "gemini",
    name: "Gemini",
    note: "Opens Gemini app. Manual paste may be required.",
    buildUrl: () => "https://gemini.google.com/app"
  },
  {
    id: "perplexity",
    name: "Perplexity",
    note: "Uses query URL prefill.",
    buildUrl: (prompt) => `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`
  },
  {
    id: "grok",
    name: "Grok",
    note: "Uses query URL prefill.",
    buildUrl: (prompt) => `https://grok.com/?q=${encodeURIComponent(prompt)}`
  },
  {
    id: "copilot",
    name: "Copilot",
    note: "Uses query URL prefill where available.",
    buildUrl: (prompt) => `https://copilot.microsoft.com/?q=${encodeURIComponent(prompt)}`
  }
];

const promptInput = document.getElementById("promptInput");
const siteGrid = document.getElementById("siteGrid");
const statusList = document.getElementById("statusList");
const launchButton = document.getElementById("launchButton");
const copyButton = document.getElementById("copyButton");
const siteCheckboxTemplate = document.getElementById("siteCheckboxTemplate");

function renderSites() {
  const fragment = document.createDocumentFragment();

  SITES.forEach((site) => {
    const node = siteCheckboxTemplate.content.cloneNode(true);
    const checkbox = node.querySelector(".site-checkbox");
    const siteName = node.querySelector(".site-name");
    const siteNote = node.querySelector(".site-note");

    checkbox.value = site.id;
    checkbox.checked = true;
    checkbox.setAttribute("aria-label", site.name);
    siteName.textContent = site.name;
    siteNote.textContent = site.note;

    fragment.appendChild(node);
  });

  siteGrid.appendChild(fragment);
}

function selectedSites() {
  const checkedIds = [...siteGrid.querySelectorAll(".site-checkbox:checked")].map((box) => box.value);
  return SITES.filter((site) => checkedIds.includes(site.id));
}

function addStatus(message) {
  const item = document.createElement("li");
  item.textContent = message;
  statusList.prepend(item);
}

async function copyPromptToClipboard(prompt) {
  try {
    await navigator.clipboard.writeText(prompt);
    addStatus("Prompt copied to clipboard.");
  } catch {
    addStatus("Clipboard permission denied. Copy manually from the input box.");
  }
}

function launchSites() {
  statusList.innerHTML = "";

  const prompt = promptInput.value.trim();
  const targets = selectedSites();

  if (!prompt) {
    addStatus("Enter a prompt first.");
    return;
  }

  if (targets.length === 0) {
    addStatus("Select at least one website.");
    return;
  }

  copyPromptToClipboard(prompt);

  const cols = Math.ceil(Math.sqrt(targets.length));
  const rows = Math.ceil(targets.length / cols);
  const screenW = window.screen.availWidth;
  const screenH = window.screen.availHeight;
  const winW = Math.floor(screenW / cols);
  const winH = Math.floor(screenH / rows);

  targets.forEach((site, index) => {
    setTimeout(() => {
      const url = site.buildUrl(prompt);
      const col = index % cols;
      const row = Math.floor(index / cols);
      const left = col * winW;
      const top = row * winH;
      
      const features = `width=${winW},height=${winH},top=${top},left=${left},noopener,noreferrer`;
      const win = window.open(url, `win_${site.id}`, features);

      if (!win) {
        addStatus(`Popup blocked for ${site.name}. Allow popups and try again.`);
        return;
      }

      addStatus(`Opened ${site.name}. Paste text/images manually.`);
    }, index * 300);
  });

  addStatus("Cross-site auto typing and Enter submission are restricted by browser security.");
}

renderSites();
launchButton.addEventListener("click", launchSites);
copyButton.addEventListener("click", () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    addStatus("Enter a prompt to copy.");
    return;
  }

  copyPromptToClipboard(prompt);
});
