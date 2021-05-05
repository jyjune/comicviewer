<html>
<head>
<title>Comic Viewer</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<link rel="shortcut icon" type="image/png" sizes="16x16"  href="comics.png"/>
<style type="text/css">
/* body { margin: 0px; }  */

.folder_link {
  font-size: 20pt;
}
.book_link {
  height: 50px;
  font-size: 14pt;
}
a:link { color: blue; text-decoration: none; }
a:visited { color: blue; text-decoration: none; }
a:hover { color: red; text-decoration: underline; }
a:active { color: red; background-color: green; }
.bargraph {
  border: 1px solid gray;
  width: 100px;
  height: 2px;
  display: flex;
  position: relative;
  left: calc(100% - 105px);
  top: 40px;
}
.bargraph_progress {
  border: 0px;
  height: 2px;
  background: red;
}

ul {
  list-style-type: none;
  list-style-position: inside;
  text-indent: 0px;
  padding-left: 0;
}
li {
  background: #ddd;
}
li:nth-child(even) { background: #fff; }

@media (min-width: 600px) {
  body {
    column-count: 2;
  }
}

</style>
<script>
</script>
</head>
<body>
<?php
include "config.php";
include "reqUtils.php";

// https://stackoverflow.com/questions/42348196/synology-access-from-web-directory-to-other-directory

if (!array_key_exists('p_dir', $_GET)) $_GET['p_dir'] = "/";

$dirBase = $CONFIG['local_base_dir'] . $_GET['p_dir'];
$dirhandle = opendir($dirBase);
while($filename = readdir($dirhandle)) {
  if (substr($filename, 0, 1) == "@") continue;
  if (substr($filename, 0, 1) == ".") continue;
  if (is_dir($dirBase . $filename)) {
    $listDirs[] = $filename;
  } else {
    if (substr($filename, -3) != "zip") continue;
    $listFiles[] = $filename;
  }
}
closedir($dirhandle);


// Upper Dirs
$curr_dir_title = "";
echo "<a class=\"folder_link\" href=\"index.php\">🏠</a>";
if (array_key_exists('p_dir', $_GET)) {
  $upperDirs = explode("/", $_GET['p_dir']);
  $dl = "";
  foreach($upperDirs as $dir) {
    if ($dir == "") continue;
    $dl .= $dir . "/";
    $curr_dir_title = $dir;
    echo " &gt; <a class=\"folder_link\" href=\"index.php?p_dir=". urlencode($dl) ."\">".$dir."</a>";
  }
}
echo "<hr>";

// Sub Dirs
if (isset($listDirs)) {
  sort($listDirs, SORT_NATURAL);
  foreach($listDirs as $filename) {
    echo "<a class=\"folder_link\" href=\"index.php?p_dir=" . urlencode($_GET['p_dir'] . $filename . "/") . "\">📂 " . $filename . "</a><br>\n";
  }
}

// Files
echo "<ul>";
if (isset($listFiles)) {
  sort($listFiles, SORT_NATURAL);
  foreach($listFiles as $filename) {
    $FILEDATA = loadFileData($_GET['p_dir'] . $filename);
    if (array_key_exists("PAGE", $FILEDATA)) {
      if ($FILEDATA["PAGE_TOTAL"] != 0) {
        $width = ($FILEDATA["PAGE"]*100 / $FILEDATA["PAGE_TOTAL"]) . "px";
        $PAGE_INFO = "<div class=\"bargraph\"><div class=\"bargraph_progress\" style=\"width:$width;\"></div></div>";
      }
    } else {
      $PAGE_INFO = "";
    }

    
    $p_filename = urlencode($_GET['p_dir'] . $filename);
    $filename = str_replace($curr_dir_title, "", $filename);
    $filename = str_replace(".zip", "", $filename);
    echo "<li>"
    . "<div>"
    . $PAGE_INFO
    . "<a href=\"view.php?p_filename=$p_filename\"><div class=\"book_link\">$filename</div></a>"
    . "</div>\n";
  }
}
echo "</ul>";
?>
</body>
</html>
