<template>
    <div>
        <div class="container">
            <div class="left">
                <div class="material-icons">drafts</div>
            </div>
            <div class="right">
                <div class="name">{{email.from.value[0].name }}</div>
                <div class="date">{{new Date(email.date).toLocaleString()}}</div>
                <div class="subject">{{email.subject}}</div>
            </div>
        </div>
    </div>
</template>

<script>
import Icon from '~/components/assets/icon.vue';

export default {
    name: 'preview',
    props: ['email', 'open'],
    data() {
        return {

        }
    },
    mounted() {
        console.log(this.email)
    },
    components: {
        Icon
    }
}
</script>

<style scoped lang="scss">
.container {
    // Apearing animation	
    animation: appear 0.5s ease-in-out;
    @keyframes appear {
        0% {
            opacity: 0;
            transform: translateY(10px);
        }
        100% {
            opacity: 1;
            transform: translateY(0px);
        }
    }
    padding: 10px;
    border-bottom: 1px solid rgb(236, 236, 236);
    width: 100%;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .left {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgb(236, 236, 236);
        margin-right: 10px;
        font-size: 20px;
    }

    .right {
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        width: calc(100% - 50px);

        .name {
            font-size: 1rem;
            color: #000;
            font-weight: 700;
        }

        .date {
            font-size: 0.7rem;
            font-weight: 400;
        }

        .subject {
            font-size: 0.8rem;
            color: #000;
            font-weight: 400;
            width: 100%;
            // Max 2 lines
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }

    &:hover {
        background-color: rgb(236, 236, 236);
    }
}
</style>