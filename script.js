let timer; // Holds the timeout timer
let timeLeft = 60; // 1 minute timeout duration
const timeoutScreen = document.getElementById('timeout-screen');
const timeoutTimerText = document.getElementById('timeout-timer');
let isInTimeoutSession = false; // Track if in timeout session
const contextMenu = document.getElementById('context-menu'); // Get context menu

// Function to update the timer
function updateTimer() {
    localStorage.setItem('remainingTime', timeLeft); // Store remaining time in local storage
    if (timeLeft <= 0) {
        clearInterval(timer); // Stop the timer
        timeoutScreen.style.display = 'none'; // Hide the timeout screen
        document.querySelector('.box-container').style.display = 'flex'; // Show app container
        localStorage.removeItem('remainingTime'); // Clear timer on completion
        isInTimeoutSession = false; // Reset session status
        return;
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeoutTimerText.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Format timer display
    timeLeft--; // Decrease time left by one second
}

// Function to start the timeout
function startTimeout() {
    if (isInTimeoutSession) return; // Prevent starting multiple sessions

    isInTimeoutSession = true; // Set session status
    timeLeft = 60; // Reset to 1 minute
    timeoutScreen.style.display = 'flex'; // Show the timeout screen
    document.querySelector('.box-container').style.display = 'none'; // Hide the app container
    timer = setInterval(updateTimer, 1000); // Start updating the timer every second
}

// Function to stop the timer
function stopTimer() {
    clearInterval(timer); // Clear the interval
}

// Check localStorage for remaining time and manage timeout screen
function checkForTimeout() {
    const remainingTime = localStorage.getItem('remainingTime');
    if (remainingTime) {
        timeLeft = parseInt(remainingTime, 10); // Parse remaining time from local storage
        if (timeLeft > 0) {
            timeoutScreen.style.display = 'flex'; // Show the timeout screen
            document.querySelector('.box-container').style.display = 'none'; // Hide app container
            timer = setInterval(updateTimer, 1000); // Start timer with remaining time
            timeoutTimerText.innerText = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
        }
    }
}

// Pause/Resume the timer based on tab visibility
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && isInTimeoutSession) {
        stopTimer(); // Stop the timer if the tab is hidden
    } else if (document.visibilityState === 'visible' && isInTimeoutSession) {
        // Resume the timer if there's remaining time
        timeLeft = parseInt(localStorage.getItem('remainingTime'), 10) || 60; // Get remaining time or default to 60
        timer = setInterval(updateTimer, 1000); // Resume updating the timer every second
    }
});

// Event listener for keypress to trigger timeout session
document.addEventListener('keydown', function (event) {
    // Check if ctrl + shift + I or F12 is pressed
    if ((event.ctrlKey && event.shiftKey && event.key === 'I') || event.key === 'F12') {
        event.preventDefault(); // Prevent default action
        startTimeout(); // Start timeout session
    }
});

// Refresh handling to prevent loss of progress during timeout session
window.addEventListener('beforeunload', function (event) {
    if (isInTimeoutSession) {
        event.preventDefault(); // Prevent the refresh if in timeout session
        event.returnValue = ''; // Show confirmation dialog for refresh
    }
});

// Check for timeout on page load
window.onload = function () {
    checkForTimeout(); // Initialize timeout check
};

// Function to show the context menu
function showContextMenu(event) {
    event.preventDefault(); // Prevent default context menu
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.classList.add('show');
    contextMenu.style.display = 'block'; // Show the context menu
}

// Function to hide the context menu
function hideContextMenu() {
    contextMenu.classList.remove('show');
    contextMenu.style.display = 'none'; // Hide the context menu
}

// Event listener for the Close button
document.getElementById('close-menu').addEventListener('click', hideContextMenu);

// Event listener for context menu opening
document.addEventListener('contextmenu', showContextMenu);
document.addEventListener('click', hideContextMenu); // Hide menu on clicking elsewhere

// Example of how to handle showing the registration screen
document.getElementById('show-register').onclick = function () {
    document.querySelector('.login-screen').style.display = 'none';
    document.querySelector('.create-account-screen').style.display = 'block';
};

// Back buttons implementation for navigation
document.getElementById('back-to-login').onclick = function () {
    document.querySelector('.create-account-screen').style.display = 'none';
    document.querySelector('.login-screen').style.display = 'block';
};

// Age verification for account creation
document.getElementById('apply-create').onclick = function () {
    const dobInput = document.getElementById('date-of-birth').value;
    const dob = new Date(dobInput);
    if (isNaN(dob)) {
        alert('Please enter a valid date in MM/DD/YYYY format.');
        return;
    }

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
    }

    if (age < 13) {
        document.getElementById('age-error').style.display = 'block';
    } else {
        document.getElementById('age-error').style.display = 'none';
        document.querySelector('.create-account-screen').style.display = 'none';
        document.querySelector('.username-screen').style.display = 'block';
    }
};

// Username validation and navigation
document.getElementById('continue').onclick = function () {
    const username = document.getElementById('username').value;
    const bannedWords = ['Nigger', 'badword2']; // Example banned words
    const isValidUsername = username.length <= 20 && !bannedWords.some(word => username.includes(word));

    if (!isValidUsername) {
        alert("Invalid username. Ensure it's less than 20 characters and not banned.");
        return;
    }

    document.querySelector('.username-screen').style.display = 'none';
    document.querySelector('.terms-screen').style.display = 'block'; // Show terms screen
};

// Finish button logic on the terms screen
document.getElementById('finish').onclick = function () {
    const isChecked = document.getElementById('terms-checkbox').checked;
    if (!isChecked) {
        alert("You must agree to the Terms and Conditions.");
        return;
    }

    alert("Account created successfully!"); // Add account creation logic here
};

// Additional navigation logic for screens
document.getElementById('back-to-create-account').onclick = function () {
    document.querySelector('.username-screen').style.display = 'none';
    document.querySelector('.create-account-screen').style.display = 'block'; // Show create account screen
};

// Event listener for scrolling on terms text
const termsText = document.getElementById('terms-text');
const termsCheckbox = document.getElementById('terms-checkbox');

termsText.addEventListener('scroll', () => {
    const isAtBottom = termsText.scrollHeight - termsText.scrollTop === termsText.clientHeight;
    termsCheckbox.disabled = !isAtBottom; // Enable checkbox if at bottom
});



// Modal functionality for help or questions
const modal = document.getElementById('info-modal');
const closeBtn = document.getElementById('modal-close');
const loginContainer = document.querySelector('.login-container');

// Show modal on question mark click
document.querySelector('.question-mark-circle').onclick = function (event) {
    event.stopPropagation(); // Prevent event from bubbling
    modal.style.display = "flex"; // Display the modal
};

// Close modal when close button is clicked
closeBtn.onclick = function () {
    modal.style.display = "none"; // Hide modal
};

// Close modal when clicking outside of the modal content
window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none"; // Hide modal
    }
};

// Manage hover state for modal to prevent unintentional closing
let isHoveringLoginContainer = false;
let isHoveringModal = false;

loginContainer.addEventListener('mouseenter', () => {
    isHoveringLoginContainer = true;
});

loginContainer.addEventListener('mouseleave', () => {
    isHoveringLoginContainer = false;
    closeModalIfNecessary(); // Check if modal should close
});

modal.addEventListener('mouseenter', () => {
    isHoveringModal = true;
});

modal.addEventListener('mouseleave', () => {
    isHoveringModal = false;
    closeModalIfNecessary(); // Check if modal should close
});

function closeModalIfNecessary() {
    if (!isHoveringLoginContainer && !isHoveringModal) {
        modal.style.display = "none"; // Hide modal
    }
}

// This section can have your weather and time functionality added as needed...