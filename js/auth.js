$(document).ready(function () {
	var CLIENT_ID = "64a0b705-0799-4ae6-a8c3-2203dd6b38e5",
	CLIENT_SECRET = "thYabTrtTZwXpjF7943MjVU",
	REDIRECT_URL = "http://omarsilva.net/demos/note2",
	SCOPE = "office.onenote_update wl.signin",
	COOKIE_NAME = "Atkn";

	$.auth = ({
		login: function () {
			var url = "https://login.live.com/oauth20_authorize.srf?"
			+ "response_type=token"
			+ "&client_id=" + CLIENT_ID
			+ "&redirect_uri=" + REDIRECT_URL
			+ "&scope=" + SCOPE;
			$(location).attr('href', encodeURI(url));
		},

		logout: function () {
			Cookies.remove(COOKIE_NAME);
			var url = "https://login.live.com/oauth20_logout.srf"
			+ "?client_id=" + CLIENT_ID
			+ "&redirect_uri=" + REDIRECT_URL;
			$(location).attr('href', encodeURI(url));
		},

		authorized: function () {
			return (Cookies.get(COOKIE_NAME)) ? true : false;
		}
	})

	var params = $.deparam(location.hash.substring(1));
	if (params.access_token && !$.auth.authorized()) {
		Cookies.set(COOKIE_NAME, params.access_token, { expires: new Date().getTime() + 3600 });
	}
});
