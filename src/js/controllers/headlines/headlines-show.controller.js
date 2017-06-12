angular
.module('myApp')
.controller('HeadlinesShowCtrl', HeadlinesShowCtrl);

HeadlinesShowCtrl.$inject = ['HeadlineFactory', 'ReactionFactory', '$stateParams', '$http', '$window', '$scope'];
function HeadlinesShowCtrl(HeadlineFactory, ReactionFactory, $stateParams, $http, $window, $scope) {
  const vm = this;

  //Replace this query with external API call.
  HeadlineFactory.get($stateParams)
  .$promise
  .then(res => {
    vm.headline = res;
  });

  /***************************************************************************/

  vm.reactions = {};

  //Play and Pause
  vm.play = play;
  function play(id) {

    id = `reaction${id}`;
    const audio = document.getElementById(id);
    if (audio && !audio.paused) {
      vm.activeClass = null;
      audio.pause();
    } else {
      // Pause all audio
      var audios = document.getElementsByTagName('audio');
      for(var i = 0, len = audios.length; i < len;i++){
        audios[i].pause();
      }
      
      vm.activeClass = id;
      audio.play();
    }
  }

  /***************************************************************************/




  window.AudioContext = window.AudioContext || window.webkitAudioContext;

  var audioContext = new AudioContext();
  var audioInput = null;
  var realAudioInput = null;
  var inputPoint = null;
  var audioRecorder = null;
  // var rafID = null;
  var analyserContext = null;
  var canvasWidth, canvasHeight;
  // var recIndex = 0;

  vm.saveAudio = saveAudio;
  function saveAudio() {
    audioRecorder.exportWAV( doneEncoding );
    // could get mono instead by saying
    // audioRecorder.exportMonoWAV( doneEncoding );
  }

  function gotBuffers(buffers) {
    // var canvas = document.getElementById('wavedisplay');

    // drawBuffer( canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] );

    // the ONLY time gotBuffers is called is right after a new recording is completed -
    // so here's where we should set up the download.
    audioRecorder.exportWAV( doneEncoding );
  }

  function doneEncoding( blob ) {
    const filestack = $window.filestack;
    var client = filestack.init('AuFKUETf9TLCMxLFaKwS0z');

    client
    .upload(blob)
    .then(response => {
      return ReactionFactory.save({
        headline_id: $stateParams.id,
        url: response.url
      }).$promise;
    })
    .then(data => {
      console.log('FINISHED', data);
      vm.headline = HeadlineFactory.get($stateParams);
    })
    .catch(error => {
      console.error(error);
    });
  }

  vm.toggleRecording = toggleRecording;
  function toggleRecording($event) {
    const e = $event.currentTarget;
    if (e.classList.contains('recording')) {
      // stop recording
      audioRecorder.stop();
      e.classList.remove('recording');
      audioRecorder.getBuffers( gotBuffers );
    } else {
      // start recording
      if (!audioRecorder) return;
      e.classList.add('recording');
      audioRecorder.clear();
      audioRecorder.record();
    }
  }

  function convertToMono( input ) {
    var splitter = audioContext.createChannelSplitter(2);
    var merger = audioContext.createChannelMerger(2);

    input.connect( splitter );
    splitter.connect( merger, 0, 0 );
    splitter.connect( merger, 0, 1 );
    return merger;
  }

  function cancelAnalyserUpdates() {
    window.cancelAnimationFrame( rafID );
    rafID = null;
  }

  function updateAnalysers(time) {
    if (!analyserContext) {
      var canvas = document.getElementById('analyser');
      canvasWidth = canvas.width;
      canvasHeight = canvas.height;
      analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
      var SPACING = 3;
      var BAR_WIDTH = 1;
      var numBars = Math.round(canvasWidth / SPACING);
      var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

      analyserNode.getByteFrequencyData(freqByteData);

      analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
      analyserContext.fillStyle = '#F6D565';
      analyserContext.lineCap = 'round';
      var multiplier = analyserNode.frequencyBinCount / numBars;

      // Draw rectangle for each frequency bin.
      for (var i = 0; i < numBars; ++i) {
        var magnitude = 0;
        var offset = Math.floor( i * multiplier );
        // gotta sum/average the block, or we miss narrow-bandwidth spikes
        for (var j = 0; j< multiplier; j++)
        magnitude += freqByteData[offset + j];
        magnitude = magnitude / multiplier;
        var magnitude2 = freqByteData[i * multiplier];
        analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
        analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
      }
    }

    rafID = window.requestAnimationFrame( updateAnalysers );
  }

  function toggleMono() {
    if (audioInput !== realAudioInput) {
      audioInput.disconnect();
      realAudioInput.disconnect();
      audioInput = realAudioInput;
    } else {
      realAudioInput.disconnect();
      audioInput = convertToMono( realAudioInput );
    }

    audioInput.connect(inputPoint);
  }

  function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

    //    audioInput = convertToMono( input );

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect(analyserNode);

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    updateAnalysers();
  }

  function initAudio() {
    if (!navigator.getUserMedia)
    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
    navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
    navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    navigator.getUserMedia(
      {
        'audio': {
          'mandatory': {
            'googEchoCancellation': 'false',
            'googAutoGainControl': 'false',
            'googNoiseSuppression': 'false',
            'googHighpassFilter': 'false'
          },
          'optional': []
        }
      }, gotStream, function(e) {
        alert('Error getting audio');
        console.log(e);
      });
    }

    $window.addEventListener('load', initAudio);
  }
