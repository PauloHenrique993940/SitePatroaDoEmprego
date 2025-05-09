let step = 0;
let userName = "";
let interest = "";

const chatBody = document.getElementById("chatBody");
const input = document.getElementById("userInput");

function toggleChat() {
  const chat = document.getElementById("chat");
  chat.style.display = chat.style.display === "flex" ? "none" : "flex";
  if (step === 0) {
    setTimeout(() => {
      addMessage("Olá! Seja bem-vindo!. Qual o seu nome?");
    }, 500);
  }
}

function addMessage(text, isUser = false) {
  const message = document.createElement("div");
  message.textContent = text;
  message.style.textAlign = isUser ? "right" : "left";
  message.style.margin = "5px 0";
  chatBody.appendChild(message);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function sendMessage() {
  const userText = input.value.trim();
  if (!userText) return;

  addMessage(userText, true);
  input.value = "";

  setTimeout(() => nextStep(userText), 600);
}

function nextStep(userText) {
  if (step === 0) {
    userName = userText;
    addMessage(`Prazer, ${userName}! Você está procurando emprego ou deseja contratar alguém?`);
    step++;
  } else if (step === 1) {
    interest = userText.toLowerCase();
    if (interest.includes("emprego")) {
      addMessage("Ótimo! Em qual área você está buscando uma vaga?");
    } else {
      addMessage("Entendido! Em qual área você deseja contratar?");
    }
    step++;
  } else if (step === 2) {
    addMessage(`Perfeito! Podemos continuar essa conversa no WhatsApp ou por Email.`);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "chat-buttons";

    const whatsappBtn = document.createElement("button");
    whatsappBtn.textContent = "👉 WhatsApp";
    whatsappBtn.className = "whatsapp";
    whatsappBtn.onclick = () => {
      window.open("https://wa.me/557192882255", "_blank");
    };

    const emailBtn = document.createElement("button");
    emailBtn.textContent = "📧 Email";
    emailBtn.className = "email";
    emailBtn.onclick = () => {
      window.location.href = "mailto:contato@seusite.com";
    };

    buttonContainer.appendChild(whatsappBtn);
    buttonContainer.appendChild(emailBtn);
    chatBody.appendChild(buttonContainer);
    chatBody.scrollTop = chatBody.scrollHeight;

    step++;
  }
}