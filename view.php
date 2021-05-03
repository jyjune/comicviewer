<?
$v = time();
?>
<html>
<head>
<title>Comics</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<link rel="shortcut icon" type="image/png" sizes="16x16" href="comics.png" />
<link href="view.css?v=<?=$v?>" rel="stylesheet">
<script src="viewUtils.js?v=<?=$v?>"></script>
<script src="viewPageInfo.js?v=<?=$v?>"></script>
<script src="viewPageHandler.js?v=<?=$v?>"></script>
<script src="viewPageBar.js?v=<?=$v?>"></script>
</head>
<body ondragstart="return false" ondrop="return false" oncopy="return false" oncut="return false" onpaste="return false">

<!-- Page -->
<div id="divPage">
  <div class="divImg" id="divImg_0"><img class="imgComics" id="img_0"></div>
  <div class="divImg" id="divImg_1"><img class="imgComics" id="img_1"></div>
  <div class="divImg" id="divImg_2"><img class="imgComics" id="img_2"></div>
</div>

<div id="divDisplayPage"></div>
<div id="divPageBar"></div>

<!-- Menu -->
<div id="divMenuButton"></div>
<div id="divMenu">
  <button id="btnFullscreen">Full Screen</button>
  <button id="btnEnableNav">Navigation</button>
  <button id="btnChangeDir">Direction</button>
  Vertical Move<br>
  <button class="small_button" data-inc="0">+0</button>
  <button class="small_button" data-inc="1">+1</button>
  <button class="small_button" data-inc="2">+2</button>
  <button id="btnExit">Exit</button>
</div>

<!-- Script -->
<script src="view.js?v=<?=$v?>"></script>

</body>
</html>
