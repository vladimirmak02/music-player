$(document).ready(_ => {
    $('#' + localStorage.getItem("tab")).click();

    let a = parseInt(localStorage.getItem('currentSong'));
    let arr = JSON.parse(localStorage.getItem("playlist"));

    if (arr != null) {
        $("#player").attr("src", "music?path=" + arr[a]);

        if (localStorage.getItem("isPlaying") === "1") {
            $("#player").trigger("play");
            $("#playpause").removeClass("fa-play").addClass("fa-pause");
        }
    }

    $.get('fileTree').done((r) => {
        r = JSON.parse(r);
        console.log(r);
        $('#fileTreeDiv').jstree({
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
            console.log("D ", data);

            if (data['node']['type'] === "file") {
                $("#player").attr("src", `music?path=${btoa(data['node']['original']['path'])}`).trigger("play");
                localStorage.setItem("isPlaying", "1");

                $("#playpause").removeClass("fa-play").addClass("fa-pause");

                let children = $("#" + data.selected).parent().children();
                let paths = [], counter = 0;

                for (let song of children) {

                    if (data.instance.get_node(song.id)['original']['text'].slice(-3) === "mp3") {
                        paths.push(btoa(data.instance.get_node(song.id)['original']['path']));
                        if (data.instance.get_node(song.id)['original']['name'] === data['node']['original']['name']) {
                            localStorage.setItem("currentSong", counter);
                        }
                        counter++;
                    }
                }

                localStorage.setItem("playlist", JSON.stringify(paths));


            }
        });


    });

});


$(".nav-link").click(e => {


    if (e.target.id === "playingnav") {
        $("#playlistsnav").removeClass("active");
        $("#filesnav").removeClass("active");
        $("#playingnav").addClass("active");
        $("#content").html("");
        $('#fileTreeDiv').hide();
        console.log(e.target);
        $.get('playing').done((r) => {
            $("#content").html(r);

        });
        let c = parseInt(localStorage.getItem('currentSong'));
        let arr = JSON.parse(localStorage.getItem("playlist"));
        if(c > -1) {
            $.get('trackinfo?path='+arr[c]).done((r) => {
               let arr1 = JSON.parse(r);
               $("#author").html(arr1['artist']);
               $("#songname").html(arr1['name']);

            });
        }
        localStorage.setItem("tab", "playingnav");
        /*if (localStorage.getItem("isPlaying") == "1") {
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
        }*/
    }
    else if (e.target.id === "filesnav") {
        $("#playlistsnav").removeClass("active");
        $("#filesnav").addClass("active");
        $("#playingnav").removeClass("active");
        $('#fileTreeDiv').show();
        $("#content").html("");
        console.log(e.target);
        $.get('files').done((r) => {
            $("#content").html(r);

        });
        localStorage.setItem("tab", "filesnav");
        if (localStorage.getItem("isPlaying") == "1") {
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
        }
    }
    else {
        $("#playlistsnav").addClass("active");
        $("#filesnav").removeClass("active");
        $("#playingnav").removeClass("active");
        $("#content").html("");
        $('#fileTreeDiv').hide();
        console.log(e.target);
        $.get('playlists').done((r) => {
            $("#content").html(r);

        });
        $.get('getPlaylists').done((r) => {
            r = JSON.parse(r);
            let rows = "";
            for (let row of r) {
                rows += `<tr><td><a style="cursor: pointer" class="playListName">${row['name']}</a></td><td><div style="font-size: 20px;"><a id="${row['name']}" class="fa fa-trash" style="cursor: pointer" aria-hidden="true"></a></div></td></td></tr>`;
            }
            $("#playlistList").html('<table class="table table-condensed">' + rows + '</table>');

        //    HW: font awesome del buttons, format table, endpoint delete playlist, (make del button call delete playlist)
        });

        localStorage.setItem("tab", "playlistsnav");
        if (localStorage.getItem("isPlaying") == "1") {
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
        let c = parseInt(localStorage.getItem('currentSong'));
        let arr = JSON.parse(localStorage.getItem("playlist"));
        if(c > -1) {
            $.get('trackinfo?path='+arr[c]).done((r) => {
               let arr1 = JSON.parse(r);
               $("#author").html(arr1['artist']);
               $("#songname").html(arr1['name']);

            });
        }
        }
    }

});