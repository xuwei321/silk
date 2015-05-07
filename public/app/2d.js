function initCanvas(elem, props) {
    var drawHistory = false;
    var canvas = document.getElementById(elem);
    var ctx = canvas.getContext('2d');
    var color = props.strokeColor || "red";

    canvas.width = props.width || Math.min(document.documentElement.clientWidth, window.innerWidth || 300);
    // canvas.height = props.height || Math.min(document.documentElement.clientHeight, window.innerHeight || 300);
    canvas.height = window.innerHeight;


    ctx.strokeStyle = color;
    ctx.lineWidth = props.strokeWidth || '2';
    ctx.lineCap = ctx.lineJoin = 'round';

    var isTouchSupported = 'ontouchstart' in window;
    var isPointerSupported = navigator.pointerEnabled;
    var isMSPointerSupported = navigator.msPointerEnabled;
    var debug = props.debug;

    var downEvent = isTouchSupported ? 'touchstart' : (isPointerSupported ? 'pointerdown' : (isMSPointerSupported ? 'MSPointerDown' : 'mousedown'));
    var moveEvent = isTouchSupported ? 'touchmove' : (isPointerSupported ? 'pointermove' : (isMSPointerSupported ? 'MSPointerMove' : 'mousemove'));
    var upEvent = isTouchSupported ? 'touchend' : (isPointerSupported ? 'pointerup' : (isMSPointerSupported ? 'MSPointerUp' : 'mouseup'));

    canvas.addEventListener(downEvent, startDraw, false);
    canvas.addEventListener(moveEvent, draw, false);
    canvas.addEventListener(upEvent, endDraw, false);

    var channel = 'draw';

    /* Draw on canvas */
    function drawOnCanvas(color, plots) {
        if (plots.length <= 1) {
            return;
        }
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(plots[plots.length -2].x, plots[plots.length -2].y);
        ctx.lineTo(plots[plots.length -1].x, plots[plots.length -1].y);
        ctx.stroke();

        // for (var i = 1; i < plots.length; i++) {
        //     ctx.lineTo(plots[i].x, plots[i].y);
        // }
        /**
        if(lastPt!=null) {
          ctx.beginPath();
          ctx.moveTo(lastPt.x, lastPt.y);
          ctx.lineTo(e.touches[0].pageX, e.touches[0].pageY);
          ctx.stroke();
        }
        lastPt = {x:e.touches[0].pageX, y:e.touches[0].pageY};
        */
    }

    var isActive = false;
    var plots = [];
    var paths = [];

    function draw(e) {
        e.preventDefault(); // prevent continuous touch event process e.g. scrolling!
        if (!isActive) return;

        var x = isTouchSupported ? (e.targetTouches[0].pageX - canvas.offsetLeft) : (e.offsetX || e.layerX - canvas.offsetLeft);
        var y = isTouchSupported ? (e.targetTouches[0].pageY - canvas.offsetTop) : (e.offsetY || e.layerY - canvas.offsetTop);
        if (plots.length > 0 && Math.abs(plots[plots.length -1].x - x) <= 1 && Math.abs(plots[plots.length -1].y - y) <= 1) {
            return;
        }

        plots.push({
            x: (x << 0),
            y: (y << 0)
        }); 
        // round numbers for touch screens
        drawOnCanvas(color, plots);
    }

    function startDraw(e) {
        e.preventDefault();
        isActive = true;
    }

    function endDraw(e) {
        e.preventDefault();
        isActive = false;
        paths.push(plots);
        if (props.onDraw) props.onDraw.call(null, plots);
        plots = [];
    }

    var getPaths = window.getPaths = function() {
      return paths;
    };

    return {
        canvas: canvas,
        getPaths: getPaths
    }
};