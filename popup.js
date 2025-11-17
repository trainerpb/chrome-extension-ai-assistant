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
                document.getElementById('output').textContent = results[0].result;
            }
        });
    });


});

