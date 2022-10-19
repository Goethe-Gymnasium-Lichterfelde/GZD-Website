<template>
    <div>
        <div class="container">
            <div class="subject">
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'preview',
    props: ['email', 'open'],
    data() {
        return {
            from: {
                name: '',
                email: ''
            },
            to: [],
            cc: [],
            bcc: [],
            subject: '',
            date: ''
        }
    },
    mounted() {
        const firstline = this.email.match(/^.*$/m)[0]
        this.from.email = firstline.match(/<(.*)>/)[1]
        this.from.name = firstline.match(/From: (.*) <(.*)>/)[1]
        this.from.name = this.from.name.replace(/"/g, '')

    }
}
</script>

<style scoped lang="scss">
.container {
    padding: 10px;
}
</style>