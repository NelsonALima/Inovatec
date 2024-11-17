// Função para abrir/fechar a janela do chat
function toggleChatWindow() {
  const chatWindow = document.getElementById('chat-window');
  const chatIcon = document.getElementById('chat-icon');
  if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
      chatWindow.style.display = "flex";
      chatIcon.style.display = "none"; // Esconde o ícone quando o chat está aberto
  }
}

// Função para minimizar a janela do chat
function minimizeChat() {
  const chatWindow = document.getElementById('chat-window');
  const chatIcon = document.getElementById('chat-icon');
  chatWindow.style.display = "none";
  chatIcon.style.display = "flex"; // Mostra o ícone novamente
}

// Função para mudar o idioma e carregar o JSON correspondente
function changeLanguage(language) {
  const languages = {
      pt: {
          file: 'intents.json',
          placeholder: "Digite sua mensagem...",
          defaultResponse: "Desculpe, não entendi. Pode reformular?",
          chatbotName: "Techbot",
          sendButton: "Enviar"
      },
      en: {
          file: 'intents_eua.json',
          placeholder: "Type your message...",
          defaultResponse: "Sorry, I didn't understand. Can you rephrase?",
          chatbotName: "Techbot",
          sendButton: "Send"
      },
      es: {
          file: 'intents_span.json',
          placeholder: "Escribe tu mensaje...",
          defaultResponse: "Lo siento, no entendí. ¿Puedes reformular?",
          chatbotName: "Techbot",
          sendButton: "Enviar"
      }
  };

  // Atualiza o idioma na interface
  document.getElementById('user-input').placeholder = languages[language].placeholder;
  document.getElementById('chatbot-name').textContent = languages[language].chatbotName;
  const sendButton = document.getElementById('send-button');
  if (sendButton) {
      sendButton.textContent = languages[language].sendButton;
  }

  // Atualiza a resposta padrão
  window.defaultResponse = languages[language].defaultResponse;

  // Carrega o arquivo JSON correspondente
  const filePath = languages[language].file;
  fetch(filePath)
      .then(response => response.json())
      .then(data => {
          window.intentsData = data.intents; // Atualiza as intenções do chatbot
          console.log(`Intenções carregadas para o idioma ${language}`);
      })
      .catch(err => console.log(`Erro ao carregar o arquivo ${filePath}: `, err));
}

// Função para enviar a mensagem
function sendMessage() {
  const userInput = document.getElementById('user-input');
  const message = userInput.value.trim();
  if (message) {
      const chatMessages = document.getElementById('chat-messages');
      const userMessage = document.createElement('div');
      userMessage.classList.add('user-message');
      userMessage.textContent = message;
      chatMessages.appendChild(userMessage);

      // Processa a mensagem do usuário e busca uma resposta
      const botResponseData = getBotResponse(message);

      // Exibe a resposta do bot e a imagem, se houver
      setTimeout(() => {
          const botMessage = document.createElement('div');
          botMessage.classList.add('bot-message');

          // Exibe a resposta
          const responseText = document.createElement('p');
          responseText.textContent = botResponseData.response;
          botMessage.appendChild(responseText);

          // Exibe a imagem, se houver
          if (botResponseData.image) {
              const responseImage = document.createElement('img');
              responseImage.src = botResponseData.image; // Caminho da imagem
              responseImage.alt = 'Imagem da resposta';
              responseImage.classList.add('bot-image'); // Classe para estilizar a imagem
              botMessage.appendChild(responseImage);
          }

          chatMessages.appendChild(botMessage);
      }, 1000);

      userInput.value = ''; // Limpa a entrada do usuário
      chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para a última mensagem
  }
}

// Função que processa a mensagem do usuário e retorna a resposta do bot
function getBotResponse(userMessage) {
  const normalizedMessage = userMessage.toLowerCase(); // Normaliza a mensagem do usuário

  // Verifica se a mensagem do usuário corresponde a algum padrão nas intenções
  for (let intent of window.intentsData) {
      for (let pattern of intent.patterns) {
          if (normalizedMessage.includes(pattern.toLowerCase())) {
              // Se encontrar, retorna uma resposta aleatória da intenção correspondente
              const response = intent.responses[Math.floor(Math.random() * intent.responses.length)];

              // Se a intenção tem uma imagem, retorna a imagem junto com a resposta
              const image = intent.image ? intent.image : null;

              return {
                  response: response,
                  image: image
              };
          }
      }
  }

  // Resposta padrão caso não encontre nenhuma intenção
  return {
      response: window.defaultResponse || "Desculpe, não entendi. Pode reformular?",
      image: null
  };
}

// Carrega o idioma padrão ao iniciar a página
document.addEventListener('DOMContentLoaded', () => {
  changeLanguage('pt'); // Define o idioma padrão como português
});
