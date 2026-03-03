// Main application logic

document.addEventListener('DOMContentLoaded', () => {
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Project Cards Expansion Logic
    const projectCards = document.querySelectorAll('.expand-on-click');
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            // Close other cards
            projectCards.forEach(c => {
                if (c !== card) c.classList.remove('expanded');
            });
            // Toggle current card
            card.classList.toggle('expanded');
        });
    });

    // Magnetic Button Effect
    const magneticElements = document.querySelectorAll('.magnetic, .magnetic-slight');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const strength = elem.classList.contains('magnetic-slight') ? 0.1 : 0.3;
            
            elem.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        
        elem.addEventListener('mouseleave', () => {
            elem.style.transform = 'translate(0px, 0px)';
        });
    });
});
