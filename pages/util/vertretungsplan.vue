<template>
    <div>
        <div class="bar">
            <div class="bar_cont" v-if="!loading">
                <div class="btn" v-for="(pl, i) of data" v-bind:key="i" v-on:click="day = i" :class="day == i?'selected':''">{{pl.title}}</div>
                <div class="allgbtn">
                    <div class="material-icons">filter_alt</div>
                </div>
                <div class="btn" v-on:click="selectedLehrer = []">Alle Filter löschen</div>
                <div class="dropdown">
                    <span>Lehrer</span>
                    <div class="dropdown-content scrollbar">
                        <div 
                            class="dropdown-item" 
                            v-for="(lr, i) of lehrer" 
                            v-bind:key="i"
                            v-on:click="selectedLehrer.includes(lr)?selectedLehrer = selectedLehrer.filter(data => data != lr):selectedLehrer.push(lr)"
                            :class="selectedLehrer.includes(lr)?'isselected':''"
                            >
                            {{lr}}
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        <div class="cl_cont">
            <div class="class" v-for="(clas, i) of classes" v-bind:key="i">
                <div class="top">{{ clas.name }}</div>
                <div class="bottom" v-if="!loading">
                    <div
                        class="hour"
                        v-for="(hour, j) of getdata(clas.class)"
                        v-bind:key="j"
                        :class="
                            (hour.art.includes('Vertr.')) ? 'vertretung' :
                            (hour.art == 'Entfall' || hour.art == 'EVA') ? 'entfall' :
                            (hour.art == 'Mitbetr.') ? 'mitbetreten' :
                            (hour.art == 'Raum�nd.') ? 'raumaenderung' : 
                            (hour.art.includes('Veranst.')) ? 'mitbetreten' : 
                            (hour.art == 'Verlegung') ? 'mitbetreten' : ''
                        "
                    >
                        <div class="oneline">
                            <div class="raumeanderung" v-if="hour.art == 'Raum�nd.' || !hour.neuerRaum.includes('---')">{{hour.neuerRaum}}</div>
                            <div class="klasse" v-if="!hour.klasse.includes('11') && !hour.klasse.includes('12')">{{hour.klasse}}</div>
                            <div class="stunde" :style="hour.fach == '---'? 'margin: 0;':''">{{hour.stunde}} Stunde</div>
                            <div class="fach" v-if="hour.fach != '---' && hour.fach != ' '" :style="(hour.klasse.includes('11') || hour.klasse.includes('12'))?'width: 100%;':''">
                                {{(hour.klasse.includes('11') || hour.klasse.includes('12'))?convFach(hour.fach):hour.fach}}
                            </div>
                        </div>
                        <div class="oneline">
                            <div class="abwesend"><div class="type">Abwesend</div> {{hour.abwesend}}</div>
                            <div class="vertreter"><div class="type">Vertretung</div> {{hour.vertreter}}</div>
                        </div>
                        <div class="info">{{hour.bemerkung}}</div>
                        <div class="art">
                            {{
                                hour.art=='Raum�nd.'?'Raumänd.':
                                hour.art=='Unterricht ge�ndert'?'Unterricht geändert':
                                hour.art
                            }}
                        </div>
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
            loading: true,
            day: 0,
            klassen: [],
            lehrer: [],
            selectedLehrer: [],
            databackup: []
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
                this.data = res.data.reverse()
                this.databackup = res.data.reverse()
                console.log(this.data)
                this.loading = false
            })
            .catch((err) => {
                console.log(err)
            })
    },
    methods: {
        getdata: function (clas) {
            const sheet = this.data[this.day]
            if (!sheet) return []
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
                // If the teacher isn't in the lehrer array, add it except if it includes "---" or "???"
                if (!this.lehrer.includes(plan.abwesend) && !plan.abwesend.includes('---') && !plan.abwesend.includes('???') && !plan.abwesend.includes('+') && !plan.abwesend.includes(' ')) this.lehrer.push(plan.abwesend)
            }

            console.log(this.lehrer)
            return allhours
        },
        convFach: function (fach) {
            fach = fach.replace(/[0-9]/g, '')
            if (fach.startsWith('G')) fach = fach.slice(1)
            if (fach.startsWith('L')) fach = 'LK ' + fach.slice(1)
            return fach
        }
    },
    watch: {
        selectedLehrer: function () {
            this.data = this.databackup
            if (this.selectedLehrer.length > 0) {
                let newdata = []
                for (let i = 0; i < this.data.length; i++) {
                    let sheet = this.data[i]
                    let newplan = []
                    for (let j = 0; j < sheet.plan.length; j++) {
                        let plan = sheet.plan[j]
                        if (this.selectedLehrer.includes(plan.abwesend)) newplan.push(plan)
                    }
                    newdata.push({
                        date: sheet.date,
                        title: sheet.title,
                        plan: newplan
                    })
                }
                this.data = newdata
            }
        }
    }
}
</script>

<style scoped lang="scss">
.bar {
    height: 50px;
    width: 100%;
    z-index: 100;
    border-bottom: 1px solid #33333366;
    display: inline-flex;
    align-items: center;

    .bar_cont {
        width: 100%;
        height: 100%;
        display: inline-flex;
        align-items: center;
    }

    .btn {
        height: 100%;
        width: 212px;
        display: grid;
        place-items: center;
        border-right: 1px solid #33333366;
        cursor: pointer;
        transition: all 0.1s;
        font-weight: 600;
        animation: fadein 0.5s;

        &:hover {
            background-color: #33333322;
        }

        &.selected {
            border-bottom: 2px solid #333333;
        }
    }

    .allgbtn {
        aspect-ratio: 1/1;
        height: 100%;
        display: grid;
        place-items: center;
        border-right: 1px solid #33333366;
        // cursor: pointer;
    }

    .dropdown {
        position: relative;
        display: inline-block;
        padding: 0 30px;
        height: 100%;
        display: grid;
        place-items: center;
        border-right: 1px solid #33333366;
        cursor: pointer;
        transition: all 0.1s;

        &:hover {
            background-color: #33333322;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #f9f9f9;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            z-index: 20;
            animation: fadein 0.5s;
            top: 100%;
            left: 0;
            max-height: calc(100vh - 100px);
            overflow-y: auto;

            .dropdown-item {
                color: black;
                padding: 12px 16px;
                text-decoration: none;
                display: block;
                cursor: pointer;
                transition: all 0.1s;

                &.isselected {
                    background-color: #33333333;
                }

                &:hover {
                    background-color: #33333322;
                }
            }
        }

        &:hover .dropdown-content {
            display: block;
        }
    }
}
.cl_cont {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    transition: all 0.5s;

    .class {
        width: 30%;
        min-height: 100vh;
        border-right: 1px solid #33333366;
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
            z-index: 10;
            top: 0;
        }

        .bottom {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow-y: hidden;

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
                    background-color: rgba(0, 0, 255, 0.1);
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

                    .raumeanderung {
                        font-weight: 600;
                        background-color: white;
                        padding: 5px 10px;
                        border-radius: 5px;
                        margin-right: 5px;
                        white-space: nowrap;
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
                        // Rest elipses
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .fach {
                        font-weight: 600;
                        background-color: white;
                        padding: 5px 10px;
                        border-radius: 5px;
                        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                        text-transform: uppercase;
                        font-weight: bold;
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