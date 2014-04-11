$(document).ready(function () {
    var that = this;
    //authenticated user handling
    this.SESSION_COOKIE_NAME = '__app_session';
    this.USERNAME_COOKIE = "_app_session_user";
    this.account = "";

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

        $('.top_links_user').show();

        $('#lstUserMenu').hide();

        $("#divUserMenu", that).click(function (e) {
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

        $(document).click(function (e) {
            if ($(".appList ul").is(":visible")) {
                $(".appList ul").hide();
                $('.platform-list').removeClass('active');
            }
        });

        $(".appList ul a").click(function (e) {
            if ($(this).attr("href") === '') return;
            window.location = $(this).attr("href");
            self.close();
        });

        $(".platform-list").unbind("click").click(function (e) {
            //hide rest of stuff
            if ($('#lnkUserMenu').hasClass('highlit-menu')) $("#divUserMenu").trigger('click');

            e.preventDefault();
            if ($(".appList ul").is(":visible")) {
                $(this).removeClass('active');
                $(".appList ul").hide();
            }
            else {
                $(this).addClass('active');
                $(".appList ul").show();
            }
            return false;
        });

        $("#lnkLogout").click(function () {
            deleteCookie(that.SESSION_COOKIE_NAME);
            deleteCookie(that.USERNAME_COOKIE);
            $(".top_links_user").hide();
            $("#aLogin").parent().show();
        });
        $("#lnkMyAccount").click(function () {
            window.location = "https://portal.appacitive.com/" + that.account + "/accounts.html?accounts=myaccount";
        });

    } else $("#ulSignIn").show();
    $("#aLogin").attr("href", $("#aLogin").attr("href") + "&ru=" + window.location.href);
});