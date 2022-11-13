<template>
    <div>
        <div class="org-container">
            <div class="name">{{orga.name}}</div>
            <div class="description">{{orga.description}}</div>
            <div class="members">
                <!-- Number of members -->
                <div class="material-icons">group</div>
                <div class="number">3</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Organisation',
    props: ['orga'],
    mounted() {
        console.log(this.orga)
    },
}
</script>

<style scoped lang="scss">
.org-container {
    width: 300px;
    height: 100%;
    background-color: #1e1e1e;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease-in-out;
    cursor: pointer;

    .name {
        font-size: 30px;
        font-weight: 500;
        color: #fff;
        margin-bottom: 20px;

        // max one line
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .description {
        font-size: 16px;
        color: #fff;
        margin-bottom: 20px;
        font-weight: 300;

        // 5 Lines overflow with ellipsis
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
    }

    .members {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        opacity: 0.5;

        .material-icons {
            font-size: 20px;
            color: #fff;
            margin-right: 10px;
        }

        .number {
            font-size: 20px;
            color: #fff;
        }
    }

    &:hover {
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.8);
        scale: 1.05;
    }
}
</style>