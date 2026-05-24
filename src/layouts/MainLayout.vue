<template>
  <q-layout view="hHh lpR fFf" class="main-layout">
    <!-- Gornja traka -->
    <q-header elevated class="header-bar">
      <q-toolbar>
        <!-- Lijeva strana: zvjezdica + naslov -->
        <div class="row items-center">
          <q-icon name="star" color="yellow" size="md" class="q-mr-sm star-icon" />
          <q-toolbar-title class="text-h4 text-weight-bold">
            Zvjezdani Put
          </q-toolbar-title>
        </div>

        <q-space />

        <!-- Desna strana: home gumb (ako nismo na početnoj) -->
        <q-btn
          v-if="$route.path !== '/'"
          flat
          round
          icon="home"
          size="md"
          class="home-btn"
          @click="$router.push('/')"
        >
          <q-tooltip>Natrag na početak</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <!-- Glavni sadržaj -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
</script>

<style scoped>
.main-layout {
  background: linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%);
}

.header-bar {
  background: linear-gradient(90deg, #1565c0 0%, #1976d2 50%, #1e88e5 100%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-bottom: 3px solid #ffc107;
}

.star-icon {
  animation: spin 4s linear infinite;
  font-size: 2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.home-btn {
  transition: transform 0.2s, background-color 0.2s;
}
.home-btn:hover {
  transform: scale(1.1);
  background-color: rgba(255, 255, 255, 0.15);
}
</style>
