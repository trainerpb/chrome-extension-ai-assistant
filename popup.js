const chat = document.getElementById('chat');
const input = document.getElementById('input');

const API = "http://192.168.137.84:8080/api/chat/whatsapp-stream?q="
input.addEventListener('keydown', (e) => {
    console.log("Keydown ---------------------------------");
    if (e.key === 'Enter' && input.value.trim().length > 0) {
        const userMsg = input.value.trim();
        appendMessage(userMsg, 'user');
        input.value = '';

        // // Simulate bot response
        // setTimeout(() => {
        //   appendMessage("You said: " + userMsg, 'bot');
        // }, 500);
        var source = new EventSource(API + encodeURIComponent(userMsg));
        const answerDiv = appendMessage('Reply: ', 'bot');
        source.onmessage = function (event) {
            let chunk = event.data;
            answerDiv.textContent += ' ' + chunk;
        };

        source.onerror = () => {
            console.log("\n\n❌ Stream disconnected.");
            source.close();

        };
        source.addEventListener('done', (event) => {
            console.log('Stream ended:', event.data);
            source.close();

        });

    }
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({
    path: "popup.html",
    enabled: true
  });
});


function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    msg.textContent = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
    return msg;
}



document.getElementById('clickMe').addEventListener('click', () => {
    alert('Button clicked!');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => document.body.innerText
        }, (results) => {
            if (chrome.runtime.lastError) {
                document.getElementById('output').textContent = 'Error: ' + chrome.runtime.lastError.message;
            } else {
                let textContent = results[0].result;
                document.getElementById('output').textContent = textContent;
                fetch("http://localhost:8080/api/chrome/chunks-to-vector-store", {
                    method: "POST",
                    headers: {
                        "Content-Type": "text/plain"
                    },
                    body: textContent
                })

                    .then(data => {
                        document.getElementById("output").textContent = data;
                    })
                    .catch(err => {
                        document.getElementById("output").textContent = "Error: " + err;
                    });

            }
        });
    });


});

