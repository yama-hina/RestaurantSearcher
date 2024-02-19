"use strict";
console.log("JS接続完了");

// URLを取得
let url = new URL(window.location.href);
// URLSearchParamsオブジェクトを取得
let params = url.searchParams;
// getからIDを取得
const id = params.get('id');
console.log("IDは"+params.get('id'));


// グルメサーチAPIで検索をする関数を使用
gourmetSearch(id);


/**
 * グルメサーチAPIで検索をする関数
 *
 * @param {string} id - 緯度
 */
function gourmetSearch(id) {
    $.ajax({
        type: "GET",
        url: "../php/shopDetail.php",
        data: {
            id: id,
        },
        cache: false
    })
    .done(function (data) {
        console.log("通信成功");
        console.log(data);
        // 前の検索結果をリセット
        $("#restaurantInfo").empty();
        // 検索結果の一覧を取得
        $(data).find('shop').each(function () {
            const name = $(this).find('name').text();
            const address = $(this).find('address').text();
            const access = $(this).find('access').text();
            const photo = $(this).find('photo pc l').text();
            const catchCopy = $(this).find('catch').text();
            const open = $(this).find('open').text();
            const url = $(this).find('urls pc').text();

            const freeDrink = $(this).find('free_drink').text();
            const freeFood = $(this).find('free_food').text();
            const card = $(this).find('card').text();
            const nonSmoking = $(this).find('non_smoking').text();
            const parking = $(this).find('parking').text();

            $("#restaurantInfo").append(
                "<h1>" + name + "</h1>"
                + "<p>" + catchCopy + "</p>"

                + "<div id='mainInfo'>"
                    + "<p><img src='" + photo + "'></p>"
                    + "<dl>"
                        + "<dt>住所</dt>"
                        + "<dd>" + address + "</dd>"
                        + "<dt>アクセス</dt>"
                        + "<dd>" + access + "</dd>"
                        + "<dt>営業時間</dt>"
                        + "<dd>" + open + "</dd>"
                        + "<dt>webサイト</dt>"
                        + "<dd><a href='" + url + "'>" + url + "</a></dd>"
                    + "</dl>"
                + "</div>"//mainiInfo

                + "<article id='subInfo'>"
                    + "<h2>店舗の詳細情報</h2>"
                    + "<div class='miniContent'>"
                        + "<p>飲み放題</p>"
                        + "<p>" + freeDrink + "</p>"
                    + "</div>"//miniContent
                    + "<div class='miniContent'>"
                        + "<p>食べ放題</p>"
                        + "<p>" + freeFood + "</p>"
                    + "</div>"//miniContent
                    + "<div class='miniContent'>"
                        + "<p>クレジットカード</p>"
                        + "<p>" + card + "</p>"
                    + "</div>"//miniContent
                    + "<div class='miniContent'>"
                        + "<p>禁煙席</p>"
                        + "<p>" + nonSmoking + "</p>"
                    + "</div>"//miniContent
                    + "<div class='miniContent'>"
                        + "<p>駐車場</p>"
                        + "<p>" + parking + "</p>"
                    + "</div>"//miniContent
                +"</article>"//subInfo
            );
        }); // 
    })//done
    .fail(function (jqXHR, textStatus, errorThrown) {
        console.log("通信失敗");
        console.log(textStatus);
    })//fail
    .always((data) => {
        console.log("通信終了");
    })//always

}
