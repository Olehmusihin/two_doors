$(function () {

    var borderColor = 'rgb(255, 133, 98)';
    var $glass = $(); // jQuery объект с селекторами стёкол
    var $doorColor = $(); // jQuery объект с селекторами цвета
    var $doorInnerColor = $(); // jQuery объект с селекторами внутреннего цвета
    var $doorOuterColor = $(); // jQuery объект с селекторами внешнего цвета
    var github_url = 'https://olehmusihin.github.io/'; // путь к папке где хранятся все изображения;
    var door = ''; // название папки с дверью, берётся с картинки со страницы с #door=название, должно совпадать с названием папки где хранятся фотографии двери.
    var doorImg = ''; // селектор изображения двери.
    var color = '1'; // какой цвет двери будем искать;
    var glass = '1';  // какое стекло будем фильтровать;
    var doorInnerColor = '1'; // какой цвет внутренней двери будем искать
    var doorOuterColor = '1'; // какой цвет внешней двери будем искать
    var doorInnerPrice = ''; // цена двери внутренней
    var doorOuterPrice = ''; // цена внешней двери


    // Add event listeners to a elements!;
    $('a').filter(function (i, d) {
        if (d.href.indexOf('#glass') != -1) {
            $glass = $glass.add(d);
            return true;
        }
        if (d.href.indexOf('#doorColor') != -1) {
            $doorColor = $doorColor.add(d);
            return true;
        }
        if (d.href.indexOf('#doorInnerColor') != -1) {
            $doorInnerColor = $doorInnerColor.add(d);
            return true;
        }
        if (d.href.indexOf('#doorOuterColor') != -1) {
            $doorOuterColor = $doorOuterColor.add(d);
            return true;
        }
    })
        .on('click', function (e) {
            removeBorders(e);
            addBorder(e);
            findImageNumber(e);
            getDoorName(e);
            doorImg = getDoorSelector(e);
            addDoorName(e);
            totalPrice(e);
            addDoorImage(door, color, glass, doorInnerColor, doorOuterColor, e);
        });

    function addBorder(e) {
        if (e.target.tagName == 'IMG') {
            $(e.target).addClass('borderActive')
        }
    }

    function removeBorders(e) {
        // for one door
        if (e.target.tagName == 'A') {
            if (e.target.href.indexOf('#glass') != -1) {
                $glass.removeClass('borderActive');
            }
            if (e.target.href.indexOf('#doorColor') != -1) {
                $doorColor.removeClass('borderActive');
            }
        }
        // for two door
        if (e.target.tagName == 'IMG') {
            if (e.target.parentElement.href.indexOf('#doorInnerColor') != -1) {
                $doorInnerColor.find('img').removeClass('borderActive');
            }
            if (e.target.parentElement.href.indexOf('#doorOuterColor') != -1) {
                $doorOuterColor.find('img').removeClass('borderActive');
            }
        }
    }

    function findImageNumber(e) {
        // for one door
        if (e.target.tagName == 'A') {
            if (e.target.href.indexOf('#glass') != -1) {
                glass = findRegularNumber(e.target.href);
            }

            if (e.target.href.indexOf('#doorColor') != -1) {
                color = findRegularNumber(e.target.href);
            }
        }

        if (e.target.tagName == 'IMG') {
            if (e.target.parentElement.href.indexOf('#doorInnerColor') != -1) {
                doorInnerColor = findRegularNumber(e.target.parentElement.href, e);
            }
            if (e.target.parentElement.href.indexOf('#doorOuterColor') != -1) {
                doorOuterColor = findRegularNumber(e.target.parentElement.href, e);
            }
        }
    }

    function findRegularNumber(linkHref, e) {
        // for one door
        if (e.target.tagName == 'A') {
            const regex = /[^=]\d*$/gm;
            const str = linkHref;
            let m;
            var result;

            while ((m = regex.exec(str)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {
                    result = match;
                    return match;
                });
            }
        }
        if (e.target.tagName == 'IMG') {
            const regex = /[^=]*\d/gm;
            const str = linkHref;
            let m;
            var result;

            while ((m = regex.exec(str)) !== null) {
                // This is necessary to avoid infinite loops with zero-width matches
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }

                // The result can be accessed through the `m`-variable.
                m.forEach((match, groupIndex) => {
                    result = match;
                    return match;
                });
            }
        }
        return result;
    }

    function addDoorImage(door, color, glass, doorInnerColor, doorOuterColor, e) {
        // For two doors
        if (e.target.tagName == 'IMG') {
            if (e.target.parentElement.href.indexOf('#doorInnerColor') != -1) {
                $.get(github_url + 'two_doors/' + door + '/inner/' + doorInnerColor + '.jpeg')
                    .done(function () {
                        console.log('Такая фотография есть!');
                        doorImg.attr('src', github_url + 'two_doors/' + String(door) + '/inner/' + String(doorInnerColor) + '.jpeg'); // это переписать
                    }).fail(function () {
                    throw new Error('Такой фотографии нет! :/');
                })
            }
            if (e.target.parentElement.href.indexOf('#doorOuterColor') != -1) {
                $.get(github_url + 'two_doors/' + door + '/outer/' + doorOuterColor + '.jpeg')
                    .done(function () {
                        console.log('Такая фотография есть');
                        doorImg.attr('src', github_url + 'two_doors/' + String(door) + '/outer/' + String(doorOuterColor) + '.jpeg'); // это переписать
                    }).fail(function () {
                    throw new Error('Такой фотографии нет! :/');
                })
            }
        }

        // For one door
        if (e.target.tagName == 'A') {
            if (e.target.href.indexOf('#doorColor') != -1 || e.target.href.indexOf('#glass') != -1) {
                $.get(github_url + 'one_door/' + door + '/' + color + glass + '.jpeg')
                    .done(function () {
                        doorImg.attr('src', github_url + String(door) + '/' + String(color) + String(glass) + '.jpeg'); // это переписать
                    }).fail(function () {
                    throw new Error('Такой фотографии нет! :/');
                })
            }
        }
        console.log(door, color, glass, doorInnerColor, doorOuterColor, e)
    }

    function getDoorSelector(e) {
        // for two doors
        if (e.target.tagName == 'IMG') {
            if (e.target.parentElement.href.indexOf('#doorInnerColor') != -1) {
                var doorImg = $('a').filter(function (i, d) {
                    if (d.href.indexOf('#innerDoor=') != -1) {
                        return true;
                    }
                }).find('img');
            }

            if (e.target.parentElement.href.indexOf('#doorOuterColor') != -1) {
                var doorImg = $('a').filter(function (i, d) {
                    if (d.href.indexOf('#outerDoor=') != -1) {
                        return true;
                    }
                }).find('img');
            }
        }

        // for one door
        if (e.target.tagName == 'A') {
            if (e.target.href.indexOf('#doorColor') != -1 || e.target.href.indexOf('#glass') != -1) {
                var doorImg = $('a').filter(function (i, d) {
                    if (d.href.indexOf('#door=') != -1) {
                        return true;
                    }
                }).find('img')
            }
        }
        return doorImg;
    }

    function getDoorName(e) {
        // for two doors
        if (e.target.tagName == 'IMG') {
            if (e.target.parentElement.href.indexOf('#doorInnerColor') != -1) {
                var result = $('a').filter(function (i, d) {
                    if (d.href.indexOf('#innerDoor=') != -1) {
                        return true;
                    }
                }).attr('href').replace('#innerDoor=', '');
            }
            if (e.target.parentElement.href.indexOf('#doorOuterColor') != -1) {
                var result = $('a').filter(function (i, d) {
                    if (d.href.indexOf('#outerDoor=') != -1) {
                        return true;
                    }
                }).attr('href').replace('#outerDoor=', '');
            }
        }
        // for one door
        if (e.target.tagName == 'A') {
            if (e.target.href.indexOf('#doorColor') != -1 || e.target.href.indexOf('#glass') != -1) {
                var result = $('a').filter(function (i, d) {
                    if (d.href.indexOf('#door=') != -1) {
                        return true;
                    }
                }).attr('href').replace('#door=', '');
            }
        }
        console.log(result)
        door = result;
        return result;
    }

    // Add price by default
    doorOuterPrice = $('#slider1 a[href="#doorOuterColor=1-1"]').data('price');
    doorInnerPrice = $('#slider2 a[href="#doorInnerColor=1-1"]').data('price');
    $('a[href="#totalPrice"').text(doorInnerPrice + doorOuterPrice + ' Р');

    // Function sum price
    function totalPrice(e) {
        // price by default when refresh page, first element with selector href="#doorOuterColor=1-1"
        if (e.target.tagName == 'IMG') {
            if (e.target.parentElement.href.indexOf('#doorOuterColor') != -1) {
                doorOuterPrice = $(e.target).parent().data('price')
            }
            if (e.target.parentElement.href.indexOf('#doorInnerColor') != -1) {
                doorInnerPrice = $(e.target).parent().data('price')
            }
        }
        $('a[href="#totalPrice"').text(doorInnerPrice + doorOuterPrice + ' Р');
    }

    // Задержка чтоб прогрузился слайдер 2 сек.
    setTimeout(function () {

        // Add Name by default
        $('[href="#outerName"]').text($('#slider1 a[href="#doorOuterColor=1-1"]').data('name'));
        $('[href="#innerName"]').text($('#slider2 a[href="#doorInnerColor=1-1"]').data('name'));

        // Add Image by default
        $('a').filter(function (i, d) {
            if (d.href.indexOf('#outerDoor=') != -1) {
                return true;
            }
        }).find('img').attr('src', $('#slider1 a[href="#doorOuterColor=1-1"]').find('img').attr('src'));

        $('a').filter(function (i, d) {
            if (d.href.indexOf('#innerDoor=') != -1) {
                return true;
            }
        }).find('img').attr('src', $('#slider2 a[href="#doorInnerColor=1-1"]').find('img').attr('src'));

    }, 500)


    // Add Name
    function addDoorName(e) {
        // price by default when refresh page, first element with selector href="#doorOuterColor=1-1"
        if (e.target.tagName == 'IMG') {
            if (e.target.parentElement.href.indexOf('#doorOuterColor') != -1) {
                $('[href="#outerName"').text($(e.target).parent().data('name'));
            }
            if (e.target.parentElement.href.indexOf('#doorInnerColor') != -1) {
                $('[href="#innerName"').text($(e.target).parent().data('name'));
            }
        }
    }


    $('body').append('<style>.borderActive { outline-offset: -2px;\n' +
        '    outline: 2px solid rgb(209, 65, 65);}</style>');
    // $('body').append('<style>.borderActive { border: 2px solid ' + borderColor + ' !important}</style>');
    // Add styles.

})


/* Slider */
$(function () {

    // Init sliders
    $('#slider1').slick({
        draggable: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        vertical: true,
        adaptiveHeight: true,
        verticalSwiping: true,
        nextArrow: $('[href="#outerNext"]'),
        prevArrow: $('[href="#outerPrev"]')
    });

    $('#slider2').slick({
        draggable: true,
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
        vertical: true,
        adaptiveHeight: true,
        verticalSwiping: true,
        nextArrow: $('[href="#innerNext"]'),
        prevArrow: $('[href="#innerPrev"]')
    });


    var filtered = false;
    $('[href="#filterOuter1"],[href="#filterOuter2"],[href="#filterOuter3"]').on('click', function (e) {
        $('#slider1').slick('slickUnfilter');
        $('#slider1').slick('slickFilter', filterSlick($(e.target).text()));
    })

    $('[href="#filterInner1"],[href="#filterInner2"],[href="#filterInner3"],[href="#filterInner4"]').on('click', function (e) {
        $('#slider2').slick('slickUnfilter');
        $('#slider2').slick('slickFilter', filterSlick($(e.target).text()));
    })

    // filter by data-filter slides;
    function filterSlick(filter_str) {
        return $('[data-filter="' + filter_str + '"]').parent('a');
    }

})
