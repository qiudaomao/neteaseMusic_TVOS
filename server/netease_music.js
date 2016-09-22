var baseURL;
var player;
var musicListURL;

function log(str) {
    console.log("js log:"+str);
}

function warningDoc(text) {
    var template = `<document><loadingTemplate><activityIndicator><text>${text}</text></activityIndicator></loadingTemplate></document>`; 
    var templateParser = new DOMParser();
    var parsedTemplate = templateParser.parseFromString(template, "application/xml");
    return parsedTemplate;
}

function resumePlayer() {
    player.present();
}

function playMusicList(music_list_url_) {
    var music_list_url = baseURL+'/'+music_list_url_;
    console.log('play music url:'+music_list_url);
    if (musicListURL == music_list_url) {
        player.present();
    } else {
        musicListURL = music_list_url;
        console.log("new play list: "+music_list_url);
        var loadingScreen = loadingDoc();
        navigationDocument.pushDocument(loadingScreen);
        player.stop();
        getHTTP(music_list_url, function(c){
            var j=JSON.parse(c);
            if (j['status']=='error') {
                var warnningXML = warningDoc(j['msg']);
                var currentDoc = getActiveDocument();
                navigationDocument.replaceDocument(warnningXML, currentDoc);
                return;
            }
            var videoList = new Playlist();
            var result = j['tracks'];
            if (result==null || result.length==0) {
                var warnningXML = warningDoc("列表中没有歌曲");
                var currentDoc = getActiveDocument();
                navigationDocument.replaceDocument(warnningXML, currentDoc);
                return;
            }
            navigationDocument.popDocument();

            for (var i=0; i<result.length; i++) {
                var item = new MediaItem('audio', result[i]['mp3Url']);
                item.title = result[i]['name'] + ' - ' + result[i]['artist'];
                item.artworkImageURL = result[i]['img'];
                videoList.push(item);
                console.log("add songs:"+item.title+" url:"+result[i]['mp3Url']);
            }
            player.playlist = videoList;
            player.play();
            console.log("play finished");
        });
    }
}

function loadingDoc() {
    var template = '<document><loadingTemplate><activityIndicator><text>加载中</text></activityIndicator></loadingTemplate></document>'; 
    var templateParser = new DOMParser();
    var parsedTemplate = templateParser.parseFromString(template, "application/xml");
    return parsedTemplate;
}

function getHTTP(url, callback) {
    var templateXHR = new XMLHttpRequest();
    templateXHR.responseType = "document";
    templateXHR.addEventListener("load", function() {
        callback(templateXHR.responseText);
    }, false);
    templateXHR.open("GET", url, true);
    templateXHR.send();
}

function postDoc(extension, data) {
    var templateXHR = new XMLHttpRequest();
    var url = baseURL + extension;
    log("postDoc"+extension+',post data:'+JSON.stringify(data));
    
    templateXHR.responseType = "document";
    templateXHR.addEventListener("load", function() {
        var currentDoc = getActiveDocument();
        navigationDocument.replaceDocument(templateXHR.responseXML, currentDoc);
    }, false);
    templateXHR.open("POST", url, true);
    var args='data='+JSON.stringify(data);
    templateXHR.send(args);
}

function getDocument(extension) {
    var templateXHR = new XMLHttpRequest();
    var url = baseURL + extension;
    var loadingScreen = loadingDoc();
    log("getDocument "+extension);
    
    navigationDocument.pushDocument(loadingScreen);
    templateXHR.responseType = "document";
    templateXHR.addEventListener("load", function() {
        pushDoc(templateXHR.responseXML, loadingScreen);
    }, false);
    templateXHR.open("GET", url, true);
    templateXHR.send();
}

function pushDoc(document, loading) {
    var currentDoc = getActiveDocument();
    navigationDocument.replaceDocument(document, currentDoc);
}

App.onLaunch = function(options) {
	var l = options.location;
    baseURL = l.substr(0,l.lastIndexOf('/')+1);
    console.log("zfu base URL is " + baseURL);
    player = new Player();
    musicListURL = "";
    //var templateURL = "templates/HelloWorld.xml";
    var templateURL = "main_page.php";
    getDocument(templateURL);
}
