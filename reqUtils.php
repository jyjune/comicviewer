<?php
include "config.php";

function loadFileData($filepath)
{
  global $CONFIG;
  $DATA = [];
  $filepath = $CONFIG['local_base_dir'] . $filepath . ".ini";
  if (file_exists($filepath)) {
    $data = file_get_contents($filepath);
    $dataLines = explode("\n", $data);
    for ($i=0;$i<count($dataLines);$i++) {
      $line = $dataLines[$i];
      $E = explode("=", $line);
      if (count($E) > 1) {
        $DATA[trim($E[0])] = trim($E[1]);
      }
    }
  }
  return $DATA;
}

function saveFileData($filepath, $DATA)
{
  global $CONFIG;
  $filepath = $CONFIG['local_base_dir'] . $filepath . ".ini";
  $data = "";
  foreach($DATA as $key=>$value) {
    $data .= $key . "=" . $value . "\n";
  }
  //
  file_put_contents($filepath, $data);
}
?>