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

    let a = $("#" + $("#" + $('#fileTreeDiv').jstree('get_selected')).attr('id')).prop('textContent');
    a = a.slice(0, -4);
    i = a.search('-');
    if (i) {
        $("#author").html(a.slice(0, i));
        $("#songname").html(a.slice(i + 1));
    }
    else {
        $("#author").html(a);
        $("#songname").html("");
    }
});

$(".fa-fast-backward").click(_ => {
    let c = parseInt(localStorage.getItem('currentSong'));
    let arr = JSON.parse(localStorage.getItem("playlist"));
    if (c > 0) {
        $("#player").attr("src", `music?path=` + arr[c - 1]).trigger("play");

        localStorage.setItem("currentSong", c - 1);
    }

    let a = $("#" + $("#" + $('#fileTreeDiv').jstree('get_selected')).attr('id')).prop('textContent');
    a = a.slice(0, -4);
    i = a.search('-');
    if (i) {
        $("#author").html(a.slice(0, i));
        $("#songname").html(a.slice(i + 1));
    }
    else {
        $("#author").html(a);
        $("#songname").html("");
    }
});


$("#newPlaylistBtn").click(_ => {
    let plFiles = [];
    $.get('fileTree').done((r) => {
        r = JSON.parse(r);
        console.log(r);
        $('#files').jstree({
            'core': {
                'data': r
            },
            'types': {
                'file': {
                    'icon': "fa fa-file audio"
                },
                'dir': {
                    'icon': "fa fa-folder"
                }

            },
            'plugins': ['themes', 'types']
        }).bind("select_node.jstree", function (e, data) {

            if (data['node']['type'] === "file" && data['node']['text'].slice(-3) === "mp3") {
                console.log($("#" + $("#" + $('#files').jstree('get_selected')).attr('id') + " a"));
                if ($("#" + $("#" + $('#files').jstree('get_selected')).attr('id') + " a").css('background-color') != "rgb(0, 128, 0)") {
                    $("#" + $("#" + $('#files').jstree('get_selected')).attr('id') + " a").css('background-color', "green");
                    plFiles.push(btoa(data['node']['original']['path']));
                }
                else {
                    $("#" + $("#" + $('#files').jstree('get_selected')).attr('id') + " a").css('background-color', "white");
                    let index = plFiles.indexOf(btoa(data['node']['original']['path']));
                    if (index > -1) {
                        plFiles.splice(index, 1);
                    }

                }
                console.log(plFiles);
            }
        });


    });

    $("#savePlBtn").off().click(_ => {
        let obj = {
            'name': $("#plNameInp").val(),
            'files': plFiles
        };

        $.ajax({
            'url': 'savePlaylist',
            'method': 'POST',
            'contentType': "application/json",
            'data': JSON.stringify(obj)
        }).done(_ => {
            $("#newPlaylistModal").modal("toggle");
            plFiles = [];
            $("#plNameInp").val("");
            // $('#files').jstree('close_all')
            $("#newPlaylistModal .modal-body").html(
                '          <label for="plNameInp">Playlist Name</label>\n' +
                '          <input size="20" id="plNameInp">\n' +
                '          <div id="files"></div>');
            $("#playlistsnav").click();
        });
    });

    $(".closeBtn").off().click(_ => {
        // $('#files').jstree('close_all');
        $("#newPlaylistModal .modal-body").html(
            '          <label for="plNameInp">Playlist Name</label>\n' +
            '          <input size="20" id="plNameInp">\n' +
            '          <div id="files"></div>')
    })
});

$(".fa-trash").click(e => {
    let idofdelBtn = e.target.id;
    $.ajax({
        'url': 'deletePlaylist',
        'method': 'POST',
        'contentType': "application/json",
        'data': JSON.stringify({name: idofdelBtn})
    }).done(_ => {
        $("#playlistsnav").click();
    });
});

$(".playListName").click(e => {
    name = e.target.innerText;
    //getPlaylistSongs
    $.ajax({
        'url': 'getPlaylistSongs',
        'method': 'POST',
        'contentType': "application/json",
        'data': JSON.stringify({name: name})
    }).done(r => {

        r = JSON.parse(r);console.log(r['files']);
        localStorage.setItem("playlist", JSON.stringify(r['files']));
        localStorage.setItem("currentSong", "0");
        if (localStorage.getItem("isPlaying") === '0') {
            $("#player").attr("src", "music?path=" + r['files'][0]);
            $("#playpause").click();
        }
        else{
             $("#player").attr("src", "music?path=" + r['files'][0]);
             //$("#playpause").click();
        }
    }).fail(_ => {
        alert('not found');
    });
});
