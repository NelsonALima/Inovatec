// Função para abrir/fechar a janela do chat
function toggleChatWindow() {
  const chatWindow = document.getElementById('chat-window');
  const chatIcon = document.getElementById('chat-icon');
  if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
      chatWindow.style.display = "flex";
      chatIcon.style.display = "none"; // Esconde o ícone quando o chat está aberto
  }
}

const menuButton = document.getElementById('menu-btn');
const submenu = document.getElementById('submenu');

// Tempo de delay em milissegundos (por exemplo, 500ms)
const delayTime = 500;
let timeoutId; // Variável para armazenar o ID do timeout

// Função para exibir o submenu
function showSubmenu() {
    submenu.classList.add('active');
    // Cancela qualquer timeout anterior, caso o mouse volte para o submenu antes do delay
    clearTimeout(timeoutId);
}

// Função para ocultar o submenu com delay
function hideSubmenu() {
    timeoutId = setTimeout(() => {
        submenu.classList.remove('active');
    }, delayTime);
}

// Adicionar eventos de mouse
menuButton.addEventListener('mouseover', showSubmenu);
submenu.addEventListener('mouseover', showSubmenu);

menuButton.addEventListener('mouseout', hideSubmenu);
submenu.addEventListener('mouseout', hideSubmenu);

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
            sendButton: "Enviar",
            menuButton: "Menu", 
            submenu: {
                history: "Histórico",
                savedMessages: "Mensagens Salvas",
                about: "Sobre"
            }
        },
        en: {
            file: 'intents_eua.json',
            placeholder: "Type your message...",
            defaultResponse: "Sorry, I didn't understand. Can you rephrase?",
            chatbotName: "Techbot",
            sendButton: "Send",
            menuButton: "Menu",
            submenu: {
                history: "History",
                savedMessages: "Saved Messages",
                about: "About"
            }
        },
        es: {
            file: 'intents_span.json',
            placeholder: "Escribe tu mensaje...",
            defaultResponse: "Lo siento, no entendí. ¿Puedes reformular?",
            chatbotName: "Techbot",
            sendButton: "Enviar",
            menuButton: "Menú",
            submenu: {
                history: "Historial",
                savedMessages: "Mensajes Guardados",
                about: "Sobre"
            }
        }
    };

    // Atualiza o idioma na interface
    document.getElementById('user-input').placeholder = languages[language].placeholder;
    document.getElementById('chatbot-name').textContent = languages[language].chatbotName;
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        sendButton.textContent = languages[language].sendButton;
    }

    // Atualiza o texto do botão Menu
    const menuButton = document.getElementById('menu-btn');
    if (menuButton) {
        menuButton.textContent = languages[language].menuButton;
    }

    // Atualiza os itens do submenu
    const submenu = document.getElementById('submenu');
    const submenuLinks = submenu.querySelectorAll('li a');
    submenuLinks[0].textContent = languages[language].submenu.history;
    submenuLinks[1].textContent = languages[language].submenu.savedMessages;
    submenuLinks[2].textContent = languages[language].submenu.about;

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

let chatHistory = [];

// Função para enviar a mensagem
function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (message) {
        const chatMessages = document.getElementById('chat-messages');
        const userMessage = document.createElement('div');
        userMessage.classList.add('user-message');
  
        // Criação do ícone circular para o usuário
        const userIcon = document.createElement('div');
        userIcon.classList.add('message-icon');
        userIcon.style.backgroundImage = "url('techbot-fundo-usu.png')"; // Caminho do ícone do usuário
        userMessage.appendChild(userIcon); // Adiciona o ícone à mensagem do usuário

        // Criação de um elemento <p> para a mensagem do usuário
        const userMessageText = document.createElement('p');
        userMessageText.textContent = message; // Adiciona o texto da mensagem do usuário
        userMessage.appendChild(userMessageText); // Adiciona o texto à mensagem do usuário
  
        chatMessages.appendChild(userMessage);
  
        // Registra a mensagem no histórico
        const currentDate = new Date();
        const userMessageData = {
            sender: 'user',
            message: message,
            timestamp: currentDate.toLocaleString()
        };
        chatHistory.push(userMessageData); // Adiciona a mensagem ao histórico
  
        // Processa a mensagem do usuário e busca uma resposta
        const botResponseData = getBotResponse(message);
  
        // Exibe a resposta do bot e a imagem, se houver
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.classList.add('bot-message');
  
            // Criação do ícone circular para o bot
            const botIcon = document.createElement('div');
            botIcon.classList.add('message-icon');
            botIcon.style.backgroundImage = "url('techbot-fundo-chat.png')"; // Caminho do ícone do bot
            botMessage.appendChild(botIcon); // Adiciona o ícone à mensagem do bot
  
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

            // Exibe o botão de download, se houver um arquivo
            if (botResponseData.file) {
                const downloadButton = document.createElement('a');
                downloadButton.href = botResponseData.file; // Caminho do arquivo
                downloadButton.download = 'limpa_cache.bat'; // Nome do arquivo ao fazer download
                downloadButton.textContent = "Download";
                downloadButton.classList.add('download-button'); // Classe para estilização
                botMessage.appendChild(downloadButton);
            }
  
            chatMessages.appendChild(botMessage);
  
            // Registra a resposta no histórico
            const botMessageData = {
              sender: 'bot',
              message: botResponseData.response,
              timestamp: currentDate.toLocaleString()
          };
          chatHistory.push(botMessageData); // Adiciona a resposta ao histórico

          // Rola para a última mensagem após a resposta do bot
          chatMessages.scrollTop = chatMessages.scrollHeight;
  
        }, 1000);

      userInput.value = ''; // Limpa a entrada do usuário
      chatMessages.scrollTop = chatMessages.scrollHeight; // Rola para a última mensagem
  }
}

// Função para exibir o histórico de conversas
function showHistory() {
    const historyScreen = document.getElementById('history-screen');
    const historyList = document.getElementById('history-list');
    
    // Limpa a lista de histórico
    historyList.innerHTML = '';

    // Preenche a lista com as mensagens do histórico
    chatHistory.forEach(item => {
        const messageItem = document.createElement('div');
        messageItem.classList.add('history-item');

        const timestamp = document.createElement('span');
        timestamp.classList.add('timestamp');
        timestamp.textContent = item.timestamp;

        const messageContent = document.createElement('p');
        messageContent.classList.add('message');
        messageContent.textContent = `${item.sender === 'user' ? 'Você' : 'Techbot'}: ${item.message}`;

        messageItem.appendChild(timestamp);
        messageItem.appendChild(messageContent);
        historyList.appendChild(messageItem);
    });

    historyScreen.style.display = 'block'; // Exibe a tela do histórico
}

// Função para fechar o histórico
function closeHistory() {
    const historyScreen = document.getElementById('history-screen');
    historyScreen.style.display = 'none'; // Fecha a tela do histórico
}

// Função para lidar com o clique no item "Histórico" do submenu
function openHistory() {
    showHistory(); // Exibe o histórico
}

// Associe o item "Histórico" para abrir o histórico ao clicar
document.querySelector('#submenu ul li:nth-child(1) a').addEventListener('click', openHistory);


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

                // Verifica se a intenção tem um arquivo associado
                if (intent.file) {
                    return {
                        response: response,
                        image: image,
                        file: intent.file // Caminho do arquivo para download
                    };
                }

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
