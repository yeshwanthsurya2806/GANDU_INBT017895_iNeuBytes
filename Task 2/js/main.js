// ===============================
// COUNTER ANIMATION
// ===============================

const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

    const target = Number(counter.dataset.target);

    let current = 0;

    const increment = Math.max(1, Math.ceil(target / 100));

    function updateCounter() {

        current += increment;

        if (current < target) {

            counter.textContent = current;

            requestAnimationFrame(updateCounter);

        } else {

            counter.textContent = target;

        }

    }

    updateCounter();

});