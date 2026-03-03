// Intersection Observer for Reveal Animations and Number Counters

document.addEventListener('DOMContentLoaded', () => {

    // Reveal Elements on Scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // If the targeting element has stat-numbers, animate them
                if (entry.target.classList.contains('about')) {
                    animateNumbers();
                }

                // Optional: Unobserve after animating once
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe Titles and Sections
    const revealElements = document.querySelectorAll('.fade-in-up, .section-title');
    revealElements.forEach(el => observer.observe(el));

    // Number Counter Animation
    let numbersAnimated = false;
    function animateNumbers() {
        if (numbersAnimated) return;

        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // ms
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;

            const timer = setInterval(() => {
                current += 1;
                stat.innerText = current;
                if (current >= target) {
                    clearInterval(timer);
                    stat.innerText = target;
                }
            }, stepTime);
        });

        numbersAnimated = true;
    }
});
