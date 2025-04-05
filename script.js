document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const statusEl = document.getElementById('status');
    const toggleBtn = document.getElementById('toggle');
    const resetBtn = document.getElementById('reset');
    const focusTimeInput = document.getElementById('focusTime');
    const breakTimeInput = document.getElementById('breakTime');
    const modeToggle = document.getElementById('modeToggle');
    const modal = document.getElementById('initModal');
    const lockInBtn = document.getElementById('lockInBtn');
    const commitmentChecks = document.querySelectorAll('.commitment-check');
    const statusIndicators = document.querySelector('.status-indicators');

    // Status elements
    const lockStatus = document.getElementById('lockStatus');
    const vibeStatus = document.getElementById('vibeStatus');
    const focusStatus = document.getElementById('focusStatus');
    const statusDots = document.querySelectorAll('.status-dot');
    const statusTexts = document.querySelectorAll('.status-text');

    // Timer variables
    let interval;
    let timeLeft;
    let isRunning = false;
    let isFocusTime = true;

    // Sound notification
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');

    // Update status indicators
    function updateStatusIndicators(active) {
        if (!modeToggle.checked) { // Only for work mode
            statusIndicators.classList.add('visible');
            const dots = document.querySelectorAll('.status-dot');
            const texts = document.querySelectorAll('.status-text');

            dots.forEach(dot => {
                dot.classList.remove('active', 'failed');
                if (active) {
                    dot.classList.add('active');
                } else if (isRunning === false && timeLeft > 0) {
                    dot.classList.add('failed');
                }
            });

            texts.forEach((text, index) => {
                text.classList.remove('active', 'failed');
                if (active) {
                    text.classList.add('active');
                    text.textContent = ['Locked In', 'Vibe Check', 'Laser Focused'][index];
                } else if (isRunning === false && timeLeft > 0) {
                    text.classList.add('failed');
                    text.textContent = ['Lock In Failed', 'Vibes Off', 'Focus Breached'][index];
                }
            });
        } else {
            statusIndicators.classList.remove('visible');
        }
    }

    // Initialize timer display
    function initTimer() {
        if (modeToggle.checked) {
            // Rest mode
            timeLeft = parseInt(breakTimeInput.value) * 60;
            statusEl.textContent = 'Rest Time';
            statusIndicators.classList.remove('visible');
        } else {
            // Work mode
            timeLeft = parseInt(focusTimeInput.value) * 60;
            statusEl.textContent = 'Work Time';
            if (isRunning) {
                statusIndicators.classList.add('visible');
            } else {
                statusIndicators.classList.remove('visible');
            }
        }
        updateTimerDisplay();
    }

    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        minutesEl.textContent = minutes.toString().padStart(2, '0');
        secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    // Show modal
    function showModal() {
        modal.classList.add('show');
        // Reset checkboxes
        commitmentChecks.forEach(check => check.checked = false);
        lockInBtn.disabled = true;
    }

    // Hide modal
    function hideModal() {
        modal.classList.remove('show');
    }

    // Check if all commitments are checked
    function updateLockInButton() {
        const allChecked = Array.from(commitmentChecks).every(check => check.checked);
        lockInBtn.disabled = !allChecked;
    }

    // Start timer after commitment
    function startAfterCommitment() {
        hideModal();
        isRunning = true;
        toggleBtn.textContent = 'Pause';
        toggleBtn.classList.add('active');
        if (!modeToggle.checked) { // Only show status for work mode
            statusIndicators.classList.add('visible');
            updateStatusIndicators(true);
        }

        interval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                audio.play();
                clearInterval(interval);
                isRunning = false;
                toggleBtn.textContent = 'Start';
                toggleBtn.classList.remove('active');
                statusIndicators.classList.remove('visible');
                updateStatusIndicators(false);
            }
        }, 1000);
    }

    // Toggle timer
    function toggleTimer() {
        if (isRunning) {
            // Pause timer
            clearInterval(interval);
            isRunning = false;
            toggleBtn.textContent = 'Start';
            toggleBtn.classList.remove('active');
            if (!modeToggle.checked) { // Only update status for work mode
                updateStatusIndicators(false);
            }
        } else {
            // For work mode, show commitment modal first
            if (!modeToggle.checked) {
                showModal();
            } else {
                // For rest mode, start immediately
                startAfterCommitment();
            }
        }
    }

    // Reset timer
    function resetTimer() {
        clearInterval(interval);
        isRunning = false;
        toggleBtn.textContent = 'Start';
        toggleBtn.classList.remove('active');
        statusIndicators.classList.remove('visible');
        initTimer();
    }

    // Handle mode toggle
    function handleModeToggle() {
        if (isRunning) {
            clearInterval(interval);
            isRunning = false;
            toggleBtn.textContent = 'Start';
            toggleBtn.classList.remove('active');
        }
        statusIndicators.classList.remove('visible');
        initTimer();
    }

    // Event listeners
    toggleBtn.addEventListener('click', toggleTimer);
    resetBtn.addEventListener('click', resetTimer);
    focusTimeInput.addEventListener('change', resetTimer);
    breakTimeInput.addEventListener('change', resetTimer);
    modeToggle.addEventListener('change', handleModeToggle);

    // Commitment checklist listeners
    commitmentChecks.forEach(check => {
        check.addEventListener('change', updateLockInButton);
    });

    // Lock in button listener
    lockInBtn.addEventListener('click', startAfterCommitment);

    // Initialize timer on page load
    initTimer();
}); 