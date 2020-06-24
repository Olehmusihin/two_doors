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

// добавление текста к надписям и в скрытые поля формы.
var glassText = ''; // название цвета (текст);
var doorText = ''; // название двери (текст);
var glassText_element = $('a[href="#glassText"]'); // где меняем текст
var doorText_element = $('a[href="#doorText"]'); // где меняем текст

// updated 24.06.2020 добавление цены цвета двери + текста.
// установка цены по умолчанию ( берётся из первого цвета где doorColor=1).
var doorPrice = 0;  // цена цвета двери;
$('a').each(function (i, d) {
    if (d.href.indexOf('doorColor=1') != -1) {
        doorPrice = getUrlVars(d.href).doorPrice;
        // alert(doorPrice)
    }
})
/* Установка текста в поле */
$('a').each(function (i, d) {
    if (d.href.indexOf('doorColor=1') != -1) {
        doorText = getUrlVars(d.href).doorText;
        doorText_element.text(decodeURI(doorText));
    }
})

/* конец установки цены */

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
        console.log('это клик по элементу', e);
        removeBorders(e);
        addBorder(e);
        findImageNumber(e);
        getDoorName(e);
        doorImg = getDoorSelector(e);
        addDoorName(e);
        totalPrice(e);
        addDoorText(doorText);
        addDoorImage(door, color, glass, doorInnerColor, doorOuterColor, e);
    });

function addBorder(e) {
    if (e.target.tagName == 'IMG') {
        $(e.target).addClass('borderActive')
    }
    if (e.target.tagName == 'A') {
        $(e.target).addClass('borderActive')
    }
}

function addDoorText(data) {
    if (doorText != '') {
        doorText_element.text(decodeURI(data));
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

    var element_href = e.target.href;
    // если присутствует стекло и дверь ( доп параметры ).
    if (e.target.tagName == 'A') {

        if (element_href.indexOf('#glass') != -1) {
            var params = element_href.replace('?', '').split('&');
            glass = findGlassColorNumber(params[0]);
        }
        if (element_href.indexOf('#doorColor') != -1) {
            var params = element_href.replace('?', '').split('&');
            color = findGlassColorNumber(params[0]);
        }
        if (element_href.indexOf('doorPrice') != -1) {
            doorPrice = getUrlVars(element_href).doorPrice;
        }
        if (element_href.indexOf('glassPrice') != -1) {
            glassPrice = getUrlVars(element_href).glassPrice;
        }
        if (element_href.indexOf('&doorText') != -1) {
            doorText = getUrlVars(element_href).doorText;
            // alert(doorText);
        }
        if (element_href.indexOf('&glassText') != -1) {
            glassText = getUrlVars(element_href).glassText;
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

/* Функция возвращает параметры get из URL */
function getUrlVars(href) {
    var vars = [], hash;
    var hashes = href.slice(href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function findGlassColorNumber(linkHref) {
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
            // console.log(match)
            result = match;
            return match;
        });
    }
    return result;
}

/* ТУТ Ошибка (разобраться) */
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
        // если не выбран Цвет для внутренней двери (тоесть если по умолчанию выбран 1 ).
        if (e.target.parentElement.href.indexOf('#doorInnerColor') != -1 && color == '1') {
            $.get(github_url + 'two_doors/' + door + '/inner/' + doorInnerColor + '.jpeg')
                .done(function () {
                    console.log('Такая фотография есть!');
                    doorImg.attr('src', github_url + 'two_doors/' + String(door) + '/inner/' + String(doorInnerColor) + '.jpeg'); // это переписать
                }).fail(function () {

                $.get(github_url + 'two_doors/' + door + '/inner/' + doorInnerColor + '.jpg').done(function () {
                    console.log('Такая фотография есть!');
                    doorImg.attr('src', github_url + 'two_doors/' + String(door) + '/inner/' + String(doorInnerColor) + '.jpg'); // это переписать
                }).fail(function () {
                    throw new Error('Фтографии в формате .jpg нет ! Проверьте путь :/');
                });
                throw new Error('Фотографии в форматом .jpeg нет! Проверьте путь :/');
            })
        }


        // если цвет панели выбран
        if (e.target.parentElement.href.indexOf('#doorInnerColor') != -1 && color != '1') {
            $.get(github_url + 'two_doors/' + door + '/inner/' + doorInnerColor + '.jpeg')
                .done(function () {
                    console.log('Такая фотография есть!');
                    doorImg.attr('src', github_url + 'two_doors/' + door + '/inner/' + doorInnerColor.split('-')[0] + '-' + color + '.jpeg'); // это переписать
                }).fail(function () {

                $.get(github_url + 'two_doors/' + door + '/inner/' + doorInnerColor + '.jpg').done(function () {
                    console.log('Такая фотография есть!');
                    doorImg.attr('src', github_url + 'two_doors/' + door + '/inner/' + doorInnerColor.split('-')[0] + '-' + color + '.jpg'); // это переписать
                }).fail(function () {
                    throw new Error('Фтографии в формате .jpg нет ! Проверьте путь :/');
                });
                throw new Error('Фотографии в форматом .jpeg нет! Проверьте путь :/');
            })
        }

        if (e.target.parentElement.href.indexOf('#doorOuterColor') != -1) {
            $.get(github_url + 'two_doors/' + door + '/outer/' + doorOuterColor + '.jpeg')
                .done(function () {
                    console.log('Такая фотография есть');
                    doorImg.attr('src', github_url + 'two_doors/' + String(door) + '/outer/' + String(doorOuterColor) + '.jpeg'); // это переписать
                }).fail(function () {

                $.get(github_url + 'two_doors/' + door + '/outer/' + doorOuterColor + '.jpg').done(function () {
                    console.log('Такая фотография есть!');
                    doorImg.attr('src', github_url + 'two_doors/' + String(door) + '/outer/' + String(doorOuterColor) + '.jpg'); // это переписать
                }).fail(function () {
                    throw new Error('Фтографии в формате .jpg нет ! Проверьте путь :/');
                });
                throw new Error('Фотографии в форматом .jpeg нет! Проверьте путь :/');

            })
        }
    }

    // Если клик был по доп парамтеру doorColor то во внутренней двери делаем пересчёт
    if (e.target.tagName == 'A' && e.target.href.indexOf('#doorColor') != '-1') {

        $.get(github_url + 'two_doors/' + door + '/inner/' + doorInnerColor.split('-')[0] + '-' + color + '.jpeg')
            .done(function () {
                console.log('Такая фотография есть!');
                doorImg.attr('src', github_url + 'two_doors/' + door + '/inner/' + doorInnerColor.split('-')[0] + '-' + color + '.jpeg'); // это переписать
            }).fail(function () {

            $.get(github_url + 'two_doors/' + door + '/inner/' + doorInnerColor.split('-')[0] + '-' + color + '.jpg').done(function () {
                console.log('Такая фотография есть!');
                doorImg.attr('src', github_url + 'two_doors/' + door + '/inner/' + doorInnerColor.split('-')[0] + '-' + color + '.jpg'); // это переписать
            }).fail(function () {
                throw new Error('Фтографии в формате .jpg нет ! Проверьте путь :/');
            });
            throw new Error('Фотографии в форматом .jpeg нет! Проверьте путь :/');
        })

    }
    console.log('door', door, 'color', color, 'glass', glass, 'doorInnerColor', doorInnerColor, 'doorOuterColoer', doorOuterColor, e)
}

function getDoorSelector(e) {
    console.log('door SELECTOR ', e.target.href);
    if (e.target.tagName == 'A' && e.target.href.indexOf('#doorColor') != -1) {
        $('a').each(function (i, d) {
            if (d.href.indexOf('#innerDoor') != -1) {
                doorImg = $(d).find('img'); // селектор где вставлять  картинку.
            }
        })
    }
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
                if (d.href.indexOf('#innerDoor=') != -1) {
                    return true;
                }
            }).attr('href').replace('#innerDoor=', '');
        }
    }
    console.log(result)
    door = result;
    return result;
}

// Add price by default
doorOuterPrice = $('#slider1 a[href="#doorOuterColor=1-1"]').data('price');
doorInnerPrice = $('#slider2 a[href="#doorInnerColor=1-1"]').data('price');
$('a[href="#totalPrice"').text(doorInnerPrice + doorOuterPrice + Number(doorPrice) + ' Р');

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

    $('a[href="#totalPrice"').text(doorInnerPrice + doorOuterPrice + Number(doorPrice) + ' Р');
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
