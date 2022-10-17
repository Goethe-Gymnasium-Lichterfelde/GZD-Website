<template>
    <div>
        <div class="tables">
            <div v-for="(table, index) in tables" v-bind:key="index" class="table">
                <div class="top">
                    <div class="title">{{ table.name }}</div>
                    <div class="date">geändert: {{ table.date }}</div>
                </div>
                <div class="af" v-for="(plan, index) in table.plan" v-bind:key="index" :class="plan.klasse=='Idle'?'idle':''">
                    <div class="klasse">{{plan.klasse}}</div>
                    <div class="stunde">{{plan.stunde}}</div>
                    <div class="fach">{{plan.fach!=plan.fachInKlammern&&plan.fach!='---'?plan.fach:plan.fachInKlammern}}</div>
                    <div class="raum">{{plan.neuerRaum}}</div>
                    <div class="art"
                        :class="[
                            (plan.art=='Entfall'||plan.art=='EVA'?'ent':''),
                            (plan.art=='Vertretung'?'ver':''),
                            (plan.art=='Raum�nd.'?'ran':''),
                            (plan.art=='Vertr.'?'ver':''),
                            (plan.art=='Veranst.'?'anst':''),
                            (plan.art=='Verlegung'?'vel':''),
                        ]"
                    >{{plan.art=='Raum�nd.'?'Raumänd.':plan.art}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Vertretungsplan',
    middleware: 'auth',
    data() {
        return {
            tables: []
        }
    },
    mounted() {
        // Fetch "api.togert.org/dsb/plan"
        this.$axios.get('http://localhost:3001/dsb/plan')
            .then((response) => {
                // Set tables to response.data
                this.tables = response.data
                let maxLen = 0
                for (let i = 0; i < this.tables.length; i++) {
                    if (this.tables[i].plan.length > maxLen) {
                        maxLen = this.tables[i].plan.length
                    }
                }
                // make all tables to max length
                for (let i = 0; i < this.tables.length; i++) {
                    while (this.tables[i].plan.length < maxLen) {
                        this.tables[i].plan.push({
                            klasse: 'Idle',
                            stunde: '',
                            fach: '',
                            fachInKlammern: '',
                            neuerRaum: '',
                            art: ''
                        })
                    }
                }
                console.log(this.tables)
                
            })
    },
}
</script>

<style scoped lang="scss">
.tables {
    position: fixed;
    top: 0;
    left: 80px;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .table {
        height: 100vh;
        width: 50%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        .top {
            width: 100%;
            height: 62px;
            background-color: #1e1e1e;
            padding: 10px 0 0 15px;
            .title {
                font-size: 20px;
                font-weight: 500;
                color: #fff;
                margin-right: 10px;
            }
            .date {
                font-size: 12px;
                font-weight: 500;
                color: rgba(255, 255, 255, 0.7);
                margin-top: -5px;
            }
        }

        .af {
            width: 50%;
            display: inline-flex;
            align-items: center;
            padding: 0 30px;
            // border: 1px solid rgba(51, 51, 51, 0.1);
            position: relative;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            border-bottom: 1px solid rgba(51, 51, 51, 0.1);
            border-right: 1px solid rgba(51, 51, 51, 0.1);
            
            &:hover {
                background-color: rgba(51, 51, 51, 0.1);
            }

            .klasse {
                width: 20%;
                font-size: 1.2em;
                font-weight: 500;
                color: #333;

                // Overflow ellipsis
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .stunde {
                width: 20%;
                font-size: 1.2em;
                font-weight: 500;
                color: #333;
            }

            .fach {
                width: 30%;
                font-size: 1.2em;
                font-weight: 500;
                color: #333;
            }

            .raum {
                width: 20%;
                font-size: 1.2em;
                font-weight: 500;
                color: #333;
            }

            .art {
                position: absolute;
                right: 5px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2em;
                font-weight: 500;
                padding: 5px 10px;
                max-width: 20%;
                color: #fff;
                border-radius: 10px;
                background: #333;

                // Overflow ellipsis
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;

                &.ent {
                    background: #e74c3c;
                }

                &.ver {
                    background: #2ecc71;
                }

                &.ran {
                    background: #3498db;
                }

                &.vel {
                    background: #f1c40f;
                }

                &.anst {
                    background: #9b59b6;
                }
            }
        }
    }
}

.abheben {
    background-color: rgb(241, 241, 241);
}
.idle {
    .klasse {
        opacity: 0;
    }
    .art {
        display: none !important;
    }
}
</style>