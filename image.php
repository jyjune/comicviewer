<?php
//https://stackoverflow.com/questions/10179435/neater-way-to-find-and-display-image-file-from-zip-archive-with-php
//https://www.php.net/manual/en/ziparchive.getfromindex.php
include "config.php";

$filename = $CONFIG['local_base_dir'] . $_GET['p_file'];
$index = $_GET['p_index'];
showimageIndex($filename, $index);

function showimageIndex($zip_file, $file_index) {
  $z = new ZipArchive();
  if ($z->open($zip_file) !== true) {
      echo "File not found.";
      return false;
  }

  $stat = $z->statIndex($file_index);
  //$fp   = $z->getStream($file_name);
  $contents = $z->getFromIndex($file_index);
  $filename = $z->getNameIndex($file_index);
  // if(!$fp) {
  //     echo "Could not load image.";
  //     return false;
  // }
  $ext = strtoupper(substr($filename, -3));
  if ($ext == "GIF") {
    header('Content-Type: image/gif');
  } else if ($ext == "PNG") {
    header('Content-Type: image/png');
  } else {
    header('Content-Type: image/jpeg');
  }
  header('Content-Length: ' . $stat['size']);
  //fpassthru($fp);
  echo $contents;

  return true;
}

function showimageName($zip_file, $file_name) {
  $z = new ZipArchive();
  if ($z->open($zip_file) !== true) {
      echo "File not found.";
      return false;
  }

  $stat = $z->statName($file_name);
  $fp   = $z->getStream($file_name);
  if(!$fp) {
      echo "Could not load image.";
      return false;
  }

  header('Content-Type: image/jpeg');
  header('Content-Length: ' . $stat['size']);
  fpassthru($fp);
  return true;
}



?>