document.addEventListener('DOMContentLoaded', () => {

    // Hero Entry Animation (GSAP)
    gsap.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.2
    });

    gsap.to('.hero-image', {
        scale: 1,
        duration: 2,
        ease: 'power2.out'
    });

    // Sub-elements fade
    gsap.from('.nav-links li', {
        opacity: 0,
        y: -10,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.5
    });

    // Handle Hero Image Error
    const heroImg = document.getElementById('hero-img');
    heroImg.onerror = () => {
        console.error("Hero image failed to load.");
        heroImg.onerror = null; // Prevent infinite loop
    };

    // Canvas Scroll Sequence Animation
    const canvas = document.getElementById("sequence-canvas");
    const context = canvas.getContext("2d");

    const frameCount = 80; // 0 to 79
    const currentFrame = index => (
        `Generate_another_one_1080p_202602201253_000/Generate_another_one_1080p_202602201253_${index.toString().padStart(3, '0')}.jpg`
    );

    const images = [];
    const sequence = { frame: 0 };

    // Resize Canvas to fit screen initially
    const setCanvasSize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render(); // Re-render after resize if images are loaded
    };

    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();

    // Preload all images
    let imagesLoaded = 0;
    for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);

        // Draw the first frame immediately when it loads
        if (i === 0) {
            img.onload = () => {
                imagesLoaded++;
                render();
            };
        }
    }

    gsap.to(sequence, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
            trigger: ".scroll-sequence-section",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5, // Smooth scrubbing
            onUpdate: render // render on update
        }
    });

    // Make text appear in the middle of scroll
    gsap.to(".sequence-overlay-text", {
        scrollTrigger: {
            trigger: ".scroll-sequence-section",
            start: "top 20%",
            end: "bottom 80%",
            scrub: 1,
            toggleActions: "play reverse play reverse",
            onEnter: () => gsap.to(".sequence-overlay-text", { opacity: 1, y: -20, duration: 0.5 }),
            onLeave: () => gsap.to(".sequence-overlay-text", { opacity: 0, y: 0, duration: 0.5 }),
            onEnterBack: () => gsap.to(".sequence-overlay-text", { opacity: 1, y: -20, duration: 0.5 }),
            onLeaveBack: () => gsap.to(".sequence-overlay-text", { opacity: 0, y: 0, duration: 0.5 })
        }
    });

    function render() {
        if (!images[sequence.frame] || !images[sequence.frame].complete) return;

        const img = images[sequence.frame];

        // Draw image covering the canvas (object-fit: cover equivalent)
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);

        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;

        // clear canvas before drawing
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(
            img,
            0, 0, img.width, img.height,
            centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
        );
    }

    // Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const submitBtn = document.getElementById('submit-btn');
            const formResponse = document.getElementById('form-response');

            // Set loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            formResponse.style.display = 'none';

            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, message })
                });

                const data = await response.json();

                if (response.ok) {
                    formResponse.textContent = data.message;
                    formResponse.style.backgroundColor = 'rgba(74, 222, 128, 0.2)'; // Green
                    formResponse.style.color = '#4ade80';
                    formResponse.style.border = '1px solid rgba(74, 222, 128, 0.4)';
                    contactForm.reset();
                } else {
                    formResponse.textContent = data.error || 'Something went wrong.';
                    formResponse.style.backgroundColor = 'rgba(248, 113, 113, 0.2)'; // Red
                    formResponse.style.color = '#f87171';
                    formResponse.style.border = '1px solid rgba(248, 113, 113, 0.4)';
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                formResponse.textContent = 'Failed to connect to the server.';
                formResponse.style.backgroundColor = 'rgba(248, 113, 113, 0.2)';
                formResponse.style.color = '#f87171';
                formResponse.style.border = '1px solid rgba(248, 113, 113, 0.4)';
            } finally {
                formResponse.style.display = 'block';
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
        });
    }
});
