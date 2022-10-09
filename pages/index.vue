<template>
  <div class="wrapper">
    <div class="title">Projekte des Goethe Gymnasiums Lichterfelde</div>
    <div class="projects">
      <Card :project="project" v-for="project in projects" :key="project.id" />
    </div>
  </div>
</template>

<script>
import Card from '~/components/assets/card.vue';
export default {
  name: "IndexPage",
  components: { Card },
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
.wrapper {
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 40px;
  max-width: calc(100% - 40px);

  .title {
    font-size: 30px;
    font-weight: 500;
    margin-bottom: 40px;
    padding: 0 10px;
  }

  .projects {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>