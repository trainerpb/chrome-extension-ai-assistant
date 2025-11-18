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

