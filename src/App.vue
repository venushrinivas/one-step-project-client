<template>
    <nav class="navbar navbar-height navbar-expand-md navbar-light bg-light fixed-top"
         :class="{ 'navbar-expanded': navOpen }">
        <div class="container-fluid">
            <router-link class="navbar-brand" to="/">
                <img width="250px" height="45px" class="one-step-logo" alt="OneStepGps Logo" id="logo-mark"
                     src="https://www.onestepgps.com/images/onestepgps_color_logotype.svg">
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation" @click="toggleNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/preferences">Preferences</router-link>
                    </li>
                </ul>
            </div>
        </div>

    </nav>
    <router-view></router-view>
</template>

<script>

export default {
    name: 'App',
    components: {},
    data() {
        return {
            navOpen: false,
        }
    },
    methods: {
        toggleNav() {
            this.navOpen = !this.navOpen
        }
    }
}
</script>

<style>
.one-step-logo {
    width: 250px;
    height: 45px;
}

html,
.app,
body,
.container-fluid {
    height: 100%;
}

.navbar-height {
    height: 10%;
}

.navbar-expand-md.navbar-expanded {
    height: 20%;
}

@media (min-width: 768px) {
    .navbar-expand-md.navbar-expanded {
        height: 10%;
    }
}
</style>
