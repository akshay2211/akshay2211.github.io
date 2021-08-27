<template>
  <div class="home">
  <div class="container vertical-center">
      <div class="row spacing">
          <img class="center col-10 col-sm-10 col-lg-5 col-md-5 spacing" src="img/user.svg">
          <div class="col-10 col-sm-10 col-lg-7 col-md-7 center spacing">
              <h1>Hi, i am Akshay</h1>
              <p class="title-desc center">Opensource Enthusiast, Software architect and User Experience Designer</p>
              <div class="col-md-6 col-sm-7 center">
                  <div class="row" id="social-list">
                    <a v-for="(tag, i) in socialtags"
                                   :key="i"
                                   class="center" :href=tag.link> <img class="center" style="padding: 5px!important;width: 40px;" :src=tag.img></a>

                  </div>
              </div>
          </div>
      </div>
  </div>
  </div>
</template>

<script>
export default {
  data(){
    return {

   socialtags : [{
       img: "img/github.svg",
       link: "https://github.com/akshay2211"
   }, {
       img: "img/linkedin.svg",
       link: "https://www.linkedin.com/in/akshay-sharma-80478448/"
   }, {
       img: "img/gitlab.svg",
       link: "https://gitlab.com/akshay2211"
   }, {
       img: "img/twitter.svg",
       link: "https://twitter.com/_akshay22"
   }]
    }
  }}
</script>
