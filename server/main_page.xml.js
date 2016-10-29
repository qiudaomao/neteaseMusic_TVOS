var str=`{
    "data":[
        {
            "title":"语种",
            "data":[
                {"name":"华语","pic_url":"/img.png"},
                {"name":"日语","pic_url":"/img.png"},
                {"name":"韩语","pic_url":"/img.png"},
                {"name":"奥语","pic_url":"/img.png"},
                {"name":"小语种","pic_url":"/img.png"}
            ]
        },
        {
            "title":"风格",
            "data":[
                {"name":"流行","pic_url":"/img.png"},
                {"name":"摇滚","pic_url":"/img.png"},
                {"name":"民谣","pic_url":"/img.png"},
                {"name":"电子","pic_url":"/img.png"},
                {"name":"舞曲","pic_url":"/img.png"},
                {"name":"说唱","pic_url":"/img.png"},
                {"name":"轻音乐","pic_url":"/img.png"},
                {"name":"爵士","pic_url":"/img.png"},
                {"name":"乡村","pic_url":"/img.png"},
                {"name":"R&amp;B&#92;Soul","pic_url":"/img.png"},
                {"name":"古典","pic_url":"/img.png"},
                {"name":"民族","pic_url":"/img.png"},
                {"name":"英伦","pic_url":"/img.png"},
                {"name":"金属","pic_url":"/img.png"},
                {"name":"朋克","pic_url":"/img.png"},
                {"name":"雷鬼","pic_url":"/img.png"},
                {"name":"世界音乐","pic_url":"/img.png"},
                {"name":"拉丁","pic_url":"/img.png"},
                {"name":"另类&#92;独立","pic_url":"/img.png"},
                {"name":"New Age","pic_url":"/img.png"},
                {"name":"古风","pic_url":"/img.png"},
                {"name":"后摇","pic_url":"/img.png"},
                {"name":"Bossa Nova","pic_url":"/img.png"}
            ]
        },
        {
            "title":"场景",
            "data":[
                {"name":"清晨","pic_url":"/img.png"},
                {"name":"夜晚","pic_url":"/img.png"},
                {"name":"学习","pic_url":"/img.png"},
                {"name":"工作","pic_url":"/img.png"},
                {"name":"午休","pic_url":"/img.png"},
                {"name":"下午茶","pic_url":"/img.png"},
                {"name":"地铁","pic_url":"/img.png"},
                {"name":"驾车","pic_url":"/img.png"},
                {"name":"运动","pic_url":"/img.png"},
                {"name":"旅行","pic_url":"/img.png"},
                {"name":"散步","pic_url":"/img.png"},
                {"name":"酒吧","pic_url":"/img.png"}
            ]
        },
        {
            "title":"情感",
            "data":[
                {"name":"怀旧","pic_url":"/img.png"},
                {"name":"清闲","pic_url":"/img.png"},
                {"name":"浪漫","pic_url":"/img.png"},
                {"name":"性感","pic_url":"/img.png"},
                {"name":"伤感","pic_url":"/img.png"},
                {"name":"治愈","pic_url":"/img.png"},
                {"name":"放松","pic_url":"/img.png"},
                {"name":"孤独","pic_url":"/img.png"},
                {"name":"感动","pic_url":"/img.png"},
                {"name":"兴奋","pic_url":"/img.png"},
                {"name":"快乐","pic_url":"/img.png"},
                {"name":"安静","pic_url":"/img.png"},
                {"name":"思念","pic_url":"/img.png"}
            ]
        },
        {
            "title":"主题",
            "data":[
                {"name":"影视原声","pic_url":"/img.png"},
                {"name":"ACG","pic_url":"/img.png"},
                {"name":"校园","pic_url":"/img.png"},
                {"name":"游戏","pic_url":"/img.png"},
                {"name":"70后","pic_url":"/img.png"},
                {"name":"80后","pic_url":"/img.png"},
                {"name":"90后","pic_url":"/img.png"},
                {"name":"网络歌曲","pic_url":"/img.png"},
                {"name":"KTV","pic_url":"/img.png"},
                {"name":"经典","pic_url":"/img.png"},
                {"name":"翻唱","pic_url":"/img.png"},
                {"name":"吉他","pic_url":"/img.png"},
                {"name":"钢琴","pic_url":"/img.png"},
                {"name":"器乐","pic_url":"/img.png"},
                {"name":"儿童","pic_url":"/img.png"},
                {"name":"榜单","pic_url":"/img.png"},
                {"name":"00后","pic_url":"/img.png"}
            ]
        }
    ]
}`;

function getNetEaseMusicMainPageDoc(callback) {
    var j = JSON.parse(str);
    var docText = `
        <document>
          <head>
            <style>
            .overlay_title {
                background-color: rgba(0,0,0,0.6);
                color: #FFFFFF;
                text-align: center;
            }
            .overlay {
                padding: 0;
                margin: 0;
            }
            </style>
          </head>
           <catalogTemplate>
              <banner>
                 <title>网易云音乐</title>
              </banner>
              <list>
                 <section>`;
    for(var value of j['data']) {
        docText += `
                    <listItemLockup>
                       <title><![CDATA[${value['title']}]]></title>
                       <decorationLabel>${value['data'].length}</decorationLabel>
                       <relatedContent>
                          <grid>
                             <section>`;
        for(var value1 of value['data']) {
            docText += `
                                <lockup onselect="showNetEasePlayList('${value1['name']}')">
                                    <img src="" width="300" height="34" />
                                    <overlay class="overlay">
                                        <title class="overlay_title">${value1['name']}</title>
                                    </overlay>
                                </lockup>`;
        }
        docText += `
                             </section>
                          </grid>
                       </relatedContent>
                    </listItemLockup>`;
    }
    docText += `
                    <listItemLockup onselect="resumePlayer()">
                       <title>回到播放界面</title>
                    </listItemLockup>
                 </section>
              </list>
           </catalogTemplate>
        </document>`;
    console.log("doc: "+docText);
    callback((new DOMParser).parseFromString(docText, "application/xml"));
}

function showNetEaseMusicMainPage() {
    getNetEaseMusicMainPageDoc(function(doc) {
        navigationDocument.replaceDocument(doc, getActiveDocument());
    });
}

function showNetEasePlayList(keyword) {
    console.log("jsb call httpGet: " + keyword);
    var url = "http://music.163.com/api/search/get";
    var referer = "http://music.163.com";
    var postData = `s=${keyword}&type=1000&sub=false&limit=40&offset=0`;
    var content = JSB.httpPost(url, referer, postData);
}
