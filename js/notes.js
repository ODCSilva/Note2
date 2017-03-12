$(document).ready(function () {

	$.notes = ({
		/**
		 * API call to get note collection.
		 */
		index: function (callback, errorCallback) {
			var url = "https://www.onenote.com/api/v1.0/me/notes/pages?select=id%2Ctitle";

			$.ajax({
				method: 'GET',
				url: url,
				headers: {
					Authorization: "Bearer " + Cookies.get('Atkn')
				},
				dataType: "json",
				success: function (data) {
					if (typeof callback == 'function') {
						callback(data);
					}
					else {
						return undefined;
					}
				},
				error: function (xhr, status, err) {
					if (typeof errorCallback == 'function') {
						errorCallback(status);
					}
				}
			});
		},

		/**
		 * API call to get the contents of a particular note.
		 */
		show: function(id, callback, errorCallback) {
			var url = "https://www.onenote.com/api/v1.0/me/notes/pages/" + id + "/content?preAuthenticated=true&includeIDs=true",
			token = Cookies.get('Atkn');

			$.ajax({
				method: 'GET',
				url: url,
				headers: {
					Authorization: "Bearer " + token
				},
				dataType: "html",
				success: function (data) {
					if (typeof callback == 'function') {
						callback(data);
					}
					else {
						return undefined;
					}
				},
				error: function (xhr, status, err) {
					if (typeof errorCallback == 'function') {
						errorCallback(status);
					}
				}
			});
		},

		/**
		 * API call to delete a note.
		 */
		destroy: function (id, callback, errorCallback) {
			var url ="https://www.onenote.com/api/v1.0/me/notes/pages/" + id + "/",
			token = Cookies.get('Atkn');

			$.ajax({
				method: 'DELETE',
				url: url,
				headers: {
					Authorization: "Bearer " + token
				},
				success: function () {
					if (typeof callback == 'function') {
						callback();
					}
				},
				error: function (xhr, status, err) {
					if (typeof errorCallback == 'function') {
						errorCallback(status);
					}
				}
			});
		},

		/**
		 * API call to crete a new note.
		 */
		create: function (content, title, callback, errorCallback) {
			var url = "https://www.onenote.com/api/v1.0/me/notes/pages",
			token = Cookies.get('Atkn'),
			body = '<?xml version="1.0" encoding="utf-8" ?>'
			+ '<html xmlns="http://www.w3.org/1999/xhtml" lang="en-us">'
			+ '<head>'
			+ '<title>' + title + '</title>'
			+ '<meta name="created" content="' + new Date().toISOString() + '" />'
			+ '</head>'
			+ '<body>'
			+ content
			+ '</body>'
			+ '</html>';

			$.ajax({
				method: 'POST',
				url: url,
				headers: {
					'Authorization': "Bearer " + token,
					'Content-Type': 'application/xhtml+xml',
				},
				data: body,
				dataType: 'json',
				success: function(data) {
					if (typeof callback == 'function') {
						callback(data);
					}
					else {
						return undefined;
					}
				},
				error: function (xhr, status, err) {
					if (typeof errorCallback == 'function') {
						ererrorCallbackr(err);
					}
				}
			});
		},

		/**
		 * API call to update a note.
		 */
		update: function(id, content, callback, errorCallback) {
			var url = "https://www.onenote.com/api/v1.0/me/notes/pages/" + id + "/content",
			token = Cookies.get('Atkn');

			$.ajax({
				method: 'PATCH',
				url: url,
				headers: {
					'Authorization': "Bearer " + token,
					'Content-Type': 'application/json',
				},
				data: "[{"
				+"'target': '#_default',"
				+"'action': 'replace',"
				+"'content': '"+ content +"'"
				+"}]",
				success: function() {
					if (typeof callback == 'function') {
						callback();
					}
				},
				error: function (xhr, status, err) {
					if (typeof errorCallback == 'function') {
						errorCallback(status);
					}
				}
			});
		}
	});
});
