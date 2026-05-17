<template>
  <q-page class="flex flex-center column">
    <div class="text-h4 q-mb-xl">Odaberi igru</div>

    <div class="row q-gutter-lg justify-center">
      <!-- Kartica igre 1 -->
      <q-card
        class="game-card cursor-pointer"
        @click="goToGame('letter-click')"
      >
        <q-img src="~assets/letters-icon.svg" width="120px" />
        <q-card-section class="text-h5 text-center">
          Klikni slovo
        </q-card-section>
      </q-card>

      <!-- Kartica igre 2 -->
      <q-card
        class="game-card cursor-pointer"
        @click="goToGame('what-is-missing')"
      >
        <q-img src="~assets/missing-icon.svg" width="120px" />
        <q-card-section class="text-h5 text-center">
          Što je nestalo?
        </q-card-section>
      </q-card>

      <!-- Kartica igre 3 -->
      <q-card
        class="game-card cursor-pointer"
        @click="goToGame('react-click')"
      >
        <q-img src="~assets/animal-icon.svg" width="120px" />
        <q-card-section class="text-h5 text-center">
          Klikni životinju
        </q-card-section>
      </q-card>
    </div>

    <div class="q-mt-xl">
      <AudioButton text="Odaberi jednu od tri igre. Klikni na sliku." />
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AudioButton from 'components/AudioButton.vue'

const router = useRouter()

const goToGame = (routeName) => {
  router.push({ name: routeName })
}
</script>

<style scoped>
.game-card {
  width: 220px;
  padding: 20px;
  border-radius: 20px;
  transition: transform 0.2s;
}
.game-card:hover {
  transform: scale(1.1);
}
</style>
