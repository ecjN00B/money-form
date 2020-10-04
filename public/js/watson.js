const VERSION = '1.1.0';
const HOST = window.location.protocol + '//' + window.location.host;
let dialog_texts = [];
let dialog_context = {};
let savedSession = {};
let startDialog = true;
let socketIo = null;

function loaded() {
    $("body").addClass('loaded');
}

function closeWatson() {
    let id = 'close-watson-alert',
        $element = $('#' + id),
        html = '<div id="' + id + '">\n' +
            '    <div>\n' +
            '       <h3>Deseja mesmo apagar essa conversa?</h3>\n' +
            '       <div>\n' +
            '          <button class="delete">Ok</button>\n' +
            '          <button class="close">Cancelar</button>\n' +
            '       </div>\n' +
            '    </div>\n' +
            '</div>';

    if ($element.length === 0) {
        $('body').prepend(html);
        $element = $('body').find('#' + id);
    }

    $element.find('button.delete').off('click').click(function () {
        deleteCookie();
        $element.remove();
        openWatson();
    });

    $element.find('button.close').off('click').click(function () {
        $element.remove();
    });
}

function inputToggle(enabled) {
    let $input = $("#user-input");

    $input.attr('disabled', 'disabled');

    if (enabled === true) {
        $input.removeAttr('disabled').focus();
    }
}

if (window.jQuery) {
    $(function () {
        createData(function () {
            $(".chat-title button").click(function () {
                openWatson();
                $("body").toggleClass("chatDigitalyWatsonOpen");
            });

            $(".chat-title a").click(function () {
                closeWatson();
            });

            callNode("iniciarDialogo");


            let $userInput = $("#user-input");

            $("#myForm").submit(function (event) {
                event.preventDefault();
                let value = $userInput.val();
                if (value) {
                    inputToggle();
                    userText(value, true);
                    loadMessage();
                    callNode(value);
                }
            });

            $userInput.click(function () {
                setTimeout(updateScroll(), 500);
            });

            loaded();

            if (getRoom()) {
                socketIo = io(HOST + '?room=' + $.QueryString.room);
                socketIo.on('connection');
            }

            createSocket();
        });
    });
} else {
    console.error('Jquery not found');
}

(function ($) {
    $.QueryString = (function (paramsArray) {
        let params = {};

        for (let i = 0; i < paramsArray.length; ++i) {
            let param = paramsArray[i]
                .split('=', 2);

            if (param.length !== 2)
                continue;

            params[param[0]] = decodeURIComponent(param[1].replace(/\+/g, " "));
        }

        return params;
    })(window.location.search.substr(1).split('&'));

})(jQuery);

function postMessage() {
    if (getRoom()) {
        socketIo.emit('toggle-chat', {room: $.QueryString['room']});
    }
}

function createHtml(callback) {
    var html = "<div id=\"chat-digitaly-watson\" style='display: none;'>";
    html += "<div class=\"content\">";
    html += "<div id=\"chat-title\" class=\"chat-title\">";
    html += "<h3>Chat</h3>";
    html += "<button>";
    html += "<i class=\"icn-init-chat\"></i>";
    html += "<i class=\"material-icons icn-close-chat\">close</i>";
    html += "</button>";
    html += "<a class=\"delete-chat\" href=\"#\"><i class=\"material-icons icn-delete-chat\">delete</i></a>";
    html += "</div>";
    html += "<div class=\"chat-clerk\">";
    html += "<h1>Berith</h1>";
    html += "<figure class=\"avatar\"><img src=\"" + HOST + "/img/berith.png\"/></figure>";
    html += "</div>";
    html += "<div class=\"messages\"><div class=\"messages-content\"></div></div>";
    html += "<form id=\"myForm\" class=\"message-box\">";
    html += "<input id=\"user-input\" type=\"text\" class=\"message-input\" autocomplete=\"off\" placeholder=\"Digite aqui sua mensagem...\">";
    html += "<input id=\"id\" type=\"hidden\">";
    html += "<button type=\"submit\" class=\"message-submit\"><i class=\"material-icons\">send</i></button>";
    html += "</form>";
    html += "</div>";
    html += "</div>";

    $("body").html(html);

    $("#chat-digitaly-watson").fadeIn(500, function () {
        callback();
    });
}

function createCss(callback) {
    var cssUrl = HOST + '/css/watson.min.css?v=' + VERSION;
    var cssCarouselUrl = HOST + '/css/watson_carousel.min.css?v=' + VERSION,
        $head = $("head");

    $head.append('<link id="chat-css" rel="stylesheet" href="' + cssUrl + '">')
        .append('<link id="chat-css-carousel" rel="stylesheet" href="' + cssCarouselUrl + '">');

    $.get(cssUrl, function () {
        $.get(cssCarouselUrl, function () {
            callback();
        });
    });
}

function createJS(callback) {
    var jsUrl = HOST + '/js/slick.min.js?v=' + VERSION,
        jsSocket = HOST + '/js/socket.io.js',
        $head = $("head");

    $head.append('<script src="' + jsUrl + '"></script>');
    $head.append('<script src="' + jsSocket + '"></script>');

    $.get(jsUrl, function () {
        $.get(jsSocket, function () {
            callback();
        });
    });
}

function createData(callback) {
    createCss(function () {
        createJS(function () {
            createHtml(callback);
        });
    });
}

function insertMessageStorage(savedSession) {
    if (savedSession && savedSession.msg_arr.length > 0) {
        dialog_texts = savedSession.msg_arr;
        dialog_context = savedSession.msg_context;
        var time = 0;
        for (let i = 0; i < savedSession.msg_arr.length; i++) {
            let msg = savedSession.msg_arr[i];
            if (msg.bot !== undefined) {
                if (msg.bot.response_type === "text" && msg.bot.text !== "carousel") {
                    setTimeout(function () {
                        $('.messages').append('<div class="message new" id="' + msg.bot.id + '"><figure class="avatar"><img src="' + HOST + '/img/berith.png" /></figure>' + msg.bot.text + '</div>');
                    }, time);
                }
                if (msg.bot.response_type === "image") {
                    setTimeout(function () {
                        messageTypeImage(msg.bot.source, msg.bot.title, msg.bot.description, msg.bot.id);
                    }, time);
                }
                if (msg.bot.response_type === "option") {
                    setTimeout(function () {
                        let userOptionHtml = "<div id='content_option_id' class='message message-buttons'>";
                        msg.bot.options.forEach(function (option) {
                            var valor = option.value.input.text;
                            userOptionHtml += "<a href=\"#\" onclick=\"userOption('" + valor + "', true)\" class=\"itens-option message new\" >" + option.label + "</a>";
                        });
                        userOptionHtml += "</div>";
                        $('.messages').append(userOptionHtml);
                    }, time);
                }
            }
            if (msg["user"]) {
                setTimeout(function () {
                    $('.messages').append('<div class="message message-personal" id="' + msg.id + '"> ' + msg.user + '</div >');
                }, time);
            }
            if (msg["carousel"]) {
                setTimeout(function () {
                    messageTypeCarousel(msg.carousel, msg.id);
                }, time);
            }

            time += 10;
        }
        setTimeout(function () {
            startDialog = false
        }, 50);
    } else {
        startDialog = false
        savedSession = {
            msg_context: {}
        };
    }
}

function callNode(userInput) {
    if (startDialog) {
        getCookie(function (data) {
            $(".messages").empty();
            insertMessageStorage(data);
        });
    }

    if (!startDialog) {
        if (userInput !== "iniciarDialogo") {
            $.ajax({
                url: HOST + "/watson/message",
                type: "POST",
                data: {
                    input: userInput,
                    sessionId: dialog_context
                }
            }).done(function (res) {
                const watsonObjResp = res;
                watsonObjResp.date_time = new Date()
                if (res.output.generic[0].text) {
                    watsonText(res);
                }
                saveDialog(watsonObjResp);
            });
        } else {
            $.ajax({
                url: HOST + "/db/welcome",
                type: "GET"
            }).done(function (res) {
                const watsonObjResp = res ? res.welcome : null;
                watsonObjResp.date_time = new Date();
                watsonObjResp.sessionId = res.sessionId || null;
                if (watsonObjResp) {
                    watsonText(watsonObjResp);
                }
            });
        }
    }
}

function saveDialog(watsonObjResp) {
    $.ajax({
        url: HOST + "/db/dialogs/upsert",
        type: "POST",
        data: {
            sessionId: watsonObjResp.sessionId,
            dialog: watsonObjResp
        }
    });
}

function loadMessage() {
    if ($('.message.loading').length === 0) {
        $('.messages').append('<div class="message loading new"><figure class="avatar"><img src="' + HOST + '/img/berith.png" /></figure><span></span></div>');
        updateScroll();
    }
}

let totalMessages = 0;

function showHideLoad(number) {
    setTimeout(function () {
        loadMessage();
        if (number === totalMessages) {
            $('.message.loading').remove();
            inputToggle(true);
        }

        updateScroll();
    }, 0);
}

function watsonText(res) {
    let time = 0,
        timeIncrement = 2000;

    loadMessage();
    setTimeout(function () {
        totalMessages = res.output.generic.length;
        if (totalMessages > 0) {
            res.output.generic.forEach(function (item, n) {
                let number = n + 1,
                    carouselImages = null;
                item.id = createId();

                try {
                    carouselImages = JSON.parse(item.text);
                } catch (e) {
                    //
                }

                if (item.response_type === "text" && carouselImages === null) {
                    setTimeout(function () {
                        $('.message.loading').remove();
                        $('.messages').append('<div class="message new" id="' + item.id + '"><figure class="avatar"> <img src="' + HOST + '/img/berith.png" /></figure>' + item.text + '</div>');
                        $("#id").val(res.sessionId);
                        dialog_texts.push({
                            bot: item
                        });
                        showHideLoad(number);
                    }, time);

                }

                if (carouselImages !== null) {
                    setTimeout(function () {
                        $('.message.loading').remove();
                        messageTypeCarousel(carouselImages, item.id);
                        $("#id").val(res.sessionId);
                        dialog_texts.push({
                            carousel: carouselImages,
                            id: item.id
                        });
                        showHideLoad(number);
                    }, time);
                }

                if (item.response_type === "image") {
                    setTimeout(function () {
                        $('.message.loading').remove();
                        messageTypeImage(item.source, item.title, item.description, item.id);
                        $("#id").val(res.sessionId);
                        dialog_texts.push({
                            bot: item
                        });
                        showHideLoad(number);
                    }, time);
                }
                if (item.response_type === "option") {
                    setTimeout(function () {
                        $('.message.loading').remove();
                        var optionHtml = "<div id='content_option_id' class='message message-buttons'>";
                        item.options.forEach(function (option) {
                            var valor = option.value.input.text;
                            optionHtml += "<a href=\"#\" onclick=\"userOption('" + valor + "', true);\" class=\"itens-option message new\">" + option.label + "</a>";
                        });
                        optionHtml += "</div>";
                        $('.messages').append(optionHtml);
                        $("#id").val(res.sessionId);
                        dialog_texts.push({
                            bot: item
                        });
                        showHideLoad(number);
                    }, time - (timeIncrement - 200));
                }
                time += timeIncrement;
                dialog_context = res.sessionId;
                updateScroll();
            });
        }
        if (res.output.encerrar) { //Mexer
            localStorage.removeItem("cliente_adv");
        }
    }, 1000);
}

function userText(text, active) {
    if (active !== false) {
        let id = createId();
        $('.messages').append("<div class=\"message message-personal\" id=\"" + id + "\">" + text + "</div>");
        $('#user-input').val("");
        dialog_texts.push({
            user: text,
            id: id
        });
    }
    updateScroll();
}

function updateScroll() {
    var element = document.querySelector('.messages');
    element.scrollTop = element.scrollHeight;
    saveCookie(dialog_context);
}

function messageTypeImage(path, title, description, id) {
    $('.messages').append("<div class=\"content-img-chatbot message new\" id=\"" + id + "\">" +
        "<div class=\"img-chatbot-background\" style=\"background-image: url('" + path + "');\">" +
        "<img class=\"img-chatbot\" src=\"" + path + "\" alt=\"img\">" +
        "</div>" +
        "<div class=\"text-img-chatbot\">" +
        "<h4>" + title + "</h4>" +
        "<span class=\"description-img-chatbot\">" + description + "</span>" +
        "</div>" +
        "</div>");
}

let hideSlickDotClass = 'hide-slick-dot';
let slickDotsLimit = 13;

function transitionSlickDots($hide, $show) {
    $hide.addClass(hideSlickDotClass);
    $show.removeClass(hideSlickDotClass);
}

function setNumberInSlickDots($parent) {
    $parent.find('li:not(.' + hideSlickDotClass + ')').each(function (i, element) {
        let $element = $(element);
        let number = (i + 1);
        $element.data('number', number);
    });
}

function slideSlickDots($this) {
    let $parent = $this.closest('ul'),
        half = ((slickDotsLimit - 1) / 2) + 1;

    setNumberInSlickDots($parent);

    let number = $this.data('number'),
        $first = $parent.find('li:not(.' + hideSlickDotClass + '):first'),
        $firstBefore = $first.prev(),
        $last = $parent.find('li:not(.' + hideSlickDotClass + '):last'),
        $lastNext = $last.next();

    if (number > half && $lastNext.length && $lastNext !== $last) {
        transitionSlickDots($first, $lastNext);
    }
    if (number < half && $firstBefore.length && $firstBefore !== $first) {
        transitionSlickDots($last, $firstBefore);
    }

    setNumberInSlickDots($parent);
}

function messageTypeCarousel(imagesCarousel, id) {
    var htmlCarousel = '<div class="carousel message new" id="' + id + '">';
    var i = 0;
    imagesCarousel.forEach(function (images) {
        htmlCarousel += '<div class="item" style="background-image: url(\'' + images.source + '\')">';
        htmlCarousel += '<img class="d-block w-100 img-carousel" src="' + images.source + '" alt="First slide">';
        htmlCarousel += '<div class="carousel-caption">';
        htmlCarousel += '<h4>' + images.title + '</h4>';
        htmlCarousel += '<p>' + images.description + '</p>';
        htmlCarousel += '</div>';
        htmlCarousel += '</div>';
        i++;
    });
    htmlCarousel += '</div>';

    $('.messages').append(htmlCarousel);

    let $carousel = $('.carousel#' + id).slick({
        dots: true,
        draggable: true,
        infinite: false,
        prevArrow: '<a class="left carousel-control" href="#"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"><i class="material-icons">chevron_left</i></span></a>',
        nextArrow: '<a class="right carousel-control" href="#"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"><i  class="material-icons">chevron_right</i></span></a>'
    });

    $carousel.find('.slick-dots li').each(function (i, element) {
        let $element = $(element),
            number = $element.find('button').text();

        if (number > slickDotsLimit) {
            $element.addClass(hideSlickDotClass);
        } else {
            $element.data('number', number);
        }
    });

    $carousel.on('afterChange', function (event, slick) {
        slideSlickDots(slick.$dots.find('li.slick-active'));
    });
}

// Guardando Sessão
function saveCookie(ctx) {
    var date = new Date();
    date.setTime(date.getTime() + (6 * 60 * 60 * 1000));
    context_chat = {
        msg_arr: dialog_texts,
        msg_context: ctx,
        expires: date
    };
    localStorage.setItem("cliente_adv", JSON.stringify(context_chat));
}

function getCookie(callback) {
    var context_chat = JSON.parse(localStorage.getItem("cliente_adv"));
    if (context_chat) {
        var date = new Date(),
            expires = new Date(context_chat.expires);

        if (date >= expires) {
            deleteCookie();
        } else {
            callback(context_chat)
        }
    } else {
        callback(null)
    }
}

function deleteCookie() {
    localStorage.removeItem("cliente_adv");
    localStorage.removeItem("autoOpen");
    setTimeout(function () {
        $(".messages").empty();
        dialog_texts = [];
        dialog_context = {};
        savedSession = {};
        startDialog = true;
        callNode("iniciarDialogo");
    }, 1000);
}

function userOption(text, active) {
    inputToggle();
    userText(text, active);
    callNode(text);
    $("#content_option_id").remove();
}

function openWatson(callback) {
    $("#chat-digitaly-watson").toggleClass('open');
    postMessage();
}

function createSocket() {
    if (getRoom()) {
        setTimeout(function () {
            socketIo.emit('loaded-iframe', {room: getRoom(), data: true});

            socketIo.on('open-chat', function (data) {
                if (data.data) {
                    $(".chat-title button .icn-init-chat").click();
                } else {
                    $(".chat-title button .icn-close-chat").click();
                }
            });

        }, 500);
    }
}

let room = null;

function getRoom() {
    if (room === null) {
        room = $.QueryString.room === undefined ? null : $.QueryString.room;
    }

    return room;
}

function createId() {
    return 'message-' + Math.random().toString(36).substr(2, 9);
}