document.addEventListener("DOMContentLoaded", () => {

    if (localStorage.getItem("user") == null) {
        // hide list of channels
        document.querySelector("#sidebar").style.display = "none";
        // display box asking for username
        document.querySelector("#username").style.display = "block";

        // once username has been submitted
        document.querySelector("#username").onsubmit = () => {
    
            // get username and save to local storage
            localStorage.setItem("user", document.querySelector("#username-input").value);
        
            // hide form and stop from submitting
            document.querySelector("#username").style.display = "none";
            // show list of channels
            document.querySelector("#sidebar").style.removeProperty("display");
            return false; 
        };

    } else {
        // check for most recent channel
        if (localStorage.getItem("channel") != null) {
            // go to channel
            const url = "/channel/" + localStorage.getItem("channel");
            if (window.location.pathname != url) {
                window.location.replace(url);
            };
        }; 
    };
});


