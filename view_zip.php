<?
include "config.php";

$za = new ZipArchive();

$filename = $CONFIG['local_base_dir'] . $_GET['p_filename'];

$za->open($filename);
print_r($za);
echo "<hr>";
var_dump($za);
echo "<hr>";
echo "numFiles: " . $za->numFiles . "<br>\n";
echo "status: " . $za->status  . "<br>\n";
echo "statusSys: " . $za->statusSys . "<br>\n";
echo "filename: " . $za->filename . "<br>\n";
echo "comment: " . $za->comment . "<br>\n";
echo "<hr>";

$encoding_from ='EUC-KR';
//$encoding_from ='UHC';
$encoding_to = 'UTF-8';
  
//https://milvus.tistory.com/39
echo "<table border=1 cellspacing=0 cellpadding=0>";
for ($i=0; $i<$za->numFiles;$i++) {
    $array = $za->statIndex($i);
    $str = print_r($array, true);
    //$converted_str = mb_convert_encoding($str,$encoding_to,$encoding_from);
    //$converted_str = mb_convert_encoding($za->statIndex($i)['name'],$encoding_to,$encoding_from);
    $converted_str = $array['name'];
    $converted_str = iconv("EUC-KR", "UTF-8", $converted_str);

    //echo "index: $i : $str <br>\n";
    //echo "index: $i : $converted_str <br>\n";

    $pos = strrpos($array[name], "/");
    $path = substr($array[name], 0, $pos);

    echo "<tr>";
    echo "<td>" . $array[index] ."</td>";
    echo "<td>" . $array[name] ."</td>";
    echo "<td>" . $path ."</td>";
    echo "<td>" . $array[size] ."</td>";
    echo "</tr>";

    $DATA[$array[name]] = $array;
}
echo "</table>";
echo "numFile:" . $za->numFiles . "\n";
echo "<hr>";

ksort($DATA);
echo "<table border=1 cellspacing=0 cellpadding=0>";
foreach($DATA as $key => $array) {
  echo "<tr>";
  echo "<td>" . $array[index] ."</td>";
  echo "<td>" . $array[name] ."</td>";
  echo "<td>" . $array[size] ."</td>";
  echo "</tr>";
}
echo "</table>";
?>