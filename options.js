document.getElementById("save").addEventListener("click", () => {
  const endpoint = document.getElementById("endpoint").value;
  chrome.storage.local.set({ apiEndpoint: endpoint }, () => {
    alert("Chatbot Endpoint saved: " + endpoint);
  });
});