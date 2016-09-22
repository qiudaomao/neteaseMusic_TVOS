<?php
require('cget.php');
$playlist_id=$_GET['playlist_id'];
$result=_cget('http://music.163.com/api/playlist/detail?id='.$playlist_id);
$j=json_decode($result,true);
if ($j == null) {
    die("{'status':'error','msg':'请求超时'}");
}
$ret_json=[];
$ret_json['status']='ok';
$i=0;

function encrypted_id($dfsid) {
    $key ='3go8&$8*3*3h0k(2)2';
    $key_len = strlen($key);
    for($i = 0; $i < strlen($dfsid); $i++){
        $dfsid[$i] = $dfsid[$i] ^ $key[$i % $key_len];
    }
    $raw_code = base64_encode(md5($dfsid, true));
    $code = str_replace(array('/', '+'), array('_', '-'), $raw_code);
    return $code;
} 

function rp($ori) {
    return htmlspecialchars($ori,ENT_COMPAT);
}

if ($j==null || !isset($j['result']) || !isset($j['result']['tracks'])) {
    die("{'status':'error','msg':'服务器数据不正确'}");
}

foreach($j['result']['tracks'] as $key=>$value) {
    $ret_json['tracks'][$i]['name']=rp($value['name']);
    $author="";
    foreach($value['artists'] as $k=>$v) {
        $author.=' '.$v['name'];
    }
    $ret_json['tracks'][$i]['artist']=rp($author);
    $ret_json['tracks'][$i]['song_id']=$value['id'];
    $ret_json['tracks'][$i]['mp3Url']=str_replace('http://m','http://p',$value['mp3Url']);
    $ret_json['tracks'][$i]['img']=$value['album']['picUrl'];
    $i++;
}
die(json_encode($ret_json));
?>
