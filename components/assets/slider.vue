<template>
    <div>
        <div class="slider">
            <div 
                class="btn left" 
                ref="left"
                @click="left()"
                >
                <div class="material-icons">
                    chevron_left
                </div>
            </div>
            <div class="slide-track" ref="track">
                <div class="slide" v-for="(item, index) of list" v-bind:key="index">
                    <Organisation :orga="item"></Organisation>
                </div>
            </div>
            <div 
                class="btn rigth"
                ref="right"
                @click="right()"
            >
                <div class="material-icons">
                    chevron_right
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Organisation from '~/components/assets/orga.vue'

export default {
    name: 'Slider',
    props: ['list'],
    data() {
        return {
            slideWidth: 0
        }
    },
    mounted() {
        this.slideCount = this.list.length;
        this.slideWidth = this.$refs.track.offsetWidth;
    },
    methods: {
        left() {
            // Scroll to the left
            this.$refs.track.scrollLeft -= ((this.slideWidth / 3) * 2)
        },
        right() {
            // Scroll to the right
            this.$refs.track.scrollLeft += ((this.slideWidth / 3) * 2)
        }
    },
    watch: {
        // If the window is resized, the width of the slider is updated
        $route() {
            this.slideWidth = this.$refs.track.offsetWidth;
        },
        // If the slider are at the beginning or end, the buttons are disabled
        track() {
            if (this.$refs.track.scrollLeft == 0) {
                this.$refs.left.classList.add('disabled');
            } else {
                this.$refs.left.classList.remove('disabled');
            }
            if (this.$refs.track.scrollLeft == (this.slideWidth * this.slideCount) - this.slideWidth) {
                this.$refs.right.classList.add('disabled');
            } else {
                this.$refs.right.classList.remove('disabled');
            }
        }
    },
    components: {
        Organisation
    }
}
</script>

<style scoped lang="scss">
.slider {
    padding: 0 20px;
    margin-top: 40px;
    position: relative;
    width: 100%;

    .slide-track {
        display: flex;
        overflow-x: hidden;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
        -ms-overflow-style: none;
        scrollbar-width: none;
        padding: 0 20px;

        .slide {
            flex: 0 0 300px;
            scroll-snap-align: start;
            margin: 0 10px;
            border-radius: 10px;
        }
    }

    .btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #fff;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        z-index: 10;
        display: grid;
        place-items: center;
    
        &:hover {
            background-color: #f5f5f5;
            scale: 1.1;
        }
    
        &.left {
            left: 5px;
        }
    
        &.rigth {
            right: 5px;
        }

        &.disabled {
            opacity: 0.5;
            cursor: default;
            &:hover {
                scale: 1;
            }
        }
    }
}
</style>