// src/scripts/carousel-init.js
import { Carousel } from "bootstrap";

document.addEventListener("DOMContentLoaded", () => {
  const reviewCarouselElement = document.querySelector("#reviewCarousel");
  if (reviewCarouselElement) {
    const carousel = new Carousel(reviewCarouselElement, {
      interval: 3000, // Change to desired interval
      ride: "carousel",
      touch: true, // Enable touch support
      wrap: true, // Allow carousel to cycle continuously
    });
  }
});
