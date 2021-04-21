
const gloAcademyList = document.querySelector('.glo-academy-list');
const trendingList = document.querySelector('.trending-list');
const musicList = document.querySelector('.music-list');

// одна карточка с видео
const creatCard = (dataVideo) => {  
  const imgUrl = dataVideo.snippet.thumbnails.high.url;
  const videoId = dataVideo.id.videoId || dataVideo.id;
  const titleVideo = dataVideo.snippet.title;
  const dateVideo = dataVideo.snippet.publishedAt;
  const channelTitle = dataVideo.snippet.channelTitle;
  const card = document.createElement('div');
  const strViewCount = dataVideo.statistics ? `<span class="video-views">${dataVideo.statistics.viewCount} views</span>` : '';
  
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

createList(gloAcademyList, gloAcademy);
createList(trendingList, trending);
createList(musicList, music);