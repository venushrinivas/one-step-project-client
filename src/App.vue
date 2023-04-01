<template>
  <nav class="navbar navbar-expand-md navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <img width="250px" height="45px" class="one-step-logo" alt="OneStepGps Logo" id="logo-mark"
                                            src="https://www.onestepgps.com/images/onestepgps_color_logotype.svg">
      </router-link>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
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
  components: {}
}
</script>

<style>
.one-step-logo {
  width: 250px;
  height: 45px;
}
</style>
