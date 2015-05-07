$(function() {


	var d2 = initCanvas("canvas", {debug: true
							, width: $("#canvas").width()
							, height: $("#canvas").height()
							, onDraw: function(plots) {
								// d3.addMeshes(plots);
							}});
	// d3.init("d3-canvas", {
	// 						container: "#d3-container"
	// 						, width: $("#canvas").width()
	// 						, height: $("#canvas").height()
	// 						, d2Width: d2.canvas.getAttribute("width")
	// 						, d2Height: d2.canvas.getAttribute("height")});

	$('.nav-tabs a').click(function (e) {
	  e.preventDefault();
	  if ($(this).text() == '3D') {
		d3.init("d3-canvas", {
								container: "#d3-container"
								, width: $("#canvas").width()
								, height: $("#canvas").height()
								, d2Width: d2.canvas.getAttribute("width")
								, d2Height: d2.canvas.getAttribute("height")});
		for (var i = d2.getPaths().length - 1; i >= 0; i--) {
			d3.addMeshes(d2.getPaths()[i]);
		}
	  } else {
	  	$("#d3-container").html("");
	  }

  	  $(this).tab('show');
	});
});