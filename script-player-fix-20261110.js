// ===================================================================
// 🌸 Ting's Personal Profile - Interactive Logic & Micro-interactions
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Starry Sky & Galaxy Engine
  const starCanvas = document.getElementById('starry-sky');
  let starCtx = starCanvas ? starCanvas.getContext('2d') : null;
  let animationFrameId = null;
  let stars = [];
  let meteors = [];
  let isStarfieldRunning = false;
  let lastMeteorTime = 0;

  function initStarfield() {
    if (!starCanvas) return;
    resizeStarCanvas();
    window.addEventListener('resize', resizeStarCanvas);

    // Create stars
    const starCount = Math.floor((starCanvas.width * starCanvas.height) / 7500);
    stars = [];
    const starColors = [
      '255, 255, 255',
      '224, 231, 255',
      '254, 240, 138',
      '233, 213, 255',
      '186, 230, 253'
    ];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        radius: Math.random() * 1.5 + 0.4,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        baseAlpha: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function resizeStarCanvas() {
    if (!starCanvas) return;
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }

  function spawnMeteor() {
    if (!starCanvas) return;
    const startX = Math.random() * starCanvas.width * 0.8 + starCanvas.width * 0.1;
    const startY = Math.random() * (starCanvas.height * 0.35);
    const length = Math.random() * 80 + 90;
    const speed = Math.random() * 6 + 10;
    const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.25;

    meteors.push({
      x: startX,
      y: startY,
      length: length,
      speed: speed,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      opacity: 1,
      decay: Math.random() * 0.015 + 0.015
    });
  }

  function drawStarfield(timestamp) {
    if (!isStarfieldRunning || !starCtx) return;

    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);

    // 1. Subtle Constellation Links
    starCtx.lineWidth = 0.5;
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 75) {
          const alpha = (1 - dist / 75) * 0.07;
          starCtx.strokeStyle = `rgba(165, 180, 252, ${alpha})`;
          starCtx.beginPath();
          starCtx.moveTo(stars[i].x, stars[i].y);
          starCtx.lineTo(stars[j].x, stars[j].y);
          starCtx.stroke();
        }
      }
    }

    // 2. Twinkling Stars
    for (const star of stars) {
      star.phase += star.twinkleSpeed;
      const alpha = Math.max(0.1, star.baseAlpha + Math.sin(star.phase) * 0.35);

      starCtx.beginPath();
      starCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      starCtx.fillStyle = `rgba(${star.color}, ${alpha})`;
      starCtx.shadowBlur = star.radius > 1 ? 4 : 0;
      starCtx.shadowColor = `rgba(${star.color}, 0.8)`;
      starCtx.fill();
    }
    starCtx.shadowBlur = 0;

    // 3. Meteors (Shooting Stars)
    if (!lastMeteorTime) lastMeteorTime = timestamp;
    if (timestamp - lastMeteorTime > 4500 + Math.random() * 3000) {
      spawnMeteor();
      lastMeteorTime = timestamp;
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.x += m.dx;
      m.y += m.dy;
      m.opacity -= m.decay;

      if (m.opacity <= 0 || m.x > starCanvas.width || m.y > starCanvas.height) {
        meteors.splice(i, 1);
        continue;
      }

      const tailX = m.x - (m.dx / m.speed) * m.length;
      const tailY = m.y - (m.dy / m.speed) * m.length;

      const grad = starCtx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.7, `rgba(165, 180, 252, ${m.opacity * 0.6})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${m.opacity})`);

      starCtx.beginPath();
      starCtx.moveTo(tailX, tailY);
      starCtx.lineTo(m.x, m.y);
      starCtx.strokeStyle = grad;
      starCtx.lineWidth = 1.8;
      starCtx.lineCap = 'round';
      starCtx.stroke();

      starCtx.beginPath();
      starCtx.arc(m.x, m.y, 2, 0, Math.PI * 2);
      starCtx.fillStyle = `rgba(255, 255, 255, ${m.opacity})`;
      starCtx.shadowBlur = 8;
      starCtx.shadowColor = '#818cf8';
      starCtx.fill();
      starCtx.shadowBlur = 0;
    }

    animationFrameId = requestAnimationFrame(drawStarfield);
  }

  function startStarfield() {
    if (!starCanvas || isStarfieldRunning) return;
    if (stars.length === 0) initStarfield();
    isStarfieldRunning = true;
    lastMeteorTime = performance.now();
    animationFrameId = requestAnimationFrame(drawStarfield);
  }

  function stopStarfield() {
    isStarfieldRunning = false;
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    if (starCtx && starCanvas) {
      starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    }
  }

  // Theme Toggle (柔和暖白 / 星空夜景)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');

  const savedTheme = localStorage.getItem('site-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  applyTheme(savedTheme, false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme, true);
    });
  }

  function applyTheme(theme, isUserClick = false) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '🌌';
      if (themeText) themeText.textContent = '星空夜景';
      if (themeToggleBtn) {
        themeToggleBtn.title = '點擊切換為柔和暖白主題';
        themeToggleBtn.setAttribute('aria-label', '目前為星空夜景主題，點擊切換為柔和暖白');
      }
      startStarfield();
      if (isUserClick) {
        showToast('🌌 已切換至星空夜景模式，璀璨星空與流星已點亮！');
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '☀️';
      if (themeText) themeText.textContent = '柔和暖白';
      if (themeToggleBtn) {
        themeToggleBtn.title = '點擊切換為星空夜景主題';
        themeToggleBtn.setAttribute('aria-label', '目前為柔和暖白主題，點擊切換為星空夜景');
      }
      stopStarfield();
      if (isUserClick) {
        showToast('☀️ 已切換至柔和暖白模式！');
      }
    }
    localStorage.setItem('site-theme', theme);
  }

  // 2. Cute Petting Interaction (Totoro Easter Egg)
  const petTrigger = document.getElementById('pet-trigger');
  const petEasterEggCard = document.getElementById('pet-easter-egg');
  const petQuotes = [
    '✨ 萌度炸裂！幸福感 +100',
    '💖 摸了摸毛茸茸的小龍貓～',
    '🐾 龍貓歪著頭看著你！',
    '🍡 給龍貓吃好吃的堅果',
    '🌸 今天也是元氣滿滿的一天！'
  ];

  function spawnHearts(e, targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const heart = document.createElement('div');
    heart.className = 'pet-heart-popup';
    const icons = ['💖', '✨', '🐾', '🌸', '💫'];
    heart.textContent = icons[Math.floor(Math.random() * icons.length)];

    heart.style.left = `${(e.clientX || (rect.left + rect.width / 2)) - 15}px`;
    heart.style.top = `${(e.clientY || (rect.top + rect.height / 2)) - 25}px`;
    heart.style.position = 'fixed';

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);

    showToast(petQuotes[Math.floor(Math.random() * petQuotes.length)]);
  }

  if (petTrigger) {
    petTrigger.addEventListener('click', (e) => spawnHearts(e, petTrigger));
  }
  if (petEasterEggCard) {
    petEasterEggCard.addEventListener('click', (e) => spawnHearts(e, petEasterEggCard));
  }

  // ===================================================================
  // 3. 隨身聽多曲目播放系統 (真實 MP3 音檔播放版本)
  // ===================================================================
  const MUSIC_PLAYLIST = [
    {
      id: 1,
      title: "LATATA",
      artist: "(G)I-DLE",
      audioUrl: "audio/ LATATA.mp3", // ⬅️ 請對應你在專案 audio 資料夾放的 mp3 檔名
      mvUrl: "https://youtu.be/9mQk7Evt6Vs?si=sLbDdc6xonwIT1Of"
    },
    {
      id: 2,
      title: "BiiiG",
      artist: "BIGBANG",
      audioUrl: "audio/BiiiG.mp3",
      mvUrl: "https://youtu.be/B5u8JiGVI_k?si=xcTahNNhrzrlJOXm"
    },
    {
      id: 3,
      title: "option love",
      artist: "BESTie",
      audioUrl: "audio/option love.mp3",
      mvUrl: "https://youtu.be/NPqtL1dtrlA?si=TDWzmFThCKzuRYbV"
    },
    {
      id: 4,
      title: "癡情的男子漢",
      artist: "玖壹壹",
      audioUrl: "audio/癡情的男子漢.mp3",
      mvUrl: "https://youtu.be/UdnSKw0wI8I?si=vfw-N1yGnPmFzYRA"
    },
    {
      id: 5,
      title: "做你的格",
      artist: "玖壹壹",
      audioUrl: "audio/做你的格.mp3",
      mvUrl: "https://youtu.be/sA9GwtXFKYg?si=KbewrI-GYbaUraO5"
    }
  ];

  let audioElement = new Audio();
  let isPlaying = false;
  let currentTrackIndex = 0;

  const playBtn = document.getElementById('play-music-btn');
  const playIcon = document.getElementById('play-icon');
  const playLabel = document.getElementById('play-label');
  const prevBtn = document.getElementById('prev-music-btn');
  const nextBtn = document.getElementById('next-music-btn');
  const playlistToggleBtn = document.getElementById('playlist-toggle-btn');
  const playlistContainer = document.getElementById('playlist-container');
  const playlistItemsList = document.getElementById('playlist-items-list');

  const musicTitleEl = document.getElementById('music-title');
  const musicArtistEl = document.getElementById('music-artist');
  const musicLyricsEl = document.getElementById('music-lyrics');
  const musicGenreTagEl = document.getElementById('music-genre-tag');
  const musicTrackIdxEl = document.getElementById('music-track-idx');
  const vinylCenterMonogram = document.getElementById('vinyl-center-monogram');
  const musicMvLinkEl = document.getElementById('music-mv-link');
  const vinylDisc = document.getElementById('vinyl-disc');
  const waveBars = document.getElementById('wave-bars');

  audioElement.addEventListener('ended', () => {
    const nextIdx = (currentTrackIndex + 1) % MUSIC_PLAYLIST.length;
    loadTrack(nextIdx, true);
  });

  audioElement.addEventListener('error', () => {
    const mediaError = audioElement.error;
    console.error('音檔載入錯誤', {
      code: mediaError ? mediaError.code : 'unknown',
      message: mediaError ? mediaError.message : '',
      source: audioElement.currentSrc,
      networkState: audioElement.networkState,
      readyState: audioElement.readyState
    });
  });

  function renderPlaylist() {
    if (!playlistItemsList) return;
    playlistItemsList.innerHTML = '';

    MUSIC_PLAYLIST.forEach((song, idx) => {
      const item = document.createElement('div');
      item.className = `playlist-track-item ${idx === currentTrackIndex ? 'active' : ''}`;
      item.setAttribute('data-index', idx);
      item.title = `點擊切換並播放「${song.title}」`;
      item.innerHTML = `
        <span class="track-item-num">${String(idx + 1).padStart(2, '0')}</span>
        <div class="track-item-meta">
          <span class="track-item-title">${song.title}</span>
          <span class="track-item-artist">${song.artist} · <small>${song.genre}</small></span>
        </div>
        <span class="track-item-badge">${idx === currentTrackIndex && isPlaying ? '🔊 播放中' : '▶'}</span>
      `;
      item.addEventListener('click', () => {
        loadTrack(idx, true);
      });
      playlistItemsList.appendChild(item);
    });
  }

  function loadTrack(index, autoPlay = false) {
    if (index < 0 || index >= MUSIC_PLAYLIST.length) return;
    currentTrackIndex = index;
    const song = MUSIC_PLAYLIST[currentTrackIndex];

    if (musicTitleEl) musicTitleEl.textContent = `${song.title} 🎵`;
    if (musicArtistEl) musicArtistEl.textContent = song.artist;
    if (musicLyricsEl) musicLyricsEl.textContent = song.lyrics;
    if (musicGenreTagEl) musicGenreTagEl.textContent = song.genre;
    if (musicTrackIdxEl) {
      musicTrackIdxEl.textContent = `${String(currentTrackIndex + 1).padStart(2, '0')} / ${String(MUSIC_PLAYLIST.length).padStart(2, '0')}`;
    }
    if (vinylCenterMonogram) {
      vinylCenterMonogram.textContent = String(currentTrackIndex + 1).padStart(2, '0');
    }
    if (musicMvLinkEl) {
      musicMvLinkEl.href = song.mvUrl;
      musicMvLinkEl.title = `在 YouTube 上聆聽 ${song.artist} - ${song.title} MV 原曲`;
    }

    // 使用完整網址載入音檔，讓含空格及中文的檔名能正確編碼
    audioElement.src = new URL(song.audioUrl, document.baseURI).href;
    audioElement.preload = 'auto';
    audioElement.load();

    renderPlaylist();

    if (isPlaying || autoPlay) {
      playAudioTrack();
    } else {
      if (playLabel) playLabel.textContent = `播放 ${song.title}`;
    }
  }

  function playAudioTrack() {
    const currentSong = MUSIC_PLAYLIST[currentTrackIndex];
    audioElement.play().then(() => {
      isPlaying = true;
      if (vinylDisc) vinylDisc.classList.add('playing');
      if (waveBars) waveBars.classList.add('active');
      if (playIcon) playIcon.textContent = '⏸️';
      if (playLabel) playLabel.textContent = `暫停 ${currentSong.title}`;
      showToast(`🎵 正在播放：${currentSong.title} - ${currentSong.artist}`);
      renderPlaylist();
    }).catch(err => {
      const mediaError = audioElement.error;
      console.error("音樂播放失敗", {
        name: err && err.name,
        message: err && err.message,
        mediaErrorCode: mediaError ? mediaError.code : null,
        mediaErrorMessage: mediaError ? mediaError.message : '',
        source: audioElement.currentSrc,
        networkState: audioElement.networkState,
        readyState: audioElement.readyState
      });
      const reason = err && err.name === 'NotAllowedError'
        ? '瀏覽器阻擋播放，請再按一次播放鍵'
        : mediaError && mediaError.code === 4
          ? '音檔格式或網址無法辨識'
          : mediaError && mediaError.code === 3
            ? '音檔解碼失敗'
            : '音檔載入失敗';
      showToast(`⚠️ ${reason}`);
      stopAudioTrack(true);
    });
  }

  function stopAudioTrack(resetLabel = true) {
    isPlaying = false;
    audioElement.pause();
    if (vinylDisc) vinylDisc.classList.remove('playing');
    if (waveBars) waveBars.classList.remove('active');
    if (playIcon) playIcon.textContent = '▶️';
    if (resetLabel && playLabel) {
      const currentSong = MUSIC_PLAYLIST[currentTrackIndex];
      playLabel.textContent = `播放 ${currentSong.title}`;
    }
    renderPlaylist();
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopAudioTrack();
      } else {
        playAudioTrack();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const prevIdx = (currentTrackIndex - 1 + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length;
      loadTrack(prevIdx, isPlaying);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const nextIdx = (currentTrackIndex + 1) % MUSIC_PLAYLIST.length;
      loadTrack(nextIdx, isPlaying);
    });
  }

  if (playlistToggleBtn && playlistContainer) {
    playlistToggleBtn.addEventListener('click', () => {
      playlistContainer.classList.toggle('collapsed');
      playlistToggleBtn.classList.toggle('active');
    });
  }

  renderPlaylist();
  loadTrack(0, false);

  // 4. Interactive Riding Scooter
  const scooter = document.getElementById('scooter-icon');
  const kmDisplay = document.getElementById('riding-km');
  const ridingProgressBar = document.getElementById('riding-progress-bar');
  let currentKm = 55;
  let progressPercent = 65;

  if (scooter && kmDisplay) {
    scooter.addEventListener('click', () => {
      currentKm += Math.floor(Math.random() * 4) + 2;
      kmDisplay.textContent = `${currentKm} km`;

      if (ridingProgressBar) {
        progressPercent = Math.min(progressPercent + 5, 96);
        ridingProgressBar.style.width = `${progressPercent}%`;
      }

      scooter.style.transform = 'translateY(-10px) rotate(15deg) scale(1.3)';
      setTimeout(() => {
        scooter.style.transform = '';
      }, 300);

      const toasts = [
        '🛵 沿著台1線吹著微風，從嘉義水上出發！',
        '🛣️ 途經新營與善化，道路風聲最是愜意！',
        '✨ 距離台南永康越來越近了，心情滿分！',
        '🎉 順利抵達台南永康，享受美好校園與充實日常！'
      ];
      const randomToast = toasts[Math.floor(Math.random() * toasts.length)];
      showToast(randomToast);
    });
  }

  // 5. Lightbox Modal
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  document.addEventListener('click', (e) => {
    const imgWrapper = e.target.closest('.zoomable-img');
    if (imgWrapper && lightbox && lightboxImg) {
      const img = imgWrapper.querySelector('img');
      if (img) {
        const caption = imgWrapper.getAttribute('data-caption') || img.alt || '精選映象預覽';
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 6. Like Button counters & Photo Mini Like Buttons
  document.addEventListener('click', (e) => {
    const photoLikeBtn = e.target.closest('.photo-like-mini-btn');
    if (photoLikeBtn) {
      const numEl = photoLikeBtn.querySelector('.like-num');
      if (numEl) {
        let count = parseInt(numEl.textContent.replace(/,/g, ''), 10) || 0;
        count++;
        numEl.textContent = count;
        photoLikeBtn.classList.add('liked', 'pulse');
        setTimeout(() => photoLikeBtn.classList.remove('pulse'), 400);
        spawnHearts(e, photoLikeBtn);
        showToast('💖 謝謝你喜歡這張照片！');
      }
      return;
    }

    const standardLikeBtn = e.target.closest('.like-button');
    if (standardLikeBtn) {
      const countEl = standardLikeBtn.querySelector('.like-count');
      if (countEl) {
        let count = parseInt(countEl.textContent.replace(/,/g, ''), 10) || 0;
        count++;
        countEl.textContent = count;
        standardLikeBtn.classList.add('liked', 'pulse');
        setTimeout(() => standardLikeBtn.classList.remove('pulse'), 400);
      }
    }
  });

  // 7. Toast Notification Utility
  let toastTimeout;
  function showToast(message) {
    let toast = document.getElementById('site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.style.position = 'fixed';
      toast.style.bottom = '2rem';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%) translateY(50px)';
      toast.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
      toast.style.color = '#fff';
      toast.style.padding = '0.75rem 1.5rem';
      toast.style.borderRadius = '9999px';
      toast.style.fontSize = '0.92rem';
      toast.style.fontWeight = '600';
      toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      toast.style.backdropFilter = 'blur(10px)';
      toast.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
      toast.style.zIndex = '9999';
      toast.style.opacity = '0';
      toast.style.pointerEvents = 'none';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2500);
  }

  // 7.5. Ting's Space Like Index & Popularity Meter
  const navLikeBtn = document.getElementById('space-like-nav-btn');
  const navLikeCountEl = document.getElementById('nav-like-count');
  const spaceLikeBtn = document.getElementById('space-like-btn');
  const mainLikeCountEl = document.getElementById('main-like-count');
  const popularityTierEl = document.getElementById('popularity-tier');
  const popularityProgressEl = document.getElementById('popularity-progress');

  let spaceLikes = parseInt(localStorage.getItem('tings_space_likes') || '1314', 10);

  function updateSpaceLikesUI() {
    const formatted = spaceLikes.toLocaleString();
    if (navLikeCountEl) navLikeCountEl.textContent = formatted;
    if (mainLikeCountEl) mainLikeCountEl.textContent = formatted;

    let tierText = '🌸 溫暖初見 · 快樂相伴';
    let progressPct = 80;

    if (spaceLikes >= 1400) {
      tierText = '👑 頂級人氣王 · 龍貓守護神';
      progressPct = 100;
    } else if (spaceLikes >= 1350) {
      tierText = '🔥 萬人迷偶像 · 能量爆棚';
      progressPct = Math.min(98, 90 + (spaceLikes - 1350) * 0.16);
    } else if (spaceLikes >= 1320) {
      tierText = '🌟 人氣爆棚 · 萌寵達人';
      progressPct = Math.min(90, 85 + (spaceLikes - 1320) * 0.16);
    } else {
      progressPct = Math.min(85, 80 + (spaceLikes - 1314) * 0.8);
    }

    if (popularityTierEl) popularityTierEl.textContent = tierText;
    if (popularityProgressEl) popularityProgressEl.style.width = `${progressPct}%`;
  }

  function handleSpaceLike(e, targetBtn) {
    spaceLikes++;
    localStorage.setItem('tings_space_likes', spaceLikes);
    updateSpaceLikesUI();

    if (targetBtn) {
      spawnHearts(e, targetBtn);
      targetBtn.classList.add('pulse');
      setTimeout(() => targetBtn.classList.remove('pulse'), 400);
    }

    const likeMessages = [
      '💖 謝謝你的應援！Ting\'s Space 按讚指數 +1',
      '✨ 獲得滿滿的治癒能量！感謝你的喜歡～',
      '🐾 小龍貓開心地蹭了蹭你！按讚指數持續上升！',
      '🌸 人氣指數飆升中！今天也是美好的一天～'
    ];
    showToast(likeMessages[Math.floor(Math.random() * likeMessages.length)]);
  }

  if (navLikeBtn) {
    navLikeBtn.addEventListener('click', (e) => handleSpaceLike(e, navLikeBtn));
  }
  if (spaceLikeBtn) {
    spaceLikeBtn.addEventListener('click', (e) => handleSpaceLike(e, spaceLikeBtn));
  }

  updateSpaceLikesUI();

  // 8. Totoro Acorn Catch Mini Game
  const gameCanvas = document.getElementById('game-canvas');
  if (gameCanvas) {
    const gCtx = gameCanvas.getContext('2d');
    const gameOverlay = document.getElementById('game-overlay');
    const overlayIcon = document.getElementById('overlay-icon');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayDesc = document.getElementById('overlay-desc');
    const gameStartBtn = document.getElementById('game-start-btn');
    const gameScoreEl = document.getElementById('game-score');
    const gameTimerEl = document.getElementById('game-timer');
    const gameHighscoreEl = document.getElementById('game-highscore');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');

    gameCanvas.width = 700;
    gameCanvas.height = 380;

    const totoroSprite = new Image();
    totoroSprite.src = 'tomcat.jpg';

    let isGameRunning = false;
    let score = 0;
    let timeLeft = 30;
    let gameTimerId = null;
    let spawnTimerId = null;
    let gameAnimFrameId = null;
    let highscore = parseInt(localStorage.getItem('totoro-highscore') || '0', 10);
    gameHighscoreEl.textContent = highscore;

    const player = {
      x: gameCanvas.width / 2,
      y: gameCanvas.height - 65,
      width: 58,
      height: 58,
      targetX: gameCanvas.width / 2,
      bounce: 0
    };

    let items = [];
    let floatTexts = [];
    let particles = [];
    let keyState = { left: false, right: false };

    const ITEM_TYPES = [
      { type: 'acorn', icon: '🌰', points: 10, prob: 0.65, size: 28 },
      { type: 'strawberry', icon: '🍓', points: 20, prob: 0.18, size: 28 },
      { type: 'star', icon: '⭐', points: 30, prob: 0.09, size: 30, bonusTime: 2 },
      { type: 'cloud', icon: '⚡', points: -10, prob: 0.08, size: 30 }
    ];

    function spawnItem() {
      if (!isGameRunning) return;
      const rand = Math.random();
      let cumulative = 0;
      let chosen = ITEM_TYPES[0];

      for (const it of ITEM_TYPES) {
        cumulative += it.prob;
        if (rand <= cumulative) {
          chosen = it;
          break;
        }
      }

      items.push({
        x: Math.random() * (gameCanvas.width - 60) + 30,
        y: -30,
        size: chosen.size,
        icon: chosen.icon,
        points: chosen.points,
        type: chosen.type,
        bonusTime: chosen.bonusTime || 0,
        speed: Math.random() * 2 + 2.6,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.06
      });
    }

    function addFloatText(x, y, text, color) {
      floatTexts.push({ x, y, text, color, alpha: 1, vy: -1.5 });
    }

    function addParticles(x, y, color) {
      for (let i = 0; i < 7; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1.5;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 3 + 2,
          color,
          alpha: 1
        });
      }
    }

    function startGame() {
      isGameRunning = true;
      score = 0;
      timeLeft = 30;
      items = [];
      floatTexts = [];
      particles = [];
      gameScoreEl.textContent = '0';
      gameTimerEl.textContent = '30s';
      gameOverlay.classList.add('hidden');
      player.x = gameCanvas.width / 2;
      player.targetX = gameCanvas.width / 2;

      clearInterval(gameTimerId);
      gameTimerId = setInterval(() => {
        timeLeft--;
        gameTimerEl.textContent = `${timeLeft}s`;
        if (timeLeft <= 0) endGame();
      }, 1000);

      clearInterval(spawnTimerId);
      spawnTimerId = setInterval(spawnItem, 620);

      cancelAnimationFrame(gameAnimFrameId);
      gameLoop();
    }

    function endGame() {
      isGameRunning = false;
      clearInterval(gameTimerId);
      clearInterval(spawnTimerId);

      let isNewRecord = false;
      if (score > highscore) {
        highscore = score;
        localStorage.setItem('totoro-highscore', highscore);
        gameHighscoreEl.textContent = highscore;
        isNewRecord = true;
      }

      let rankMsg = '';
      if (score >= 260) {
        rankMsg = '👑 傳奇龍貓飼育大師！你的反應速度無人能敵！';
      } else if (score >= 180) {
        rankMsg = '🏆 特級龍貓投餵員！龍貓吃得心滿意足～';
      } else if (score >= 100) {
        rankMsg = '✨ 暖心好搭檔！龍貓蹭了蹭你表示感謝！';
      } else {
        rankMsg = '🐾 龍貓拍了拍你：沒關係，再挑戰一次吧！';
      }

      overlayIcon.textContent = isNewRecord ? '🎉' : '⭐';
      overlayTitle.textContent = isNewRecord ? '創下新紀錄！' : '遊戲結束！';
      overlayDesc.innerHTML = `本次得分：<strong>${score} 分</strong><br>${rankMsg}`;
      gameStartBtn.innerHTML = '<span>🔄 再玩一次</span>';
      gameOverlay.classList.remove('hidden');
    }

    function updateGame() {
      if (keyState.left) player.targetX -= 8;
      if (keyState.right) player.targetX += 8;

      player.targetX = Math.max(player.width / 2, Math.min(gameCanvas.width - player.width / 2, player.targetX));
      player.x += (player.targetX - player.x) * 0.22;
      if (player.bounce > 0) player.bounce -= 0.1;

      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.y += it.speed;
        it.rotation += it.rotSpeed;

        const hitDistanceX = Math.abs(it.x - player.x);
        const hitDistanceY = Math.abs(it.y - player.y);

        if (hitDistanceX < (player.width / 2 + it.size / 2 - 4) && hitDistanceY < (player.height / 2 + 10)) {
          score = Math.max(0, score + it.points);
          gameScoreEl.textContent = score;
          player.bounce = 1.2;

          if (it.type === 'cloud') {
            addFloatText(it.x, it.y - 15, `${it.points}`, '#ef4444');
            addParticles(it.x, it.y, '#94a3b8');
          } else {
            if (it.type === 'star') {
              timeLeft += it.bonusTime;
              gameTimerEl.textContent = `${timeLeft}s`;
              addFloatText(it.x, it.y - 15, `+${it.points} (+2s!)`, '#eab308');
              addParticles(it.x, it.y, '#fbbf24');
            } else {
              addFloatText(it.x, it.y - 15, `+${it.points}`, '#10b981');
              addParticles(it.x, it.y, it.type === 'strawberry' ? '#f43f5e' : '#f59e0b');
            }
          }

          items.splice(i, 1);
          continue;
        }

        if (it.y > gameCanvas.height + 40) {
          items.splice(i, 1);
        }
      }

      for (let i = floatTexts.length - 1; i >= 0; i--) {
        const ft = floatTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.025;
        if (ft.alpha <= 0) floatTexts.splice(i, 1);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.035;
        if (p.alpha <= 0) particles.splice(i, 1);
      }
    }

    function renderGame() {
      gCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

      gCtx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      gCtx.fillRect(0, gameCanvas.height - 18, gameCanvas.width, 18);

      for (const it of items) {
        gCtx.save();
        gCtx.translate(it.x, it.y);
        gCtx.rotate(it.rotation);
        gCtx.font = `${it.size}px sans-serif`;
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'middle';
        gCtx.fillText(it.icon, 0, 0);
        gCtx.restore();
      }

      gCtx.save();
      const bounceOffset = Math.sin(player.bounce * Math.PI) * 8;
      const px = player.x - player.width / 2;
      const py = player.y - player.height / 2 - bounceOffset;

      gCtx.beginPath();
      gCtx.ellipse(player.x, gameCanvas.height - 12, player.width / 2, 7, 0, 0, Math.PI * 2);
      gCtx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      gCtx.fill();

      gCtx.beginPath();
      gCtx.arc(player.x, py + player.height / 2, player.width / 2, 0, Math.PI * 2);
      gCtx.clip();

      if (totoroSprite.complete && totoroSprite.naturalWidth !== 0) {
        gCtx.drawImage(totoroSprite, px, py, player.width, player.height);
      } else {
        gCtx.fillStyle = '#ffffff';
        gCtx.fill();
        gCtx.font = '32px sans-serif';
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'middle';
        gCtx.fillText('🐰', player.x, py + player.height / 2);
      }
      gCtx.restore();

      gCtx.beginPath();
      gCtx.arc(player.x, py + player.height / 2, player.width / 2, 0, Math.PI * 2);
      gCtx.strokeStyle = '#f43f5e';
      gCtx.lineWidth = 3;
      gCtx.stroke();

      for (const p of particles) {
        gCtx.beginPath();
        gCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        gCtx.fillStyle = p.color;
        gCtx.globalAlpha = p.alpha;
        gCtx.fill();
        gCtx.globalAlpha = 1;
      }

      gCtx.font = 'bold 18px Outfit, sans-serif';
      gCtx.textAlign = 'center';
      for (const ft of floatTexts) {
        gCtx.fillStyle = ft.color;
        gCtx.globalAlpha = ft.alpha;
        gCtx.fillText(ft.text, ft.x, ft.y);
        gCtx.globalAlpha = 1;
      }
    }

    function gameLoop() {
      if (!isGameRunning) return;
      updateGame();
      renderGame();
      gameAnimFrameId = requestAnimationFrame(gameLoop);
    }

    function handlePointerMove(clientX) {
      const rect = gameCanvas.getBoundingClientRect();
      const scaleX = gameCanvas.width / rect.width;
      const canvasX = (clientX - rect.left) * scaleX;
      player.targetX = canvasX;
    }

    gameCanvas.addEventListener('mousemove', (e) => {
      if (!isGameRunning) return;
      handlePointerMove(e.clientX);
    });

    gameCanvas.addEventListener('touchmove', (e) => {
      if (!isGameRunning) return;
      if (e.touches.length > 0) {
        e.preventDefault();
        handlePointerMove(e.touches[0].clientX);
      }
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keyState.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keyState.right = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keyState.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keyState.right = false;
    });

    let touchHoldTimer = null;
    function startTouchMove(dir) {
      if (!isGameRunning) return;
      clearInterval(touchHoldTimer);
      player.targetX += dir * 25;
      touchHoldTimer = setInterval(() => {
        player.targetX += dir * 18;
      }, 40);
    }

    function stopTouchMove() {
      clearInterval(touchHoldTimer);
    }

    if (btnLeft && btnRight) {
      btnLeft.addEventListener('mousedown', () => startTouchMove(-1));
      btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); startTouchMove(-1); });
      btnRight.addEventListener('mousedown', () => startTouchMove(1));
      btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); startTouchMove(1); });

      window.addEventListener('mouseup', stopTouchMove);
      window.addEventListener('touchend', stopTouchMove);
    }

    gameStartBtn.addEventListener('click', startGame);

    totoroSprite.onload = () => {
      if (!isGameRunning) renderGame();
    };
    renderGame();
  }

  // 12. Navigation Smooth Scroll & ScrollSpy
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionsToWatch = [
    { id: 'profile-hero' },
    { id: 'about-section' },
    { id: 'skills-section' },
    { id: 'portfolio-section' },
    { id: 'awards-section' },
    { id: 'widgets-section' },
    { id: 'timeline-section' },
    { id: 'contact-section' }
  ];

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 220;

    sectionsToWatch.forEach(item => {
      const el = document.getElementById(item.id);
      if (el && el.offsetTop <= scrollPos) {
        currentId = item.id;
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });

  // 13. Photo Gallery Filtering & Dynamic Upload System
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioGrid = document.getElementById('portfolio-grid');
  const photoTotalBadge = document.getElementById('photo-total-badge');
  const triggerPhotoUpload = document.getElementById('trigger-photo-upload');
  const userPhotoInput = document.getElementById('user-photo-input');
  const dropzoneNotice = document.getElementById('dropzone-notice');

  function updatePhotoCountBadge() {
    if (photoTotalBadge && portfolioGrid) {
      const total = portfolioGrid.querySelectorAll('.portfolio-card').length;
      photoTotalBadge.textContent = total;
    }
  }

  function applyPhotoFilter(filterVal) {
    if (!portfolioGrid) return;
    const cards = portfolioGrid.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      if (filterVal === 'all' || categories.split(/\s+/).includes(filterVal)) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.transition = 'all 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 30);
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterVal = btn.getAttribute('data-filter');
      applyPhotoFilter(filterVal);
    });
  });

  function addUserPhoto(dataUrl, fileName = '自訂照片') {
    if (!portfolioGrid) return;

    const cleanTitle = fileName.replace(/\.[^/.]+$/, "") || '我的精選瞬間';
    const card = document.createElement('article');
    card.className = 'portfolio-card photo-card user-uploaded-card';
    card.setAttribute('data-category', 'street');

    card.innerHTML = `
      <div class="portfolio-img-wrap zoomable-img" data-caption="${cleanTitle} · 我的專屬相簿">
          <img src="${dataUrl}" alt="${cleanTitle}">
          <span class="portfolio-category-badge" style="background: rgba(16, 185, 129, 0.85);">✨ 我的自選相片</span>
          <span class="photo-lens-tag">📸 自訂相簿</span>
          <button type="button" class="photo-delete-btn" title="從相簿中移除此相片">✕</button>
          <div class="photo-hover-overlay">
              <span class="hover-zoom-btn">🔍 點擊放大相片</span>
          </div>
      </div>
      <div class="portfolio-info">
          <div class="photo-title-row">
              <h3 class="portfolio-title">${cleanTitle}</h3>
              <span class="photo-location-tag">📍 我的私藏</span>
          </div>
          <p class="portfolio-desc">
              用心收錄的專屬相片，將屬於自己的記憶與生活視角珍藏在作品空間中。
          </p>
          <div class="photo-meta-row">
              <span class="photo-param-pill">📷 本機相片展示</span>
              <span class="photo-param-pill">🌟 專屬收藏</span>
              <button type="button" class="photo-like-mini-btn" title="喜歡這張相片">
                  <span class="heart-icon">💖</span>
                  <span class="like-num">1</span>
              </button>
          </div>
      </div>
    `;

    portfolioGrid.insertBefore(card, portfolioGrid.firstChild);
    updatePhotoCountBadge();
    showToast(`📸 成功收錄「${cleanTitle}」至作品相簿！`);

    const delBtn = card.querySelector('.photo-delete-btn');
    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.style.transition = 'all 0.35s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.85)';
        setTimeout(() => {
          card.remove();
          updatePhotoCountBadge();
          showToast('🗑️ 已從相簿中移除該照片');
        }, 350);
      });
    }
  }

  if (triggerPhotoUpload && userPhotoInput) {
    triggerPhotoUpload.addEventListener('click', () => {
      userPhotoInput.click();
    });

    userPhotoInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          addUserPhoto(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
      });
      userPhotoInput.value = '';
    });
  }

  if (dropzoneNotice) {
    ['dragenter', 'dragover'].forEach(eventName => {
      dropzoneNotice.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzoneNotice.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropzoneNotice.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzoneNotice.classList.remove('dragover');
      });
    });

    dropzoneNotice.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer.files);
      let count = 0;
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        count++;
        const reader = new FileReader();
        reader.onload = (event) => {
          addUserPhoto(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
      });
      if (count === 0) {
        showToast('⚠️ 請拖曳圖片檔案 (JPG / PNG / WebP) 喔！');
      }
    });
  }

  updatePhotoCountBadge();

  // 13.5. Awards & Honors Filtering & Dynamic Upload System
  const awardFilterBtns = document.querySelectorAll('.award-filter-btn');
  const awardsGrid = document.getElementById('awards-grid');
  const awardTotalBadge = document.getElementById('award-total-badge');
  const triggerAwardUpload = document.getElementById('trigger-award-upload');
  const userAwardInput = document.getElementById('user-award-input');
  const awardDropzoneNotice = document.getElementById('award-dropzone-notice');

  function updateAwardCountBadge() {
    if (awardTotalBadge && awardsGrid) {
      const total = awardsGrid.querySelectorAll('.award-card').length;
      awardTotalBadge.textContent = total;
    }
  }

  function applyAwardFilter(filterVal) {
    if (!awardsGrid) return;
    const cards = awardsGrid.querySelectorAll('.award-card');
    cards.forEach(card => {
      const categories = card.getAttribute('data-category') || '';
      if (filterVal === 'all' || categories.split(/\s+/).includes(filterVal)) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.transition = 'all 0.35s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 30);
      } else {
        card.style.display = 'none';
      }
    });
  }

  awardFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      awardFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterVal = btn.getAttribute('data-filter');
      applyAwardFilter(filterVal);
    });
  });

  function addUserAward(dataUrl, fileName = '新獎狀榮譽') {
    if (!awardsGrid) return;
    const cleanTitle = fileName.replace(/\.[^/.]+$/, "") || '自訂榮譽獎狀';
    const card = document.createElement('article');
    card.className = 'award-card zoomable-img user-uploaded-award';
    card.setAttribute('data-category', 'competition academic');
    card.setAttribute('data-caption', `${cleanTitle} · 榮譽獎狀專屬收藏`);

    card.innerHTML = `
      <div class="award-frame award-gold-frame">
          <div class="award-watermark" aria-hidden="true">HONOR & CERTIFICATE</div>
          <div class="award-card-header">
              <div class="award-seal-badge seal-gold">
                  <span>🏆</span>
              </div>
              <span class="award-type-pill pill-gold">自訂獎狀 · 最新上傳</span>
              <span class="award-year-tag">新收錄</span>
          </div>
          <div class="award-preview-thumb-wrap">
              <img src="${dataUrl}" alt="${cleanTitle}" class="award-preview-thumb">
          </div>
          <div class="award-card-body">
              <h3 class="award-title">${cleanTitle}</h3>
              <div class="award-issuer-row">
                  <span class="issuer-label">頒發單位</span>
                  <strong class="issuer-name">個人榮譽 / 認證機構</strong>
              </div>
              <p class="award-desc">
                  用心收錄的榮譽獎狀與專業證照，在時間裡凝結成持續邁進的踏實肯定。
              </p>
          </div>
          <div class="award-card-footer">
              <div class="award-tags">
                  <span>#榮譽收藏</span>
                  <span>#專屬獎狀</span>
                  <span>#持續成長</span>
              </div>
              <button type="button" class="award-delete-btn" title="從專區中移除此獎狀">✕ 移除</button>
              <span class="award-view-btn">🔍 點擊放大檢視</span>
          </div>
      </div>
    `;

    awardsGrid.insertBefore(card, awardsGrid.firstChild);
    updateAwardCountBadge();
    showToast(`📜 成功收錄「${cleanTitle}」至榮譽獎狀專區！`);

    const delBtn = card.querySelector('.award-delete-btn');
    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        card.style.transition = 'all 0.35s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.85)';
        setTimeout(() => {
          card.remove();
          updateAwardCountBadge();
          showToast('🗑️ 已從獎狀專區移除該項目');
        }, 350);
      });
    }
  }

  if (triggerAwardUpload && userAwardInput) {
    triggerAwardUpload.addEventListener('click', () => {
      userAwardInput.click();
    });

    userAwardInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          addUserAward(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
      });
      userAwardInput.value = '';
    });
  }

  if (awardDropzoneNotice) {
    ['dragenter', 'dragover'].forEach(eventName => {
      awardDropzoneNotice.addEventListener(eventName, (e) => {
        e.preventDefault();
        awardDropzoneNotice.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      awardDropzoneNotice.addEventListener(eventName, (e) => {
        e.preventDefault();
        awardDropzoneNotice.classList.remove('dragover');
      });
    });

    awardDropzoneNotice.addEventListener('drop', (e) => {
      const files = Array.from(e.dataTransfer.files);
      let count = 0;
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        count++;
        const reader = new FileReader();
        reader.onload = (event) => {
          addUserAward(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
      });
      if (count === 0) {
        showToast('⚠️ 請拖曳獎狀圖檔 (JPG / PNG / WebP) 喔！');
      }
    });
  }

  updateAwardCountBadge();

  // 14. Contact Form Submission & Validation
  const contactForm = document.getElementById('contact-form');
  const contactSubmitBtn = document.getElementById('contact-submit-btn');

  if (contactForm && contactSubmitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name-input');
      const emailInput = document.getElementById('contact-email-input');
      const msgInput = document.getElementById('contact-msg-input');

      if (!nameInput.value.trim()) {
        showToast('⚠️ 請填寫您的稱呼或姓名喔！');
        nameInput.focus();
        return;
      }

      if (!emailInput.value.trim()) {
        showToast('⚠️ 請填寫您的電子信箱 Email！');
        emailInput.focus();
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(emailInput.value.trim())) {
        showToast('⚠️ 請輸入有效的電子郵件格式！');
        emailInput.focus();
        return;
      }

      if (!msgInput.value.trim()) {
        showToast('⚠️ 請輸入您想留下的訊息內容！');
        msgInput.focus();
        return;
      }

      const originalHTML = contactSubmitBtn.innerHTML;
      contactSubmitBtn.innerHTML = '<span>⏳ 訊息發送中...</span>';
      contactSubmitBtn.disabled = true;

      setTimeout(() => {
        contactSubmitBtn.innerHTML = '<span>✅ 訊息已送出！</span>';
        showToast(`💌 感謝 ${nameInput.value.trim()} 的留言！婷已收到您的訊息，會盡快回覆您～`);
        contactForm.reset();

        setTimeout(() => {
          contactSubmitBtn.innerHTML = originalHTML;
          contactSubmitBtn.disabled = false;
        }, 2800);
      }, 900);
    });
  }
});
