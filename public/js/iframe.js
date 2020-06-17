if (typeof jQuery !== 'undefined') {
    (function ($) {
        const ENABLE = true;

        const SRC_IFRAME_LOCAL = 'http://localhost:3001';
        const SRC_IFRAME_DEV = 'https://dev-nome-cliente.link';
        const SRC_IFRAME_HOMOLOG = 'https://nome-cliente.link';
        const SRC_IFRAME_PROD = SRC_IFRAME_HOMOLOG;

        const SRC_IFRAME = getHostAndHttpScheme() + '/index?origin=' + window.location.href + '&room=' + createRoom();
        const USE_BUTTON = true;
        const AUTO_OPEN = false;
        let opened = false;

        const watsonChat = {
            $container: null,
            initialized: false,
            socketIo: null,
            socket: function (callback) {
                if (this.socketIo === null) {
                    let jsSocket = getHostAndHttpScheme() + '/js/socket.io.js',
                        $head = $("head");

                    $head.append('<script src="' + jsSocket + '"></script>');

                    $.get(jsSocket, function () {
                        watsonChat.socketIo = io(SRC_IFRAME.replace('/index', ''));

                        watsonChat.socket().on('connection');

                        watsonChat.socket().on('toggle-chat', function (data) {
                            watsonChat.toggleChatEvent();
                        });

                        setTimeout(function () {
                            callback();
                        }, 500);
                    });
                }

                return watsonChat.socketIo;
            },
            _vars: {
                keyAutoOpen: 'autoOpen',
                id: "watson-digitaly-iframe",
                classUseButton: "use-button",
                _class: "close-chat-watson",
                _classBody: 'body-overflow-watson',
                css: "#watson-digitaly-iframe{border-radius:10px!important;padding:0;margin:0;position:fixed;bottom:5%;left:2%;border:1px solid rgba(2,0,125,.4);box-shadow:0 0 10px rgba(0,0,0,.4);background:#fff;overflow:hidden;z-index:2000000001;transition:all ease-in-out .05s}#watson-digitaly-iframe.loading{opacity:.1!important;width:1px!important;height:1px!important;min-width:1px!important;min-height:1px!important;overflow:hidden!important;bottom:0!important;right:0!important;box-shadow:transparent!important;border:none!important}#watson-digitaly-iframe.close-chat-watson{border:0;border-radius:50%!important;width:70px;height:70px;overflow:visible}#watson-digitaly-iframe .bullet{position:absolute;background:#003554;width:130px;left:55px;top:-55px;font-size:13px;text-align:center;border-radius:15px;padding:7px 0;line-height:15px;color:#fff;opacity:0;transition:opacity ease-in-out .1s}#watson-digitaly-iframe .bullet b{font-weight:700!important}#watson-digitaly-iframe .bullet::before{border-right:16px solid transparent;border-top:30px solid #003554;bottom:-3px;content:'';position:absolute;transform:rotate(160deg);left:-8px}#watson-digitaly-iframe iframe{border:none;min-height:70vh;max-height:90vh;min-width:270px}#watson-digitaly-iframe.close-chat-watson iframe{width:70px;min-width:70px;max-width:70px;height:70px;min-height:70px;max-height:70px;border-radius:50%;overflow:hidden}#watson-digitaly-iframe.loading iframe{width:1px!important;height:1px!important;min-width:1px!important;min-height:1px!important;overflow:hidden}#watson-digitaly-iframe.close-chat-watson.use-button{display:none}#watson-digitaly-iframe.use-button{display:block}@-webkit-keyframes bounce-watson{20%,53%,80%,from,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1);-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}40%,43%{-webkit-animation-timing-function:cubic-bezier(.755,.05,.855,.06);animation-timing-function:cubic-bezier(.755,.05,.855,.06);-webkit-transform:translate3d(0,-30px,0);transform:translate3d(0,-30px,0)}70%{-webkit-animation-timing-function:cubic-bezier(.755,.05,.855,.06);animation-timing-function:cubic-bezier(.755,.05,.855,.06);-webkit-transform:translate3d(0,-15px,0);transform:translate3d(0,-15px,0)}90%{-webkit-transform:translate3d(0,-4px,0);transform:translate3d(0,-4px,0)}}@keyframes bounce-watson{20%,53%,80%,from,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1);-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}40%,43%{-webkit-animation-timing-function:cubic-bezier(.755,.05,.855,.06);animation-timing-function:cubic-bezier(.755,.05,.855,.06);-webkit-transform:translate3d(0,-30px,0);transform:translate3d(0,-30px,0)}70%{-webkit-animation-timing-function:cubic-bezier(.755,.05,.855,.06);animation-timing-function:cubic-bezier(.755,.05,.855,.06);-webkit-transform:translate3d(0,-15px,0);transform:translate3d(0,-15px,0)}90%{-webkit-transform:translate3d(0,-4px,0);transform:translate3d(0,-4px,0)}}.bounce-watson{-webkit-animation-name:bounce-watson;animation-name:bounce-watson;-webkit-transform-origin:center bottom;transform-origin:center bottom;animation-duration:1s;animation-delay:2s;opacity:1!important}@media (max-width:768px){#watson-digitaly-iframe{bottom:0!important;right:0!important;left:0!important;border-radius:0!important;border:0}#watson-digitaly-iframe iframe{max-height:100%!important;height:calc(100vh - 5px);max-width:100%;width:100vw;bottom:0;top:0;left:0;right:0}#watson-digitaly-iframe iframe:not(:root:root){height:calc(100vh - 120px);}#watson-digitaly-iframe.close-chat-watson{bottom:3%!important;left:3%!important}}@media (max-width:460px){.body-overflow-watson{overflow:hidden!important}}",
                src: SRC_IFRAME,
                div: "<div id=\"{{id}}\" class=\"{{_class}}\"><div class=\"bullet\">Mensagem do Cliente<br><b>Aqui!</b></div><iframe id=\"watson-iframe\" src=\"{{src}}\"></iframe></div>",
                style: "<style>{{css}}</style>"
            },
            autoOpen: function () {
                let autoOpen = localStorage.getItem(this._vars.keyAutoOpen);

                if (autoOpen === null) {
                    autoOpen = AUTO_OPEN;
                }

                autoOpen = JSON.parse(autoOpen);

                if (autoOpen === true) {
                    this.open();
                }

                this.setAutoOpen(autoOpen);

                return this;
            },
            setAutoOpen: function (bool) {
                localStorage.setItem(this._vars.keyAutoOpen, bool);
            },
            toggleChatEvent: function () {
                watsonChat.setAutoOpen(watsonChat.$container.hasClass(watsonChat._vars._class));
                watsonChat.$container.toggleClass(watsonChat._vars._class);

                $("body").addClass(watsonChat._vars._classBody);

                if (watsonChat.$container.hasClass(watsonChat._vars._class)) {
                    $("body").removeClass(watsonChat._vars._classBody);
                }

                if (!USE_BUTTON) {
                    watsonChat.$container.toggleClass(watsonChat._vars.classUseButton);
                }

                return this;
            },
            create: function (callback) {

                let classCSS = !USE_BUTTON ? this._vars._class + ' ' + this._vars.classUseButton : this._vars._class;

                let html = this._vars.div
                        .replace('{{id}}', this._vars.id)
                        .replace('{{_class}}', classCSS)
                        .replace('{{src}}', this._vars.src),
                    css = this._vars.style.replace('{{css}}', this._vars.css);

                $('body').append(html);

                $('head').append(css);

                this.initialized = true;

                this.$container = $('#' + this._vars.id);

                callback();
            },
            open: function (close) {
                if (!this.initialized) {
                    return this.create(function () {
                        watsonChat.socket(function () {
                            watsonChat.socket().on('loaded-iframe', function () {
                                watsonChat.open();
                                watsonChat.displayOn();
                            });
                        });
                    });
                }

                if (close === true && opened === true) {
                    opened = false;
                }

                if (close !== true && opened === false) {
                    opened = true;
                }

                watsonChat.socket().emit('open-chat', {room: createRoom(), data: opened});

                this.setAutoOpen(opened);

                return this;
            },
            close: function () {
                return this.open(true);
            },

            destroy: function () {
                $('#' + this._vars.id).remove();
                this.initialized = false;
                this.setAutoOpen(AUTO_OPEN);
                return this;
            },
            displayOn: function () {
                let $content = $("#" + this._vars.id);

                $content.removeClass('loading');

                setTimeout(function () {
                    $content.find('.bullet').addClass('bounce-watson');
                }, 1000);

            },
            preLoadImage: function (url) {
                try {
                    var _img = new Image();
                    _img.src = url;
                } catch (e) {
                }
            }
        };

        $(function () {
            if (ENABLE === false) {
                return;
            }

            watsonChat.preLoadImage(getHostAndHttpScheme() + '/img/cliente_avatar.png');

            watsonChat.create(function () {
                watsonChat.socket(function () {
                    watsonChat.socket().on('loaded-iframe', function () {
                        watsonChat.autoOpen();
                        watsonChat.displayOn();
                    });
                });
            });
        });

        function checkSrc(searchSrc) {
            let srcIframe = null;

            if (searchSrc === undefined || searchSrc === null) {
                return srcIframe;
            }

            if (searchSrc.indexOf(SRC_IFRAME_LOCAL) !== -1) {
                srcIframe = SRC_IFRAME_LOCAL;
            }

            if (searchSrc.indexOf(SRC_IFRAME_DEV) !== -1) {
                srcIframe = SRC_IFRAME_DEV;
            }

            if (searchSrc.indexOf(SRC_IFRAME_HOMOLOG) !== -1) {
                srcIframe = SRC_IFRAME_HOMOLOG;
            }

            if (searchSrc.indexOf(SRC_IFRAME_PROD) !== -1) {
                srcIframe = SRC_IFRAME_PROD;
            }

            return srcIframe;
        }

        function getHostAndHttpScheme() {
            let $scripts = $('script'),
                search = 'iframe.min.js',
                searchSrc = window.location.href,
                storageId = 'srcIframeWatson',
                srcIframe = SRC_IFRAME_PROD;

            let checkSrcRes = checkSrc(searchSrc);

            if (checkSrcRes !== null) {
                return checkSrcRes;
            }

            $scripts.each(function (i, script) {
                let src = $(script).attr('src'),
                    checkSrcRes = checkSrc(src);
                if (checkSrcRes !== null) {
                    srcIframe = checkSrcRes;
                }
            });

            return srcIframe;
        }

        function createRoom() {
            return '_' + Math.random().toString(36).substr(2, 9);
        }
    })(jQuery);
} else {
    console.log(
        'iframe.js requires jQuery'
    );
}