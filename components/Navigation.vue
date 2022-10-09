<template>
    <div>
        <nav>
            <Icon :primary="route == '/'" to="/" tooltip="Startseite">home</Icon>
            <Icon :primary="route == '/util/emails'" to="/util/emails" tooltip="E-Mails">mail</Icon>
            <Icon :primary="route == '/util/vertretungsplan'" to="/util/vertretungsplan" tooltip="Vertretungsplan">schedule</Icon>
            <Icon :primary="route == '/util/kalender'" to="/util/kalender" tooltip="Kalender">today</Icon>
            <Icon :primary="route == '/util'" to="/util" tooltip="Alle Angebote">more_horiz</Icon>
            <div @click="openCreate = true"><Icon tooltip="Neues Projekt">add</Icon></div>

            <div class="bottom">
                <Icon :primary="route == '/settings/account'" tooltip="Account">account_circle</Icon>
                <Icon :primary="route == '/settings'" tooltip="Einstellungen">settings</Icon>
                <Icon to="/login" tooltip="Abmelden">exit_to_app</Icon>
            </div>
        </nav>
        <Create @close="openCreate = false" :openCreate="openCreate" />
    </div>
</template>

<script>
import Icon from './assets/icon.vue';
import Create from './Create.vue';

export default {
    name: "Navigation",
    data() {
        return {
            route: this.$route.path,
            openCreate: false
        };
    },
    components: {
        Icon,
        Create
    },
    watch: {
        $route() {
            this.route = this.$route.path;
        }
    }
}
</script>

<style scoped lang="scss">
nav {
    background-color: #333;
    color: #fff;
    padding: 20px;
    width: 80px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: width 0.5s;
    z-index: 1000;

    .bottom {
        position: absolute;
        bottom: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
}
</style>