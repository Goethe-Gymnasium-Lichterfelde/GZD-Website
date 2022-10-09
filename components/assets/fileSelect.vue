<template>
    <label class="file-select">
        <div class="select-button">
            <slot></slot>
        </div>
        <input type="file" @change="handleFileChange"/>
    </label>
</template>

<script>
export default {
    name: "file-select",
    props: ['file'],
    methods: {
        handleFileChange(e) {
            this.$emit('input', e.target.files[0])
        }
    }
}
</script>

<style scoped lang="scss">
.file-select > .select-button {
    padding: 1rem;
    color: white;
    background-color: #333;
    cursor: pointer;
    border-radius: .3rem;
    text-align: center;
    font-weight: bold;
    transition: all .2s ease-in-out;

    &:hover {
        scale: 1.03;
        box-shadow: 0 0 0 5px rgba(144, 224, 255, 0.7);
    }
}

.file-select > input[type="file"] {
    display: none;
}
</style>