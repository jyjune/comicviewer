<html>
<head>
<title>만화방</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
<link rel="shortcut icon" type="image/png" sizes="16x16"  href="comics.png"/>
<style type="text/css">
/* body { margin: 0px; }  */
a {
  font-size: 20pt;
}
a:link { color: blue; text-decoration: none; }
a:visited { color: blue; text-decoration: none; }
a:hover { color: red; text-decoration: underline; }
a:active { color: red; background-color: green; }
.barGraph {
  border: 1px solid gray;
  width: 100px;
  height: 5px;
  display: flex;
}
.barGraphInner {
  border: 0px;
  height: 5px;
  background: red;
}

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
<?
include "reqUtils.php";

// https://stackoverflow.com/questions/42348196/synology-access-from-web-directory-to-other-directory

$dirBase = "/volume2/Comics/" . $_GET[p_dir];
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

if (array_key_exists("p_dir", $_GET)) {
  $curr_dir = trim($_GET[p_dir], "/");
  $pos = strrpos($curr_dir, "/", 1);
  if ($pos === FALSE) {
    echo "⬆️ <a href=\"index.php\">Root</a><br>\n";
  } else {
    $prev_dir = substr($curr_dir, 0, $pos);
    echo "⬆️ <a href=\"index.php?p_dir=".urlencode($prev_dir."/")."\">$prev_dir</a><br>\n";
  }
}

if ($listDirs) {
  sort($listDirs, SORT_NATURAL);
  foreach($listDirs as $filename) {
    echo "<a href=index.php?p_dir=" . urlencode($_GET[p_dir] . $filename . "/") . ">📂 " . $filename . "</a><br>\n";
  }
}

if ($listFiles) {
  sort($listFiles, SORT_NATURAL);
  foreach($listFiles as $filename) {
    $FILEDATA = loadFileData($_GET[p_dir] . $filename);
    if (array_key_exists("PAGE", $FILEDATA)) {
      $width = ($FILEDATA["PAGE"]*100 / $FILEDATA["PAGE_TOTAL"]) . "px";
      $PAGE_INFO = "<div class=\"barGraph\"><div class=\"barGraphInner\" style=\"width:$width;\"></div></div>";
      //$PAGE_INFO .= ($FILEDATA["PAGE"]+1) . " / " . $FILEDATA["PAGE_TOTAL"];
    } else {
      $PAGE_INFO = "";
    }

    $p_filename = urlencode($_GET[p_dir] . $filename);
    echo ""
    . "<a href=view_zip.php?p_filename=$p_filename>🕮</a>"
    . "<a href=view.php?p_filename=$p_filename>$filename</a>"
    . $PAGE_INFO
    . "<br>\n";
  }
}
?>
</body>
</html>
