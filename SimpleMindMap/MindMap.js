$(document).ready(function() {
    getLastChangeServer();
    //setXYMap();
});

function getLastChangeServer() {
    fetch("getLastChange", {
        method: "GET",
    }).then(res => {
        return res.text();
    }).then(text => {
        if (parseInt(text) > parseInt(localStorage.getItem("lastChange")) || localStorage.getItem("counter") == null || localStorage.getItem("lastChange") == null) {
            getCounterServer();
        } else {
            saveMap();
            drawNodes();
        }
    });
}

function getCounterServer() {
    fetch("getCounter", {
        method: "GET",
    }).then(res => {
        return res.text();
    }).then(text => {
        localStorage.setItem("counter", text);
        getMapServer();
    });
}

function getMapServer() {
    var mapData = fetch("getMap", {
        method: "GET",
    }).then(res => {
        return res.text();
    }).then(data => {
        var lastChange = localStorage.getItem("lastChange");
        var counter = localStorage.getItem("counter");
        localStorage.clear();
        localStorage.setItem("lastChange", lastChange);
        localStorage.setItem("counter", counter);
        const lines = data.split(/\r?\n/);
        lines.forEach(function(line) {
            if (line != "") {
                var node = JSON.parse(line);
                localStorage.setItem(node.id, line);
                var ele = node;
            }
        });
        localStorage.setItem("lastChange", parseInt(Date.now()));
        drawNodes();
    });
}

function saveMap() {
    var data = [];
    data.push({ lastChange: parseInt(Date.now()) });
    data.push({ counter: localStorage.getItem("counter") });
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) != "lastChange" && localStorage.key(i) != "counter") {
            data.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
        }
    }

    fetch("saveMap", {
        method: "POST",
        body: JSON.stringify(data)
    }).then(res => {
        return res.text();
    }).then(text => {

    });
}

function drawNodes() {
    document.getElementById("map").innerHTML = "";
    for (var i = 0; i < localStorage.length; i++) {
        var ele = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (ele.class == "node") {
            document.getElementById("map").innerHTML += '<div id="' + ele.id + '" class="' + ele.class + '" style="width: -moz-min-content; width: -webkit-min-content; width: min-content; height: -moz-min-content; height: -webkit-min-content; height: min-content; position: ' + ele.position + '; left: ' + ele.left + 'px; top: ' + ele.top + 'px; background-color: ' + ele.background_color + '; user-select: ' + ele.user_select + '; z-index: ' + ele.z_index + '; font-weight: 400;  padding: 5px 5px 5px 5px; border-radius: 7px;"> <p id="title' + ele.id + '" class="title" style="text-align: ' + ele.text_align + '; line-height: ' + ele.line_height + 'px; white-space: nowrap;">' + decodeURIComponent(escape(window.atob(ele.title))) + '</p> <textarea class="' + ele.item.class + '" style="width: ' + ele.item.width + 'px; height: 200px; position: ' + ele.item.position + '; left: ' + 0 + 'px; top: ' + 0 + 'px; resize: ' + ele.item.resize + ';">' + decodeURIComponent(escape(window.atob(ele.item.text))) + '</textarea> </div>';
            $('#' + ele.id).children('.item').css('left', $('#' + ele.id).width() / 2 - $('#' + ele.id).children('.item').width() / 2 + "px");
            $('#' + ele.id).children('.item').css('top', $('#' + ele.id).height() + 10 + "px");
        }
        if (ele.class == "smallnode") {
            document.getElementById("map").innerHTML += '<div id="' + ele.id + '" class="' + ele.class + '" style="width: -moz-min-content; width: -webkit-min-content; width: min-content; height: -moz-min-content; height: -webkit-min-content; height: min-content; position: ' + ele.position + '; left: ' + ele.left + 'px; top: ' + ele.top + 'px; background-color: ' + ele.background_color + '; user-select: ' + ele.user_select + '; z-index: ' + ele.z_index + '; font-weight: 200;  padding: 5px 5px 5px 5px; border-radius: 7px;"> <p id="title' + ele.id + '" class="title" style="text-align: ' + ele.text_align + '; line-height: ' + ele.line_height + 'px; white-space: nowrap;">' + decodeURIComponent(escape(window.atob(ele.title))) + '</p> <textarea class="' + ele.item.class + '" style="width: ' + ele.item.width + 'px; height: 200px; position: ' + ele.item.position + '; left: ' + 0 + 'px; top: ' + 0 + 'px; resize: ' + ele.item.resize + ';">' + decodeURIComponent(escape(window.atob(ele.item.text))) + '</textarea> </div>';
            $('#' + ele.id).children('.item').css('left', $('#' + ele.id).width() / 2 - $('#' + ele.id).children('.item').width() / 2 + "px");
            $('#' + ele.id).children('.item').css('top', $('#' + ele.id).height() + 10 + "px");
        }
    }
    for (var i = 0; i < localStorage.length; i++) {
        var ele = JSON.parse(localStorage.getItem(localStorage.key(i)));
        if (ele.class == "line") {

            ele.x2 = $('#' + ele.idTo).position().left + ($('#' + ele.idTo).width() / 2);
            ele.y2 = $('#' + ele.idTo).position().top + ($('#' + ele.idTo).height() / 2);

            ele.x1 = $('#' + ele.idFrom).position().left + ($('#' + ele.idFrom).width() / 2);
            ele.y1 = $('#' + ele.idFrom).position().top + ($('#' + ele.idFrom).height() / 2);

            var length = Math.sqrt(((ele.x2 - ele.x1) * (ele.x2 - ele.x1)) + ((ele.y2 - ele.y1) * (ele.y2 - ele.y1)));

            var cx = ((ele.x1 + ele.x2) / 2) - (length / 2);
            var cy = ((ele.y1 + ele.y2) / 2) - (2 / 2);

            var angle = Math.atan2((ele.y1 - ele.y2), (ele.x1 - ele.x2)) * (180 / Math.PI);

            document.getElementById("map").innerHTML += '<div id="' + ele.id + '" class="' + ele.class + '" style="width: ' + length + 'px; height: ' + 2 + 'px; position: ' + ele.position + '; left: ' + cx + 'px; top: ' + cy + 'px; background-color: ' + ele.color + '; -moz-transform: rotate(' + angle + 'deg); -webkit-transform:rotate(' + angle + 'deg); -o-transform:rotate(' + angle + 'deg); -ms-transform:rotate(' + angle + 'deg); transform:rotate(' + angle + 'deg);"></div>';
        }
    }

    document.getElementById("map").innerHTML += '<div id="rightClickMenu" style="width: 120px; height: 120px; position: absolute; left: 0px; top: 0px; background-color:white; border-radius: 7px; overflow: hidden; z-index: 1000;"> <div id="newnode" style="width: 120px; height: 30px; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"> New Node </div> <div id="newsmallnode" style="width: 120px; height: 30px; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"> New small Node </div>  <div id="savemap" style="width: 120px; height: 30px; float: left;  text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"> Save </div> <div id="showall" style="width: 120px; height: 30px; float: left;  text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"> ShowAll </div>  </div>';
    document.getElementById("map").innerHTML += '<div id="rightClickMenuNode" style="width: 120px; height: 150px; position: absolute; left: 0px; top: 0px; background-color:white; border-radius: 7px; overflow: hidden; z-index: 1000;">  <div id="color1" style="width: 30px; height: 30px; border-radius: 30px; background-color: #311D3F; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div><div id="color2" style="width: 30px; height: 30px; border-radius: 30px; background-color: #522546; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div><div id="color3" style="width: 30px; height: 30px; border-radius: 30px; background-color: #88304E; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div> <div id="color4" style="width: 30px; height: 30px; border-radius: 30px; background-color: #E23E57; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div> <div id="color5" style="width: 30px; height: 30px; border-radius: 30px; background-color: #FFCFDF; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div><div id="color6" style="width: 30px; height: 30px; border-radius: 30px; background-color: #FEFDCA; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div><div id="color7" style="width: 30px; height: 30px; border-radius: 30px; background-color: #E0F9B5; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div> <div id="color8" style="width: 30px; height: 30px; border-radius: 30px; background-color: #A5DEE5; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div> <div id="newline" style="width: 120px; height: 30px; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"> New Line </div> <div id="delete" style="width: 120px; height: 30px; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"> Delete </div>  <div id="changetitle" style="width: 120px; height: 30px; float: left;  text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"> change Title </div> </div>';
    document.getElementById("map").innerHTML += '<div id="rightClickMenuLine" style="width: 120px; height: 90px; position: absolute; left: 0px; top: 0px; background-color:white; border-radius: 7px; overflow: hidden; z-index: 1000;"><div id="color1" style="width: 30px; height: 30px; border-radius: 30px; background-color: #FFCFDF; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div><div id="color2" style="width: 30px; height: 30px; border-radius: 30px; background-color: #FEFDCA; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div><div id="color3" style="width: 30px; height: 30px; border-radius: 30px; background-color: #E0F9B5; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div> <div id="color4" style="width: 30px; height: 30px; border-radius: 30px; background-color: #A5DEE5; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"></div> <div id="delete" style="width: 120px; height: 30px; float: left; text-align: center; font-size: 15px; line-height: 30px; user-select: none; cursor: pointer;"> Delete </div></div>';

    addAllItemsFunctions();
}

var mapX = -25000;
var mapY = -25000;
var buttondown = false;
var currentNode = undefined;
var editNode = false;

document.querySelector('#map').addEventListener('mousemove', dragMap);
document.querySelector('#map').addEventListener('mousemove', dragNode);
document.addEventListener('mouseup', logButtonUp);
document.addEventListener('mousedown', logButtonDown);


document.getElementById("map").addEventListener('contextmenu', event => event.preventDefault());

function dragMap(e) {
    if (buttondown == true && currentNode == undefined && editNode == false && targetNode == undefined) {
        mapX = (mapX + e.movementX);
        mapY = (mapY + e.movementY);
        document.getElementById("map").style.left = mapX + "px";
        document.getElementById("map").style.top = mapY + "px";

        //localStorage.setItem("mapX", JSON.stringify(mapX));
        //localStorage.setItem("mapY", JSON.stringify(mapY));
    }
}

function setXYMap() {
    if (localStorage.getItem("mapX") != undefined || localStorage.getItem("mapY") != undefined) {
        mapX = JSON.parse(localStorage.getItem("mapX"));
        mapY = JSON.parse(localStorage.getItem("mapY"));
        document.getElementById("map").style.left = mapX + "px";
        document.getElementById("map").style.top = mapY + "px";
    }
}

var menuX;
var menuY;
var targetNode;

var newLineFrom;

function logButtonDown(e) {
    if (e.buttons == 2) {
        if (e.target.id == "map") {
            menuX = e.clientX - mapX;
            menuY = e.clientY - mapY;
            $('#rightClickMenu').css('left', menuX - 20 + "px");
            $('#rightClickMenu').css('top', menuY - 10 + "px");
            $('#rightClickMenuNode').hide();
            $('#rightClickMenuLine').hide();
            $('#rightClickMenu').show();
            targetNode = e.target;
            newLineFrom = undefined;
        }
    } else {
        buttondown = true;
    }
}

function logButtonUp(e) {
    buttondown = false;
}

var showall = "false";

function addAllItemsFunctions() {
    $('#map').mousedown(function(e) {
        if (e.target == this) {
            editNode = false;
            currentNode = undefined;
            changeTitleEnd();
            targetNode = undefined;
            $('#rightClickMenu').hide();
            $('#rightClickMenuNode').hide();
            $('#rightClickMenuLine').hide();
        }
    });
    $('#map').mouseup(function(e) {
        if (e.target == this) {
            if (currentNode != undefined) {
                changePos(currentNode.attr('id'), (document.getElementById(currentNode.attr('id')).style.left).slice(0, -2), (document.getElementById(currentNode.attr('id')).style.top).slice(0, -2));
                dragEnd();
            }
            editNode = false;
            currentNode = undefined;
            targetNode = undefined;
        }
    });
    $('.item').hide();
    $('.item').mousedown(function() {
        editNode = true;
    });
    $('.line').hover(function() {
        document.getElementById(this.id).style.border = "1px solid";

    }, function() {

        document.getElementById(this.id).style.border = "";
    });
    $('.node, .smallnode').hover(function() {
        document.getElementById(this.id).style.border = "1px solid";
        $(this).children('.item').show();
    }, function() {
        if (showall == "false") {
            $(this).children('.item').hide();
        }
        document.getElementById(this.id).style.border = "";
        changeText($(this).attr('id'), $(this).children('.item').val());
    });
    $('.node, .smallnode')
        .mousedown(function(e) {
            if (e.target == document.getElementById('title' + this.id + '')) {
                if (newLineFrom != undefined && newLineFrom.id != this.id) {
                    newLine(newLineFrom.id, this.id);
                    newLineFrom = undefined;
                    drawNodes();
                } else if (e.buttons == 2) {
                    menuX = e.clientX - mapX;
                    menuY = e.clientY - mapY;
                    $('#rightClickMenuNode').css('left', menuX - 20 + "px");
                    $('#rightClickMenuNode').css('top', menuY - 10 + "px");
                    $('#rightClickMenu').hide();
                    $('#rightClickMenuLine').hide();
                    $('#rightClickMenuNode').show();
                    targetNode = this;
                } else {
                    currentNode = $(this);
                    offsetX = (e.clientX - (parseInt((document.getElementById(currentNode.attr('id')).style.left).slice(0, -2))));
                    offsetY = (e.clientY - (parseInt((document.getElementById(currentNode.attr('id')).style.top).slice(0, -2))));
                    currentNodeElement = document.getElementById(currentNode.attr('id'));
                    dragStart();
                }
            }
        })
        .mouseup(function(e) {
            if (currentNode != undefined) {
                changePos(currentNode.attr('id'), (document.getElementById(currentNode.attr('id')).style.left).slice(0, -2), (document.getElementById(currentNode.attr('id')).style.top).slice(0, -2));
                dragEnd();
                currentNode = undefined;
                targetNode = undefined;
            }
        });

    $('.line').unbind('click').bind('click', function(e) {
        menuX = e.clientX - mapX;
        menuY = e.clientY - mapY;
        $('#rightClickMenuLine').css('left', menuX - 20 + "px");
        $('#rightClickMenuLine').css('top', menuY - 10 + "px");
        $('#rightClickMenu').hide();
        $('#rightClickMenuNode').hide();
        $('#rightClickMenuLine').show();
        targetNode = e.target;
    });

    $('#rightClickMenu').hide();
    $('#rightClickMenu').unbind('click').bind('click', function(e) {
        if (e.target.id == "newnode") {
            newNode(menuX - 50, menuY - 25, "node");
            $('#rightClickMenu').hide();
            return false;
        }
        if (e.target.id == "newsmallnode") {
            newNode(menuX - 50, menuY - 25, "smallnode");
            $('#rightClickMenu').hide();
            return false;
        }
        if (e.target.id == "savemap") {
            saveMap();
            $('#rightClickMenu').hide();
        }
        if (e.target.id == "showall") {
            if (showall == "true") {
                console.log(showall)
                $('.item').hide();
                showall = "false";
            } else if (showall == "false") {
                console.log(showall)
                $('.item').show();
                showall = "true";
            }
            $('#rightClickMenu').hide();
        }
    });
    $('#rightClickMenuNode').hide();
    $('#rightClickMenuNode').unbind('click').bind('click', function(e) {
        if (e.target.id == "newline") {
            newLineFrom = targetNode;
            $('#rightClickMenuNode').hide();
        }
        if (e.target.id == "delete") {
            removeNode(targetNode.id);
            $('#rightClickMenuNode').hide();
        }
        if (e.target.id == "changetitle") {
            changeTitle(targetNode.id);
            $('#rightClickMenuNode').hide();
        }
        if (e.target.id == "color1") {
            changeBackgroundColor(targetNode.id, "#311D3F");
            $('#rightClickMenuNode').hide();
        }
        if (e.target.id == "color2") {
            changeBackgroundColor(targetNode.id, "#522546");
            $('#rightClickMenuNode').hide();
        }
        if (e.target.id == "color3") {
            changeBackgroundColor(targetNode.id, "#88304E");
            $('#rightClickMenuNode').hide();
        }
        if (e.target.id == "color4") {
            changeBackgroundColor(targetNode.id, "#E23E57");
            $('#rightClickMenuNode').hide();
        }
        if (e.target.id == "color5") {
            changeBackgroundColor(targetNode.id, "#FFCFDF");
            $('#rightClickMenuNode').hide();
        }
        if (e.target.id == "color6") {
            changeBackgroundColor(targetNode.id, "#FEFDCA");
            $('#rightClickMenuNode').hide();
        }
        if (e.target.id == "color7") {
            changeBackgroundColor(targetNode.id, "#E0F9B5");
            $('#rightClickMenuNode').hide();
        }
        if (e.target.id == "color8") {
            changeBackgroundColor(targetNode.id, "#A5DEE5");
            $('#rightClickMenuNode').hide();
        }
    });
    $('#rightClickMenuLine').hide();
    $('#rightClickMenuLine').unbind('click').bind('click', function(e) {
        if (e.target.id == "delete") {
            removeLine(targetNode.id);
            $('#rightClickMenuLine').hide();
        }
        if (e.target.id == "color1") {
            changeColorLine(targetNode.id, "#FFCFDF");
            $('#rightClickMenuLine').hide();
        }
        if (e.target.id == "color2") {
            changeColorLine(targetNode.id, "#FEFDCA");
            $('#rightClickMenuLine').hide();
        }
        if (e.target.id == "color3") {
            changeColorLine(targetNode.id, "#E0F9B5");
            $('#rightClickMenuLine').hide();
        }
        if (e.target.id == "color4") {
            changeColorLine(targetNode.id, "#A5DEE5");
            $('#rightClickMenuLine').hide();
        }
    });
}

var offsetX;
var offsetY;
var currentNodeElement;

function dragStart() {
    if (currentNode != undefined && editNode == false) {
        var node = JSON.parse(localStorage.getItem(currentNodeElement.id));
        for (var i = 0; i < node.connectionIn.length; i++) {
            document.getElementById(node.connectionIn[i]).style.visibility = "hidden";
        }
        for (var i = 0; i < node.connectionOut.length; i++) {
            document.getElementById(node.connectionOut[i]).style.visibility = "hidden";
        }
    }
}

function dragNode(e) {
    if (currentNode != undefined && editNode == false) {
        currentNodeElement.style.left = (e.clientX - offsetX) + "px";
        currentNodeElement.style.top = (e.clientY - offsetY) + "px";
    }
}

function dragEnd() {
    if (currentNode != undefined && editNode == false) {
        var node = JSON.parse(localStorage.getItem(currentNodeElement.id));
        for (var i = 0; i < node.connectionIn.length; i++) {
            document.getElementById(node.connectionIn[i]).style.visibility = "visible";
        }
        for (var i = 0; i < node.connectionOut.length; i++) {
            document.getElementById(node.connectionOut[i]).style.visibility = "visible";
        }
    }
}

function newNode(xMouse, yMouse, type) {
    var counter = parseInt(localStorage.getItem("counter"));
    var textarea = { class: "item", width: 200, height: 100, resize: "none", position: "absolute", left: -50, top: 49, text: "dGV4dC4uLg==" };
    var node = { id: counter, class: type, width: 100, height: 50, position: "absolute", left: xMouse, top: yMouse, background_color: "rgb(255, 255, 255)", text_align: "center", line_height: 50, user_select: "none", z_index: 999, title: window.btoa(unescape(encodeURIComponent("Title.."))), item: textarea, connectionIn: new Array(), connectionOut: new Array() };
    localStorage.setItem("counter", (counter + 1));
    localStorage.setItem(node.id, JSON.stringify(node));

    addAllItemsFunctions();
    drawNodes();
    localStorage.setItem("lastChange", parseInt(Date.now()));

    changeTitle(counter);
    selectText('title' + counter);
}


function removeNode(id) {
    lastEditNodeId = undefined;
    var node = JSON.parse(localStorage.getItem(id));
    for (var i = 0; i < node.connectionIn.length; i++) {
        removeLine(node.connectionIn[i]);
    }
    for (var i = 0; i < node.connectionOut.length; i++) {
        removeLine(node.connectionOut[i]);
    }
    localStorage.removeItem(id);
    drawNodes();
    localStorage.setItem("lastChange", parseInt(Date.now()));
}

function changeText(id, text) {
    var node = JSON.parse(localStorage.getItem(id));
    node.item.text = window.btoa(unescape(encodeURIComponent(text)));

    localStorage.setItem(id, JSON.stringify(node));

    localStorage.setItem("lastChange", parseInt(Date.now()));
}

function changePos(id, xNew, yNew) {
    var node = JSON.parse(localStorage.getItem(id));
    node.left = parseInt(xNew);
    node.top = parseInt(yNew);

    for (var i = 0; i < node.connectionIn.length; i++) {
        var ele = JSON.parse(localStorage.getItem(node.connectionIn[i]));
        ele.x2 = node.left + ($('#' + ele.idTo).width() / 2);
        ele.y2 = node.top + ($('#' + ele.idTo).height() / 2);
        localStorage.setItem(node.connectionIn[i], JSON.stringify(ele));

        var length = Math.sqrt(((ele.x2 - ele.x1) * (ele.x2 - ele.x1)) + ((ele.y2 - ele.y1) * (ele.y2 - ele.y1)));

        var cx = ((ele.x1 + ele.x2) / 2) - (length / 2);
        var cy = ((ele.y1 + ele.y2) / 2) - (2 / 2);

        var angle = Math.atan2((ele.y1 - ele.y2), (ele.x1 - ele.x2)) * (180 / Math.PI);

        document.getElementById(node.connectionIn[i]).style.width = length + "px";
        document.getElementById(node.connectionIn[i]).style.left = cx + "px";
        document.getElementById(node.connectionIn[i]).style.top = cy + "px";
        document.getElementById(node.connectionIn[i]).style.transform = 'rotate(' + angle + 'deg)';
        document.getElementById(node.connectionIn[i]).style.WebkitTransform = 'rotate(' + angle + 'deg)';
        document.getElementById(node.connectionIn[i]).style.MozTransform = 'rotate(' + angle + 'deg)';
        document.getElementById(node.connectionIn[i]).style.OTransform = 'rotate(' + angle + 'deg)';
        document.getElementById(node.connectionIn[i]).style.msTransform = 'rotate(' + angle + 'deg)';
    }


    for (var i = 0; i < node.connectionOut.length; i++) {
        var ele = JSON.parse(localStorage.getItem(node.connectionOut[i]));
        ele.x1 = node.left + ($('#' + ele.idFrom).width() / 2);
        ele.y1 = node.top + ($('#' + ele.idFrom).height() / 2);
        localStorage.setItem(node.connectionOut[i], JSON.stringify(ele));

        var length = Math.sqrt(((ele.x2 - ele.x1) * (ele.x2 - ele.x1)) + ((ele.y2 - ele.y1) * (ele.y2 - ele.y1)));

        var cx = ((ele.x1 + ele.x2) / 2) - (length / 2);
        var cy = ((ele.y1 + ele.y2) / 2) - (2 / 2);

        var angle = Math.atan2((ele.y1 - ele.y2), (ele.x1 - ele.x2)) * (180 / Math.PI);

        document.getElementById(node.connectionOut[i]).style.width = length + "px";
        document.getElementById(node.connectionOut[i]).style.left = cx + "px";
        document.getElementById(node.connectionOut[i]).style.top = cy + "px";
        document.getElementById(node.connectionOut[i]).style.transform = 'rotate(' + angle + 'deg)';
        document.getElementById(node.connectionOut[i]).style.WebkitTransform = 'rotate(' + angle + 'deg)';
        document.getElementById(node.connectionOut[i]).style.MozTransform = 'rotate(' + angle + 'deg)';
        document.getElementById(node.connectionOut[i]).style.OTransform = 'rotate(' + angle + 'deg)';
        document.getElementById(node.connectionOut[i]).style.msTransform = 'rotate(' + angle + 'deg)';
    }


    localStorage.setItem(id, JSON.stringify(node));

    localStorage.setItem("lastChange", parseInt(Date.now()));
}

function changeBackgroundColor(id, colorNew) {
    var node = JSON.parse(localStorage.getItem(id));
    node.background_color = colorNew;
    localStorage.setItem(id, JSON.stringify(node));

    for (var i = 0; i < node.connectionOut.length; i++) {
        var ele = JSON.parse(localStorage.getItem(node.connectionOut[i]));
        ele.color = colorNew;
        localStorage.setItem(node.connectionOut[i], JSON.stringify(ele));
        document.getElementById(node.connectionOut[i]).style.backgroundColor = colorNew;
    }

    document.getElementById(id).style.backgroundColor = colorNew;
    localStorage.setItem("lastChange", parseInt(Date.now()));
}

function changeColorLine(id, colorNew) {
    var line = JSON.parse(localStorage.getItem(id));
    line.color = colorNew;
    localStorage.setItem(id, JSON.stringify(line));
    document.getElementById(id).style.backgroundColor = colorNew;
    localStorage.setItem("lastChange", parseInt(Date.now()));
}

function newLine(idFrom, idTo) {
    if (idFrom != undefined && idTo != undefined) {
        var nodeFrom = JSON.parse(localStorage.getItem(idFrom));
        var nodeTo = JSON.parse(localStorage.getItem(idTo));
        var idLine = "line" + nodeFrom.id + nodeTo.id;
        nodeFrom.connectionOut.push(idLine);
        nodeTo.connectionIn.push(idLine);

        var connection = { id: idLine, class: "line", x1: nodeFrom.left, y1: nodeFrom.top, x2: nodeTo.left, y2: nodeTo.top, idFrom: idFrom, idTo: idTo, position: "absolute", color: nodeFrom.background_color };
        localStorage.setItem(idLine, JSON.stringify(connection));

        localStorage.setItem(idFrom, JSON.stringify(nodeFrom));
        localStorage.setItem(idTo, JSON.stringify(nodeTo));

        drawNodes();
        localStorage.setItem("lastChange", parseInt(Date.now()));
    }
}

function removeLine(idTarget) {
    var line = JSON.parse(localStorage.getItem(idTarget));
    if (line != undefined) {
        var nodeFrom = JSON.parse(localStorage.getItem(line.idFrom));
        var nodeTo = JSON.parse(localStorage.getItem(line.idTo));


        for (var i = 0; i < nodeFrom.connectionOut.length; i++) {
            if (nodeFrom.connectionOut[i] == idTarget) {
                nodeFrom.connectionOut.splice(i, 1);
                i--;
            }
        }
        for (var i = 0; i < nodeTo.connectionIn.length; i++) {
            if (nodeTo.connectionIn[i] == idTarget) {
                nodeTo.connectionIn.splice(i, 1);
                i--;
            }
        }
        localStorage.setItem(line.idFrom, JSON.stringify(nodeFrom));
        localStorage.setItem(line.idTo, JSON.stringify(nodeTo));

        localStorage.removeItem(idTarget);

        drawNodes();
        localStorage.setItem("lastChange", parseInt(Date.now()));
    }
}
var lastEditNodeId;

function changeTitle(idTarget) {
    if (lastEditNodeId != undefined) {
        changeTitleEnd();
    }
    document.getElementById('title' + idTarget).contentEditable = "true";
    document.getElementById(idTarget).style.userSelect = "auto";
    editNode = true;
    lastEditNodeId = idTarget;
    selectText('title' + idTarget)
}

function selectText(node) {
    node = document.getElementById(node);
    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}


//<div id="target"><p>Some text goes here!</p><p>Moar text!</p></div>
//<p class="click-me">Click me!</p>


function changeTitleEnd() {
    if (lastEditNodeId != null) {

        var node = JSON.parse(localStorage.getItem(lastEditNodeId));

        node.title = window.btoa(unescape(encodeURIComponent($('#' + node.id).children('.title').html())));
        localStorage.setItem(node.id, JSON.stringify(node));

        for (var i = 0; i < node.connectionIn.length; i++) {
            var ele = JSON.parse(localStorage.getItem(node.connectionIn[i]));
            ele.x2 = node.left + ($('#' + ele.idTo).width() / 2);
            ele.y2 = node.top + ($('#' + ele.idTo).height() / 2);
            localStorage.setItem(node.connectionIn[i], JSON.stringify(ele));

            var length = Math.sqrt(((ele.x2 - ele.x1) * (ele.x2 - ele.x1)) + ((ele.y2 - ele.y1) * (ele.y2 - ele.y1)));

            var cx = ((ele.x1 + ele.x2) / 2) - (length / 2);
            var cy = ((ele.y1 + ele.y2) / 2) - (2 / 2);

            var angle = Math.atan2((ele.y1 - ele.y2), (ele.x1 - ele.x2)) * (180 / Math.PI);

            document.getElementById(node.connectionIn[i]).style.width = length + "px";
            document.getElementById(node.connectionIn[i]).style.left = cx + "px";
            document.getElementById(node.connectionIn[i]).style.top = cy + "px";
            document.getElementById(node.connectionIn[i]).style.transform = 'rotate(' + angle + 'deg)';
            document.getElementById(node.connectionIn[i]).style.WebkitTransform = 'rotate(' + angle + 'deg)';
            document.getElementById(node.connectionIn[i]).style.MozTransform = 'rotate(' + angle + 'deg)';
            document.getElementById(node.connectionIn[i]).style.OTransform = 'rotate(' + angle + 'deg)';
            document.getElementById(node.connectionIn[i]).style.msTransform = 'rotate(' + angle + 'deg)';
        }


        for (var i = 0; i < node.connectionOut.length; i++) {
            var ele = JSON.parse(localStorage.getItem(node.connectionOut[i]));
            ele.x1 = node.left + ($('#' + ele.idFrom).width() / 2);
            ele.y1 = node.top + ($('#' + ele.idFrom).height() / 2);
            localStorage.setItem(node.connectionOut[i], JSON.stringify(ele));

            var length = Math.sqrt(((ele.x2 - ele.x1) * (ele.x2 - ele.x1)) + ((ele.y2 - ele.y1) * (ele.y2 - ele.y1)));

            var cx = ((ele.x1 + ele.x2) / 2) - (length / 2);
            var cy = ((ele.y1 + ele.y2) / 2) - (2 / 2);

            var angle = Math.atan2((ele.y1 - ele.y2), (ele.x1 - ele.x2)) * (180 / Math.PI);

            document.getElementById(node.connectionOut[i]).style.width = length + "px";
            document.getElementById(node.connectionOut[i]).style.left = cx + "px";
            document.getElementById(node.connectionOut[i]).style.top = cy + "px";
            document.getElementById(node.connectionOut[i]).style.transform = 'rotate(' + angle + 'deg)';
            document.getElementById(node.connectionOut[i]).style.WebkitTransform = 'rotate(' + angle + 'deg)';
            document.getElementById(node.connectionOut[i]).style.MozTransform = 'rotate(' + angle + 'deg)';
            document.getElementById(node.connectionOut[i]).style.OTransform = 'rotate(' + angle + 'deg)';
            document.getElementById(node.connectionOut[i]).style.msTransform = 'rotate(' + angle + 'deg)';
        }

        document.getElementById('title' + lastEditNodeId).contentEditable = "false";
        document.getElementById(lastEditNodeId).style.userSelect = "none";
        editNode = false;
        lastEditNodeId = undefined;
    }
}