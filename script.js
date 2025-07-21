const video = document.getElementById('video');
const moodDisplay = document.getElementById('moodDisplay');
const player = document.getElementById('player');

// Local playlist for each mood
const moodSongs = {
  happy: [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  ],
  sad: [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  ],
  angry: [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  ],
  surprised: [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  ],
  neutral: [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  ]
};

const moodEmojis = {
  happy: '😄',
  sad: '😢',
  angry: '😠',
  surprised: '😲',
  neutral: '😐'
};

// Load webcam
async function startVideo() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
  } catch (err) {
    alert('Could not access webcam.');
  }
}

// Load face-api models
async function loadModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('models');
  await faceapi.nets.faceExpressionNet.loadFromUri('models');
}

// Detect emotion and update UI
async function detectMood() {
  const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
  if (detections && detections.expressions) {
    const mood = getDominantMood(detections.expressions);
    moodDisplay.textContent = moodEmojis[mood] || '😊';
    playMoodSong(mood);
  }
}

function getDominantMood(expressions) {
  let max = 0;
  let mood = 'neutral';
  for (const [key, value] of Object.entries(expressions)) {
    if (value > max) {
      max = value;
      mood = key;
    }
  }
  // Map face-api.js moods to our set
  if (['happy','sad','angry','surprised','neutral'].includes(mood)) return mood;
  return 'neutral';
}

function playMoodSong(mood) {
  const songs = moodSongs[mood] || moodSongs['neutral'];
  const song = songs[Math.floor(Math.random() * songs.length)];
  if (player.src !== song) {
    player.src = song;
    player.play();
  }
}

// Main
window.addEventListener('DOMContentLoaded', async () => {
  await loadModels();
  await startVideo();
  setInterval(detectMood, 2000); // Check every 2 seconds
});

