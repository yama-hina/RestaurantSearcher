"use strict";

// Geolocation APIに対応しているかを確認
if (navigator.geolocation) {
    console.log("この端末では位置情報が取得できます");
} else {
    console.log("この端末では位置情報が取得できません");
}

// 現在地を取得し、検索をする
navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

// ページャの1ページの表示件数
const count = 30;


// 現在地の取得に成功した場合
function successCallback(position) {
    console.log("位置情報取得成功");
    // 緯度・経度を格納
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;


    // 検索ボタンをクリックされたとき
    let range, start;
    $("#searchButton").click(function (e) {
        // 範囲情報を取得
        range = $("#range").val();
        // ページのスタート位置を設定
        start = 1;

        // グルメサーチAPIで検索をする関数を使用
        gourmetSearch(lat, lng, range, start);

    });

    // ページャがクリックされたとき
    $(document).on('click', '.number', function () {
        // 今のページはクリックできないようにする
        if ($(this).hasClass('nowPage')) {
            console.log('nowPage クラスが存在します');
        } else {
            console.log('nowPage クラスが存在しません');
            // ページのスタート位置を取得
            start = $(this).text();
            // グルメサーチAPIで検索をする関数を使用
            gourmetSearch(lat, lng, range, start);
        }
        $('html, body').animate({
            scrollTop: $('#yourTargetElementId').offset().top
        }, 0); // スクロールのアニメーション時間（ミリ秒）
    });

    // 前へボタンがクリックされたとき
    $(document).on('click', '#prevPage', function () {
        // ページのスタート位置を取得
        start = $("#prevPage").data("value");
        if(start != ""){
            // グルメサーチAPIで検索をする関数を使用
            gourmetSearch(lat, lng, range, start);
        }
    });

    // 次へボタンがクリックされたとき
    $(document).on('click', '#nextPage', function () {
        // ページのスタート位置を取得
        start = $("#nextPage").data("value");
        if(start != ""){
            // グルメサーチAPIで検索をする関数を使用
            gourmetSearch(lat, lng, range, start);
        }
    });
};


/**
 * グルメサーチAPIで検索をする関数
 *
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @param {integer} range - 検索範囲
 * @param {integer} start - 現在のページ番号
 */
function gourmetSearch(lat, lng, range, start) {
    // 今が何ページか
    let nowPage = start;
    // ページのスタート位置を取得
    start = (start - 1) * count + 1;
    $.ajax({
        type: "GET",
        url: "../php/gourmetSearch.php",
        data: {
            lat: lat, // 緯度
            lng: lng, // 経度
            range: range, // 検索範囲
            start: start, // ページャ初期値
            count: count // 1ページの表示件数
        },
        cache: false
    })
    .done(function (data) {
        console.log("通信成功");
        // 前の検索結果をリセット
        $("#restaurantInfo").empty();

        // 検索結果の一覧を取得
        $(data).find('shop').each(function(){
            const name = $(this).find('name').text();
            const address = $(this).find('address').text();
            const access = $(this).find('access').text();
            const photo = $(this).find('photo pc l').text();
            const id = $(this).find('id').text();
            $("#restaurantInfo").append(
                "<div class='miniInfo'>"+
                    "<p><img src='" + photo + "'></p>" +
                    "<div>"+
                        "<h3>"+ name +"</h3>"+
                        "<p>" + address + "</p>" +
                        "<p>" + access + "</p>" +
                        "<p><a href='shopDetail.html?id=" + id + "'>店舗の詳細はこちら</a></p>"+
                    "</div>"+
                    "</div>"//miniInfo
            );
        }); // find


        // ページャ作成
        $("#numberList").empty();
        // 全部で何ページかを取得
        const totalPage = Math.ceil($(data).find('results_available').text() / count);
        // 数字部分を作成
        for (let i = 1; i <= totalPage; i++) {
            if (i != nowPage){
                $("#numberList").append(
                    "<p class='number'>" + i + "</p>"
                );
            } else {
                $("#numberList").append(
                    "<p class='number nowPage'>" + i + "</p>"
                );
            }
        }

        // 「前へ」と「次へ」ボタンの情報を変更
        if (nowPage == 1){
            $('#prevPage').addClass('nowPage'); // 前へを使えなくする
            $('#nextPage').data('value', nowPage + 1);
            $('#nextPage').removeClass('nowPage');
        } else if (nowPage == totalPage){
            $('#nextPage').addClass('nowPage'); // 次へを使えなくする
            $('#prevPage').data('value', nowPage - 1);
            $('#prevPage').removeClass('nowPage');
        } else {
            $('#prevPage').removeClass('nowPage');
            $('#nextPage').removeClass('nowPage');
            $('#nextPage').data('value', nowPage + 1);
            $('#prevPage').data('value', nowPage - 1);
        }

    })//done
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("通信失敗");
        console.log(textStatus);
    })//fail
    .always((data) => {
        console.log("通信終了");
    })//always

}



// 現在地の取得に失敗した場合
function errorCallback(error) {
    switch (error.code) {
        case 1: //PERMISSION_DENIED
            console.log("位置情報の利用が許可されていません");
            break;
        case 2: //POSITION_UNAVAILABLE
            console.log("現在位置が取得できませんでした");
            break;
        case 3: //TIMEOUT
            console.log("タイムアウトになりました");
            break;
        default:
            console.log(`その他のエラー(エラーコード:${error.code})`);
            break;
    }
};
