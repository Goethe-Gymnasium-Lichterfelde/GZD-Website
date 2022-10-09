<template>
    <div 
        class="container" 
        :class="[
            (primary==true?'primary':secondary==true?'secondary':''),
            (small==true?'small':large==true?'large':'default'),
            (nohover==true?'nohover':'')
            ]" 
    >
        <nuxt-link v-if="to != null" :to="to">
            <div 
                class="btn"
                @mouseover="hover = true"
                @mouseout="hover = false"
            >
                <div class="material-icons"><slot></slot></div>
            </div>
        </nuxt-link>
        <div v-if="to == null"
            class="btn"
            @mouseover="hover = true"
            @mouseout="hover = false"
        >
            <div class="material-icons"><slot></slot></div>
        </div>
        <div 
            v-if="tooltip != null" 
            class="tooltip" 
            :class="tooltipPosition"
            :style="hover?'opacity: 1; transition-delay: 0.3s;':''"
        >
            {{tooltip}}
        </div>
    </div>
</template>

<script>
export default {
    name: 'icon',
    props: {
        primary: {
            type: Boolean,
            default: false
        },
        secondary: {
            type: Boolean,
            default: false
        },
        tooltip: {
            type: String,
            default: null
        },
        tooltipPosition: {
            type: String,
            default: 'right'
        },
        to: {
            type: String,
            default: null
        },
        small: {
            type: Boolean,
            default: false
        },
        large: {
            type: Boolean,
            default: false
        },
        nohover: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            hover: false
        };
    },
}
</script>

<style scoped lang="scss">
.container {
    position: relative;

    .btn {
        padding: 15px;
        border-radius: 50%;
        background-color: #333;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s;
        margin: 10px;
        position: relative;
        &:hover {
            background-color: #fff;
            color: #333;
        }
    }
}

.tooltip {
    position: absolute;
    background-color: rgb(36, 36, 36);
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    opacity: 0;
    transition: all 0.3s;
    z-index: 1000;
    cursor: default;

    &.right {
        right: -10px;
        top: 50%;
        transform: translateY(-50%) translateX(100%);
    }

    &.left {
        left: -10px;
        top: 50%;
        transform: translateY(-50%) translateX(-100%);
    }

    &.top {
        top: -10px;
        left: 50%;
        transform: translateX(-50%) translateY(-100%);
    }

    &.bottom {
        bottom: -10px;
        left: 50%;
        transform: translateX(-50%) translateY(100%);
    }
}

.primary {
    .btn {
        background-color: #fff;
        color: #333;
        &:hover {
            background-color: #fff;
            color: #333;
        }
    }
}

.secondary {
    .btn {
        background-color: #333;
        color: #fff;
        &:hover {
            background-color: #333;
            color: #fff;
            box-shadow: 0 0 0 5px rgba(144, 224, 255, 0.7);
            scale: 1.1;
        }
    }
}

.small {
    .btn {
        padding: 10px;
        margin: 5px;
        .material-icons {
            font-size: 1rem;
        }
    }
}

.large {
    .btn {
        padding: 20px;
        margin: 15px;
        .material-icons {
            font-size: 2rem;
        }
    }
}

.nohover {
    .btn {
        &:hover {
            background-color: #333;
            color: #fff;
        }
    }
}
</style>