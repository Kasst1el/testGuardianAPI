$(function () {
    var successAjax = true,
        ajaxUrl = 'http://content.guardianapis.com/search?show-blocks=body&api-key=test',
        currentPage = 1,
        amountPages = 0,
        pageInputVal = 1,
        timer;


    function checkDisabled() {

    }





    $('#current-page').on("propertychange change click keyup input paste", function () {
        pageInputVal = $(this).val();
        ajaxUrl = 'http://content.guardianapis.com/search?show-blocks=body&api-key=test';

        clearTimeout(timer);

        timer = setTimeout(function () {
            pageInputVal = parseInt(pageInputVal);

            if (pageInputVal != NaN && pageInputVal > 0 && pageInputVal <= amountPages) {

                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    cache: false,
                    url: ajaxUrl,
                    success: function (data) {
                        $('.news__ul').html('');
                        if (data.response.status == 'ok') {
                            for (var i = 0; i < data.response.results.length; i++) {
                                $('.news__ul').append("<li class='accordion__li'><div class='accordion__header'><i class='small material-icons'>arrow_drop_down</i>" + data.response.results[i].webTitle + "</div></li>");
                            }
                        }
                        currentPage = pageInputVal;
                        $('#current-page').val(currentPage);


                        if (currentPage != amountPages) {
                            $('.pagination__next').removeClass('disabled')
                        }
                        if (currentPage != 1) {
                            $('.pagination__prev').removeClass('disabled')
                        }
                    },
                    error: function () {
                        $('.news__ul').html('');
                        $('.news__ul').append("<li class='collection-item error-message'>Sorry, we couldn't find news for you. Please try again later.");
                        $('.pagination__next,.pagination__prev').addClass('disabled');
                    }

                });
            }
            console.log('ajaxUrlInput - ' + ajaxUrl);
        }, 1500);
        ajaxUrl += '&page=' + pageInputVal;
    });


    $('.pagination__next a').click(function (e) {
        e.preventDefault();
        ajaxUrl = 'http://content.guardianapis.com/search?show-blocks=body&api-key=test';


        if (currentPage != amountPages && $(this).closest('.pagination__next').hasClass('disabled') == false) {
            currentPage++;
            ajaxUrl += '&page=' + currentPage;


            $.ajax({
                type: "GET",
                dataType: "jsonp",
                cache: false,
                url: ajaxUrl,
                success: function (data) {
                    $('.news__ul').html('');
                    if (data.response.status == 'ok') {
                        for (var i = 0; i < data.response.results.length; i++) {
                            $('.news__ul').append("<li class='accordion__li'><div class='accordion__header'><i class='small material-icons'>arrow_drop_down</i>" + data.response.results[i].webTitle + "</div></li>");
                        }
                    }


                    $('#current-page').val(currentPage);
                    $('.pagination__prev').removeClass('disabled')
                    if (currentPage == amountPages) {
                        $('.pagination__next').addClass('disabled')
                    }



                },
                error: function () {
                    $('.news__ul').html('');
                    $('.news__ul').append("<li class='collection-item error-message'>Sorry, we couldn't find news for you. Please try again later.");
                    $('.pagination__next,.pagination__prev').addClass('disabled');
                }
            });


        }
    });


    $('.pagination__prev a').click(function (e) {
        e.preventDefault();
        ajaxUrl = 'http://content.guardianapis.com/search?show-blocks=body&api-key=test';


        if (currentPage != 1 && $(this).closest('.pagination__prev').hasClass('disabled') == false) {
            currentPage--;
            ajaxUrl += '&page=' + currentPage;

            $.ajax({
                type: "GET",
                dataType: "jsonp",
                cache: false,
                url: ajaxUrl,
                success: function (data) {
                    $('.news__ul').html('');
                    if (data.response.status == 'ok') {
                        for (var i = 0; i < data.response.results.length; i++) {
                            $('.news__ul').append("<li class='accordion__li'><div class='accordion__header'><i class='small material-icons'>arrow_drop_down</i>" + data.response.results[i].webTitle + "</div></li>");
                        }
                    }


                    $('#current-page').val(currentPage);



                    $('.pagination__next').removeClass('disabled')

                    if (currentPage ==  1) {
                        $('.pagination__prev').addClass('disabled')
                    }
                },
                error: function () {
                    $('.news__ul').html('');
                    $('.news__ul').append("<li class='collection-item error-message'>Sorry, we couldn't find news for you. Please try again later.");
                    $('.pagination__next,.pagination__prev').addClass('disabled');
                }
            });
        }
    });


    $(document).on('click', '.accordion__header', function () {
        if (successAjax == true) {
            successAjax = false;
            var liClicked = $(this).closest('.accordion__li');
            var indexLi = $('li').index(liClicked);
            if (!liClicked.is('.done')) {
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    cache: false,
                    url: ajaxUrl,
                    success: function (data) {
                        if (data.response.status == 'ok') {
                            var newsBodyText = '';
                            newsBodyText = data.response.results[indexLi].blocks.body[0].bodyHtml;
                            if (data.response.results[indexLi].blocks.body[0].bodyHtml != undefined) {
                                newsBodyText = data.response.results[indexLi].blocks.body[0].bodyTextSummary;
                            } else {
                                newsBodyText = data.response.results[indexLi].webTitle;
                            }
                            liClicked
                                .append("<div class='accordion__main'><p> " + newsBodyText + "</p><a class='accordion__a' target='_blank' href='" + data.response.results[indexLi].webUrl + "'>Reed full news</a></div>")
                                .addClass('pagination__li_active done')
                                .find('.accordion__main').slideDown();
                        }
                    },
                    error: function () {
                        $('.news__ul').html('');
                        $('.news__ul').append("<li class='collection-item error-message'>Sorry, we couldn't find news for you. Please try again later.");
                    }
                });
                successAjax = true;
            }
            else {
                liClicked.toggleClass('pagination__li_active').find('.accordion__main').slideToggle();
                successAjax = true;
            }
        }
    });

    $('#refresh').click(function () {
        console.log('ajaxUrl - ' + ajaxUrl)
        $.ajax({
            type: "GET",
            dataType: "jsonp",
            cache: false,
            url: ajaxUrl,
            success: function (data) {
                if (data.response.status == 'ok') {
                    $('.news__ul').html('');
                    for (var i = 0; i < data.response.results.length; i++) {
                        $('.news__ul').append("<li class='accordion__li'><div class='accordion__header'><i class='small material-icons'>arrow_drop_down</i>" + data.response.results[i].webTitle + "</div></li>");
                    }

                } else {
                    $('.news__ul').append("<li class='collection-item error-message'>Sorry, we couldn't find news for you. Please try again later.");
                }
            },
            error: function () {
                $('.news__ul').html('');
                $('.news__ul').append("<li class='collection-item error-message'>Sorry, we couldn't find news for you. Please try again later.");
                $('.pagination__next,.pagination__prev').addClass('disabled');
            }
        });
    })


    $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: ajaxUrl,
        success: function (data) {
            if (data.response.status == 'ok') {
                for (var i = 0; i < data.response.results.length; i++) {
                    $('.news__ul').append("<li class='accordion__li'><div class='accordion__header'><i class='small material-icons'>arrow_drop_down</i>" + data.response.results[i].webTitle + "</div></li>");
                }
                amountPages = data.response.pages;
                $('#amount-pages').text(amountPages)
            }
        },
        error: function () {
            $('.news__ul').html('');
            $('.news__ul').append("<li class='collection-item error-message'>Sorry, we couldn't find news for you. Please try again later.");
            $('.pagination__next,.pagination__prev').addClass('disabled');
        }
    });
});

