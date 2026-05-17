<template>
  <q-page class="flex flex-center column">
    <div class="text-center q-mb-xl">
      <q-img
        src="~assets/stars-logo.svg"
        width="100%"
        v-if="true"
      />
      <div class="text-h3 q-mt-md">Zvjezdani Put</div>
    </div>

    <!-- Gumbi za odabir razine -->
    <div class="q-gutter-y-lg">
      <q-btn
        label="Lakša razina"
        color="blue-6"
        class="full-width text-h4 q-py-lg"
        unelevated
        rounded
        @click="startGame('easy')"
      />
      <q-btn
        label="Teža razina"
        color="orange-6"
        class="full-width text-h4 q-py-lg"
        unelevated
        rounded
        @click="startGame('hard')"
      />
    </div>

    <!-- Gumb za slušanje uputa -->
    <div class="q-mt-xl">
      <AudioButton text="Dobrodošao, Dobrodošla! Odaberite laku ili tešku razinu." />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useGameStore } from 'src/stores/gameStore'
import AudioButton from 'components/AudioButton.vue'

const router = useRouter()
const gameStore = useGameStore()

const startGame = (level) => {
  gameStore.setLevel(level)
  router.push('/games') // vodi na izbor igara
}
</script>
