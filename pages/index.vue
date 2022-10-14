<template>
  <div class="wrapper">
    <div class="banner" style="background-image: url(https://www.goethe-gymnasium-lichterfelde.de/assets/backgrounds/bg1.webp)">
      <div class="overlay">
        <div class="title">Goethe Gymnasium Lichterfelde Berlin</div>
        <div class="subtitle">Das Schulforum</div>
      </div>
    </div>
    <div class="projects">
      <Card :project="project" v-for="project in projects" :key="project.id" />
    </div><!-- <br><br>
    <div class="title">Arbeitsgemeinschaften</div>
    <div class="subtitle">Hier findest du alle AG's, die es an unserer Schule gibt.</div> -->
  </div>
</template>

<script>
import Card from '~/components/assets/card.vue';
export default {
  name: "IndexPage",
  components: { Card },
  middleware: 'auth',
  data() {
    return {
      projects: [
        {
          name: 'Oberstufenraum',
          description: 'Der Oberstufenraum ist ein Raum, der für die Oberstufe der Schule gedacht ist. Er ist mit einem großen Tisch ausgestattet, der Platz für 20 Schüler bietet. Außerdem gibt es einen Beamer, der für Präsentationen genutzt werden kann. Der Raum ist mit einem großen Fenster ausgestattet, sodass er sehr hell ist. Außerdem gibt es einen großen Schrank, in dem die Schüler ihre Sachen aufbewahren können.',
          image: 'https://gymnasium-tiergarten.de/_data/631__Copy_.JPG',
          date: '2020-01-01',
          anzahlschueler: 20,
          tags: [
            'Oberstufe'
          ]
        },
        {
          name: 'Schultore',
          description: 'Der Oberstufenraum ist ein Raum, der für die Oberstufe der Schule gedacht ist. Er ist mit einem großen Tisch ausgestattet, der Platz für 20 Schüler bietet. Außerdem gibt es einen Beamer, der für Präsentationen genutzt werden kann. Der Raum ist mit einem großen Fenster ausgestattet, sodass er sehr hell ist. Außerdem gibt es einen großen Schrank, in dem die Schüler ihre Sachen aufbewahren können.',
          image: 'https://www.goethe-gymnasium-lichterfelde.de/assets/backgrounds/bg1.webp',
          date: '2020-01-01',
          anzahlschueler: 20,
          tags: [
            'Mittelstufe',
            'Schulhof'
          ]
        },
        {
          name: 'Schulball',
          description: 'Der Oberstufenraum ist ein Raum, der für die Oberstufe der Schule gedacht ist. Er ist mit einem großen Tisch ausgestattet, der Platz für 20 Schüler bietet. Außerdem gibt es einen Beamer, der für Präsentationen genutzt werden kann. Der Raum ist mit einem großen Fenster ausgestattet, sodass er sehr hell ist. Außerdem gibt es einen großen Schrank, in dem die Schüler ihre Sachen aufbewahren können.',
          image: 'https://www.goethe-gymnasium-lichterfelde.de/assets/backgrounds/bg6.webp',
          date: '2020-01-01',
          anzahlschueler: 20,
          tags: [
            'Alle'
          ]
        },
        {
          name: 'Sitzgelegenheiten',
          description: 'Der Oberstufenraum ist ein Raum, der für die Oberstufe der Schule gedacht ist. Er ist mit einem großen Tisch ausgestattet, der Platz für 20 Schüler bietet. Außerdem gibt es einen Beamer, der für Präsentationen genutzt werden kann. Der Raum ist mit einem großen Fenster ausgestattet, sodass er sehr hell ist. Außerdem gibt es einen großen Schrank, in dem die Schüler ihre Sachen aufbewahren können.',
          image: 'https://www.goethe-gymnasium-lichterfelde.de/assets/backgrounds/bg4.webp',
          date: '2020-01-01',
          anzahlschueler: 20,
          tags: [
            'Schulhof'
          ]
        },
      ]
    }
  }
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
  }
}
</style>