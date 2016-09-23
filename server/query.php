<?php
require('cget.php');
if (isset($_GET['s'])) {
    $keyword=$_GET['s'];
    $post_data="limit=40&s=".$keyword."&type=1000&sub=false&offset=0";
    $data = _cget('http://music.163.com/api/search/get',false, $post_data);
    $j = json_decode($data, true);
}
$url='playlist.php?playlist_id=';
function rp($ori) {
    return htmlspecialchars($ori,ENT_COMPAT);
}
?>
<?xml version="1.0" encoding="utf-8"?>
<document>
   <listTemplate>
      <banner>
         <title><?php echo $keyword;?></title>
      </banner>
      <list>
         <header>
             <title>歌单</title>
         </header>
         <section>
<?php
    foreach($j['result']['playlists'] as $key=>$value) {
?>
            <listItemLockup onselect="playMusicList('<?php echo $url.$value['id'];?>')">
               <title><?php echo rp($value['name']);?></title>
               <relatedContent>
                  <lockup>
                    <img src="<?php echo $value['coverImgUrl'];?>" width="857" height="482" />
                    <title><?php echo rp($value['name']);?></title>
                    <description>歌单由 <?php echo rp($value['creator']['nickname']);?> 创建</description>
                  </lockup>
               </relatedContent>
            </listItemLockup>
<?php
    }
?>
         </section>
      </list>
   </listTemplate>
</document>
