<template>
    <div>
        <div class="container">
            {{email.from.value[0].name }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'preview',
    props: ['email', 'open'],
    data() {
        return {

        }
    },
    mounted() {
        console.log(this.email)
    }
}
</script>

<style scoped lang="scss">
.container {
    padding: 10px;
}
</style>