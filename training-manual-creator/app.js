const defaultSections = {
  1: `Hi Joe

Section 1: Welcome to Our Lovely Company!

Welcome to the team! This training manual will help you get oriented and become productive in your new role. Please review each section carefully and don't hesitate to reach out to your supervisor or HR if you have questions.

Company Mission:
We strive to deliver innovative solutions that make our customers' lives easier while maintaining the highest standards of quality and service.

Core Values:
- Customer Focus: Every decision should benefit our customers
- Innovation: We embrace new ideas and continuous improvement
- Integrity: We act ethically and transparently in all situations
- Collaboration: We work together to achieve common goals

Your First Week:
1. Complete this training manual (Sections 1-3)
2. Meet with your direct supervisor to discuss role expectations
3. Attend the new employee orientation session
4. Set up your workspace and IT accounts
5. Schedule introductory meetings with key team members

Remember, everyone here wants you to succeed. Take advantage of the knowledge and experience around you!`,
  2: `Section 2: IT Setup and Security

Your technology setup is crucial for productivity and security. Please follow these steps carefully and contact IT Support if you encounter any issues.

Computer Setup:
1. Log in using your temporary credentials (provided by IT)
2. Update your password immediately (must be 12+ characters with mixed case, numbers, and symbols)
3. Install required software from the company portal
4. Configure your email and calendar settings

Security Guidelines:
- Never share your login credentials with anyone
- Lock your computer whenever you step away (Windows: Win+L, Mac: Cmd+Ctrl+Q)
- Report suspicious emails to IT immediately - when in doubt, don't click!
- Use the company VPN when working remotely
- Keep your software updated with automatic updates enabled`,
};

const state = {
  messages: JSON.parse(localStorage.getItem("tmc_messages") || "[]"),
  sections: JSON.parse(localStorage.getItem("tmc_sections") || JSON.stringify(defaultSections)),
};

const chatLog = document.querySelector("#chatLog");
const chatForm = document.querySelector("#chatForm");
const chatInput = document.querySelector("#chatInput");
const manualPreview = document.querySelector("#manualPreview");

function saveState() {
  localStorage.setItem("tmc_messages", JSON.stringify(state.messages));
  localStorage.setItem("tmc_sections", JSON.stringify(state.sections));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function renderChat() {
  chatLog.innerHTML = "";
  if (state.messages.length === 0) {
    chatLog.innerHTML = `
      <div class="empty-chat">
        <h2>Ask the assistant to work with the handbook.</h2>
        <p>Try reading section 1, looking up Sarah Chen, or writing a new section 3.</p>
      </div>
    `;
    return;
  }

  for (const message of state.messages) {
    const row = document.createElement("div");
    row.className = `chat-message ${message.role}`;
    row.innerHTML = `<span>${message.role}</span><p>${escapeHtml(message.content)}</p>`;
    if (message.toolCall) {
      row.innerHTML += `
        <details class="tool-detail" open>
          <summary>Tool executed: ${escapeHtml(message.toolCall.function_name)}</summary>
          <pre>${escapeHtml(JSON.stringify(message.toolCall, null, 2))}</pre>
        </details>
      `;
    }
    chatLog.appendChild(row);
  }
  chatLog.scrollTop = chatLog.scrollHeight;
}

function renderManual() {
  manualPreview.innerHTML = Object.entries(state.sections)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([sectionNumber, content]) => `
      <article class="manual-section">
        <h3>Section ${escapeHtml(sectionNumber)}</h3>
        <pre>${escapeHtml(content)}</pre>
      </article>
    `)
    .join("");
}

async function sendPrompt(prompt) {
  state.messages.push({ role: "user", content: prompt });
  renderChat();
  saveState();

  const response = await fetch("/api/training-manual-chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: state.messages, sections: state.sections }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  state.sections = data.sections || state.sections;
  state.messages.push({ role: "assistant", content: data.reply, toolCall: data.toolCall });
  saveState();
  renderChat();
  renderManual();
}

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = chatInput.value.trim();
  if (!prompt) return;
  chatInput.value = "";
  chatInput.disabled = true;
  try {
    await sendPrompt(prompt);
  } catch (error) {
    state.messages.push({ role: "assistant", content: `Error: ${error.message}` });
    renderChat();
  } finally {
    chatInput.disabled = false;
    chatInput.focus();
  }
});

document.querySelectorAll(".prompt-chip").forEach((button) => {
  button.addEventListener("click", () => {
    chatInput.value = button.dataset.prompt;
    chatForm.requestSubmit();
  });
});

document.querySelector("#resetApp").addEventListener("click", () => {
  state.messages = [];
  state.sections = { ...defaultSections };
  saveState();
  renderChat();
  renderManual();
});

renderChat();
renderManual();
