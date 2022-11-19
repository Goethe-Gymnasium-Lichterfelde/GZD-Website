<template>
    <div>
        <div class="container">
            <div class="navi">
                <div class="title">Lehrer</div>
                <div class="right">
                    <div class="close" @click="close()">
                        <div class="material-icons">close</div>
                    </div>
                </div>
            </div>
            <div class="content scrollbar">
                <table>
                    <thead>
                        <tr>
                            <th>Kürzel</th>
                            <th>Name</th>
                            <th>E-Mail</th>
                            <th>Aktion</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="position: sticky; top: 0; box-shadow: 0 0 10px -5px black; z-index: 100;">
                            <td>
                                <input type="text" v-model="teacher.kuerzel" placeholder="Kürzel" />
                            </td>
                            <td>
                                <input type="text" v-model="teacher.name" placeholder="Name" />
                            </td>
                            <td>
                                <input type="text" v-model="teacher.email" placeholder="E-Mail" />
                            </td>
                            <td>
                                <button class="button" @click="addTeacher">add</button>
                            </td>
                        </tr>
                        <tr v-for="(teacher, i) in teachers" v-bind:key="i">
                            <td>{{ teacher.abbreviation }}</td>
                            <td>{{ teacher.name }}</td>
                            <td>{{ teacher.email }}</td>
                            <td>
                                <button class="delete" @click="deleteTeacher(teacher._id)">delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'teachers',
    data() {
        return {
            teachers: [],
            teacher: {
                kuerzel: '',
                name: '',
                email: ''
            }
        }
    },
    mounted() {
        this.getTeachers();
    },
    methods: {
        getTeachers() {
            this.$axios.get('http://localhost:3001/teachers', {
                headers: {
                    'x-auth-token': this.$auth.strategy.token.get().slice(7)
                }
            })
                .then(response => {
                    console.log(response.data)
                    this.teachers = response.data
                    this.teachers.sort((a, b) => {
                        if (a.abbreviation < b.abbreviation) {
                            return -1;
                        }
                        if (a.abbreviation > b.abbreviation) {
                            return 1;
                        }
                        return 0;
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        },
        close() {
            this.$emit('closeTeacher')
        },
        addTeacher() {
            this.$axios.post('http://localhost:3001/teachers', {
                abbreviation: this.teacher.kuerzel,
                name: this.teacher.name,
                email: this.teacher.email
            }, {
                headers: {
                    'x-auth-token': this.$auth.strategy.token.get().slice(7)
                }
            })
                .then(response => {
                    this.teacher = {
                        kuerzel: '',
                        name: '',
                        email: ''
                    }
                    this.getTeachers()
                })
                .catch(error => {
                    console.log(error)
                })
        },
        deleteTeacher(id) {
            console.log(id)
            this.$axios.delete('http://localhost:3001/teachers/' + id, {
                headers: {
                    'x-auth-token': this.$auth.strategy.token.get().slice(7)
                }
            })
                .then(response => {
                    this.getTeachers()
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
}
</script>

<style scoped lang="scss">
.container {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1000px;
    max-width: 100vw;
    height: 90vh;
    max-height: 100%;
    background-color: #fff;
    z-index: 10000;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    border-radius: 5px;
    animation: fadeIn 0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
    overflow: hidden;

    @keyframes fadeIn {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
        }
        60% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.04);
        }
        100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
    }

    .navi {
        width: 100%;
        height: 50px;
        border-bottom: 1px solid #ccc;
        display: inline-flex;
        align-items: center;
        overflow: hidden;

        .title {
            font-size: 20px;
            font-weight: 500;
            padding-left: 20px;
            flex: 1;
        }

        .right {
            margin-left: auto;
            display: inline-flex;
            align-items: center;

            .close {
                width: 50px;
                height: 50px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: 0.2s;

                &:hover {
                    background-color: #eee;
                }

                .material-icons {
                    font-size: 20px;
                }
            }
        }
    }

    .content {
        width: 100%;
        height: calc(100% - 50px);
        overflow: auto;
        position: relative;

        table {
            width: 100%;
            border-collapse: collapse;

            thead {
                background-color: #eee;

                th {
                    padding: 10px;
                    text-align: left;
                }
            }

            tbody {
                tr {
                    &:nth-child(odd) {
                        background-color: #f5f5f5;
                    }

                    td {
                        padding: 10px;

                        input {
                            width: 100%;
                            border: 0;
                            outline: 0;
                            padding: 5px;
                            font-size: 14px;
                            border-radius: 5px;
                            transition: 0.2s;
                            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);

                            &:focus {
                                box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                            }
                        }

                        button {
                            width: 100%;
                            border: 0;
                            outline: 0;
                            padding: 5px;
                            font-size: 14px;
                            border-radius: 5px;
                            transition: 0.2s;
                            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                            background-color: #fff;
                            cursor: pointer;

                            &:hover {
                                box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                            }
                        }

                        .delete {
                            background-color: #f44336;
                            color: #fff;

                            &:hover {
                                background-color: #d32f2f;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>