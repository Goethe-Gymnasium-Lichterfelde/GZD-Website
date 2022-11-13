<template>
    <div>
        <div class="top">

        </div>
        <div class="container">
            <div class="cont stundenplan">
                <div class="days">
                    <div 
                        class="day"
                        v-for="(day, index) in days"
                        :key="index"
                        >
                            {{ day }}
                    </div>
                </div>
                <div class="rows">
                    <div 
                        class="row"
                        v-for="(row, index) in rows"
                        :key="index"
                        >

                    </div>
                </div>
            </div>
            <div class="cont vertretungen">

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
            tables: [],
            days: [
                'Montag',
                'Dienstag',
                'Mittwoch',
                'Donnerstag',
                'Freitag'
            ],
            rows: [
                [],[],[],[],[]
            ]
        }
    },
    mounted() {
        // Fetch "api.togert.org/dsb/plan"
        this.$axios.get('http://localhost:3001/dsb/plan', {
            headers: {
                'x-auth-token': this.$auth.strategy.token.get().slice(7)
            }
        })
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
.top {
    height: 60px;
    // box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
    background-color: #333;
    color: #fff;
    display: inline-flex;
    align-items: center;
    padding: 0 20px;
    width: 100%;
}

.container {
    width: 100%;
    display: inline-flex;
    align-items: center;
    height: calc(100vh - 100px);

    .cont {
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: #fff;
        border-radius: 4px;
        margin: 0 10px;
    }

    .stundenplan {
        background-color: #e9e9e9;
        border-radius: 10px;

        .days {
            display: inline-flex;
            align-items: center;
            width: 100%;

            .day {
                width: 100%;
                padding: 10px 0 5px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                font-weight: 500;
                background-color: #e0e0e0;
            }
        }

        .rows {
            display: inline-flex;
            width: 100%;

            .row {
                width: 100%;
                height: 100%;
                background-color: rgb(136, 51, 51);
            }
        }
    }

    .vertretungen {
        background-color: #fff;
    }
}

@media only screen and (max-width: 768px) {
    .container {
        flex-direction: column;

        .stundenplan {
            width: 100%;
            margin-bottom: 20px;
        }

        .vertretungen {
            width: 100%;
            margin-left: 0;
        }
    }
}

</style>