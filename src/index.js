import './styles/index.scss';

const endpoints = {
  voices: '//public.lyrebird.ai/api/public/voices',
  overdub: '//public.lyrebird.ai/api/public/overdub',
  // voices: '/voices',
  // overdub: '/overdub',
};

let voices;
let status = '';
let currentVoice = {};

const elements = {
  widget: document.querySelector('#overdub-demo'),
  select: document.querySelector('#overdub-select'),
  text: document.querySelector('#overdub-text'),
  sample: document.querySelector('#overdub-sample'),
  input: document.querySelector('#overdub-input'),
  play: document.querySelector('#overdub-play'),
  hint: document.querySelector('#overdub-hint'),
  audio: document.querySelector('#overdub-audio'),
};

elements.input.addEventListener('transitionend', resetOverflow);
// elements.input.addEventListener('transitionstart', scrollToTop);
elements.select.addEventListener('change', selectVoice);
elements.input.addEventListener('input', changeText);
elements.play.addEventListener('click', playAudio);
elements.audio.addEventListener('pause', pause);
elements.audio.addEventListener('play', play);
window.addEventListener('load', init);
window.addEventListener('resize', resetText);

function init() {
  if (!elements.widget) return;

  const options = {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
  };

  fetch(endpoints.voices, options)
    .then(response => response.json())
    .then(json => saveOptions(json))
    .catch(error);
    // .catch(() => saveOptions([{"id":1,"speaker":"Don"},{"id":2,"speaker":"Charle"}]));
}

function saveOptions(options) {
  voices = options;
  currentVoice = options[0];
  voices.forEach(({ speaker }, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.innerText = speaker;
    elements.select.appendChild(option);
  });

  elements.input.value = 'Descript’s Overdub Text-to-Speech enables developers to synthesize natural-sounding speech with 100+ voices, available in multiple languages and variants. It applies DeepMind’s groundbreaking research in WaveNet and Google’s powerful neural networks to deliver the highest fidelity possible. As an easy-to-use API, you can create lifelike interactions with your users, across many applications and devices.';
  elements.hint.innerText = 'Type anything you want, then click "Speak it" to hear.';
  resetText();
  ready();
}

function setStatus(newStatus) {
  status && elements.widget.classList.remove(status);
  elements.widget.classList.add(newStatus);
  status = newStatus;
}

function playAudio() {
  const { id } = currentVoice;
  const text = elements.input.value.trim().slice(0, 500);

  if (!id || !text) return;

  switch (status) {
    case 'generated': {
      elements.audio.play().catch(pause);
      return;
    }

    case 'ready': {
      setStatus('generating');

      fetchAudio({ voice_id: id, text })
        .then((blob) => {
          if (blob && status === 'generating') {
            elements.audio.src = blob;
            elements.audio.play().catch(ready);
          }
        });

      return;
    }

    case 'playing': {
      setStatus('generated');
      elements.audio.pause();
      elements.audio.currentTime = 0;
      return;
    }

    default:
      return;
  }
}

function selectVoice({ target: { value } }) {
  resetAudio();
  currentVoice = voices[parseInt(value)];
}

function fetchAudio(data) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  return fetch(endpoints.overdub, options)
    .then((response) => {
      if (response.ok) {
        return response.blob();
      } else {
        throw new Error('Error while fetching audio');
      }
    })
    .then(blob => URL.createObjectURL(blob))
    .catch(ready);
}

function ready() {
  setStatus('ready');
}

function pause() {
  setStatus('generated');
}

function play() {
  setStatus('playing');
}

function error() {
  setStatus('error');
  elements.audio.src = '';
  elements.audio.currentTime = 0;
}

function changeText() {
  resetAudio();
  resetText();
}

function resetText() {
  elements.text.innerText = elements.input.value + '\r';

  if (elements.text.scrollHeight <= 360 && elements.input.style.height !== elements.text.scrollHeight + 'px') {
    elements.input.style.height = elements.text.scrollHeight + 'px';
    // scrollToTop();
    !elements.input.classList.contains('overflow-hidden') && elements.input.classList.add('overflow-hidden');
  }
}

function resetOverflow() {
  elements.input.classList.remove('overflow-hidden');
}

function scrollToTop() {
  elements.input.scrollTop = 0;
}

function resetAudio() {
  switch (status) {
    case 'playing':
    case 'generated':
    case 'generating': {
      setStatus('ready');
      elements.audio.src = '';
      return;
    }

    default:
      return;
  }
}
