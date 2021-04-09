const swiper = new Swiper('.channel-slider', {
  // Optional parameters
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 5,
  breakpoints: {
    1900: {
      spaceBetween: 30
    },
    1400: {
      spaceBetween: 20
    },
    1200: {
      spaceBetween: 15
    },
    992: {
      spaceBetween: 10
    },
    760: {
      spaceBetween: 7
    }
  },


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
  spaceBetween: 10,
  breakpoints: {
  1600: {
    spaceBetween: 30
  },
  1100: {
    spaceBetween: 20
  },
  
},


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
  spaceBetween: 20,
  breakpoints: {
    1900: {
      spaceBetween: 30
    },
    1400: {
      spaceBetween: 20
    },
    1200: {
      spaceBetween: 15
    },
    992: {
      spaceBetween: 10
    },
    760: {
      spaceBetween: 7
    }
  },


  // Navigation arrows
  navigation: {
    nextEl: '.recommended-channel-button-next',
    prevEl: '.recommended-channel-button-prev',
  },
});

const mobileSearch = document.querySelector('.mobile-search');
const  inputGroup = document.querySelector('.input-group');

mobileSearch.addEventListener('click', () => {
  inputGroup.classList.add('is-open');
});

if (document.documentElement.scrollWidth <= 640) {
  swiper.destroy();
  swiperR.destroy();
  swiperRC.destroy();
}