// src/composables/useSound.js
export function useSound() {
  const playSound = (type) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioCtx.createOscillator()
    oscillator.connect(audioCtx.destination)

    if (type === 'correct') {
      oscillator.frequency.value = 800
      oscillator.type = 'sine'
    } else {
      oscillator.frequency.value = 300
      oscillator.type = 'square'
    }

    oscillator.start()
    oscillator.stop(audioCtx.currentTime + 0.2)
  }

  return { playSound }
}
