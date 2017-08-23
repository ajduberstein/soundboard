const writeToLocalStorage = (audioCtx, name, sound) => {
  audioCtx.decodeAudioData(audioData).then(
  () => {
    window.localStorage.setItem("music", {
      name, soundBytes
    })
  })
}

const readFromLocalStorage = () {
  window.localStorage
}
