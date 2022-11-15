<template>
    <div>
        <Navigation />
        <div class="container scrollbar">
            <!-- <div class="warpper">
                <nuxt />
            </div> -->
            <nuxt />
        </div>
    </div>
</template>

<script>
export default {
    name: 'DefaultLayout',
}
</script>

<style scoped lang="scss">
.container {
    position: fixed;
    top: 0;
    left: 80px;
    right: 0;
    bottom: 0;
    overflow: auto;
    // background-color: #1e1e1e
}
</style>