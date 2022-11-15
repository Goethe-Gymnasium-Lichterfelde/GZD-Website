<template>
    <div>
        <div class="cl_cont">
            <div class="class" v-for="(clas, i) of classes" v-bind:key="i">
                <div class="top">{{ clas.name }}</div>
                <div class="bottom" v-if="!loading">
                    <div
                        class="hour"
                        v-for="(hour, j) of getdata(clas.class)"
                        v-bind:key="j"
                        :class="
                            (hour.art == 'Vertr.') ? 'vertretung' :
                            (hour.art == 'Entfall' || hour.art == 'EVA') ? 'entfall' :
                            (hour.art == 'Mitbetr.') ? 'mitbetreten' :
                            (hour.art == 'Raum�nd.') ? 'raumaenderung' : ''
                        "
                    >
                        <div class="oneline">
                            <div class="klasse" v-if="hour.klasse != 11 && hour.klasse != 12">{{hour.klasse}}</div>
                            <div class="stunde">{{hour.stunde}} Stunde</div>
                            <div class="fach" :style="(hour.klasse == 11 || hour.klasse == 12)?'width: 100%;':''">{{hour.fach}}</div>
                        </div>
                        <div class="oneline">
                            <div class="abwesend"><div class="type">Abwesend</div> {{hour.abwesend}}</div>
                            <div class="vertreter"><div class="type">Vertretung</div> {{hour.vertreter}}</div>
                        </div>
                        <div class="info">{{hour.bemerkung}}</div>
                        <div class="art">{{hour.art=='Raum�nd.'?'Raumänd.':hour.art}}</div>
                    </div>    
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
            classes: [
                {
                    class: 7,
                    name: '7. Klassen',
                    hours: []
                },
                {
                    class: 8,
                    name: '8. Klassen',
                    hours: []
                },
                {
                    class: 9,
                    name: '9. Klassen',
                    hours: []
                },
                {
                    class: 10,
                    name: '10. Klassen',
                    hours: []
                },
                {
                    class: 11,
                    name: 'Q1',
                    hours: []
                },
                {
                    class: 12,
                    name: 'Q3',
                    hours: []
                }
            ],
            data: [],
            loading: true
        }
    },
    mounted() {
        // Fetch "api.togert.org/dsb/plan"
        this.$axios.get('http://localhost:3001/dsb/plan', {
            headers: {
                'x-auth-token': this.$auth.strategy.token.get().slice(7)
            }
        })
            .then((res) => {
                this.data = res.data
                console.log(this.data)
                this.loading = false
            })
            .catch((err) => {
                console.log(err)
            })
    },
    methods: {
        getdata: function (clas) {
            const sheet = this.data.find((plan) => plan.name === 'Schüler heute')
            let allhours = []
            for (let i = 0; i < sheet.plan.length; i++) {
                let plan = sheet.plan[i]
                let klassen = []
                if (plan.klasse.includes(',')) klassen = plan.klasse.split(',')
                else klassen.push(plan.klasse)
                for (let j = 0; j < klassen.length; j++) {
                    if (klassen[j].includes(clas)) {
                        allhours.push(plan)
                        break
                    }
                }
            }

            return allhours
        }
    }
}
</script>

<style scoped lang="scss">
.cl_cont {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    .class {
        width: 30%;
        min-height: 100vh;
        border-right: 1px solid rgba(51, 51, 51, 0.4);
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .top {
            width: 100%;
            background-color: white;
            border-bottom: 1px solid rgba(51, 51, 51, 0.4);
            padding: 10px;
            display: grid;
            place-items: center;
            font-size: 1.2rem;
            font-weight: 600;
            position: sticky;
            top: 0;
        }

        .bottom {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow-y: auto;

            .hour {
                width: calc(100%);
                padding: 10px;
                animation: fadein 0.5s;
                border-bottom: 1px solid rgba(51, 51, 51, 0.2);
                position: relative;

                @keyframes fadein {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                &.entfall {
                    background-color: rgba(255, 0, 0, 0.2);
                }
                &.vertretung {
                    background-color: rgba(0, 255, 0, 0.2);
                }
                &.mitbetreten {
                    background-color: rgba(0, 0, 255, 0.2);
                }
                &.raumaenderung {
                    background-color: rgba(255, 255, 0, 0.2);
                }

                .oneline {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                    
                    .klasse {
                        font-weight: 600;
                        background-color: white;
                        padding: 5px 10px;
                        border-radius: 5px;
                        margin-right: 5px;
                        width: 100%;
                        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                    }

                    .stunde {
                        font-weight: 600;
                        background-color: white;
                        padding: 5px 10px;
                        border-radius: 5px;
                        margin-right: 5px;
                        width: 100%;
                        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                    }

                    .fach {
                        font-weight: 600;
                        background-color: white;
                        padding: 5px 10px;
                        border-radius: 5px;
                        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                    }

                    .abwesend {
                        font-weight: 600;
                        background-color: white;
                        padding: 5px 10px;
                        border-radius: 5px;
                        margin-right: 5px;
                        width: 50%;
                        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                    }

                    .vertreter {
                        font-weight: 600;
                        background-color: white;
                        padding: 5px 10px;
                        border-radius: 5px;
                        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                        width: 50%;
                    }
                    .type {
                        font-size: 10px;
                    }
                }

                .art {
                    position: absolute;
                    bottom: 10px;
                    right: 10px;
                    font-size: 0.8rem;
                }
            }
        }
    }
}
</style>