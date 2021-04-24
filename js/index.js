const content = document.querySelector('.content');
const authBtn = document.querySelector('.auth-btn');
const userAvatar = document.querySelector('.user-avatar');
const navMenuMore = document.querySelector('.nav-menu-more');
const showMore = document.querySelector('.show-more');
const formSearch = document.querySelector('.form-search');
const navMenuSubscriptions = document.querySelector('.nav-menu-subscriptions');
const navLinkLiked = document.querySelectorAll('.nav-link-liked');
const navLinkMusic = document.querySelectorAll('.nav-link-music');
const navLinkGames = document.querySelectorAll('.nav-link-games');
const navLinkTrending = document.querySelectorAll('.nav-link-trending');
const navLinkHome = document.querySelectorAll('.nav-link-home');


// одна карточка с видео
const creatCard = dataVideo => {
  const videoId = dataVideo.id.videoId || dataVideo.id;
  const strViewCount = dataVideo.statistics ? `<span class="video-views">${getViewer(dataVideo.statistics.viewCount)} views</span>` : '';
  const card = document.createElement('li');
  const {channelTitle, publishedAt: dateVideo, title: titleVideo, thumbnails: {high: {url: imgUrl}}} = dataVideo.snippet;

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
      <span class="video-date">${getDate(dateVideo)}</span>
      </span>
      <span class="video-channel">${channelTitle}</span>
    </div>`;
  return card;
}

//  создаёт и выводит список карточек
const createList = (listVideo, title, clear) => {
{/* <div class="channel-header">
            <a href="#" class="channel-title">
              <img src="img/glo.png" alt="Glo Academy" class="channel-avatar" />
              <span class="channel-text">Glo Academy</span>
            </a>
          </div> */}
  const channel = document.createElement('section');
  channel.classList.add('channel');
  if (clear) {
    content.textContent = '';
  }

  if (title) {
    const header = document.createElement('h2');
    header.textContent = title;
    channel.insertAdjacentElement('afterbegin', header);
  }

  const wrapper = document.createElement('ul');
  wrapper.classList.add('video-list');
  channel.insertAdjacentElement('beforeend', wrapper);
  listVideo.forEach(item => wrapper.append(creatCard(item)));

  content.insertAdjacentElement('beforeend', channel);
};
// получает элемент меню в подписке
const createMenuSubscriptionsItem = elem => {
  const menuItem = document.createElement('li');
  const {resourceId: {channelId}, title, thumbnails: {default: {url}}} = elem.snippet;
  menuItem.classList.add('nav-item');
  menuItem.innerHTML = `
    <a href="#" class="nav-link" data-channel-id="${channelId}" data-title ="${title}">
      <img
        src="${url}"
        alt="Photo: ${title}"
        class="nav-image"
      />
      <span class="nav-text">${title}</span>
    </a>`;
  return menuItem;
};
// вывод меню подписки
const createMenuSubscriptions = data => {
  navMenuSubscriptions.textContent = '';
  data.forEach(item => navMenuSubscriptions.append(createMenuSubscriptionsItem(item)))
};

const getDate = date => {
  const currentDay = Date.parse(new Date());
  const days = Math.round((currentDay - Date.parse(new Date(date))) / 86400000);
  if (days > 30) {
    if (days > 60) {
      return Math.round(days/30) + ' month ago';
    }
    return 'One month ago';
  }
  if (days > 1) {
    return Math.round(days) + ' days ago';
  }
  return 'One day ago';
}

const getViewer = count => {
  if (count >= 1000000) {
    return Math.round(count / 1000000) + 'M views';
  }
  if (count >= 1000) {
    return Math.round(count / 1000) + 'K views';
  }
    return count + ' views';

}

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

const requestCategory = (callback, maxResults = 6, category) => {
  gapi.client.youtube.videos.list({
    part: 'snippet, statistics',
    chart: 'mostPopular',
    regionCode: 'RU',
    videoCategoryId: category,
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

const requestLike = (callback, maxResults = 6) => {
  gapi.client.youtube.videos.list({
    part: 'snippet, statistics',
    maxResults,
    myRating: 'like',
  }).execute(responce => {
    callback(responce.items)
  })
}

const loadScreen = () => {
  requestVideos('UCVswRUcKC-M35RzgPRv8qUg', data => {
    content.textContent = '';
    createList(data, 'GLO Academy');
    
    requestTrending(data => {
      createList(data, 'Популярные видео');
      
      requestCategory(data => {
        createList(data, 'Популярная музыка');
      }, 6, 10);
    });
  });
};



showMore.addEventListener('click', evt => {
  evt.preventDefault();
  navMenuMore.classList.toggle('nav-menu-more-show')
});

formSearch.addEventListener('submit', evt => {
  evt.preventDefault();
  requestSearch(formSearch.elements.search.value, data => {
    createList(data, 'Результат поиска', true);
  }, 20);
});

navMenuSubscriptions.addEventListener('click', evt => {
  evt.preventDefault();
  const target = evt.target;
  const linkChannel = target.closest('.nav-link');
  const channelId = linkChannel.dataset.channelId;
  const title = linkChannel.dataset.title;
  requestVideos(channelId, data => {
    createList(data, title, true);
  }, 12);
});

navLinkLiked.forEach(item => {
  item.addEventListener('click', evt => {
    evt.preventDefault();
    requestLike(data => {
      createList(data, 'Понравившиеся видео', true);
    }, 12);
  });
});

navLinkMusic.forEach(item => {
  item.addEventListener('click', evt => {
    evt.preventDefault();
    requestCategory(data => {
      createList(data, 'Музыка', true);
    }, 12, 10);
  });
});

navLinkGames.forEach(item => {
  item.addEventListener('click', evt => {
    evt.preventDefault();
    requestCategory(data => {
      createList(data, 'Игры', true);
    }, 12, 20);
  });
});

navLinkHome.forEach(item => {
  item.addEventListener('click', evt => {
    evt.preventDefault();
    loadScreen();
  });
});

navLinkTrending.forEach(item => {
  item.addEventListener('click', evt => {
    evt.preventDefault();
    requestTrending(data => {
      createList(data, 'Популярные видео', true, 20);
    }, 12);
  });
});