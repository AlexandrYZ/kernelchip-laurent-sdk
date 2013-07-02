// TCP/IP Stack Javascript Library. http://www.kernelchip.ru
// Version: 3.01 
var timeOutMS = 5000; //ms 
var ajaxList = new Array();

function newAJAXCommand(url, container, repeat, data)
{	
var newAjax = new Object();
var theTimer = new Date();
newAjax.url = url;
newAjax.container = container;
newAjax.repeat = repeat;
newAjax.ajaxReq = null;	
	
	if(window.XMLHttpRequest) {
        newAjax.ajaxReq = new XMLHttpRequest();
        newAjax.ajaxReq.open((data==null)?"GET":"POST", newAjax.url, true);
        newAjax.ajaxReq.send(data); 
    } else if(window.ActiveXObject) {
        newAjax.ajaxReq = new ActiveXObject("Microsoft.XMLHTTP");
        if(newAjax.ajaxReq) {
            newAjax.ajaxReq.open((data==null)?"GET":"POST", newAjax.url, true);
            newAjax.ajaxReq.send(data);
        }
    }    
    newAjax.lastCalled = theTimer.getTime();   
    ajaxList.push(newAjax);
}

function pollAJAX() {
	
	var curAjax = new Object();
	var theTimer = new Date();
	var elapsed;	

	for(i = ajaxList.length; i > 0; i--)
	{
		curAjax = ajaxList.shift();
		if(!curAjax)
			continue;
		elapsed = theTimer.getTime() - curAjax.lastCalled;				
	
		if(curAjax.ajaxReq.readyState == 4 && curAjax.ajaxReq.status == 200) {			
			if(typeof(curAjax.container) == 'function'){
				curAjax.container(curAjax.ajaxReq.responseXML.documentElement);
			} else if(typeof(curAjax.container) == 'string') {
				document.getElementById(curAjax.container).innerHTML = curAjax.ajaxReq.responseText;
			} 
			
	    	curAjax.ajaxReq.abort();
	    	curAjax.ajaxReq = null;
			
			if(curAjax.repeat)
				newAJAXCommand(curAjax.url, curAjax.container, curAjax.repeat);
			continue;
		}	
		
		if(elapsed > timeOutMS) {			
			if(typeof(curAjax.container) == 'function'){
				curAjax.container(null);
			} else {				
				//alert("Command failed.\nConnection to Jerome board was lost.");
			}

	    	curAjax.ajaxReq.abort();
	    	curAjax.ajaxReq = null;
						
			if(curAjax.repeat)
				newAJAXCommand(curAjax.url, curAjax.container, curAjax.repeat);
			continue;
		}		
		ajaxList.push(curAjax);
	}	
	setTimeout("pollAJAX()", 100);	
}			

function getXMLValue(xmlData, field) {
	try {
		if(xmlData.getElementsByTagName(field)[0].firstChild.nodeValue)
			return xmlData.getElementsByTagName(field)[0].firstChild.nodeValue;
		else
			return null;
	} catch(err) { return null; }
}

setTimeout( "pollAJAX()", 500 );

function LaurentObject() 
{
  this.Connected  = 0;      // 0 - disconnected, 1 - connected
  this.time      =  0;      // SystemTime
  this.sn        = "";      // Serial Number
  this.fw        = "";      // Firmware version
  this.pwm       = -1;      // PWM level  
  this.temp      = 0;       // Temperature  
  this.REL  = new Array();  // States of 4 Reles
  this.IN   = new Array();  // States of 6 IN lines
  this.OUT  = new Array();  // States of 12 OUT lines
  this.ADC  = new Array();  // ADC, 2 channels
  this.INT  = new Array();  // Impuls counter, 4 channels
  this.INTCycle  = new Array();   // Impuls counter cycles, 4 channels
  
  this.pass = "";
  this.ip   = "";
  this.mac  = "";
  this.mask = "";
  this.gate = "";
  this.baud = "";
  this.security = true;  // Security is ON
  this.fw_load  = false; // FW upload is disabled
  this.sav      = false; // Values saving is disabled
  
  for(i = 0; i < 4; i++)  this.REL[i] = 0;
  for(i = 0; i < 6; i++)  this.IN[i]  = 0;
  for(i = 0; i < 12; i++) this.OUT[i] = 0;
  for(i = 0; i < 2; i++)  this.ADC[i] = 0;
  for(i = 0; i < 4; i++)  this.INT[i] = 0;  
  for(i = 0; i < 4; i++)  this.INTCycle[i] = 0;
    
  this.IsConnected = function() { return this.Connected; }
  this.GetTime = function() { return this.time; } 
  this.GetSN = function() { return this.sn; }  
  this.GetFW = function() { return this.fw; }
  this.GetPWM = function() { return this.pwm; }
  this.GetTemperature = function() { return this.temp; }
  this.GetRele = function(n) { return this.REL[n]; }
  this.GetIN = function(n) { return this.IN[n]; }
  this.GetOUT = function(n) { return this.OUT[n]; } 
  this.GetADC = function(n) { return this.ADC[n]; }
  this.GetINT = function(n) { return this.INT[n]; }
  this.GetINTCycle = function(n) { return this.INTCycle[n]; }
  
  this.GetPass = function() { return this.pass; }
  this.GetIP = function() { return this.ip; }
  this.GetMAC = function() { return this.mac; } 
  this.GetMask = function() { return this.mask; } 
  this.GetGate = function() { return this.gate; } 
  this.GetBaud = function() { return this.baud; } 
  
  this.GetSEC = function() { return this.security; } 
  this.GetFWL = function() { return this.fw_load; }
  this.GetSAV = function() { return this.sav; }

  var srv = "server.cgi?data";

  this.SetRele = function(ReleIdx){ 
  newAJAXCommand(srv+'=REL,'+ReleIdx); }

  this.SetOUT = function(LineIdx){
  newAJAXCommand(srv+'=OUT,'+LineIdx);}

  this.SetPWM = function(NewPwm){ 
  newAJAXCommand(srv+'=PWM,'+NewPwm);}  

  this.SetPass = function(value){  
  newAJAXCommand(srv+'=PAS,' + value);}

  this.SetIP = function(value){ 
  newAJAXCommand(srv+'=IPX,' + value + '$');}

  this.SetMAC = function(value){ 
  newAJAXCommand(srv+'=MAC,' + value + '$');}
  
  this.SetMSK = function(value){ 
  newAJAXCommand(srv+'=MSK,' + value + '$');}
  
  this.SetGTW = function(value){ 
  newAJAXCommand(srv+'=GTW,' + value + '$');}
  
  this.SetSEC = function(value){ 
  newAJAXCommand(srv+'=SEC,' + value);}
  
  this.SetFWL = function(value){ 
  newAJAXCommand(srv+'=FWL,' + value);}
  
  this.SetSAV = function(value){ 
  newAJAXCommand(srv+'=SAV,' + value);}

  this.SetBaud = function(value){
  newAJAXCommand(srv+'=BAU,' + value);}
  
  this.SendUSART = function(value, cr_lf){
  newAJAXCommand(srv+'=USR,' + cr_lf + ',' + value.length + ',' + value);}

  this.Reset = function(){
  newAJAXCommand(srv+'=RST');}

  this.Default = function(){
  newAJAXCommand(srv+'=DEF');} 
      
      
  this.UpdateStatus = function(xmlData){   
  if( !xmlData ) { this.Connected = 0; return; }  
  
  this.Connected = 1;

  this.time = getXMLValue( xmlData, 'systime0' );
  this.sn = getXMLValue( xmlData, 'sn0' );
  this.fw = getXMLValue( xmlData, 'fw0' );    
  this.pwm = getXMLValue(xmlData, 'pwm0'); 
  this.temp = getXMLValue( xmlData, 'temper0' );
 
  var ReleTempTable = getXMLValue( xmlData, 'rele_table0' );
  for( i = 0; i < 4; i++ ) this.REL[i] = ReleTempTable.charAt(i);     
  var InTempValue = getXMLValue( xmlData, 'in_table0' ); 
  for( i = 0; i < 6; i++ ) this.IN[i] = InTempValue.charAt(i);  
  var OutTempValue = getXMLValue( xmlData, 'out_table0' ); 
  for( i = 0; i < 12; i++ ) this.OUT[i] = OutTempValue.charAt(i);   
  for( i = 0; i < 2; i++) this.ADC[i] = getXMLValue( xmlData, 'adc' + i ); 
  for( i = 0; i < 4; i++) this.INT[i] = getXMLValue( xmlData, 'count' + i );
  for( i = 0; i < 4; i++) this.INTCycle[i] = getXMLValue( xmlData, 'count_cycle' + i );

  this.pass = getXMLValue( xmlData, 'set_pass0' );
  this.ip   = getXMLValue( xmlData, 'set_ip0' );
  this.mac  = getXMLValue( xmlData, 'set_mac0' );
  this.baud = getXMLValue( xmlData, 'baud0' );
  
  this.mask  = getXMLValue( xmlData, 'set_mask0' );
  this.gate  = getXMLValue( xmlData, 'set_gate0' );
  
  this.security = false;
  this.fw_load  = false;
  this.sav      = false;

  var SettingsTable = getXMLValue( xmlData, 'bitset_table0' );
  var ch = SettingsTable.charAt(0);
  if( ch == '1' ) this.security = true;
  ch = SettingsTable.charAt(1);
  if( ch == '1' ) this.fw_load = true;  
  ch = SettingsTable.charAt(2);
  if( ch == '1' ) this.sav = true;  
  }
    
  this.Run = function(){
  setTimeout( "newAJAXCommand('status.xml', updateStatusLaurent, true)", 1000 );
  }
}


function JeromeObject() 
{
  this.Connected  = 0;      // 0 - disconnected, 1 - connected
  this.time      =  0;      // SystemTime
  this.sn        = "";      // Serial Number
  this.fw        = "";      // Firmware version
  this.pwm       = 0;       // PWM level  
  
  this.IOTableSave = new Array(); // States of IO lines (in/out) 
  this.IOValueSave = new Array(); // Values for IO lines (0/1)
    
  this.ADC  = new Array();        // ADC, 4 channels
  this.INT  = new Array();        // Impuls counter, 4 channels
  this.INTCycle  = new Array();   // Impuls counter cycles, 4 channels
  
  this.pass = "";
  this.ip   = "";
  this.mac  = "";
  this.mask = "";
  this.gate = "";
  this.baud = "";
  this.security = true;  // Security is ON
  this.fw_load  = false; // FW upload is disabled
  this.sav      = false; // Values saving is disabled
  
  for(i = 0; i < 22; i++)  
  {
    this.IOTableSave[i] = 0;
    this.IOValueSave[i] = 0;
  }
    
  for(i = 0; i < 4; i++)  
  {
    this.ADC[i] = 0;
    this.INT[i] = 0; 
    this.INTCycle[i] = 0; 
  }
    
  this.IsConnected = function() { return this.Connected; }
  this.GetTime = function() { return this.time; } 
  this.GetSN = function() { return this.sn; }  
  this.GetFW = function() { return this.fw; }
  this.GetPWM = function() { return this.pwm; }      
  this.GetADC = function(n) { return this.ADC[n]; }
  this.GetINT = function(n) { return this.INT[n]; }
  this.GetINTCycle = function(n) { return this.INTCycle[n]; }
  this.GetIoTable = function(n) { return this.IOTableSave[n]; }
  this.GetIoValue = function(n) { return this.IOValueSave[n]; } 
  
  this.GetPass = function() { return this.pass; }
  this.GetIP   = function() { return this.ip; }
  this.GetMAC  = function() { return this.mac; } 
  this.GetMask = function() { return this.mask; } 
  this.GetGate = function() { return this.gate; } 
  this.GetBaud = function() { return this.baud; } 
  
  this.GetSEC = function() { return this.security; } 
  this.GetFWL = function() { return this.fw_load; }
  this.GetSAV = function() { return this.sav; }

  var srv = "server.cgi?data";

  this.SetIO = function(LineIdx){ 
  newAJAXCommand(srv+'=SIO,'+LineIdx); }

  this.SetOUT = function(LineIdx,Value){
  newAJAXCommand(srv+'=OUT,'+LineIdx+','+Value);}

  this.SetPWM = function(NewPwm){ 
  newAJAXCommand(srv+'=PWM,'+NewPwm);}  

  this.SetPass = function(value){  
  newAJAXCommand(srv+'=PAS,' + value);}

  this.SetIP = function(value){ 
  newAJAXCommand(srv+'=IPX,' + value + '$');}

  this.SetMAC = function(value){ 
  newAJAXCommand(srv+'=MAC,' + value + '$');}

  this.SetMSK = function(value){ 
  newAJAXCommand(srv+'=MSK,' + value + '$');}
  
  this.SetGTW = function(value){ 
  newAJAXCommand(srv+'=GTW,' + value + '$');}
  
  this.SetSEC = function(value){ 
  newAJAXCommand(srv+'=SEC,' + value);}
  
  this.SetFWL = function(value){ 
  newAJAXCommand(srv+'=FWL,' + value);}
  
  this.SetSAV = function(value){ 
  newAJAXCommand(srv+'=SAV,' + value);}

  this.SetBaud = function(value){
  newAJAXCommand(srv+'=BAU,' + value);}
  
  this.SendUSART = function(value, cr_lf){
  newAJAXCommand(srv+'=USR,' + cr_lf + ',' + value.length + ',' + value);}

  this.Reset = function(){
  newAJAXCommand(srv+'=RST');}

  this.Default = function(){
  newAJAXCommand(srv+'=DEF');} 
      
      
  this.UpdateStatus = function(xmlData){   
  if( !xmlData ) { this.Connected = 0; return; }  
  
  this.Connected = 1;

  this.time = getXMLValue( xmlData, 'systime0' );
  this.sn = getXMLValue( xmlData, 'sn0' );
  this.fw = getXMLValue( xmlData, 'fw0' );    
  this.pwm = getXMLValue(xmlData, 'pwm0'); 
   
  var IoTempTable = getXMLValue( xmlData, 'iotable0' );
  for( i = 0; i < 22; i++ ) this.IOTableSave[i] = IoTempTable.charAt(i);     
  var IoTempValue = getXMLValue( xmlData, 'iovalue0' );
  for( i = 0; i < 22; i++ ) this.IOValueSave[i] = IoTempValue.charAt(i);  
  
  for( i = 0; i < 4; i++) this.ADC[i] = getXMLValue( xmlData, 'adc' + i ); 
  for( i = 0; i < 4; i++) this.INT[i] = getXMLValue( xmlData, 'count' + i );
  for( i = 0; i < 4; i++) this.INTCycle[i] = getXMLValue( xmlData, 'count_cycle' + i );

  this.pass = getXMLValue( xmlData, 'set_pass0' );
  this.ip   = getXMLValue( xmlData, 'set_ip0' );
  this.mac  = getXMLValue( xmlData, 'set_mac0' );
  this.baud = getXMLValue( xmlData, 'baud0' );  
  
  this.mask  = getXMLValue( xmlData, 'set_mask0' );
  this.gate  = getXMLValue( xmlData, 'set_gate0' );
      
  this.security = false;
  this.fw_load  = false;
  this.sav      = false;

  var SettingsTable = getXMLValue( xmlData, 'bitset_table0' );
  var ch = SettingsTable.charAt(0);
  if( ch == '1' ) this.security = true;
  ch = SettingsTable.charAt(1);
  if( ch == '1' ) this.fw_load = true;  
  ch = SettingsTable.charAt(2);
  if( ch == '1' ) this.sav = true;  
  }
    
  this.Run = function(){
  setTimeout( "newAJAXCommand('status.xml', updateStatusJerome, true)", 1000 );
  }
}

var bLaurentExists_XX = false;
var bJeromeExists_XX  = false;

var ObjLaurent_XX = null;
var ObjJerome_XX  = null;

function GetLaurentObject()
{
  if( !bLaurentExists_XX )
  {
     ObjLaurent_XX = new LaurentObject();
     bLaurentExists_XX = true;
  }
  return ObjLaurent_XX;
}

function GetJeromeObject()
{
  if( !bJeromeExists_XX )
  {
     ObjJerome_XX = new JeromeObject();
     bJeromeExists_XX = true;
  }  
  return ObjJerome_XX;
}

function updateStatusLaurent( xmlData ) 
{
  ObjLaurent_XX.UpdateStatus( xmlData );   
}

function updateStatusJerome( xmlData ) 
{
  ObjJerome_XX.UpdateStatus( xmlData );   
}