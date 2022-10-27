<template>
    <div class="container">
        <div class="folders">
            <div class="top">
                <div class="mail">mateo.meillon</div>
                <div class="options">
                    <!-- <div :class="sync?'syncing':''"><Icon small>sync</Icon></div> -->
                    <Icon small>more_vert</Icon>
                </div>
            </div>
            <div class="allfolders">
                <div class="fol" style="position: relative;" @click="selectedFolder='INBOX'">
                    <folder :selected="selectedFolder=='INBOX'" name="Inbox"/>
                    <div class="unread" :style="unreadMails > 0?'opacity: 100%;':'opacity: 0%;'">
                        {{unreadMails}}
                    </div>
                </div>
                <div class="fol" @click="selectedFolder='Sent Items'">
                    <folder :selected="selectedFolder=='Sent Items'" name="Gesendet" />
                </div>
                <div class="fol" @click="selectedFolder='Drafts'">
                    <folder :selected="selectedFolder=='Drafts'" name="Entwürfe" />
                </div>
                <div class="fol" @click="selectedFolder='Deleted Items'">
                    <folder :selected="selectedFolder=='Deleted Items'" name="Mülleimer"/>
                </div>
                <div class="fol" @click="selectedFolder='Junk E-Mail'">
                    <folder :selected="selectedFolder=='Junk E-Mail'" name="Spam"/>
                </div>
            </div>
        </div>
        <div class="emails">
            <div class="top">
                <div class="title">
                    <div class="name">{{
                        selectedFolder=='INBOX'?'Inbox':
                        selectedFolder=='Sent Items'?'Gesendet':
                        selectedFolder=='Drafts'?'Entwürfe':
                        selectedFolder=='Deleted Items'?'Mülleimer':
                        selectedFolder=='Junk E-Mail'?'Spam':
                        selectedFolder
                    }}</div>
                </div>
                <div class="options">
                    <Icon primary small nohover>search</Icon>
                </div>
            </div>
            <div ref="mails" class="mails scrollbar" v-if="emails != null">
                <div 
                    v-for="email in emails" 
                    :key="email.uid" 
                    @click="mail = email"
                    class="mail_cont"
                    :class="mail!=null?(email.uid==mail.uid?'selected':''):''"
                >
                    <preview :read="email.flags.includes('\\Seen')" :email="email" :open="email.uid==selectedEmail.uid" />
                </div>
            </div>
        </div>
        <div class="preview" v-if="mail != null">
            <div class="top">
                <div class="leftoptions">
                    <div @click="mail = null"><Icon primary small nohover tooltipPosition="bottom" tooltip="Schließen">close</Icon></div>
                </div>
                <div class="options">
                    <Icon primary small nohover tooltipPosition="bottom" tooltip="Antworten">reply</Icon>
                    <Icon primary small nohover tooltipPosition="bottom" tooltip="Allen antworten">reply_all</Icon>
                    <Icon primary small nohover tooltipPosition="bottom" tooltip="Weiterleiten">forward</Icon>
                    <Icon primary small nohover tooltipPosition="bottom" tooltip="Löschen">delete</Icon>
                </div>
            </div>
            <div class="mail">
                <div class="header">
                    <div class="conta">
                        <div v-for="fr in mail.from.value" v-bind:key="fr" class="name">{{fr.name==null?fr.address:fr.name}}</div>
                        <div class="date">{{new Date(mail.date).toLocaleString()}}</div>
                        <div class="subject">{{mail.subject}}</div>
                    </div>
                </div>
                <div class="content">
                    <div class="contb" v-html="mail.html!=false?mail.html:mail.textAsHtml"></div>
                </div>
            </div>
        </div>
        <div class="passwordInput" v-if="showPasswordInput">
            <div class="title">Passwort eingeben</div>
            <div class="subtitle">{{sync?'Synchronisieren...':'Bitte gib dein Kopano Passwort ein, um deine E-Mails zu synchronisieren.'}}</div>
            <div class="input" v-if="sync == false">
                <input type="password" v-model="password" placeholder="Passwort" />
                <div class="button" @click="setPw">Synchronisieren</div>
            </div>
        </div>
    </div>
</template>

<script>
import Icon from '~/components/assets/icon.vue'
import io from 'socket.io-client'
import folder from '~/components/email/folder.vue'
import preview from '~/components/email/preview.vue'

export default {
    name: "EMails",
    data() {
        return {
            sync: false,
            socket: null,
            password: '',
            showPasswordInput: false,
            boxes: null,
            selectedFolder: 'INBOX',
            emails: [],
            page: 0,
            perPage: 20,
            selectedEmail: {},
            unreadMails: 0,
            mail: null,
            loading: false
        }
    },
    middleware: 'auth',
    components: { 
        Icon,
        folder,
        preview
    },
    methods: {
        async setPw() {
            this.sync = true;
            const req = await this.$axios.post('http://localhost:3001/mail/setpw', {
                password: this.password
            }, {
                headers: {
                    'x-auth-token': this.$auth.strategy.token.get().slice(7)
                }
            })

            if (req.status == 200) {
                this.showPasswordInput = false
                this.sync = false
                this.syncMails()
            }
        },
        async getMails() {
            this.loading = true
            this.socket.emit('folder', {
                folder: this.selectedFolder,
                page: this.page,
                perPage: this.perPage
            })
        }
    },
    mounted() {
        this.emails = []
        this.loading = true
        this.socket = io('http://localhost:3050', {
            query: {
                token: this.$auth.strategy.token.get().slice(7)
            }
        })

        this.socket.on('email', (mail) => {
            if (mail.folder != this.selectedFolder)
                return
            const parser = new DOMParser()
            const doc = parser.parseFromString((mail.html==false?mail.textAsHtml:mail.html), 'text/html')
            const anchors = doc.getElementsByTagName('a')
            for (let i = 0; i < anchors.length; i++)
                anchors[i].setAttribute('target', '_blank')
            mail.html==false?(mail.textAsHtml = doc.body.innerHTML):(mail.html = doc.body.innerHTML)
            this.emails.push(mail)
            this.emails = this.emails.sort((a, b) => {
                return new Date(b.date) - new Date(a.date)
            })
        })

        this.socket.on('error', (err) => {
            console.log(err)
            if (err == "0x01")
                this.showPasswordInput = true
        })

        this.socket.on('unread', (data) => {
            this.unreadMails = data
        })

        this.$refs.mails.addEventListener('scroll', (e) => {
            if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight) {
                if (this.loading == true)
                    return
                this.page++
                this.getMails()
            }
        })

        this.socket.on('end', () => {
            this.loading = false
        })
    },   
    watch: {
        selectedFolder() {
            this.emails = []
            this.page = 0
            this.getMails()
        }
    }
}
</script>

<style scoped lang="scss">
.unread {
    position: absolute;
    z-index: 2;
    top: 50%;
    transform: translateY(-50%);
    right: 10px;
    background: rgb(63, 63, 63);
    color: white;
    font-weight: bold;
    padding: 0 15px;
    height: 30px;
    display: grid;
    place-items: center;
    border-radius: 60px;
    transition: all 0.2s ease;
}

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

            .leftoptions {
                position: absolute;
                left: 10px;
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
        width: 420px;
        background-color: #f5f5f5;
        // box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        border-right: 1px solid #ddd;
        height: 100vh;

        .top {
            height: 50px;
            position: relative;
            display: inline-flex;
            align-items: center;
            padding: 0 20px;
            width: 100%;
            border-bottom: 1px solid #ddd;

            .title {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            .options {
                position: absolute;
                right: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
        }

        .mails {
            height: calc(100% - 50px);
            overflow-y: auto;

            .mail_cont {
                transition: all 0.1s ease;
            }

            .selected {
                // border-left: 4px solid #2d2d2d;
                // background-color: #e4e4e4;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

                .container {
                    &:hover {
                        background-color: #e4e4e4 !important;
                    }
                }
            }
        }
    }

    .preview {
        width: calc(100vw - 80px - (420px + 319.317px));
        background-color: #fff;
        height: 100vh;
        animation: fadeIn 0.2s ease-in-out;
        animation-fill-mode: forwards;

        @keyframes fadeIn {
            0% {
                opacity: 0;
                transform: translateX(20px);
            }
            100% {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .top {
            height: 50px;
            position: relative;
            display: inline-flex;
            align-items: center;
            width: 100%;
            border-bottom: 1px solid #ddd;

            .title {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            .name {
                font-weight: bold;
                margin-left: 20px;
                padding-top: 5px;
            }

            .options {
                position: absolute;
                right: 10px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
        }

        .mail {
            height: calc(100vh - 50px);
            width: 100%;

            .header {
                width: 100%;

                .conta {
                    width: 100%;
                    border-bottom: 1px solid #ddd;
                    padding: 20px;
                }
            }

            .content {
                width: 100%;
                padding: 20px;

                .contb {
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                }
            }
        }
    }

    .passwordInput {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        z-index: 100;

        .title {
            font-size: 1.5rem;
            color: #fff;
            font-weight: 700;
        }

        .subtitle {
            font-size: 1rem;
            color: #fff;
            font-weight: 400;
            margin-bottom: 20px;
        }

        .input {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 400px;

            input {
                width: 100%;
                height: 40px;
                border: 1px solid #fff;
                border-radius: 5px;
                padding: 0 10px;
                color: #fff;
                background-color: transparent;
                font-size: 1rem;
                font-weight: 400;
                outline: none;
            }

            .button {
                height: 40px;
                border: 1px solid #fff;
                border-radius: 5px;
                padding: 0 10px;
                color: #fff;
                background-color: transparent;
                font-size: 1rem;
                font-weight: 400;
                outline: none;
                margin-left: 10px;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease-in-out;

                &:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                }
            }
        }
    }
}

.material-icons {
    position: absolute;
    left: 50%;
    margin-top: 50px;
    transform: translate(-50%, 0);
    font-size: 3rem;
    color: #2d2d2d;

    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: translate(-50%, 0) rotate(0deg);
    }
    100% {
        transform: translate(-50%, 0) rotate(-360deg);
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