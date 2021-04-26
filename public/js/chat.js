const socket = io();

const fallback = document.querySelector(".fallback");

socket.on("message", (message) => {
  console.log(message);

  if (!message.typers) {
    fallback.innerHTML = "";
  }
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message);

  e.target.elements.message.value = "";
});

document
  .querySelector("#message-form__sendButton")
  .addEventListener("click", () => {
    let message = document.querySelector("#message-form__input");

    socket.emit("sendMessage", message.value);

    message.value = "";

    socket.emit("typing", { isTyping: message.value.length > 0 });
  });

document.querySelector("#message-form__input").addEventListener("keyup", () => {
  socket.emit("typing", {
    isTyping: document.querySelector("#message-form__input").value.length > 0,
    nick: "Salik",
  });
});

socket.on("typing", (data) => {
  const { isTyping, nick, typers } = data;

  console.log("t--", typers);

  if (!isTyping) {
    fallback.innerHTML = "";
    return;
  }

  fallback.innerHTML =
    typers > 1 ? `Several people are typing` : `<p>${nick} is typing...</p>`;
});
