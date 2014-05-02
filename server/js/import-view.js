$(document).ready(function () {

	var template = '<div id="myModal" class="modal fade">	\
  						<div class="modal-dialog">	\
						    <div class="modal-content">	\
						    	<div class="modal-header">	\
						        	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>	\
						        	<h4 class="modal-title">Data Import Tool</h4>	\
						      	</div>	\
						      	<div class="modal-body">	\
						        	<p style="padding-bottom:25px">Please provide your application details</p>	\
						        	<form class="form-horizontal" role="form"> \
						        		<div class="form-group"> \
								        	<label for="inputAppId" class="col-sm-3 control-label">Application Id</label> \
					        				<div class="col-sm-9">	\
										    	<input type="text" class="form-control" id="inputAppId" placeholder="Application Id">	\
										    </div>	\
									    </div>	\
									    <div class="form-group" style="margin-bottom:5px"> \
								        	<label for="inputAPIKey" class="col-sm-3 control-label">API Key</label> \
					        				<div class="col-sm-9">	\
										    	<input type="text" class="form-control" id="inputAPIKey" placeholder="API Key">	\
										    </div>	\
									    </div>	\
							        </form>  \
							        <div class="import-log hide">	\
							        	<p>Starting Import</p>	\
							        </div>	\
						      	</div>	\
						      	<div class="modal-footer">	\
						        	<button id="btnStartImport" type="button" class="btn btn-primary" data-loading-text="Importing">Import</button>	\
						      	</div>	\
					    	</div><!-- /.modal-content -->	\
					  	</div><!-- /.modal-dialog -->	\
					</div>';

	//show the modal
	$('#aImportTool').click(function (e) {
		$(template).appendTo($(document.body));
		$('#myModal').modal({ keyboard: false });
		$('#btnStartImport').click(function (e) {
			$('.has-error').removeClass('has-error');
			//validation
			if($('#inputAppId').val().trim() === '') $('#inputAppId').closest('.form-group').addClass('has-error');
			if($('#inputAPIKey').val().trim() === '') $('#inputAPIKey').closest('.form-group').addClass('has-error');
			if($('.has-error').length > 0) return;

			//start the import
			var that = $(this);
			that.button('loading');
			
			//show logs
			$('.import-log').removeClass('hide');

			window.importData.start({
				apiKey: $('#inputAPIKey').val().trim(),
				appId: $('#inputAppId').val().trim(),
				logCallback: function (info) {
					$('<p></p>').html(info).appendTo($('.import-log'));
				},
				doneCallback:function () {
					that.button('reset');
					that.html('Close');
					that.unbind('click').click(function(){
						$('#myModal').modal('hide');
					});
				}
			});
		})
	});

	function inlcudeJS (fileName) {
		var wf = document.createElement('script');
	    wf.src = '/js/imports/' + fileName + '.js';
	    wf.type = 'text/javascript';
	    wf.async = 'false';
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(wf, s);
	}

	//read the data attribute and include the JS on the fly which will do actual import
	if($('#aImportTool').data('js') && $('#aImportTool').data('js') != '')
		inlcudeJS($('#aImportTool').data('js'));

});