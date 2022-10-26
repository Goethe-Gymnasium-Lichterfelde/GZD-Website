<template>
    <div>
        <div class="folder" :class="selected?'sel':''">
            <Icon nohover small>
                {{
                    (name == 'Inbox') ? 'inbox' :
                    (name == 'Gesendet') ? 'send' :
                    (name == 'Entwürfe') ? 'drafts' :
                    (name == 'Mülleimer') ? 'delete' :
                    (name == 'Spam') ? 'report' :
                    'folder'
                }}
            </Icon>
            <div class="name">{{name}}</div>
        </div>
    </div>
</template>

<script>
import Icon from '~/components/assets/icon.vue';

export default {
    name: 'folder',
    props: ['name', 'selected'],
    components: {
        Icon
    }
}
</script>

<style scoped lang="scss">
.folder {
    display: flex;
    align-items: center;
    padding: 5px;
    cursor: pointer;
    transition: 0.2s;
    width: 100%;
    color: #fff;
    display: inline-flex;
    align-items: center;
    width: 100%;

    &:hover {
        background: rgb(36, 36, 36);
    }

    .material-icons {
        font-size: 20px;
    }

    .name {
        margin-left: 10px;
        font-size: 1rem;
        font-weight: bold;
    }
}
.sel {
    background: rgb(36, 36, 36);
}
</style>