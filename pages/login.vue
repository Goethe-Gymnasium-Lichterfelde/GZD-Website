<template>
    <div class="bg">
        <div class="center">
            <div class="title">Goethe Gymnasium Lichterfelde Berlin</div>
            <div class="subtitle">Das Schulforum</div>
            <br><br>
            <!-- Nextcloud login button -->
            <a @click="login" :disabled="loading" class="button">{{loading?'Loading...':'Login with Nextcloud'}}</a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data() {
        return {
            email: '',
            password: '',
            error: '',
            loading: false,
            credentials: {}
        }
    },
    methods: {
        async login() {
            this.loading = true
            let data = await fetch('http://localhost:3001/nextcloud/login', { method: 'GET' })
            data = await data.json()
            await window.open(data.login, '_blank')
            let user = await fetch('http://localhost:3001/nextcloud/login/' + data.poll.token)
        }
    },
    layout: 'login',
}
</script>

<style scoped lang="scss">
.bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #1e1e1e;
}
.center {
    width: 500px;
    padding: 100px 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #2d2d2d;
    border-radius: 10px;
    color: #fff;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    .title {
        font-size: 2.5rem;
        font-weight: 600;
    }
    .subtitle {
        font-size: 1.5rem;
        font-weight: 400;
    }

    .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #0082c9;
        color: #fff;
        border-radius: 5px;
        margin-top: 20px;
        font-size: 1.2rem;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.2s ease-in-out;

        &:hover {
            box-shadow: 0 0 0 3px #333;
        }
    }
}
</style>