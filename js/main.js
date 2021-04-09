const swiper = new Swiper('.channel-slider', {
  // Optional parameters
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 30,


  // Navigation arrows
  navigation: {
    nextEl: '.channel-button-next',
    prevEl: '.channel-button-prev',
  },
});

const swiperR = new Swiper('.recommended-slider', {
  // Optional parameters
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 30,


  // Navigation arrows
  navigation: {
    nextEl: '.recommended-button-next',
    prevEl: '.recommended-button-prev',
  },
});

const swiperRC = new Swiper('.recommended-channel-slider', {
  // Optional parameters
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 30,


  // Navigation arrows
  navigation: {
    nextEl: '.recommended-channel-button-next',
    prevEl: '.recommended-channel-button-prev',
  },
});