<template>
    <div class="bg" :class="openCreate?'':'closed'">
        <section>
            <div class="top">
                <div>
                    <div class="title">{{type=='project'?'Neues Projekt':'Neue Arbeitsgemeinschaft'}}</div>
                    <div class="subtitle">{{type=='project'?'Starte eine neue Initiative um das Goethe zu verändern!':'Erstelle deine Arbeitsgemeinschaft (AG) am Goethe Gymnasium!'}}</div>
                </div>
                <div @click="close()"><Icon small secondary>close</Icon></div>
            </div>
            <div class="content">
                <a-radio-group 
                    v-model="type"
                    button-style="solid"
                    size="large"
                    style="width: 100%;"
                >
                    <a-radio-button value="project">Projekt</a-radio-button>
                    <a-radio-button value="organisation">Arbeitsgemeinschaft</a-radio-button>
                </a-radio-group><br><br>
                <a-input v-model="name" :placeholder="type=='project'?'Name des Projektes':'Name der AG z.B. Courage AG'" /><br><br>
                <a-textarea
                    v-model="description"
                    :maxlength="255"
                    :placeholder="type=='project'?'Beschreibe die Idee von dienem Projekt in ein paar Sätzen':'Beschreibe was deine Arbeitsgemeinschaft ausmacht!'"
                    :auto-size="{ minRows: 3, maxRows: 10 }"
                /><br><br>
                <div class="tags" v-if="type=='project'">
                    <a-tag style="cursor: pointer;" :color="tags.includes(tag)?'pink':''" @click="check(tag) == false?tags.push(tag):tags = tags.filter(data => data != tag)" v-for="tag in options" :key="tag.value">{{ tag.label }}</a-tag>
                </div><br>
                <!-- <div class="upload" v-if="type!='project'">
                    <file-select v-model="file">Banner hochladen</file-select><br>
                    <p v-if="file">{{file.name}} <a @click="file = null">entfernen</a></p>
                </div> -->
                <div class="error" v-if="error">
                    {{error}}
                </div>
            </div>
            <div class="bottom">
                <!-- Abbrechen btn -->
                <a-button style="margin-right: 10px;" @click="close()">Abbrechen</a-button>
                <a-button style="background-color: #333; border: none;" :loading="loading" @click="create()" type="primary">{{type=='project'?'Projekt erstellen':'AG erstellen'}}</a-button>
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
            error: null,
            type: "project",
            options: [
                { label: "Für alle", value: "Alle" },
                { label: "Oberstufe", value: "Oberstufe" },
                { label: "Mittelstufe", value: "Mittelstufe" },
                { label: "Aktivität", value: "Aktivität" },
                { label: "Veranstaltung", value: "Veranstaltung" },
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

            if (this.type == 'project') {
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
                }).catch(err => {
                    this.error = err.response.data
                    this.loading = false
                })

                if (req) {
                    this.loading = false
                    this.name = ""
                    this.description = ""
                    this.tags = []
                    this.file = null
                    this.error = null
                    this.$router.push('/ag/' + + '/' + req._id)
                }
            } else {
                const req = await this.$axios.$post('http://localhost:3001/organisations/', {
                    owner: this.$auth.user._id,
                    name: this.name,
                    description: this.description,
                    banner: this.file
                }, {
                    headers: {
                        'x-auth-token': this.$auth.strategy.token.get().replace('Bearer ', '')
                    }
                }).catch(err => {
                    this.error = err.response.data
                    this.loading = false
                })

                if (req) {
                    this.loading = false
                    this.name = ""
                    this.description = ""
                    this.tags = []
                    this.file = null
                    this.error = null
                    this.$router.push('/ag/' + req._id)
                }
            }
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

.error {
    width: 100%;
    padding: 10px;
    background-color: #f5222d;
    color: #fff;
    border-radius: 5px;
    margin-bottom: 10px;
    border: 1px solid #b3232a;
    font-weight: bold;
}
</style>