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

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,bn,gu,kn,ml,mr,pa,ta,te', // Add more as needed
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

document.getElementById('translate-btn').onclick = function() {
    // Show the Google Translate toolbar
    document.getElementById('google_translate_element').style.display = 'block';
    // Simulate a click on the Google Translate dropdown
    var gtFrame = document.querySelector('iframe.goog-te-menu-frame');
    if (!gtFrame) {
        // First time: load the widget
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(s);
    }
};