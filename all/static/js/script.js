document.addEventListener("DOMContentLoaded", function() {
    const message = document.getElementById("message");
    if (message) {
        setTimeout(() => message.style.display = "none", 4000);
    }
});

window.onload = function() {
    const translateBtn = document.getElementById('translate-btn');
    const langSelect = document.getElementById('language-select');

    if (translateBtn && langSelect) {
        translateBtn.addEventListener('click', function() {
            langSelect.style.display = langSelect.style.display === 'block' ? 'none' : 'block';
        });

        langSelect.addEventListener('change', function() {
            const selectedLang = langSelect.value;
            // Redirect to chatbot page with selected language as query param
            window.location.href = `/chatbot?language=${selectedLang}`;
        });
    }
};
