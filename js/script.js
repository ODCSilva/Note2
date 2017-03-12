$(document).ready(function () {

	/**
	* Toastr initialization.
	*/
	toastr.options = {
		"closeButton": false,
		"debug": false,
		"newestOnTop": false,
		"progressBar": false,
		"positionClass": "toast-bottom-center",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "20",
		"hideDuration": "1000",
		"timeOut": "2000",
		"extendedTimeOut": "1000",
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut"
	}

	/**
	* Large spinner preset.
	*/
	$.fn.spin.presets.editor = {
		lines: 9 // The number of lines to draw
		, length: 5 // The length of each line
		, width: 6 // The line thickness
		, radius: 11 // The radius of the inner circle
		, scale: 2.25 // Scales overall size of the spinner
		, corners: 1 // Corner roundness (0..1)
		, color: '#d9534f' // #rgb or #rrggbb or array of colors
		, opacity: 0.15 // Opacity of the lines
		, rotate: 58 // The rotation offset
		, direction: 1 // 1: clockwise, -1: counterclockwise
		, speed: 1 // Rounds per second
		, trail: 100 // Afterglow percentage
		, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
		, zIndex: 2e9 // The z-index (defaults to 2000000000)
		, className: 'spinner' // The CSS class to assign to the spinner
		, top: '50%' // Top position relative to parent
		, left: '50%' // Left position relative to parent
		, shadow: false // Whether to render a shadow
		, hwaccel: false // Whether to use hardware acceleration
		, position: 'absolute' // Element positioning
	}

	/**
	* Spinner preset.
	*/
	$.fn.spin.presets.small = {
		lines: 9 // The number of lines to draw
		, length: 5 // The length of each line
		, width: 6 // The line thickness
		, radius: 11 // The radius of the inner circle
		, scale: 1.0 // Scales overall size of the spinner
		, corners: 1 // Corner roundness (0..1)
		, color: '#d9534f' // #rgb or #rrggbb or array of colors
		, opacity: 0.15 // Opacity of the lines
		, rotate: 58 // The rotation offset
		, direction: 1 // 1: clockwise, -1: counterclockwise
		, speed: 1 // Rounds per second
		, trail: 100 // Afterglow percentage
		, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
		, zIndex: 2e9 // The z-index (defaults to 2000000000)
		, className: 'spinner' // The CSS class to assign to the spinner
		, top: '50%' // Top position relative to parent
		, left: '50%' // Left position relative to parent
		, shadow: false // Whether to render a shadow
		, hwaccel: false // Whether to use hardware acceleration
		, position: 'absolute' // Element positioning
	}

	/**
	* Fit function.
	*/
	var fit = function() {
		$("#content").css("top", $("#mainNav").css("height"));
		$("#content").outerHeight($(document).height() - $("#mainNav").outerHeight());
		$('textarea').ckeditor().editor.resize('100%', $('#noteContent').height());
	}

	/**
	* Initialize ckeditor.
	*/
	$('textarea').ckeditor({
		extraPlugins: 'fixed',
	}, function () {
		fit();
	});

	/**
	* Check if token is present.
	*/
	if ($.auth.authorized()) {
		updateList();
	}
	else {
		$('#splashScreen').removeClass('hidden');
	}

	/**
	 * Error handling function.
	 */
	var error = function(err) {
		toastr["error"](err);
	}

	/**
	* Clicked login button.
	*/
	$("#loginButton").click(function () {
		$.auth.login();
	});

	/**
	* Fit contents to window.
	*/
	var fitContent = function () {
		setTimeout(function () {
			fit();
		}, 200);
	}

	/**
	* Resize contents on window resize. Doesn't work...
	*/
	$(window).on('resize', function () { fitContent() });

	/**
	* Make API call to get note collection and display them in the note list
	*/
	function updateList() {
		$('#notes').spin('small');
		$.notes.index(function(data) {
			$.each(data.value, function(k, v) {
				var title = (v.title) ? v.title : "Untitled",
				html = "<li class='nav-item'>"
				+ "<a class='nav-link ws text-danger' href='#' data-id='" + v.id + "'>"
				+ title
				+ "</a>"
				+ "</li>";
				$("#notes").hide().append(html);
			}, error);
			$('#notes').spin(false);
			$("#notes").find('a').hide();
			$("#notes").show(0, function () {
				$('#notes').find('a').slideDown('slow');
			});
		});
	}

	/**
	* Clicked item on the note list.
	*/
	$("#notes").on('click', 'a', function () {

		if (!$(this).hasClass('active')) {
			if (!$('#saveButton').hasClass('disabled')) {
				$('#nextNoteId').val($(this).data('id'));
				$('#discardChangesModal').modal();
			}
			else {

				var editor = $('textarea').ckeditor().editor;
				$("#notes").find("a").removeClass("active");
				$(this).addClass("active");
				$('#documentTitle').html($(this).text());
				editor.setData('');
				$('#noteContent').spin('editor');

				$.notes.show($(this).data('id'), function(htmlDoc) {
					var innerContent = $(htmlDoc).filter('div').html();

					editor.setData(innerContent);
					editor.setReadOnly(true);
					$("#noteContent").spin(false);
					$('#deleteButton').removeClass('disabled');
					$('#editButton').removeClass('disabled');
					$('#saveButton').addClass('disabled');
				}, error);
			}
		}
	});

	/**
	* Edit button cliked disable it and enable editor.
	*/
	$("#editButton").click(function() {
		if (!$('#editButton').hasClass('disabled')) {
			$('textarea').ckeditor().editor.setReadOnly(false);
			$('textarea').addClass('editable');
			$(this).addClass('disabled');
			$('#saveButton').removeClass('disabled');
		}
	});

	/**
	* About menu item cliked.
	*/
	$("#about_link").click(function () {
		$("#about").modal();
	});

	/**
	* Delete button clicked, prompt user for confirmation.
	*/
	$("#deleteButton").click(function () {
		var id = $('#notes').find('.active').data('id');
		if (id) {
			$("#deleteNoteModal").modal();
		}
	});

	/**
	* Delete modal show event.
	*/
	$("#deleteNoteModal").on('show.bs.modal', function(e) {
		var note = $('#notes').find('.active'),
		title = note.html(),
		modal = $(this),
		body = "<p>You're about to delete the note titled: <strong>" + title + "</strong>. "
		+ "This procedure is irreversible.</p><p>Are you sure you want to proceed?</p>";

		modal.find('#title').html("Confirm Note Delete");
		modal.find('#body').html(body);
	});

	/**
	* Confirm note deletion.
	*/
	$('#discardChangesModal').on('click', '.btn-ok', function () {
		$('#discardChangesModal').modal('hide');
		var selected = $('#notes').find('a[data-id="' + $('#nextNoteId').val() + '"]');
		$('#saveButton').addClass('disabled');
		selected.trigger('click');
	});

	/**
	* Delete note.
	*/
	$("#deleteNoteModal").on('click', '.btn-ok', function(e) {
		var note = $('#notes').find('.active'),
		id = note.data('id');

		if (id) {
			$('#noteContent').spin('editor');
			$.notes.destroy(id, function () {
				note.slideUp('slow', function() {
					$(this).remove();
				});
				$('textarea').ckeditor().editor.setReadOnly(true);
				$('textarea').ckeditor().editor.setData('');
				$('#editButton').removeClass('active');
				$('#editButton').addClass('disabled');
				$('#documentTitle').html("");
				$('#noteContent').spin(false);
				toastr["info"]("Note Deleted");
			}, error);
		}
	});

	/**
	* Add new note.
	*/
	$('#addButton').click(function () {
		$("#notes").find("a").removeClass("active");
		$('textarea').ckeditor().editor.setData('');
		$('textarea').ckeditor().editor.setReadOnly(false);
		$('textarea').ckeditor().editor.focus();
		$('#documentTitle').html("Untitled");
		$('#saveButton').removeClass('disabled');
		$('#editButton').addClass('disabled');
	});

	/**
	* Save note.
	*/
	$('#saveButton').click(function() {
		if(!$('#saveButton').hasClass('disabled')){
			var active = $('#notes').find('.active'),
			content,
			id;

			if (active.length == 0) {
				$('#newFileNameModal').modal();
			}
			else {
				content = $('textarea').ckeditor().editor.getData();
				id = active.data('id');
				$.notes.update(id, content, function() {
					toastr["success"]("Saved!");
					$('#saveButton').addClass('disabled');
				}, error);
			}
		}
	});

	/**
	* Modal for note title input.
	*/
	$('#newFileNameModal').on('click', '.btn-ok', function() {
		var title = $("#titleInput").val(),
		content = $('textarea').ckeditor().editor.getData();
		$('#newFileNameModal').modal('hide');

		// Check for duplicate note titles.
		var dupes = $('#notes').find('a').filter(function () {
			return $(this).text() === title;
		});

		if (dupes.length == 0) {
			$.notes.create(content, title, function (note) {
				toastr["success"]("Note created!");
				var html = "<li class='nav-item'>"
				+ "<a class='nav-link ws text-danger' href='#' data-id='" + note.id + "'>"
				+ note.title
				+ "</a>"
				+ "</li>";

				$("#notes").prepend(html).slideDown('slow');
			}, error);
		}
		else {
			genericModal('Duplicate file name', 'Notes must not contain duplicate titles, try again.')
		}
	});

	/**
	* Filter notes.
	*/
	$('#search').on('input', function() {

		var value = $(this).val();

		if (value) {
			$('#notes').find('a').hide(0);
			$("#notes").find('a:contains('+value+')').show(0);
		}
		else {
			$('#notes').find('a').show(0);
		}
	});

	/**
	* Call a generic modal dialog, with title and body.
	*/
	function genericModal(title, body) {
		$("#genericModal").find(".modal-title").text(title);
		$("#genericModal").find(".modal-body").html(body);
		$('#genericModal').modal();
	}

	/**
	* Event fired when editor is changed.
	*/
	$('textarea').ckeditor().editor.on('change', function() {
		//$('#saveButton').removeClass('disabled');
	});

	/**
	 * Sign out.
	 */
	 $('#signout').click(function() {
		 $.auth.logout();
	 });
});
