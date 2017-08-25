// TODO convert file object to bytestring
// then store bytestring
// hydrate audio
// pass

class Player {
  constructor() {
    if (!window.AudioContext) {
      if (!window.webkitAudioContext) {
          alert("Your browser does not support any AudioContext and cannot play back this audio.");
          return;
      }
      window.AudioContext = window.AudioContext||window.webkitAudioContext;
    }
    this.context = new AudioContext();
    this.buf = null;
  }
  
  playByteArrayAtLocalStorageIndex(idx) {
      let byteArray = window.localStorage.getItem(idx).split(",");
      let arrayBuffer = new ArrayBuffer(byteArray.length);
      let bufferView = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteArray.length; i++) {
        bufferView[i] = byteArray[i];
      }
      this.context.decodeAudioData(arrayBuffer, (buffer) => {
          this.buf = buffer;
          this.play();
      });
  }
  
  // Play the loaded file
  play() {
      // Create a source node from the buffer
      let source = this.context.createBufferSource();
      source.buffer = this.buf;
      // Connect to the final output node (the speakers)
      source.connect(this.context.destination);
      // Play immediately
      source.start(0);
  }
}

const audioToLocalStorage = (inputFile, key, successCb) => {
  let fr = new FileReader();
  fr.onload = () => {
      let data = fr.result;
      let array = new Int8Array(data);
      window.localStorage.setItem(key, array)
      successCb()
  };
  fr.readAsArrayBuffer(inputFile);
}


export {
  audioToLocalStorage,
  Player
};
