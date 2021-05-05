<?php
include "reqUtils.php";

$p_mode = $_GET['p_mode'];

$DATA = loadFileData($_GET['p_filepath']);

if ($p_mode == "lastpage") {
  $DATA['PAGE'] = $_GET['p_page'];
  $DATA['PAGE_TOTAL'] = $_GET['p_page_total'];
} else if ($p_mode == "dir") {
  $DATA['DIRECTION'] = $_GET['p_dir'];
} else if ($p_mode == "verMoveInc") {
  $DATA['VERTICAL_MOVE_INC'] = $_GET['p_ver_move_inc'];
}

saveFileData($_GET['p_filepath'], $DATA);

$json['res'] = 'ok';

echo json_encode($json);
?>