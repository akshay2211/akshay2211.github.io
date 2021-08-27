package io.ak1.plugins

import io.ak1.data.socialtags
import io.ktor.routing.*
import io.ktor.http.*
import io.ktor.content.*
import io.ktor.http.content.*
import io.ktor.features.*
import io.ktor.application.*
import io.ktor.html.*
import io.ktor.response.*
import io.ktor.request.*
import kotlinx.html.*

fun Application.configureRouting() {
    
    

    routing {
        get("/") {
            call.respondHtml(HttpStatusCode.OK) {
                head {
                    //<meta content="width=device-width, initial-scale=1.0" name="viewport" shrink-to-fit=no">
                    meta { charset = "utf-8" }
                    meta(name = "viewport", content = "width=device-width, initial-scale=1.0")
                    meta {
                        content = "portfolio website for akshay sharma"
                        name = "author"
                    }
                    title { +"AKSHAY SHARMA" }
                    link(href = "static/img/favicon.ico", rel = "shortcut icon")
                    styleLink("https://netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css")
                    styleLink("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;500&display=swap")
                    styleLink("static/css/style.css")
                    styleLink("static/css/bootstrap-grid.css")
                    script(src = "static/js/load.js") {}
                }
                body {
                    button {
                        onClick = "dayNightToggle()"
                        +"Toggle dark mode"
                    }
                    div(classes = "container vertical-center") {
                        div(classes = "row spacing") {
                            img(classes = "center col-10 col-sm-10 col-lg-5 col-md-5 spacing") {
                                src = "static/img/user.svg"
                            }
                            div(classes = "col-10 col-sm-10 col-lg-7 col-md-7 center spacing") {
                                h1 { +"Hi, i am Akshay" }
                                p(classes = "title-desc center") {
                                    +"Opensource Enthusiast, Software architect and User Experience Designer"
                                }
                                div(classes = "col-md-6 col-sm-7 center") {
                                    div(classes = "row social-list") {
                                        for (data in socialtags) {
                                            a(classes = "center") {
                                                href = data.link
                                                img(classes = "center") {
                                                    src = data.img
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        // Static plugin. Try to access `/static/index.html`
        static("/static") {
            resources("static")
        }
        install(StatusPages) {
            exception<AuthenticationException> { cause ->
                call.respond(HttpStatusCode.Unauthorized)
            }
            exception<AuthorizationException> { cause ->
                call.respond(HttpStatusCode.Forbidden)
            }
        
        }
    }
}
class AuthenticationException : RuntimeException()
class AuthorizationException : RuntimeException()
