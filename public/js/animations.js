// sets up all the animations used with GSAP
const tl = gsap.timeline();
const soundscapeInfo = document.querySelector("#soundscape-info");
const mainContainer = document.querySelector(".main-container");

// sets up the animations
function setupAnimations() {
  gsap.set(soundscapeInfo, { y: -100, opacity: 0 });
  gsap.set(mainContainer, { y: -100, opacity: 0 });
}

// plays the animation when a new soundscape is loaded
function playPageLoadAnimations() {
  tl.clear();

  tl.to(soundscapeInfo, {
    y: 0,
    opacity: 1,
    duration: 3,
    ease: "power1.out",
    delay: 3,
  });
  
  tl.to(mainContainer, {
    y: 0,
    opacity: 1,
    duration: 3,
    ease: "power1.out",
    delay: 2,
  });

  tl.play();
  
  return tl;
}

// gets rid of animations so they don't play all the way through if necessary
function pauseAnimations() {
  const soundscapeInfo = document.querySelector("#soundscape-info");
  const mainContainer = document.querySelector(".main-container");
  
  gsap.killTweensOf(soundscapeInfo);
  gsap.killTweensOf(mainContainer);
  
  tl.clear();
  
  gsap.set(soundscapeInfo, { y: -100, opacity: 0 });
  gsap.set(mainContainer, { y: -100, opacity: 0 });
}

// handles the animations for the carousel
function carouselNavigationAnimation(card, direction, currentIndex, startIndex) {
  gsap.fromTo(card,
          { opacity: 0, y: 20 * direction },
          { opacity: 1, y: 0, duration: 1, delay: 0.2 * (currentIndex - startIndex) }
        );
}

export { setupAnimations, playPageLoadAnimations, carouselNavigationAnimation, pauseAnimations };
