document.addEventListener("DOMContentLoaded", () => {
    document.querySelector("#new-channel").onclick = () => {
        
        // display prompt for channel name
        document.getElementById("new-channel-form").style.display = "inline";

        // hide new channel button
        document.getElementById("new-channel").style.display = "none";

        // listener for submission
        document.getElementById("new-channel-form").onsubmit = () => {
            // hide form on submission and show new channel button
            document.getElementById("new-channel-form").style.display = "none";
            document.getElementById("new-channel").style.display = "";
        }
    };
});