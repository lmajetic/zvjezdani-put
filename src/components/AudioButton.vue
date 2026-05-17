<template>
  <q-btn
    round
    color="secondary"
    icon="volume_up"
    @click="speak"
    size="lg"
  />
</template>

<script setup>
const props = defineProps({
  text: String
})

const speak = () => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(props.text)
    utterance.lang = 'hr-HR'
    utterance.rate = 0.8 // brzina govora
    utterance.pitch = 1.4
    window.speechSynthesis.speak(utterance)
  }
}
</script>
