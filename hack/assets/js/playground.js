/* global $ */
/* global ace */
/* global jQuery */
jQuery(document).ready(function() {
    /* Font checker */
    (function(c){var b,d,e,f,g,h=c.body,a=c.createElement("div");a.innerHTML='<span style="'+["position:absolute","width:auto","font-size:128px","left:-99999px"].join(" !important;")+'">'+Array(100).join("wi")+"</span>";a=a.firstChild;b=function(b){a.style.fontFamily=b;h.appendChild(a);g=a.clientWidth;h.removeChild(a);return g};d=b("monospace");e=b("serif");f=b("sans-serif");window.isFontAvailable=function(a){return d!==b(a+",monospace")||f!==b(a+",sans-serif")||e!==b(a+",serif")}})(document);

    /* Remove fonts that are not webfonts and are not installed */
    var removeUnavailableFonts = function () {
        var select = $('#face option'), option, face;
        // skip first entry = Hack,
        // never remove it even when it's not finished loading yet
        for (var i = 1; i < select.length; i++) {
            option = select.eq(i);
            face   = option.text();
            if (!isFontAvailable(face)) {
                if (typeof option.attr('data-webfont') === "undefined") {
                    // no web font available, we must remove this font
                    option.remove();
                }
            }
        }
    };
    removeUnavailableFonts();

    /* Editor controls */
    ace.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0");
    var editor = ace.edit("playground");
    editor.renderer.setScrollMargin(20);
    editor.getSession().setUseWorker(false);

    // More info link open in new tab
    $('#moreinfo a').prop('target', '_blank');

    $('#face').change(function (ev) {
        var face = $(this).val();
        $(this).parent().find("span").text(face);
        if (!isFontAvailable(face)
            && face !== 'Hack'
        ) {
            // instruct the loader to fetch this font for us
            var webfont     = $(this).find("option:selected").attr('data-webfont'),
                face_folder = face.toLowerCase().split(" ").join("-"),
                config      = webfont === "custom"
                    ? {
                            custom: {
                                families: [face],
                                urls: ['assets/fonts/' + face_folder + '/webfont.css']
                            }
                        }
                    : {
                            google: {
                                families: [face]
                            }
                        };
            WebFont.load(config);
        }
        editor.setOptions({
            fontFamily: face
        });

        // update more info text
        var href = $(this).find("option:selected").attr('data-href');
        $('#moreinfo')
        .find('span').text(face).end()
        .find('a').prop('href', href).text(href).end()
        .css('visibility', 'visible');
    })
    .trigger("change");
    $('#size').change(function (ev) {
        var size = $(this).val();
        $(this).parent().find("span").text(size);
        editor.setOptions({
            fontSize: size + "pt"
        });
    })
    .trigger("change");
    $('#mode').change(function (ev) {
        var mode = $(this).val(),
            displayMode = $(this).find("option:selected").text();
        $(this).parent().find("span").text(displayMode);
        editor.getSession().setMode(mode);
    })
    .trigger("change");
    $('#theme')
    .val((localStorage && localStorage.playgroundEditorTheme)
        ? localStorage.playgroundEditorTheme
        : 'ace/theme/monokai'
    )
    .change(function (ev) {
        var theme = $(this).val(),
            displayTheme = $(this).find("option:selected").text();
        $(this).parent().find("span").text(displayTheme);
        localStorage.playgroundEditorTheme = theme;
        editor.setTheme(theme);
    })
    .trigger("change");
});
