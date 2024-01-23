mapboxgl.accessToken =
      'pk.eyJ1IjoiYW5mbzAzIiwiYSI6ImNqbXJyYWYwMjAzenIzd2xiY3Z5djZmMzEifQ._RkhQi3c8bZyvZXTXu3OEA';
var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/satellite-streets-v9',
        center: [13.404661, 52.520682], // starting position
        zoom: 7 // starting zoom
    });

    // Disable default box zooming.
    map.boxZoom.disable();

    map.on('load', function () {
        //Save arrays Coordinates.
        //var myCoords = [];

        var canvas = map.getCanvasContainer();

        // Variable to hold the starting xy coordinates
        // when `mousedown` occured.
        var start;

        // Variable to hold the current xy coordinates
        // when `mousemove` or `mouseup` occurs.
        var current;

        // Variable for the draw the box element.
        var box;

        // Set `true` to dispatch the event before other functions
        // call it. This is necessary for disabling the default map
        // dragging behaviour.
        canvas.addEventListener('mousedown', mouseDown, true);
        canvas.addEventListener('mouseup', onMouseUp, true);

        // Return the xy coordinates of the mouse position
        function mousePos(e) {
            var rect = canvas.getBoundingClientRect();
            return new mapboxgl.Point(
                e.clientX - rect.left - canvas.clientLeft,
                e.clientY - rect.top - canvas.clientTop
            );
        }

        function mouseDown(e) {


            // Continue the rest of the function if the shiftkey is pressed.
            if (!(e.shiftKey && e.button === 0)) return;


            // Disable default drag zooming when the shift key is held down.
            map.dragPan.disable();

            // Call functions for the following events
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('keydown', onKeyDown);

            // Capture the first xy coordinates
            start = mousePos(e);


            map.on('mousedown', function (e) {
                document.getElementsByName("upper")[0].value =   JSON.stringify(e.lngLat);
                document.getElementById('coord1').innerHTML =
                    JSON.stringify(e.lngLat);
                //myCoords.push(e.lngLat);
                //console.log(JSON.stringify(e.lngLat));

                if (box) {
                box.parentNode.removeChild(box);
                box = null;
            }
          })
        }


        function onMouseMove(e) {
            // Capture the ongoing xy coordinates
            current = mousePos(e);

            // Append the box element if it doesnt exist
            if (!box) {
                box = document.createElement('div');
                box.classList.add('boxdraw');
                canvas.appendChild(box);
            }

            var minX = Math.min(start.x, current.x),
                maxX = Math.max(start.x, current.x),
                minY = Math.min(start.y, current.y),
                maxY = Math.max(start.y, current.y);

            // Adjust width and xy position of the box element ongoing
            var pos = 'translate(' + minX + 'px,' + minY + 'px)';
            box.style.transform = pos;
            box.style.WebkitTransform = pos;
            box.style.width = maxX - minX + 'px';
            box.style.height = maxY - minY + 'px';
        }

        function onMouseUp(e) {
            // Capture xy coordinates
            finish([start, mousePos(e)]);

            map.on('mouseup', function (e) {
                    //document.getElementByName("fname").setAttribute("value","my value is high");
                    document.getElementsByName("lower")[0].value =   JSON.stringify(e.lngLat);
                    document.getElementById('coord2').innerHTML = JSON.stringify(e.lngLat);
                    //myCoords.push(e.lngLat);
                    // console.log(JSON.stringify(e.lngLat));
                    var lng1 = e.lngLat.lng;
                    var lat1 = e.lngLat.lat;
                    var lng2 = document.getElementById('coord1').innerHTML.substring(7,24);
                    var lat2 = document.getElementById('coord1').innerHTML.substring(32,48);

                    if (lng1 > lng2) {
                      var tmp = lng1;
                      lng1 = lng2;
                      lng2 = tmp;
                    }

                    if (lat1 > lat2) {
                      var tmp = lat1;
                      lat1 = lat2;
                      lat2 = tmp;
                    }
                    var geohash = ngeohash.encode(38.897, -77.036, 12);
                    console.log(geohash);
                    console.log(lat1);
                    console.log(lat2);
                    console.log(lng1);
                    console.log(lng1);
                    var bboxes = ngeohash.bboxes(lat1, lng1, lat2, lng2);
                    console.log(bboxes);
                })
            map.dragPan.enable();
        }

        function onKeyDown(e) {
            // If the ESC key is pressed
            if (e.keyCode === 27) finish();
        }

        function finish(bbox) {
            // Remove these events now that finish has been called.
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('mouseup', onMouseUp);
        }
    })

function filter() {
    var keyword = document.getElementById("search").value;
    var fleet = document.getElementById("select");
    for (var i = 0; i < fleet.length; i++) {
        var txt = fleet.options[i].text;
        if (txt.substring(0, keyword.length).toLowerCase() !== keyword.toLowerCase() && keyword.trim() !== "") {
            fleet.options[i].style.display = 'none';
        } else {
            fleet.options[i].style.display = 'list-item';
        }
    }
}

function patchIdsWithSelectedLabels() {
  var selectedLabels = document.getElementById('select').selectedOptions;
  for (var j = 0; j < selectedLabels.length; j++) {
      console.log(selectedLabels[j].index);
      console.log(selectedLabels[j].innerHTML);
  }
}

function clearCoordinates() {
   document.getElementsByName("lower")[0].value =   JSON.stringify('');
   document.getElementsByName("upper")[0].value =   JSON.stringify('');
   document.getElementsByName("coord1")[0].value =   JSON.stringify('');
   document.getElementsByName("coord2")[0].value =   JSON.stringify('');
}
