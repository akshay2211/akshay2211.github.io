/*
 *
 * akshay sharma 
 * fxn769@gmail.com
 * 5/7/2020
 * 
 */

var socialtags = [{
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

function loadSocialIcons() {
    var socialtext = ""
    for (x in socialtags) {
        var data = `<a class="center" href="` + socialtags[x].link + `"> <img class="center" style="padding: 5px!important;width: 40px;" src="` + socialtags[x].img + `"></a>`
        socialtext += data
    }
    document.getElementById("social-list").innerHTML = socialtext;
}

loadSocialIcons()

function dayNightToggle() {
    var element = document.body;
    element.classList.toggle("light-mode");
    var check = window.localStorage.getItem('light-mode');
    if (check == "light") {
        window.localStorage.clear();
    } else {
        window.localStorage.setItem('light-mode', 'light');
    }

}

function checkDayNight() {
    var check = window.localStorage.getItem('light-mode');
    var element = document.body;
    if (check == "light") {
        element.classList.add("light-mode");
    } else {
        element.classList.remove("light-mode");
    }
}

checkDayNight()

class Router {

    constructor(){
       this.routes = [];
    }

    get(uri, callback){
        // ensure that the parameters are not empty
        if(!uri || !callback) throw new Error('uri or callback must be given');

        // ensure that the parameters have the correct types
        if(typeof uri !== "string") throw new TypeError('typeof uri must be a string');
        if(typeof callback !== "function") throw new TypeError('typeof callback must be a function');

        // throw an error if the route uri already exists to avoid confilicting routes
        this.routes.forEach(route=>{
            if(route.uri === uri) throw new Error(`the uri ${route.uri} already exists`);
        })

        // Step 5 - add route to the array of routes
        const route = {
            uri, // in javascript, this is the same as uri: uri, callback: callback, avoids repition
            callback
        }
        this.routes.push(route);
    }

    init(){
        this.routes.some(route=>{

            let regEx = new RegExp(`^${route.uri}$`); // i'll explain this conversion to regular expression below
            let path = window.location.pathname;

            if(path.match(regEx)){
                // our route logic is true, return the corresponding callback

                let req = { path } // i'll also explain this code below
                return route.callback.call(this, req);
            }
        })
    }
}

const router = new Router();
router.get('/thanks', function(req){

      console.log(req.path); // outputs /about-me to the console
}
router.init();
