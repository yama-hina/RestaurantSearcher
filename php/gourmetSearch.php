<?php
// クロスオリジン制約の緩和
header('Access-Control-Allow-Origin: *');
header("Content-type: application/xml; charset=UTF-8");

// 今回使うリクエストURLと自分のAPIキーを格納
$requestUrl = 'https://webservice.recruit.co.jp/hotpepper/gourmet/v1/';
$apiKey = "?key=729ffa566e20e234";
$url = $requestUrl . $apiKey;

// 現在地を取得
$url = $url . '&lat=' . $_GET['lat'] . '&lng=' . $_GET['lng'];
// 範囲を追加
$url = $url . '&range=' . $_GET['range'] . '&order=4';
// 初期位置を追加
$url = $url . '&start=' . $_GET['start'] . '&count=' . $_GET['count'];

$xml = file_get_contents($url);
echo $xml;

