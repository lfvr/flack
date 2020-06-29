document.addEventListener("DOMContentLoaded", () => {
    // update saved channel
    const channel = document.getElementById("message-textbox").dataset.channel;
    localStorage.setItem("channel", channel);

    // align messages
    if (document.querySelector(".message-user") != null) {
        const curruser = localStorage.getItem("user");
        document.querySelectorAll(".single-message").forEach(msg => {
            if (msg.dataset.user == curruser) {
                msg.style.textAlign = "right";
            };
        });
    };
    
    // connect to websocket
    var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port);

    socket.on("connect", () => {
        // each message submission to emit event
        document.getElementById("message-form").onsubmit = () => {
            message = document.getElementById("message-textbox").value;
            socket.emit("new message", {"text": message, "channel": channel, "user": localStorage.getItem("user")});
            // clear textbox
            document.getElementById("message-textbox").value = "";
            // stop form from submitting
            return false;
        };
    });

    socket.on("update messages", message => {
        // make new list item to hold message
        const li = document.createElement("li");
        li.setAttribute("class", "single-message")
        // extract datetime and convert to local 
        var tmp = new Date(message["timestamp"].split('"').join(""));
        const time = tmp.toLocaleString();
        // check if message sent by current user
        if (message["user"] == localStorage.getItem("user")) {
            li.style.textAlign = "right";
        };
        // populate li and add to ul
        li.innerHTML = `<span class="time">${time}</span><br><span class="message-user">${message["user"]}</span> says:<br>${message["message"]}`;
        document.getElementById("messages").append(li);
        // scroll to bottom
        const div = document.getElementById("message");
        div.scrollTop = div.scrollHeight;
    });

    // convert all timestamps to local format
    window.onload = () => {
        document.querySelectorAll(".time").forEach(timestamp => {
            var tmp = new Date(timestamp.innerHTML.split('"').join(""));
            const time = tmp.toLocaleString();
            timestamp.innerHTML = time;
        })
    }
});