document.addEventListener("DOMContentLoaded", function() {
    const bot = new RiveScript();
    bot.loadFile("brain.rive").then(botReady).catch(botError);

    const chatOutput = document.getElementById("chat-output");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-btn");
    const clearButton = document.getElementById("clear-btn");

    // Load chat history from local storage on page load
    loadChatHistory();

    function botReady() {
        bot.sortReplies();
    }

    function botError(error) {
        console.error("Error loading RiveScript:", error);
        chatOutput.innerHTML += "<p><strong>Error:</strong> Couldn't load the bot brain.</p>";
    }

    // Send user input to the bot on button click
    sendButton.addEventListener("click", function() {
        let input = userInput.value.trim();
        if (input) {
            addChat(input, "user");
            bot.reply("local-user", input).then(function(reply) {
                addChat(reply, "bot");
            });
            userInput.value = "";
        }
    });

    // Clear chat history on button click
    clearButton.addEventListener("click", function() {
        localStorage.removeItem("chatHistory");
        chatOutput.innerHTML = "";
    });

    // Function to add chat messages to the output and save to local storage
    function addChat(text, sender) {
        const message = document.createElement("p");
        message.className = sender;
        message.innerHTML = `<strong>${sender === 'user' ? 'You' : 'Bot'}:</strong> ${text}`;
        chatOutput.appendChild(message);
        chatOutput.scrollTop = chatOutput.scrollHeight;

        // Save to local storage
        saveChatHistory();
    }

    // Save chat history to local storage
    function saveChatHistory() {
        const chatMessages = [];
        chatOutput.querySelectorAll("p").forEach(p => {
            chatMessages.push({
                sender: p.className,
                text: p.innerHTML
            });
        });
        localStorage.setItem("chatHistory", JSON.stringify(chatMessages));
    }

    // Load chat history from local storage
    function loadChatHistory() {
        const chatHistory = JSON.parse(localStorage.getItem("chatHistory"));
        if (chatHistory) {
            chatHistory.forEach(msg => {
                const message = document.createElement("p");
                message.className = msg.sender;
                message.innerHTML = msg.text;
                chatOutput.appendChild(message);
            });
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }
    }
});
