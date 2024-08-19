// Custom JavaScript file for additional functionality

// Example function to handle a custom event
function handleCustomEvent() {
    console.log('Custom event triggered');
}

// Add event listener for a button click
document.addEventListener('DOMContentLoaded', () => {
    const customButton = document.getElementById('customButton');
    if (customButton) {
        customButton.addEventListener('click', handleCustomEvent);
    }
});
 