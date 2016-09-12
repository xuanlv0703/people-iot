"use strict";
app.controller('peopleIOTCtrl', ['$scope', 'ConfigService', '$http', '$filter', 'DTOptionsBuilder',
    'DTColumnBuilder', '$state', '$compile',
    function($scope, ConfigService, $http, $filter, DTOptionsBuilder, DTColumnBuilder, $state, $compile) {

        var host = ConfigService.host;
        $scope.host = host;
        var zoneId = "0d71d5f0-137e-11e6-9361-91bcf9411721";
        $scope.zoneId = zoneId;
        $scope.devicelist = '';

        $http.get(host + "/api/deployzonedevice/getDeviceDeployment/" + zoneId).success(function(res) {
            $scope.devicelist = res.data;
        });

        $scope.dtOptions = DTOptionsBuilder.fromSource("assets/data/peopleIOT.json")
            .withOption('fnRowCallback', function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                $compile(nRow)($scope);
            })
            .withOption('initComplete', function() {
                $('#btnSearch').on('click', function() {
                    console.log('btnSearch');
                    $scope.dtInstance.DataTable.search($('#search').val()).draw();
                })
            })
            .withOption('order', [0, 'desc'])
            .withOption('bLengthChange', false);
        $scope.dtColumns = [
            DTColumnBuilder.newColumn('number').withTitle('Number'),
            DTColumnBuilder.newColumn('username').withTitle('User Name'),
            DTColumnBuilder.newColumn('userid').withTitle('Userid'),
            DTColumnBuilder.newColumn('ipv6').withTitle('IPv6'),
            DTColumnBuilder.newColumn('action').withTitle('Action'),
            DTColumnBuilder.newColumn('room').withTitle('Room'),
            DTColumnBuilder.newColumn('time').withTitle('Time'),
            DTColumnBuilder.newColumn('id').renderWith(getOption),
        ];
        $scope.dtInstance = {};

        function getOption(data, type, full, meta) {
            return '<p class="seemore" ng-click="seeMore(\'' + data + '\')">See More</p>';
        }
        $scope.seeMore = function(data) {
            $state.go('home.peopleiot.replayvideo');
        }

        function getMouseCoords(event, canvas) {
            var pointer = canvas.getPointer(event.e);
            var posX = pointer.x;
            var posY = pointer.y;
            console.log(posX + ", " + posY); // Log to console
        }
        var canvas = undefined;
        var devicelist = undefined;
        var objArray = [];

        var deviceidlist = [];
        var zoneimage;
        //global variables 
        var canvasScale = 1; //global
        var SCALE_FACTOR = 1.25; //global 

        devicelist = angular.element(document.getElementById('content')).scope().devicelist;
        $http.get(host + "/api/deployzonedevice/getZoneImage/" + zoneId).then(function(response) {
            zoneimage = response.data.data[0].zoneimage;
            loadImages(canvas, zoneimage);
            loadDevices($scope.devicelist);
        })
        canvas = new fabric.Canvas('canvas', { selection: false });
        canvas.on('mouse:down', function(e) {
            getMouseCoords(e, canvas);
        });
        canvas.on({
            'object:selected': objectSelected
        });

        function loadImages(canvas, zoneimage) {
            var img = new Image();
            img.onload = function() {
                var imgWidth = this.width;
                var imgHeight = this.height;
                canvas.setHeight(imgHeight);
                canvas.setWidth(imgWidth);
                canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
                    originX: 'left',
                    originY: 'top',
                    left: 0,
                    top: 0
                });
                var grid = 60;
                // create grid
                for (var i = 0; i < (imgWidth / grid); i++) {
                    var text = new fabric.Text(i + '', {
                        top: i * grid,
                        left: 0,
                        fontSize: 18,
                        borderColor: '#ccc',
                        opacity: 1,
                        fontFamily: "helvetica"
                    }).setOpacity(0.5);
                    var text1 = new fabric.Text(i + '', {
                        top: 0,
                        left: i * grid,
                        fontSize: 18,
                        borderColor: '#ccc',
                        opacity: 1,
                        fontFamily: "helvetica"
                    }).setOpacity(0.5);
                    canvas.add(text);
                    canvas.add(text1);
                    canvas.add(new fabric.Line([i * grid, 0, i * grid, imgHeight], { stroke: '#ccc', selectable: false }));
                    canvas.add(new fabric.Line([0, i * grid, imgWidth, i * grid], { stroke: '#ccc', selectable: false }));
                }
            };
            img.src = zoneimage;
        }

        $scope.zoomOut = function() {

            canvasScale = canvasScale / SCALE_FACTOR;
            canvas.setHeight(canvas.getHeight() * (1 / SCALE_FACTOR));
            canvas.setWidth(canvas.getWidth() * (1 / SCALE_FACTOR));

            var objects = canvas.getObjects();
            for (var i in objects) {
                var scaleX = objects[i].scaleX;
                var scaleY = objects[i].scaleY;
                var left = objects[i].left;
                var top = objects[i].top;

                var tempScaleX = scaleX * (1 / SCALE_FACTOR);
                var tempScaleY = scaleY * (1 / SCALE_FACTOR);
                var tempLeft = left * (1 / SCALE_FACTOR);
                var tempTop = top * (1 / SCALE_FACTOR);
                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;

                objects[i].setCoords();

            }
            var img = new Image();
            img.onload = function() {
                var imgWidth = this.width;
                var imgHeight = this.height;
                canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
                    originX: 'left',
                    originY: 'top',
                    top: 0,
                    left: 0,
                    scaleY: canvas.height / img.height,
                    scaleX: canvas.width / img.width
                });
            };
            img.src = zoneimage;
            canvas.renderAll();
        }

        $scope.zoomIn = function() {
            canvasScale = canvasScale * SCALE_FACTOR;
            canvas.setHeight(canvas.getHeight() * SCALE_FACTOR);
            canvas.setWidth(canvas.getWidth() * SCALE_FACTOR);
            var objects = canvas.getObjects();
            for (var i in objects) {
                var scaleX = objects[i].scaleX;
                var scaleY = objects[i].scaleY;
                var left = objects[i].left;
                var top = objects[i].top;

                var tempScaleX = scaleX * SCALE_FACTOR;
                var tempScaleY = scaleY * SCALE_FACTOR;
                var tempLeft = left * SCALE_FACTOR;
                var tempTop = top * SCALE_FACTOR;

                objects[i].scaleX = tempScaleX;
                objects[i].scaleY = tempScaleY;
                objects[i].left = tempLeft;
                objects[i].top = tempTop;

                objects[i].setCoords();
            }
            var img = new Image();
            img.onload = function() {
                var imgWidth = this.width;
                var imgHeight = this.height;
                canvas.setBackgroundImage(img.src, canvas.renderAll.bind(canvas), {
                    originX: 'left',
                    originY: 'top',
                    top: 0,
                    left: 0,
                    scaleY: canvas.height / img.height,
                    scaleX: canvas.width / img.width
                });
            };
            img.src = zoneimage;
            canvas.renderAll();
        }

        function objectSelected() {
            var activeObject = canvas.getActiveObject();
            // console.log(activeObject.deviceId);
        }

        function loadDevices(devicelist) {
            var object = undefined;
            for (var i = devicelist.length - 1; i >= 0; i--) {
                if (devicelist[i].coordinatex) {
                    object = new fabric.Triangle({
                        top: parseInt(devicelist[i].coordinatex),
                        left: parseInt(devicelist[i].coordinatey),
                        type: devicelist[i].type,
                        width: 20,
                        height: 20,
                        fill: 'rgb(21,114,153)',
                        stroke: '',
                        strokeWidth: 1,
                        deviceId: devicelist[i].deviceid,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockMovementX: true,
                        lockMovementY: true
                    });
                    objArray.push(object);
                    canvas.add(object);
                    canvas.renderAll();
                }
                // deviceidlist.push(devicelist[i].deviceid);
            }
        };

        // var socket = io.connect();
        var socket = io.connect('http://people-rutledge.apps.openshift.rasia');

        var x = undefined;
        var y = undefined;
        var id = undefined;
        socket.on('data', function(msg) {

            objArray.map(function(o) {
                if (o.deviceId == '587B72467F0976A5') {
                    o.remove();
                }
            })
            console.log(msg);
            x = msg.position[1] * 60 * canvasScale;
            y = msg.position[0] * 60 * canvasScale;
            id = msg.mobile;
            console.log(x + "," + y);
            var wallRelay = new fabric.Circle({
                top: x,
                left: y,
                width: 20,
                height: 20,
                stroke: '',
                radius: 10 * canvasScale,
                strokeWidth: 1,
                fill: 'rgb(0,191,0)',
                lockScalingX: true,
                lockScalingY: true,
                type: 'wallRelay',
                deviceId: id
            })
            objArray.push(wallRelay);
            canvas.add(wallRelay);
        });

    }
])
