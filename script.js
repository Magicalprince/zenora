// Animate ZENORA letters
document.addEventListener('DOMContentLoaded', () => {
    // GSAP animation for logo letters
    gsap.from('.logo span', {
        duration: 1,
        opacity: 0,
        y: 50,
        stagger: 0.2,
        ease: "back.out"
    });

    // Load Lottie animation
    const animation = lottie.loadAnimation({
        container: document.getElementById('animation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets2.lottiefiles.com/packages/lf20_ksr6ciz9.json' // Meditation animation
    });

    // Fetch and display quote
    fetchDailyQuote();
});

async function fetchDailyQuote() {
    try {
        const response = await fetch('/api/quote');
        const data = await response.json();
        
        const quoteText = document.querySelector('.quote-text');
        const quoteAuthor = document.querySelector('.quote-author');
        
        if (data.quote) {
            quoteText.textContent = data.quote;
            quoteAuthor.textContent = `- ${data.author || 'Unknown'}`;
        }
    } catch (error) {
        console.error('Error fetching quote:', error);
        // Fallback quote in case of API failure
        const quoteText = document.querySelector('.quote-text');
        const quoteAuthor = document.querySelector('.quote-author');
        
        quoteText.textContent = "Peace comes from within. Do not seek it without.";
        quoteAuthor.textContent = "- Buddha";
    }
}
