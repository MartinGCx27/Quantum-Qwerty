// Scrip slider img centro pop -LGS

let currentCentered = null;

function updateCenteredLogo() {
    const slider = document.querySelector('.logo-slider');
    const items = document.querySelectorAll('.logo-item');
    if (!slider || items.length === 0) return;
    
    const sliderRect = slider.getBoundingClientRect();
    const centerX = sliderRect.left + sliderRect.width / 2;
    
    let closestItem = null;
    let closestDistance = Infinity;
    
    items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distanceToCenter = Math.abs(centerX - itemCenter);
        
        if (distanceToCenter < closestDistance) {
            closestDistance = distanceToCenter;
            closestItem = item;
        }
    });
    
    if (closestItem && closestItem !== currentCentered) {
        if (currentCentered) currentCentered.classList.remove('centered');
        closestItem.classList.add('centered');
        currentCentered = closestItem;
    }
}

function animateSliderCenter() {
    updateCenteredLogo();
    requestAnimationFrame(animateSliderCenter);
}

document.addEventListener('DOMContentLoaded', () => {
    animateSliderCenter();
});
