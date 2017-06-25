'use strict'

var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var request = require('request');
var api = {
    songs: 'http://s.music.qq.com/fcgi-bin/music_search_new_platform?t=0&n=10&aggr=1&cr=1&loginUin=0&format=json&inCharset=GB2312&outCharset=utf-8&notice=0&platform=jqminiframe.json&needNewCode=0&p=1&catZhida=0&remoteplace=sizer.newclient.next_song&w={0}',
    img: 'http://imgcache.qq.com/music/photo/album_500/{0}/500_albumpic_{1}_0.jpg',
    src: 'http://210.38.1.134:9999/ws.stream.qqmusic.qq.com/{0}.m4a?fromtag=46'
};


router.get('/', function(req, res, next) {
    var search = req.query.search
    var url = api.songs.format(search);
    //将中文进行uri(统一资源标识符)编码,才能被服务器识别
    url = encodeURI(url);  
    console.log(url)

    request({url: url, json:true, method: 'GET', encoding: null}, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var _data = body;
            //console.log(_data.data.song.list.length);

            if(_data.data == 'undefined' || _data.data.song == 'undefined' ||  _data.data.song.list.length == 0) {
                 res.json({data: false});
            }else {
                var result = _data.data.song.list;
                //console.log(result);
                var songs = []
                result.forEach(function(item) {
                    var arr = item.f.split("|"); 
                    var imgId = arr[4];
                    if( typeof imgId != 'string' || arr[1].length >=30 ) {
                        return;
                    }

                    var imgIdlen = imgId.length;        
                    var imgIdstr = ''+ imgId[imgIdlen-2] + imgId[imgIdlen-1];

                    var song = {
                        src: 'http://ws.stream.qqmusic.qq.com/{0}.m4a?fromtag=46'.format(arr[0]),
                        img: 'http://imgcache.qq.com/music/photo/album_500/{0}/500_albumpic_{1}_0.jpg'.format(imgIdstr, imgId),
                        singer: arr[3],
                        song: arr[1]
                    };

                    songs.push(song);
                });

                res.json({data: songs});
            }
        }else {
            res.json({data: false});
        }
    });

});

module.exports = router;