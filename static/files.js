

$("#playpause").click(_ => {
    if ($('#player').prop("paused")) {
        $("#player").trigger('play');
        $("#playpause").removeClass("fa-play").addClass("fa-pause");
        localStorage.setItem("isPlaying", "1");
    }
    else{
        $("#player").trigger('pause');
        $("#playpause").removeClass("fa-pause").addClass("fa-play");
        localStorage.setItem("isPlaying", "0");
    }

});

$(".fa-fast-forward").click(_ => {
    let c = parseInt(localStorage.getItem('currentSong'));
    let arr = JSON.parse(localStorage.getItem("playlist"));
    if(arr.length-1 > c) {
        $("#player").attr("src", `music?path=` + arr[c + 1]).trigger("play");

        localStorage.setItem("currentSong", c + 1);
    }

});

$(".fa-fast-backward").click(_ => {
    let c = parseInt(localStorage.getItem('currentSong'));
    let arr = JSON.parse(localStorage.getItem("playlist"));
    if(c > 0) {
        $("#player").attr("src", `music?path=` + arr[c - 1]).trigger("play");

        localStorage.setItem("currentSong", c - 1);
    }

});
