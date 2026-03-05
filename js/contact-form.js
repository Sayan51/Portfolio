/* ============================================
   contact-form.js — Form Handling & Animation
   ============================================ */
const ContactForm = (function () {
    function init() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const emailInput = document.getElementById('contact-email');
        const submitBtn = document.getElementById('contact-submit');
        const successDiv = document.getElementById('contact-success');

        // Real-time email validation
        emailInput.addEventListener('blur', function () {
            if (this.value && !isValidEmail(this.value)) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
            }
        });
        emailInput.addEventListener('input', function () {
            this.classList.remove('error');
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate
            const email = emailInput.value;
            if (!isValidEmail(email)) {
                emailInput.classList.add('error');
                return;
            }

            // Show loading
            const submitText = submitBtn.querySelector('.submit-text');
            const submitLoading = submitBtn.querySelector('.submit-loading');
            submitText.style.display = 'none';
            submitLoading.style.display = 'inline';
            submitBtn.disabled = true;

            // Send to Formspree
            const formData = new FormData(form);

            fetch('https://formspree.io/f/xdawnokl', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
                .then(response => {
                    if (response.ok) {
                        // Flash effect
                        const flash = document.createElement('div');
                        flash.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#fff;z-index:9998;opacity:0.8;';
                        document.body.appendChild(flash);
                        setTimeout(() => flash.remove(), 150);

                        SoundManager.playTransmission();

                        // Show success
                        form.style.display = 'none';
                        successDiv.style.display = 'block';

                        // Type success messages
                        const lines = successDiv.querySelectorAll('.success-line');
                        lines.forEach((line, i) => {
                            line.style.opacity = '0';
                            setTimeout(() => {
                                line.style.transition = 'opacity 0.5s ease';
                                line.style.opacity = '1';
                            }, i * 500 + 200);
                        });

                        // Reset after 4 seconds
                        setTimeout(() => {
                            successDiv.style.display = 'none';
                            form.style.display = 'block';
                            form.reset();
                            submitText.style.display = 'inline';
                            submitLoading.style.display = 'none';
                            submitBtn.disabled = false;
                        }, 4000);
                    } else {
                        throw new Error('Submission failed');
                    }
                })
                .catch(error => {
                    // Show error
                    submitText.textContent = '❌ TRANSMISSION FAILED';
                    submitText.style.display = 'inline';
                    submitLoading.style.display = 'none';
                    submitBtn.disabled = false;
                    setTimeout(() => {
                        submitText.textContent = '🚀 SEND TRANSMISSION';
                    }, 3000);
                });
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    return { init };
})();
