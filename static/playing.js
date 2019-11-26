$("#playpause").click(_ => {
    if ($('#player').prop("paused")) {
        $("#player").trigger('play');
        $("#playpause").removeClass("fa-play").addClass("fa-pause");
        localStorage.setItem("isPlaying", "1");
    }
    else {
        $("#player").trigger('pause');
        $("#playpause").removeClass("fa-pause").addClass("fa-play");
        localStorage.setItem("isPlaying", "0");
    }

});

$(".fa-fast-forward").click(_ => {
    let c = parseInt(localStorage.getItem('currentSong'));
    let arr = JSON.parse(localStorage.getItem("playlist"));
    if (arr.length - 1 > c) {
        $("#player").attr("src", `music?path=` + arr[c + 1]).trigger("play");

        localStorage.setItem("currentSong", c + 1);
    }

    // let a = $("#" + $("#" + $('#fileTreeDiv').jstree('get_selected')).attr('id')).prop('textContent');
    // a = a.slice(0, -4);
    // i = a.search('-');
    // if(i){
    //     $("#author").html(a.slice(0, i));
    //     $("#songname").html(a.slice(i+1));
    // }
    // else{
    //     $("#author").html(a);
    //     $("#songname").html("");
    // }
    $.get('trackinfo?path=' + arr[c]).done((r) => {
        let arr1 = JSON.parse(r);
        $("#author").html(arr1['artist']);
        $("#songname").html(arr1['name']);

    });
});

$(".fa-fast-backward").click(_ => {
    let c = parseInt(localStorage.getItem('currentSong'));
    let arr = JSON.parse(localStorage.getItem("playlist"));
    if (c > 0) {
        $("#player").attr("src", `music?path=` + arr[c - 1]).trigger("play");

        localStorage.setItem("currentSong", c - 1);
    }

    $.get('trackinfo?path=' + arr[c]).done((r) => {
        let arr1 = JSON.parse(r);
        $("#author").html(arr1['artist']);
        $("#songname").html(arr1['name']);

    });
    // let a = $("#" + $("#" + $('#fileTreeDiv').jstree('get_selected')).attr('id')).prop('textContent');
    // a = a.slice(0, -4);
    // i = a.search('-');
    // if(i){
    //     $("#author").html(a.slice(0, i));
    //     $("#songname").html(a.slice(i+1));
    // }
    // else{
    //     $("#author").html(a);
    //     $("#songname").html("");
    // }
});
// TODO: work on design