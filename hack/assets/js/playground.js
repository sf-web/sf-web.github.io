/* global $ */
/* global ace */
/* global jQuery */
jQuery(document).ready(function() {
    /* Font checker */
    (function(c){var b,d,e,f,g,h=c.body,a=c.createElement("div");a.innerHTML='<span style="'+["position:absolute","width:auto","font-size:128px","left:-99999px"].join(" !important;")+'">'+Array(100).join("wi")+"</span>";a=a.firstChild;b=function(b){a.style.fontFamily=b;h.appendChild(a);g=a.clientWidth;h.removeChild(a);return g};d=b("monospace");e=b("serif");f=b("sans-serif");window.isFontAvailable=function(a){return d!==b(a+",monospace")||f!==b(a+",sans-serif")||e!==b(a+",serif")}})(document);

    /* Remove fonts that are not webfonts and are not installed */
    var removeUnavailableFonts = function () {
        var select = $("select.face option"), option, face;
        // skip first entry = Hack,
        // never remove it even when it's not finished loading yet
        for (var i = 1; i < select.length; i++) {
            option = select.eq(i);
            face   = option.text();
            if (!isFontAvailable(face)) {
                if (typeof option.attr("data-webfont") === "undefined") {
                    // no web font available, we must remove this font
                    option.remove();
                    console.info("Removing " + face + ".");
                }
            }
        }
    };
    removeUnavailableFonts();

    /* Editor controls */
    ace.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.0");

    var editors = [];
    var aceInit = function (index) {
        editors[index] = ace.edit("playground" + index);
        editors[index].renderer.setScrollMargin(20);
        editors[index].$blockScrolling = Infinity;
        editors[index].getSession().setUseWorker(false);
    };
    aceInit(1);
    aceInit(2);

    // More info link open in new tab
    $("#moreinfo a").prop("target", "_blank");

    // clone font face control
    var $face_select = $(".styled-select.face.editor1 select")
        .clone();
    $face_select.val($face_select.find("option[data-selected-editor2]").val());
    $(".styled-select.face.editor2 select")
        .replaceWith($face_select);

    // sync editors
    editors[2].setSession(editors[1].getSession());

    var first_run = true;
    $(document).on("change", "select.face", function (ev) {
        var editorIndex = $(this).parent().hasClass("editor2") ? 2 : 1;
        var face = $(this).val();
        $(this).parent().find("span").text(face);
        if (!isFontAvailable(face)
            && face !== 'Hack'
            ) {
            // instruct the loader to fetch this font for us
            var webfont = $(this).find("option:selected").attr("data-webfont"),
                face_folder = face.toLowerCase().split(" ").join("-"),
                config = webfont === "custom"
                    ? {
                        custom: {
                            families: [face],
                            urls: ["assets/fonts/" + face_folder + "/webfont.css"]
                        }
                    }
                    : {
                        google: {
                            families: [face]
                        }
                    };
            WebFont.load(config);
        }
        if (first_run) {
            console.info("Applying face change to all editors");
            for (var i = 1; i < editors.length; i++) {
                editors[i].setOptions({
                    fontFamily: face
                });
            }
            first_run = false;
        } else {
            console.info("Changing editor " + editorIndex + " to " + face);
            editors[editorIndex].setOptions({
                fontFamily: face
            });
        }

        // update more info text
        if (editorIndex === 1) {
            var href = $(this).find("option:selected").attr("data-href");
            $("#moreinfo")
                .find("span").text(face).end()
                .find("a").prop("href", href).text(href).end()
                .css("visibility", "visible");
        }
    });
    $("select.face").trigger("change");
    $("select.size").change(function (ev) {
        var size = $(this).val();
        for (var i = 1; i < editors.length; i++) {
            editors[i].setOptions({
                fontSize: size + "px"
            });
            // clean view for huge sizes
            editors[i].renderer.setShowGutter(size < 100);
            editors[i].setDisplayIndentGuides(size < 50);
            editors[i].renderer.setScrollMargin(size < 100 ? 20 : 0);
        }
    })
    .trigger("change");
    $("select.mode").change(function (ev) {
        var mode = $(this).val();
        editors[1].getSession().setMode(mode);
    })
    .trigger("change");
    $("select.theme").change(function (ev) {
        var theme = $(this).val();
        localStorage.playgroundEditorTheme = theme;
        for (var i = 1; i < editors.length; i++) {
            editors[i].setTheme(theme);
        }
    })
    .val((localStorage && localStorage.playgroundEditorTheme)
        ? localStorage.playgroundEditorTheme
        : "ace/theme/eclipse"
    )
    .trigger("change");

    /* full screen */
    (function () {
        $("a#enter-fullscreen, a#exit-fullscreen").click(function (e) {
            e.preventDefault();
            if ($(window).height() < $(window).width()) {
                $(document.body).addClass("vertical");
            }
            $(document.body).toggleClass("fullscreen");
            $(window).trigger("resize");
        });
        $("a#alignment-horizontal, a#alignment-vertical").click(function (e) {
            e.preventDefault();
            if ($(this).attr("id") === "alignment-vertical") {
                $(document.body).addClass("vertical");
            } else {
                $(document.body).removeClass("vertical");
            }
            $(window).trigger("resize");
            for (var i = 1; i < editors.length; i++) {
                editors[i].resize();
            }
        });
        $(window).resize(function () {
            $("#editors").css("top", $("#editor-controls").outerHeight() + 5);
        });
    })();
});
