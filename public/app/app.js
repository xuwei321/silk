$(function() {
	var d2 = initCanvas("canvas", {debug: true
							, width: $("#canvas").width()
							, height: $("#canvas").height()
							, onDraw: function(plots) {
								d3.addMeshes(plots);
							}});
	d3.init("d3-canvas", {
							container: "#d3-container"
							, width: $("#canvas").width()
							, height: $("#canvas").height()
							, d2Width: d2.canvas.getAttribute("width")
							, d2Height: d2.canvas.getAttribute("height")});
});