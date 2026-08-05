// ================================
// Active Navigation Highlight
// ================================

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if(window.scrollY >= sectionTop){

            current = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if(link.getAttribute("href") === "#" + current){

            link.classList.add("active");

        }

    });

}); 
 
 
// ================================
// Appointment Form Validation
// ================================

const form = document.getElementById("appointmentForm");
const modal = document.getElementById("successModal");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if(name === ""){
        alert("Please enter your name.");
        return;
    }

    if(email === ""){
        alert("Please enter your email.");
        return;
    }

    if(phone.length !== 10){
        alert("Phone number should contain exactly 10 digits.");
        return;
    }

    

    modal.classList.add("show");

    

    form.reset();

});

// ==========================
// Close Modal Button
// ==========================

const closeModal = document.getElementById("closeModal");

closeModal.addEventListener("click", () => {

    modal.classList.remove("show");

});


// ==========================
// Close Modal by Clicking Outside
// ==========================

modal.addEventListener("click", (e) => {

    if(e.target === modal){

        modal.classList.remove("show");

    }

});






// ================================
// Scroll To Top Button
// ================================

const scrollTopBtn = document.querySelector(".scroll-top");

window.addEventListener("scroll", () => {

    if (window.scrollY > 300) {

        scrollTopBtn.classList.add("show");

    } else {

        scrollTopBtn.classList.remove("show");

    }

});

scrollTopBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,
        behavior: "smooth"

    });

});

// ================================
// Animated Counter
// ================================

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            const counter = entry.target;
            const target = +counter.dataset.target;

            let count = 0;

            const speed = target / 100;

            const updateCounter = () => {

                if(count < target){

                    count += speed;

                    counter.innerText = Math.ceil(count);

                    requestAnimationFrame(updateCounter);

                }else{

                    counter.innerText = target + "+";

                }

            };

            updateCounter();

            counterObserver.unobserve(counter);

        }

    });

});

counters.forEach(counter => {

    counterObserver.observe(counter);

});

// =====================================
// Scroll Reveal Animation
// =====================================

const hiddenElements = document.querySelectorAll("section");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.style.transitionDelay="0.2s";

            entry.target.classList.add("show");

        }

    });

});

hiddenElements.forEach((el)=>{

    el.classList.add("hidden");

    observer.observe(el);

});

// ==========================
// Mobile Navigation
// ==========================

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {

    navMenu.classList.toggle("active");

});


const navItems = document.querySelectorAll(".nav-links a");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navMenu.classList.remove("active");

    });

});