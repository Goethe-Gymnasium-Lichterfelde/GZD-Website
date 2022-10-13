<template>
    <div class="container">
        <div class="folders">
            <div class="top">
                <div class="mail">mateo.meillon</div>
                <div class="options">
                    <div @click="syncMails" :class="sync?'syncing':''"><Icon small>sync</Icon></div>
                    <Icon small>search</Icon>
                    <Icon small>more_vert</Icon>
                </div>
            </div>
            <div class="folders">
            
            </div>
        </div>
        <div class="emails">

        </div>
        <div class="preview">

        </div>
    </div>
</template>

<script>
import Icon from '~/components/assets/icon.vue';

export default {
    name: "EMails",
    data() {
        return {
            sync: false,
        }
    },
    middleware: 'auth',
    components: { 
        Icon
    },
    methods: {
        syncMails() {
            this.sync = true
            setTimeout(() => {
                this.sync = false
            }, 2000);
        }
    }
}
</script>

<style scoped lang="scss">
.container {
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;

    .folders {
        width: 320px;
        background-color: #333;
        border-left: 1px solid #444;

        .top {
            height: 50px;
            position: relative;
            display: inline-flex;
            align-items: center;
            padding: 0 20px;
            width: 100%;
            border-bottom: 1px solid #444;

            .options {
                position: absolute;
                right: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }

            .mail {
                color: #fff;
                font-size: 1rem;
                font-weight: bold;
                max-width: 50%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }

    .emails {
        width: 320px;
        background-color: #f5f5f5;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    }

    .preview {
        width: calc(100% - 640px);
    }
}

.syncing { animation: spin 1s linear infinite; }
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(-360deg);
    }
}
</style>