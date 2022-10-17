<template>
  <div class="wrapper">
    <div class="banner" style="background-image: url(https://www.goethe-gymnasium-lichterfelde.de/assets/backgrounds/bg1.webp)">
      <div class="overlay">
        <div class="title">Goethe Gymnasium Lichterfelde Berlin</div>
        <div class="subtitle">Das Schulforum</div>
      </div>
    </div>
    <div class="projects">
      <span v-if="loading" class="material-icons">sync</span>
      <Card v-else :project="project" v-for="project in projects" :key="project.id" />
    </div><!-- <br><br>
    <div class="title">Arbeitsgemeinschaften</div>
    <div class="subtitle">Hier findest du alle AG's, die es an unserer Schule gibt.</div> -->
  </div>
</template>

<script>
import Card from '~/components/assets/card.vue'

export default {
  name: "IndexPage",
  components: { Card },
  middleware: 'auth',
  data() {
    return {
      projects: [],
      loading: true,
    }
  },
  async mounted() {
    this.projects = await this.$axios.$get('http://localhost:3001/projects/', {
      headers: {
        'x-auth-token': this.$auth.strategy.token.get().replace('Bearer ', '')
      }
    })
      .catch((error) => {
        console.log(error)
      })
    this.loading = false
  },
}
</script>

<style lang="scss" scoped>

.banner {
  width: calc(100% - 20px);
  height: 40vh;
  border-radius: 10px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  overflow: hidden;
  margin: 10px;
  margin-bottom: 20px;
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    .title {
      font-size: 3rem;
      color: white;
      font-weight: 700;
    }
    .subtitle {
      font-size: 1.5rem;
      color: white;
      font-weight: 700;
    }
  }
}

.wrapper {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 40px;
  max-width: calc(100% - 40px);

  .title {
    font-size: 2rem;
    font-weight: 700;
  }

  .subtitle {
    font-size: 1rem;
    font-weight: 200;
    margin-top: -7px;
    margin-bottom: 20px;
  }

  .projects {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    position: relative;

    .material-icons {
      position: absolute;
      left: 50%;
      margin-top: 50px;
      transform: translate(-50%, 0);
      font-size: 3rem;
      color: #2d2d2d;

      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% {
        transform: translate(-50%, 0) rotate(0deg);
      }
      100% {
        transform: translate(-50%, 0) rotate(-360deg);
      }
    }
  }
}
</style>