const gloAcademyList = document.querySelector('.glo-academy-list');
const trendingList = document.querySelector('.trending-list');
const musicList = document.querySelector('.music-list');
const authBtn = document.querySelector('.auth-btn');
const userAvatar = document.querySelector('.user-avatar');
const navMenuMore = document.querySelector('.nav-menu-more');
const showMore = document.querySelector('.show-more');
const formSearch = document.querySelector('.form-search');
const navMenuSubscriptions = document.querySelector('.nav-menu-subscriptions')

// одна карточка с видео
const creatCard = dataVideo => {
  const imgUrl = dataVideo.snippet.thumbnails.high.url;
  const videoId = dataVideo.id.videoId || dataVideo.id;
  const titleVideo = dataVideo.snippet.title;
  const dateVideo = dataVideo.snippet.publishedAt;
  const channelTitle = dataVideo.snippet.channelTitle;
  const strViewCount = dataVideo.statistics ? `<span class="video-views">${dataVideo.statistics.viewCount} views</span>` : '';
  const card = document.createElement('div');

  card.classList.add('video-card');
  card.innerHTML = `
    <div class="video-thumb">
      <a
        class="link-video youtube-modal"
        href="https://youtu.be/${videoId}"
      >
        <img src="${imgUrl}" alt="" class="thumbnail" />
      </a>
    </div>
    <h3 class="video-title">${titleVideo}</h3>
    <div class="video-info">
      <span class="video-counter">
      ${strViewCount}	
      <span class="video-date">${new Date(dateVideo).toLocaleString()}</span>
      </span>
      <span class="video-channel">${channelTitle}</span>
    </div>`;
  return card;
}

//  создаёт и выводит список карточек
const createList = (wrapper, listVideo) => {
  wrapper.textContent = '';
  listVideo.forEach(item => wrapper.append(creatCard(item)));

};
// получает элемент меню в подписке
const createMenuSubscriptionsItem = elem => {
  const menuItem = document.createElement('li');
  menuItem.classList.add('nav-item');
  menuItem.innerHTML = `
  <a href="https://youtu.be/${elem.snippet.resourceId.channelId}" class="nav-link">
    <img
      src="${elem.snippet.thumbnails.default.url}"
      alt="Photo: ${elem.snippet.title}"
      class="nav-image"
    />
    <span class="nav-text">${elem.snippet.title}</span>
  </a>`;
  return menuItem;
};
// вывод меню подписки
const createMenuSubscriptions = data => {
  navMenuSubscriptions.textContent = '';
  data.forEach(item => navMenuSubscriptions.append(createMenuSubscriptionsItem(item)))
};

// youtubeAPI

const handleSuccessAuth = data => {
  authBtn.classList.add('hide');
  userAvatar.classList.remove('hide');
  userAvatar.src = data.getImageUrl();
  userAvatar.alt = data.getName();
  requestSubscriptions(data => {
    createMenuSubscriptions(data);
  });
};

const handleNoAuth = () => {
  authBtn.classList.remove('hide');
  userAvatar.classList.add('hide');
  userAvatar.src = '';
  userAvatar.alt = '';
};

// авторизация
const handleAuth = () => {
  gapi.auth2.getAuthInstance().signIn();
};
// выход
const handleSignout = () => {
  gapi.auth2.getAuthInstance().signOut();
};

// обновление статуса
const updateStatusAuth = data => {
  data.isSignedIn.listen(() => {
    updateStatusAuth(data);
  });

  if (data.isSignedIn.get()) {
    const userData = data.currentUser.get().getBasicProfile();
    handleSuccessAuth(userData)
  } else {
    handleNoAuth();
  }
};

// инициализация
function initClient() {
  gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': 'https://www.googleapis.com/auth/youtube.readonly',
    'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
  }).then(() => {
    updateStatusAuth(gapi.auth2.getAuthInstance());
    authBtn.addEventListener('click', handleAuth);
    userAvatar.addEventListener('click', handleSignout);
  }).then(loadScreen)
  .catch(err => {
    authBtn.removeEventListener('click', handleAuth);
    userAvatar.removeEventListener('click', handleSignout);
    console.warn('Авторизация не возможна, код ошибки ', err);
  });
};

gapi.load('client:auth2', initClient);

// временный запрос, скоро удалим
const getChannel = () => {
  return gapi.client.youtube.channels.list({
    part: 'snippet, statistics',
    id: 'UCf2LGgt4l6NoroDrHx8uD_Q',
  }).execute(responce => {
    console.log(responce);
  })
};


// запросы
const requestVideos = (channelId, callback, maxResults = 6) => {
  gapi.client.youtube.search.list({    
    part: 'snippet',
    channelId,
    maxResults,
    order: 'date',
  }).execute(responce => {
    callback(responce.items)
  })
};

const requestTrending = (callback, maxResults = 6) => {
  gapi.client.youtube.videos.list({
    part: 'snippet, statistics',
    chart: 'mostPopular',
    regionCode: 'RU',
    // videoCategoryId: 0,
    maxResults,
  }).execute(responce => {
    callback(responce.items)
  })
};

const requestMusic = (callback, maxResults = 6) => {
  gapi.client.youtube.videos.list({
    part: 'snippet, statistics',
    chart: 'mostPopular',
    regionCode: 'RU',
    videoCategoryId: 10,
    maxResults,
  }).execute(responce => {
    callback(responce.items)
  })
};

const requestSearch = (searchText, callback, maxResults = 6) => {
  gapi.client.youtube.search.list({    
    part: 'snippet',
    q: searchText,
    order: 'relevance',
    maxResults,
  }).execute(responce => {
    callback(responce.items)
  })
};
const requestSubscriptions = (callback, maxResults = 6) => {
  gapi.client.youtube.subscriptions.list({
    part: 'snippet',
    mine: true,
    maxResults,
    order: 'unread',
  }).execute(responce => {
    callback(responce.items)
})};

const loadScreen = () => {
  requestVideos('UCVswRUcKC-M35RzgPRv8qUg', data => {
    createList(gloAcademyList, data);
  });
  requestTrending(data => {
    createList(trendingList, data);
  });
  requestMusic(data => {
    createList(musicList, data);
  });
};



showMore.addEventListener('click', evt => {
  evt.preventDefault();
  navMenuMore.classList.toggle('nav-menu-more-show')
});

formSearch.addEventListener('submit', evt => {
  evt.preventDefault();
  requestSearch(formSearch.elements.search.value, data => {
    createList(gloAcademyList, data);
  }, 20);
})
