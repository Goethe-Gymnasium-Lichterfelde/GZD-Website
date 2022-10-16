<template>
    <div class="bg" :class="openCreate?'':'closed'">
        <section>
            <div class="top">
                <div>
                    <div class="title">Neues Projekt</div>
                    <div class="subtitle">Starte eine neue Initiative um das Goethe zu verändern!</div>
                </div>
                <div @click="close()"><Icon small secondary>close</Icon></div>
            </div>
            <div class="content">
                <a-input @value="name" placeholder="Name des Projektes" /><br><br>
                <a-textarea
                    @value="description"
                    placeholder="Beschreibe die Idee von dienem Projekt in ein paar Sätzen"
                    :auto-size="{ minRows: 3, maxRows: 10 }"
                /><br><br>
                <div class="tags">
                    <a-tag style="cursor: pointer;" :color="tags.includes(tag)?'pink':''" @click="check(tag) == false?tags.push(tag):tags = tags.filter(data => data != tag)" v-for="tag in options" :key="tag.value">{{ tag.label }}</a-tag>
                </div><br>
                <div class="upload">
                    <file-select v-model="file">Banner hochladen</file-select><br>
                    <p v-if="file">{{file.name}} <a @click="file = null">entfernen</a></p>
                </div>
            </div>
            <div class="bottom">
                <!-- Abbrechen btn -->
                <a-button style="margin-right: 10px;" @click="close()">Abbrechen</a-button>
                <a-button style="background-color: #333; border: none;" :loading="loading" @click="create()" type="primary">Projekt erstellen</a-button>
            </div>
        </section>
    </div>
</template>

<script>
import Icon from "./assets/icon.vue"
import FileSelect from "./assets/fileSelect.vue"

export default {
    name: "Create",
    components: {
        Icon,
        FileSelect
    },
    props: ['openCreate'],
    data() {
        return {
            name: "",
            description: "",
            tags: [],
            route: this.$route.path,
            loading: false,
            file: null,
            options: [
                { label: "Für alle", value: "Alle" },
                { label: "Oberstufe", value: "Oberstufe" },
                { label: "Mittelstufe", value: "Mittelstufe" },
                { label: "Schulhof", value: "Schulhof" },
                { label: "Turnhalle", value: "Turnhalle" },
                { label: "Gebäude", value: "Gebäude" }
            ],
        }
    },
    methods: {
        check(tag) {
            return this.tags.includes(tag)
        },
        close() {
            this.$emit("close")
        },
        async create() {
            this.loading = true
            const req = await this.$axios.$post('http://localhost:3001/projects/', {
                owner: this.$auth.user._id,
                name: this.name,
                description: this.description,
                tags: this.tags,
                banner: this.file
            }, {
                headers: {
                    'x-auth-token': this.$auth.strategy.token.get().replace('Bearer ', '')
                }
            })
            console.log(req)
        }
    },
    watch: {
        $route() {
            this.route = this.$route.path
            this.$emit("close")
        }
    }
}
</script>

<style scoped lang="scss">
.closed {
    opacity: 0;
    pointer-events: none;
    margin-top: -30px;
}

.bg {
    position: fixed;
    top: 0;
    left: 80px;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.219);
    z-index: 100;
    transition: all 0.3s ease-in-out;
}
section {
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 550px;
    z-index: 1000;
    max-width: calc(100% - 60px);
    max-height: 90vh;
    overflow: auto;

    .top {
        .title {
            font-size: 20px;
            font-weight: 500;
        }
        .subtitle {
            font-size: 14px;
            color: rgb(119, 119, 119);
        }
        display: inline-flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        width: 100%;
        border-bottom: 1px solid #eee;
    }

    .content {
        padding: 20px;

        .ant-tag {
            &:hover {
                border-color: #227b969f;
            }
        }
    }
    
    .bottom {
        padding: 20px;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: flex-end;
    }
}
</style>