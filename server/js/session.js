$(document).ready(function () {
    var that = this;

    var cThemeName = "appacitive-docs-selected-theme";

    //authenticated user handling
    this.SESSION_COOKIE_NAME = '__app_session';
    this.USERNAME_COOKIE = "_app_session_user";
    this.account = "";

    var storeCookie = function (cName, value) {
        if (!value) return;
        document.cookie = cName + "=" + value + ";path=/";
    };
    var readCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    };
    var deleteCookie = function (name) {
        var domain = "domain=.appacitive.com;";
        if (window.location.hostname == "localhost") domain = '';
        document.cookie = name + "=; expires=Thu, 01-Jan-1970 00:00:01 GMT;path=/;" + domain;
    };

    var user = readCookie(this.USERNAME_COOKIE);
    
    if (user) {
        user = unescape(user);
        var split = user.split("|");
        this.account = split[2];
        $(".top_nav_user_name_first").html(split[0]);
        $(".top_nav_user_name_last").html(split[1]);

        if (split.length == 6) $('#imgUserPhoto').attr("src", split[5]);
        else $('#imgUserPhoto').attr("src", "https://secure.gravatar.com/avatar/" + MD5(split[4]) + "?s=40&d=" + escape("https://portal.appacitive.com/styles/images/human.png"));

        $('.top_links_user').removeClass('hide');

        $('#lstUserMenu').hide();

        $("#divUserMenu", that).click(function (e) {

            $(".appList ul").hide();
            $('.platform-list').removeClass('active');
        
            //hide rest of stuff
            if ($(".appList ul").is(":visible")) $(".platform-list").trigger('click');

            var self = this;
            if ($('#lnkUserMenu').hasClass('highlit-menu') == false) {
                if (!that.docEventBinded) {
                    that.docEventBinded = true;

                    $(document).click(function (e) {
                        if ($('#lnkUserMenu').hasClass('highlit-menu') == false) return;
                        $('#lnkUserMenu').toggleClass('highlit-menu');
                        $('#lstUserMenu').hide();
                        $(self).toggleClass('active');
                    });
                }
            }
            $('#lnkUserMenu').toggleClass('highlit-menu');
            $('#lstUserMenu', that).toggle();
            $(self).toggleClass('active');
            e.preventDefault();
            return false;
        });

        $("#lnkLogout").click(function () {
            deleteCookie(that.SESSION_COOKIE_NAME);
            deleteCookie(that.USERNAME_COOKIE);
            $(".top_links_user").addClass('hide');
            $("#ulSignIn").removeClass('hide')
        });
        $("#lnkMyAccount").click(function () {
            window.location = "https://portal.appacitive.com/" + that.account + "/accounts.html?accounts=myaccount";
        });

        $("#lnkApps").click(function () {
            window.location = "https://portal.appacitive.com/" + that.account + "/app-list.html";
        });

    } else $("#ulSignIn").removeClass('hide');

    //platform list handling
    $(document).click(function (e) {
        if ($(".appList ul").is(":visible")) {
            $(".appList ul").hide();
            $('.platform-list').removeClass('active');
        }
    });

    $(".appList ul a").click(function (e) {
        if ($(this).attr("href") === '') return;
        window.location = $(this).attr("href");
    });

    $(".platform-list").unbind("click").click(function (e) {

        var isVisible = false;
        if ($(".appList ul", $(this)).is(":visible")) {
            isVisible = true;
        }

        $(".appList ul").hide();
        $('.platform-list').removeClass('active');
        
        //hide rest of stuff
        if ($('#lnkUserMenu').hasClass('highlit-menu')) $("#divUserMenu").trigger('click');

        e.preventDefault();
        if (isVisible) {
            $(this).removeClass('active');
            $(".appList ul", $(this)).hide();
        } else {
            $(this).addClass('active');
            $(".appList ul", $(this)).show();
        }
        return false;
    });


    var split = window.location.pathname.split('/');
    if (window.location.pathname !== '/' ) {
        var relativeUrl = '/';
        if (window.location.pathname.indexOf('getting-started') != -1) {
            relativeUrl = '/getting-started/installation';
        } else if (window.location.pathname.indexOf('guides.html') != -1) {
            relativeUrl = '/' + split[2] + '/' + split[3];
        } else if (window.location.pathname.indexOf('samples') != -1) {
            relativeUrl = '/samples';
        } else if (window.location.pathname.indexOf('downloads') != -1) {
            relativeUrl = '/downloads';
        }
        $('a', $('.nav-list', '.platform-dropdown')).each(function(i, a) {
            a = $(a);
            if (a.attr('href') !== '/') {
                a.attr('href', a.attr('href') + relativeUrl);
            }
        });
    }

    $("#btnLogin").click(function(e){
        e.preventDefault();
        window.location = 'https://portal.appacitive.com/login.html?rel=devcenter'+ '&ru=' + window.location.href;
        return false;
    });

    //attach theme switch
    var html = '<div class="theme-switch">' +
                    '<a class="theme theme-white" data-theme="white" title="Switch to White theme"></a>' +
                    '<a class="theme theme-black" data-theme="black" title="Switch to Black theme"></a>' +
                '</div>';
    $(html).appendTo($('pre'));

    //Switch theme
    var switchStyle = function (title) {
        var i, links = document.getElementsByTagName("link");
        for (i = 0; i < links.length ; i++) {
            if ((links[i].rel.indexOf("stylesheet") != -1) && links[i].title) {
                links[i].disabled = true;
                if (links[i].title == title) {
                    links[i].disabled = false;
                    storeCookie(cThemeName, title);
                }
            }
        }
    }
    //theme switch anchors
    $(".theme-switch a").unbind("click").click(function () {
        switchStyle($(this).data("theme"));
    });
    var theme = readCookie(cThemeName);
    if (!theme) $(".theme-switch a:first").trigger("click");
    $("*[data-theme='" + theme + "']").trigger("click");

});