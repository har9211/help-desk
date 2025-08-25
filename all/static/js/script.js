document.addEventListener("DOMContentLoaded", function(){
  const message = document.getElementById("message");
  if (message) {
    setTimeout(() => message.style.display = "none", 4000);
  }
});
