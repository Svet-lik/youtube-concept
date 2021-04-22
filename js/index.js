const gloAcademyList = document.querySelector('.glo-academy-list');
const trendingList = document.querySelector('.trending-list');
const musicList = document.querySelector('.music-list');
const authBtn = document.querySelector('.auth-btn');
const userAvatar = document.querySelector('.user-avatar');

// одна карточка с видео
const creatCard = (dataVideo) => {
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

// временный запрос, скоро удалим
const getChannel = () => {
  return gapi.client.youtube.channels.list({
    part: 'snippet, statistics',
    id: 'UCf2LGgt4l6NoroDrHx8uD_Q',
  }).execute(responce => {
    console.log(responce);
  })
};

// youtubeAPI

const handleSuccessAuth = data => {
  authBtn.classList.add('hide');
  userAvatar.classList.remove('hide');
  userAvatar.src = data.getImageUrl();
  userAvatar.alt = data.getName();

  getChannel();
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
  }).catch(() => {
    authBtn.removeEventListener('click', handleAuth);
    userAvatar.removeEventListener('click', handleSignOut);

    alert('Авторизация не возможна')
  });
};

gapi.load('client:auth2', initClient);



createList(gloAcademyList, gloAcademy);
createList(trendingList, trending);
createList(musicList, music);