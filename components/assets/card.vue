<template>
    <div>
        <section>
            <!-- <div class="image" :style="'background-image: url(' + project.image + ');'"></div> -->
            <div class="title">{{project.name}}</div>
            <div class="description">{{project.description}}</div>
            <div class="tags">
                <div class="tag" v-for="tag in project.tags" :key="tag">{{tag}}</div>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'Card',
    props: {
        project: {
            type: Object,
            required: true
            // {
            //     name: 'Oberstufenraum',
            //     description: 'Der Oberstufenraum ist ein Raum, der für die Oberstufe der Schule gedacht ist. Er ist mit einem großen Tisch ausgestattet, der Platz für 20 Schüler bietet. Außerdem gibt es einen Beamer, der für Präsentationen genutzt werden kann. Der Raum ist mit einem großen Fenster ausgestattet, sodass er sehr hell ist. Außerdem gibt es einen großen Schrank, in dem die Schüler ihre Sachen aufbewahren können.',
            //     image: 'https://gymnasium-tiergarten.de/_data/631__Copy_.JPG',
            //     date: '2020-01-01',
            //     anzahlschueler: 20,
            //     tags: [
            //         'Oberstufe'
            //     ]
            // }
        }
    }
}
</script>

<style scoped lang="scss">
section {
    width: 260px;
    cursor: pointer;
    background-color: #f5f5f5;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    margin: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;

    .image {
        width: 100%;
        height: 150px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        transition: all 0.3s;
    }

    .title {
        padding: 10px 15px;
        font-size: 20px;
        font-weight: 500;
        color: #333;
        transition: all 0.3s;

        // Only one line of text and ellipsis
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .description {
        padding: 0 15px;
        opacity: 0.7;
        font-size: 12px;
        color: #333;
        transition: all 0.3s;
        // Set heigth and overflow to show only 3 lines
        height: 4.5em;
        overflow: hidden;
        // Hide text if it is longer than 3 lines
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .tags {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        padding: 10px 10px;
        transition: all 0.3s;

        .tag {
            background-color: #333;
            color: #fff;
            padding: 5px 10px;
            border-radius: 5px;
            margin: 5px;
            transition: all 0.3s;
        }
    }

    &:hover {
        transform: scale(1.02);
        box-shadow: 0 0 0 5px rgba(144, 224, 255, 0.7);
    }
}
</style>