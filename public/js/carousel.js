// controls the carousel used to display the different birds
import { carouselNavigationAnimation } from "./animations.js"

const cardsPerPage = 3;
let currentPage = 0;
let allBirdCards = [];

let carouselContainer = document.querySelector(".carousel-container");
let paginationContainer = document.querySelector(".carousel-pagination");;
let prevButton = document.querySelector(".prev");
let nextButton = document.querySelector(".next");
let imageDisplay = document.querySelector("#image-box");

// Initialize the carousel when the page loads
function initCarousel() {
  prevButton.onclick = () => navigateCarousel(-1);
  nextButton.onclick = () => navigateCarousel(1);

  toggleNavigation(false);
}

// Navigate carousel in a direction
function navigateCarousel(direction) {
  const totalPages = Math.ceil(allBirdCards.length / cardsPerPage);

  currentPage = currentPage + direction;

  if (currentPage < 0) currentPage = 0;
  if (currentPage >= totalPages) currentPage = totalPages - 1;

  updateCarouselDisplay();
  
  allBirdCards.forEach((card, index) => {
    const startIndex = currentPage * cardsPerPage;
      const endIndex = startIndex + cardsPerPage - 1;

    if (index >= startIndex && index <= endIndex) {
      // Adds animations when navigating. Currently negatively impacts the "More info" feature
      // carouselNavigationAnimation(card, direction, index, startIndex)
    }
      
  });
}

// Update the carousel when navigating to a new page
function updateCarouselDisplay() {
  const totalPages = Math.ceil(allBirdCards.length / cardsPerPage);
  
  const dots = paginationContainer.querySelectorAll(".pagination-dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentPage);
  });

  // Show/hide cards based on current page
  allBirdCards.forEach((card, index) => {
    const startIndex = currentPage * cardsPerPage;
    const endIndex = startIndex + cardsPerPage - 1;

    if (index >= startIndex && index <= endIndex) {
      card.style.display = "flex";      
    } else {
      card.style.display = "none";
    }
  });
  
  prevButton.style.visibility = currentPage === 0 ? "hidden" : "visible";
  nextButton.style.visibility = currentPage === totalPages - 1 ? "hidden" : "visible";
  
  paginationContainer.style.display = totalPages > 1 ? "flex" : "none";
}

// Update the pagination dots when the carousel is navigated
function updatePagination() {
  paginationContainer.innerHTML = "";
  const totalPages = Math.ceil(allBirdCards.length / cardsPerPage);

  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement("div");
    dot.classList.add("pagination-dot");
    if (i === currentPage) dot.classList.add("active");

    dot.addEventListener("click", () => {
      currentPage = i;
      updateCarouselDisplay();
    });

    paginationContainer.appendChild(dot);
  }
}

// Turns navigation on or off depending on number of pages
function toggleNavigation(show) {
  if (!show) {
    prevButton.style.visibility = "hidden";
    nextButton.style.visibility = "hidden";
    paginationContainer.style.display = "none";
    return;
  }
  updateCarouselDisplay();
}

// Adds a bird to the carousel
function addCardToCarousel(card) {
  allBirdCards.push(card);

  updatePagination();
  updateCarouselDisplay();

  toggleNavigation(allBirdCards.length > cardsPerPage);
}

// Resets the carousel for new soundscape
function resetCarousel() {
  allBirdCards = [];
  currentPage = 0;
  updatePagination();
  toggleNavigation(false);
}

export default addCardToCarousel;
export { initCarousel, resetCarousel };