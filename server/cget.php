<?php
    //const USER_AGENT = 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36';
    const USER_AGENT = 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7';
    const REFERER = 'http://music.163.com';
    const FORM_ENCODE = 'GBK';
    const TO_ENCODE = 'UTF-8';

    function _cget($url,$convert=false,$post_data=null,$timeout=10){
        $ch=curl_init($url);
        $cookie="appver=1.5.0.75771";
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch,CURLOPT_TIMEOUT,$timeout);
        curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
        curl_setopt($ch,CURLOPT_USERAGENT,USER_AGENT);
        curl_setopt($ch,CURLOPT_REFERER,REFERER);
        curl_setopt($ch,CURLOPT_FOLLOWLOCATION,1); //跟随301跳转
        curl_setopt($ch,CURLOPT_AUTOREFERER,1); //自动设置referer
        curl_setopt($ch, CURLOPT_COOKIE, $cookie);
        if ($post_data) {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        }
        $res=curl_exec($ch);
        curl_close($ch);
        if($convert){
            $res=mb_convert_encoding($res,TO_ENCODE,FORM_ENCODE);
        }
        return $res;
    }
?>
