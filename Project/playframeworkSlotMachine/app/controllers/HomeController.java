package controllers;

import play.mvc.*;

import views.html.*;


public class HomeController extends Controller {


    //this method renders the index page
    public Result index() {
        return ok(index.render("Slot machine is ready."));
    }


}
