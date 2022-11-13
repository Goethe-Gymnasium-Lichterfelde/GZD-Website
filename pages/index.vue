<template>
  <div>
    <div style="width: 100%; height: 40px;"></div>
    <div class="wrapper">
      <div class="grid">
        <div class="box red">
          <div class="material-icons">handshake</div>
          Schüler helfen Schüler
        </div>
        <div class="box orange">
          <div class="material-icons">filter_list</div>
          Projekte
        </div>
        <nuxt-link to="/util/vertretungsplan"><div class="box blue">
          <div class="material-icons">next_plan</div>
          Vertretungsplan
        </div></nuxt-link>
        <nuxt-link to="/util/emails"><div class="box lila">
          <div class="material-icons">mail</div>
          E-Mails
        </div></nuxt-link>
        <div class="box green">
          <div class="material-icons">event</div>
          Kalender
        </div>
        <div class="box darkgreen">
          <div class="material-icons">group</div>
          Arbeitsgemeinschaften
        </div>
      </div>
    </div>
    <div class="title">
      <h1>Arbeitsgemeinschaften (AGs)</h1>
    </div>
    <!-- Slider -->
    <div class="wrapper">
      <Slider :list="orgas"></Slider>
    </div>
  </div>
</template>

<script>
import Organisation from '~/components/assets/orga.vue'
import Slider from '~/components/assets/slider.vue'

export default {
  name: 'Index',
  components: {
    Organisation,
    Slider
  },
  data() {
    return {
      orgas: []
    }
  },
  mounted() {
    this.$axios.get('http://localhost:3001/organisations', {
      headers: {
        'x-auth-token': this.$auth.strategy.token.get().slice(7)
      }
    }).then(res => {
      this.orgas = res.data
    }).catch(err => {
      console.log(err)
    })
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 20px;

  .grid {
    // Grid with 6 columns and 2 rows
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 20px;
    margin-top: 20px;

    .box {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      padding: 20px;
      font-weight: bold;
      font-size: large;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease-in-out;

      .material-icons {
        font-size: 100px;
        margin-bottom: 10px;
      }
    }

    .lila {
      background-color: #b38edd;
      color: white;

      &:hover {
        background-color: #6f538f;
      }
    }

    .blue {
      background-color: #8e93dd;
      color: white;

      &:hover {
        background-color: #57538f;
      }
    }

    .green {
      background-color: #8eddd3;
      color: white;

      &:hover {
        background-color: #5f8f6f;
      }
    }

    .red {
      background-color: #dd8e8e;
      color: white;

      &:hover {
        background-color: #8f5f5f;
      }
    }

    .darkgreen {
      background-color: #8eddb3;
      color: white;

      &:hover {
        background-color: #5f8f5f;
      }
    }

    .orange {
      background-color: #ddc38e;
      color: white;

      &:hover {
        background-color: #8f6f5f;
      }
    }
  }
}

@media (max-width: 800px) {
  .wrapper {
    .grid {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(6, 1fr);
    }
  }
}

.title {
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  margin-top: 40px;

  h1 {
    font-size: 30px;
    font-weight: 200;
  }
}
</style>