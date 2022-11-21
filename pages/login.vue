<template>
    <div>
        <div class="bg"></div>
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
            this.$auth.loginWith('local').then(() => {
                this.$router.push('/')
            }).catch((error) => {
                this.error = error.response.data.message
                this.loading = false
            })
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
    background-image: url(https://www.goethe-gymnasium-lichterfelde.de/assets/backgrounds/bg4.webp);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    filter: blur(8px);
    -webkit-filter: blur(8px);
}
.center {
    width: 500px;
    padding: 100px 20px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    border-radius: 10px;
    color: #2d2d2d;
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
            scale: 1.1;
        }
    }
}
</style>