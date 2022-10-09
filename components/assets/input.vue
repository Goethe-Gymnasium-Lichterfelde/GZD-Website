<template>
    <div>
        <input
            :type="type"
            :placeholder="placeholder"
            :value="value"
            :disabled="disabled"
            @input="input"
        />
    </div>
</template>

<script>
export default {
    name: 'g-input',
    props: {
        label: {
            type: String,
            default: null
        },
        type: {
            type: String,
            default: 'text'
        },
        value: {
            type: String,
            default: null
        },
        placeholder: {
            type: String,
            default: null
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            val: this.value
        };
    },
    watch: {
        value() {
            this.val = this.value;
        }
    },
    methods: {
        update() {
            this.$emit('input', this.val);
        }
    }
}
</script>

<style scoped lang="scss">
input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
    transition: border 0.3s;
    &:focus {
        border: 1px solid #333;
    }
}
</style>