<?php
  include "config.php";
  
  $filename = $_GET['content'];

  header('Content-type: text/javascript');
  
  

  $userscript = get_include_contents($filename);
  echo $userscript;
    
  function get_include_contents($filename) {
	  global $namespace;
    global $testHarnessUrl;
    
    $testHarness = $testHarnessUrl . "*"; 
    
	   if (is_file($filename)) {
	       ob_start();
	       include $filename;
	       $contents = ob_get_contents();
	       ob_end_clean();
	       return $contents;
	   }else{
   		return false;
	   }
	}

?>