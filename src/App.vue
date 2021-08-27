<template>
  <div id="nav" style="display: flex; align-content: end; align-items: center;">
    <button onclick="dayNightToggle()">Toggle dark mode</button>
    <div v-if=false style="align-items: end;
                align-content: end;
                display: flex;
                margin-left: auto;
                margin-right: 12px;">
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
    </div>
  </div>
  <router-view />
</template>
<style>
#nav a {
  font-weight: 100;

}
#nav a.router-link-exact-active {
  color: #00b0ff;
}
</style>
