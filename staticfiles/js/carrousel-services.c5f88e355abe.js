function nextQuestion(tabId) {
  const carousel = document.getElementById('questions-carousel-' + tabId);
  const items = carousel.querySelectorAll('.carousel-item');
  let activeIndex = Array.from(items).findIndex(it => it.classList.contains('active'));
  items[activeIndex].classList.remove('active');
  let nextIndex = (activeIndex + 1) % items.length;
  items[nextIndex].classList.add('active');
}
function prevQuestion(tabId) {
  const carousel = document.getElementById('questions-carousel-' + tabId);
  const items = carousel.querySelectorAll('.carousel-item');
  let activeIndex = Array.from(items).findIndex(it => it.classList.contains('active'));
  items[activeIndex].classList.remove('active');
  let prevIndex = (activeIndex - 1 + items.length) % items.length;
  items[prevIndex].classList.add('active');
}

function toggleCarouselOnMobile() {
  const isMobile = window.innerWidth <= 600;
  document.querySelectorAll('.services-temp').forEach(function(tabPane) {
    const carousel = tabPane.querySelector('.questions-carousel-wrapper');
    const questions = tabPane.querySelector('.tab-content-questions');
    if (carousel && questions) {
      if (isMobile) {
        carousel.style.display = 'block';
        questions.style.display = 'none';
      } else {
        carousel.style.display = 'none';
        questions.style.display = 'block';
      }
    }
  });
}
window.addEventListener('resize', toggleCarouselOnMobile);
window.addEventListener('DOMContentLoaded', toggleCarouselOnMobile);


document.querySelectorAll('.nav-tabs .nav-link').forEach(function(tab) {
  tab.addEventListener('shown.bs.tab', function(e) {

    var tabId = e.target.getAttribute('href').replace('#', '');
    var carousel = document.getElementById('questions-carousel-' + tabId);
    if (carousel) {
      var items = carousel.querySelectorAll('.carousel-item');
      items.forEach(function(it, idx) {
        it.classList.toggle('active', idx === 0);
      });
    }
    toggleCarouselOnMobile();
  });
});