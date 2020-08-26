
/*
 *
 * akshay sharma 
 * fxn769@gmail.com
 * 5/7/2020
 * 
 */

 var mydata = 
 [   {
    title:"Pix (WhatsApp Style Image and Video Picker)",
    desc:"Pix is a Whatsapp image picker replica. with this you can integrate a image picker just like whatsapp.",
    img:"https://raw.githubusercontent.com/akshay2211/PixImagePicker/master/media/media-tilt.png",
    link:"https://github.com/akshay2211/PixImagePicker"
},
{
    title:"BubbleTabBar",
    desc:"BubbleTabBar is bottom navigation bar with customizable bubble like tabs.",
    img:"https://raw.githubusercontent.com/akshay2211/BubbleTabBar/master/media/animation.gif",
    link:"https://github.com/akshay2211/BubbleTabBar"
},
{
    title:"Oblique",
    desc:"With Oblique explore new styles of displaying images.",
    img:"https://raw.githubusercontent.com/akshay2211/Oblique/master/media/media_1.gif",
    link:"https://github.com/akshay2211/Oblique"
},
{
    title:"MusicWave",
    desc:"With MusicWave represent your Sound in a gradient colored Visualization.",
    img:"https://raw.githubusercontent.com/akshay2211/MusicWave/master/media/musicwave_web.png",
    link:"https://github.com/akshay2211/MusicWave"
},
{
    title:"Ariana",
    desc:"Provide Multiple Gradients in ImageViews and Texts",
    img:"https://raw.githubusercontent.com/akshay2211/Ariana/master/media/web_256.png",
    link:"https://github.com/akshay2211/Ariana"
}
]



function loadJSON() {
var text = ""

    for (x in mydata) {
var data = `<a  style="color: black;" href="`+mydata[x].link+`">
<div class="pure-g">
<div class="pure-u-4-24"></div>
<div class="pure-u-16-24 center">
    <div class="pure-g" style="padding-bottom: 15%!important;">

    <div class="pure-u-1 pure-u-md-1-2 pure-u-lg-1-2 center">
        <div class="pure-u-1 center">
        <h1 style="padding-top: 5%!important; font-weight: 200;" class="center">`+mydata[x].title+`</h1>
        <p 
        style="
        padding-top: 5%!important;
        margin-bottom: 30px;
        font-weight: 200;"
        class="center"
        >`+mydata[x].desc+`</p>

    </div>
    
    </div>
    <img class="pure-img center" style="max-height: 250px;" src="`+mydata[x].img+`">
</div>
</div>
<div class="pure-u-4-24"></div>
</div>
</a>
`
text += data;
      } 
    console.log(""+text);
    document.getElementById("contentlist").innerHTML = text;

 }


 var socialtags = 
[   {
    img  : "img/github.svg",
    link : "https://github.com/akshay2211"
},   {
    img  : "img/linkedin.svg",
    link : "https://www.linkedin.com/in/akshay-sharma-80478448/"
},   {
    img  : "img/gitlab.svg",
    link : "https://gitlab.com/akshay2211"
},   {
    img  : "img/twitter.svg",
    link : "https://twitter.com/_akshay22"
}]



 function loadSocialIcons(){
     var socialtext = ""
     for (x in socialtags) {
         var data  = `<a class="center" href="`+socialtags[x].link+`"> <img class="center" style="padding: 5px!important;width: 40px;" src="`+socialtags[x].img+`"></a>`
         socialtext +=data
     }
     document.getElementById("social-list").innerHTML = socialtext;
 }


 loadSocialIcons()

 function dayNightToggle() {
    var element = document.body;
    element.classList.toggle("light-mode");
     var check = window.localStorage.getItem('light-mode');
      if(check == "light"){
      window.localStorage.clear();
      }else{
      window.localStorage.setItem('light-mode', 'light');
      }

 }
 function checkDayNight(){
 var check = window.localStorage.getItem('light-mode');
      var element = document.body;
 if(check == "light"){
    element.classList.add("light-mode");
 }else{
    element.classList.remove("light-mode");
 }
 }
 checkDayNight()
 //loadJSON()

/*
 *<a class="github-button" href="https://github.com/akshay2211/PixImagePicker" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-icon="octicon-star" data-size="large" data-show-count="true" aria-label="Star akshay2211/PixImagePicker on GitHub">Star</a>
 *<a class="github-button" href="https://github.com/akshay2211/PixImagePicker/fork" data-color-scheme="no-preference: dark; light: dark; dark: dark;" data-icon="octicon-repo-forked" data-size="large" data-show-count="true" aria-label="Fork akshay2211/PixImagePicker on GitHub">Fork</a>
 */



