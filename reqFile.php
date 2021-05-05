<?php
include "reqUtils.php";
include "config.php";

$p_which = $_GET['p_which'];
$pos = strrpos($_GET['p_filepath'], "/");
$oldFilename = substr($_GET['p_filepath'], $pos+1);
$basepath = substr($_GET['p_filepath'], 0, $pos+1);

if ($p_which == "this") {
  $newFilename = $oldFilename;
} else {
  // Find filepath : next or prev

  $dirBase = $CONFIG['local_base_dir'] . $basepath;
  $dirhandle = opendir($dirBase);
  while($filename = readdir($dirhandle)) {
    if (substr($filename, 0, 1) == "@") continue;
    if (substr($filename, 0, 1) == ".") continue;
    if (is_dir($dirBase . $filename)) continue;
    if (substr($filename, -3) != "zip") continue;
    $listFiles[] = $filename;
  }
  closedir($dirhandle);
  sort($listFiles, SORT_NATURAL);

  $newFilename = "";
  if ($p_which == "next") {
    for ($i=0; $i<sizeof($listFiles)-1; $i++) {
      if ($listFiles[$i] == $oldFilename) {
        $newFilename = $listFiles[$i+1];
      }
    }
  } else if ($p_which == "prev") {
    for ($i=1; $i<sizeof($listFiles); $i++) {
      if ($listFiles[$i] == $oldFilename) {
        $newFilename = $listFiles[$i-1];
      }
    }
  }
}

////////////////////////
if ($newFilename != "") {
  $FILEDATA = loadFileData($basepath . $newFilename);
  if (array_key_exists("PAGE", $FILEDATA)) {
    $json['page'] = $FILEDATA['PAGE'];
  } else {
    $json['page'] = 0;
  }
  if (array_key_exists("DIRECTION", $FILEDATA)) {
    $json['direction'] = $FILEDATA['DIRECTION'];
  } else {
    $json['direction'] = $CONFIG['default_direction'];
  }

  if (array_key_exists("VERTICAL_MOVE_INC", $FILEDATA)) {
    $json['verticalMoveInc'] = $FILEDATA['VERTICAL_MOVE_INC'];
  } else {
    $json['verticalMoveInc'] = 0;
  }

  $json['filepath'] = $basepath . $newFilename;

  $za = new ZipArchive();
  $filepath = $CONFIG['local_base_dir'] . $json['filepath'];
  $za->open($filepath);
  for ($i=0; $i<$za->numFiles;$i++) {
    $array = $za->statIndex($i);
    $DATA[$array['name']] = $array;
  }
  ksort($DATA, SORT_NATURAL);

  $INDEX_PAGE = array();
  $INDEX_SECTION_OF_INDEX_PAGE = array();
  $first = true;
  $pathOld = "";
  $indexPage = 0;
  foreach($DATA as $key => $array) {
    if (substr($array['name'], 0, 8) == "__MACOSX") continue;
  
    $ext3 = strtoupper(substr($array['name'], -3));
    $ext4 = strtoupper(substr($array['name'], -4));
    if ($ext3 == "GIF" || $ext3 == "JPG" || $ext4 == "JPEG") {
      $posSlash = strrpos($array['name'], "/");
      $path = substr($array['name'], 0, $posSlash);
      if ($path != $pathOld) {
        array_push($INDEX_SECTION_OF_INDEX_PAGE, $indexPage);
      }
      array_push($INDEX_PAGE, $array['index']);
      $pathOld = $path;
      $indexPage++;
    }
  }
  $json['pageIndex'] = $INDEX_PAGE;
  $json['sectionPageIndex'] = $INDEX_SECTION_OF_INDEX_PAGE;
}

echo json_encode($json);

?>