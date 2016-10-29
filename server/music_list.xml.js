var NetEaseMusicListID;
function getNetEaseMusicListDoc(keyword, callback) {
    console.log("jsb call httpGet: " + keyword);
    var url = "http://music.163.com/api/search/get";
    var referer = "http://music.163.com";
    var postData = `s=${keyword}&type=1000&sub=false&limit=40&offset=0`;
    var content = JSB.httpPost(url, referer, postData);
    var j = JSON.parse(content);
    var docText = `<?xml version="1.0" encoding="utf-8"?>
        <document>
           <listTemplate>
              <banner>
                 <title><?php echo $keyword;?></title>
              </banner>
              <list>
                 <header>
                     <title>歌单</title>
                 </header>
                 <section>`;
    for(var value of j['result']['playlists']) {
        docText += `
                    <listItemLockup onselect="playMusicList('${value['id']}')">
                       <title><![CDATA[${value['name']}]]></title>
                       <relatedContent>
                          <lockup>
                            <img src="${value['coverImgUrl']}" width="857" height="482" />
                            <title><![CDATA[${value['name']}]]></title>
                            <description><![CDATA[歌单由 ${value['creator']['nickname']} 创建]]></description>
                          </lockup>
                       </relatedContent>
                    </listItemLockup>`;
    }
    docText += `
                 </section>
              </list>
           </listTemplate>
        </document>`;
    console.log("doc: "+docText);
    callback((new DOMParser).parseFromString(docText, "application/xml"));
}

function showNetEasePlayList(keyword) {
    const loadingDocument = createLoadingDocument();
    navigationDocument.pushDocument(loadingDocument);
    getNetEaseMusicListDoc(keyword, function(doc) {
        navigationDocument.replaceDocument(doc, getActiveDocument());
    });
}

function playMusicList(id) {
    if (NetEaseMusicListID == id) {
        player.present();
        return;
    }
    NetEaseMusicListID = id;
    var url = `http://music.163.com/api/playlist/detail?id=${id}`;
    const loadingDocument = createLoadingDocument();
    navigationDocument.pushDocument(loadingDocument);
    player.stop();
    getHTTP(url, function(content) {
        var ret_json = JSON.parse(content);
        var videoList = new Playlist();
        for(var value of ret_json['result']['tracks']) {
            var name = value['name'];
            var artist = "";
            for(var art of value['artists']) artist+=art['name']+' ';
            var song_id=value['id'];
            var mp3Url = value['mp3Url'].replace(/http:\/\/m/, "http://p");
            var img = value['album']['picUrl'];
            var title = `${name}  - ${artist}`;
            var item = new MediaItem('audio', mp3Url);
            item.title = title;
            item.artworkImageURL = img;
            console.log(`Add Music ${item.title} ${mp3Url} ${img}`);
            videoList.push(item);
        }
        player.playlist = videoList;
        player.play();
        setTimeout(function(){
            console.log("timeout remove loadDoc");
            navigationDocument.removeDocument(loadingDocument);
        }, 800);
    });
}
