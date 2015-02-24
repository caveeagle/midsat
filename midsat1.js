
var NOAA_STR = "NOAA 12,NOAA 15,NOAA 16,NOAA 17,NOAA 18,NOAA 19,";

var midsat_filter;

var midsat_visible = 1;

var selected_uid;
var selected_uid_layer;

var activeProduct="seance_contour";

var selected_midsat_scene_update = "";

/* for return to old sceme: delete all strings with layer_name_2 and layer_name_3, then change base layer */

var seance_composite_layer_name = "combo_mrsat"; // BASE LAYER
var seance_composite_layer_name_2 = "seance_composite";
var seance_composite_layer_name_3 = "mrsat_tif_set";

function reload_midsat_parameters() 
{
	make_midsat_params();
	metaobj_midsat.SetDataParams(midsat_params);
	if(active_tab=="tab_midlayers")
	{
		metaobj_midsat.get();
	}	
    
    layers[seance_composite_layer_name+"_contour"].params={};
    layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name+"_contour_dt"] = midsat_params.data_params.dt;

    if((activeProduct=="seance_contour")||(activeProduct=="none"))
    {
    	layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name+"_contour_product"] = "ANY";
    	//layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name+"_contour_product"] = "seance_contour";

    	  layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_2+"_contour_product"] = "ANY";
    	/*???!!*/ layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_3+"_contour_product"] = "seance_contour";

	}   
	else
    {
    	layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name+"_contour_product"] = activeProduct;
    	layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_2+"_contour_product"] = activeProduct;
    	layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_3+"_contour_product"] = activeProduct;
	}
	

    layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name+"_contour_sats"] = midsat_sats_str;
    layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name+"_contour_stations"] = midsat_stn_str;

    if(poly_midfind_wkt)
    {
    	layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name+"_contour_polyfind"] = poly_midfind_wkt;
    	layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_2+"_contour_polyfind"] = poly_midfind_wkt;
    	layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_3+"_contour_polyfind"] = poly_midfind_wkt;
	}	

    layers[seance_composite_layer_name].params={};
    layers[seance_composite_layer_name].params[seance_composite_layer_name+"_dt"] = midsat_params.data_params.dt;
    layers[seance_composite_layer_name].params[seance_composite_layer_name+"_product"] = activeProduct; 

    layers[seance_composite_layer_name].params[seance_composite_layer_name+"_sats"] = midsat_sats_str;
    layers[seance_composite_layer_name].params[seance_composite_layer_name+"_stations"] = midsat_stn_str;


    if(poly_midfind_wkt)
    {
    	layers[seance_composite_layer_name].params[seance_composite_layer_name+"_polyfind"] = poly_midfind_wkt;
    	layers[seance_composite_layer_name].params[seance_composite_layer_name_2+"_polyfind"] = poly_midfind_wkt;
    	layers[seance_composite_layer_name].params[seance_composite_layer_name_3+"_polyfind"] = poly_midfind_wkt;
	}	



    /* ! TMP SCEME */ 
    layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_2+"_contour_dt"] = midsat_params.data_params.dt;
    layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_3+"_contour_dt"] = midsat_params.data_params.dt;
    layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_2+"_contour_sats"] = midsat_sats_str;
    layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_2+"_contour_stations"] = midsat_stn_str;
    layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_3+"_contour_satellite"] = midsat_sats_str;
    layers[seance_composite_layer_name+"_contour"].params[seance_composite_layer_name_3+"_contour_station"] = midsat_stn_str;

    layers[seance_composite_layer_name].params[seance_composite_layer_name_3+"_dt"] = midsat_params.data_params.dt;
    layers[seance_composite_layer_name].params[seance_composite_layer_name_3+"_product"] = activeProduct; 
    layers[seance_composite_layer_name].params[seance_composite_layer_name_3+"_satellite"] = midsat_sats_str;
    layers[seance_composite_layer_name].params[seance_composite_layer_name_3+"_station"] = midsat_stn_str;

    layers[seance_composite_layer_name].params[seance_composite_layer_name_2+"_dt"] = midsat_params.data_params.dt;
    layers[seance_composite_layer_name].params[seance_composite_layer_name_2+"_product"] = activeProduct; 
    layers[seance_composite_layer_name].params[seance_composite_layer_name_2+"_sats"] = midsat_sats_str;
    layers[seance_composite_layer_name].params[seance_composite_layer_name_2+"_stations"] = midsat_stn_str;
    
    if ( /^_/.test(activeProduct) )
    {
    	layers[seance_composite_layer_name].params[seance_composite_layer_name_3+"_use_product_aliases"] = 1; 
	}
	else
    {
    	layers[seance_composite_layer_name].params[seance_composite_layer_name_3+"_use_product_aliases"] = 0; 
	}
	
    
	setMidsatLayers();
}


function make_midsat_params()
{
   var midsat_date = document.getElementById("midsat_date_field").innerHTML;
	
   var fiter_array = new Object();
   fiter_array.sats = new Array();
   midsat_sats_str="";
   if(document.midsat_satelites_form)
   {
	   var never_sat = 1;
	   
	   for(i=0; i<(document.midsat_satelites_form.length); i++)
	   {
	      if(document.midsat_satelites_form.elements[i].checked)
	      {
	         never_sat = 0;
	         
	         var l_name = document.midsat_satelites_form.elements[i].name;
	         fiter_array.sats[fiter_array.sats.length] = l_name;
	         
	         if(l_name=="NOAA")
	         { 
	         	midsat_sats_str=midsat_sats_str+NOAA_STR;
	         }
	         else
	         {
	         	midsat_sats_str=midsat_sats_str+l_name+",";
	         }
	      }  
	   }
	   if(never_sat==1){midsat_sats_str="never_sat";}
   }

   // Make station list
   fiter_array.stn = new Array();
   midsat_stn_str="";
   if(document.midsat_stations_form)
   {
	   for(i=0; i<(document.midsat_stations_form.length); i++)
	   {
	      if(document.midsat_stations_form.elements[i].checked)
	      {
	         var l_name = document.midsat_stations_form.elements[i].name;
	         fiter_array.stn[fiter_array.stn.length] = l_name;

	         midsat_stn_str=midsat_stn_str+l_name+",";
	      }  
	   }
   }
    
    
    midsat_filter = JSON.stringify(fiter_array);
    
	var srs_string = "";
    if(typeof(need_reproj)!="undefined")
    { 
    	srs_string=currentProjection;
	}	
	
	midsat_params = { data_params: 
	{ 
		minLon: fixLon(mapobj.minLon), 
		minLat: fixLat(mapobj.minLat), 
		maxLon: fixLon(mapobj.maxLon), 
		maxLat: fixLat(mapobj.maxLat),
		dt: midsat_date,
		satellite: midsat_sats_str,
		station: midsat_stn_str,
		srs: srs_string,
		polyFind: poly_midfind_wkt,
		dt_from: midsat_date
	} };

	// add by Tolpin
	if(typeof session!='undefined')
	{
		if(typeof session.id!='undefined')
		{
			midsat_params.data_params.sid = session.id;
		}
	}
   
}	 

function setMidsatVisible(i)
{
	if(i)
	{
		midsat_visible=1;
		tabVeil("tab_midlayers",0);
	}
	else	
	{
		midsat_visible=0;
		tabVeil("tab_midlayers",1);
	}
	
	setMidsatVisibleLayers(i);
}

function setMidsatVisibleLayers(i)
{
	if(i)
	{
		midsat_visible=1;
		document.getElementById('midsat_visible_control').checked=true;
	}
	else	
	{
		midsat_visible=0;
		document.getElementById('midsat_visible_control').checked=false;
	}
	
	setMidsatLayers();
}


function checkMidsatVisible()
{
	return midsat_visible;
}


function midsat_makeMetaParams(opts)
{
	var params={};
	
	if(opts.DATA.common.dt) { params.dt = opts.DATA.common.dt; }
	if(opts.DATA.common.station) 
	{ 
		params.station = opts.DATA.common.station;
	}
	if(opts.DATA.common.satellite) 
	{ 
		params.satellite = opts.DATA.common.satellite; 

	}

	var active_color = 'color="#010101"';
	var passive_color = 'color="#C1C1C1"';

	if(opts.DATA.products)
	{
		
		var products_color	=	'';
		
		if(opts.DATA.products[activeProduct])
		{
				products_color=active_color;
		}
		else
		{
				products_color=passive_color;
		}
		
		if((activeProduct=="seance_contour")||(activeProduct=="none"))
		{
			products_color=active_color;
		}	
		
		params.products_color = products_color;
	}		
	
	
	if(opts.DATA.common.station && opts.INFO.stations && opts.INFO.stations[opts.DATA.common.station])
	{
		var tz = opts.INFO.stations[opts.DATA.common.station].tz;
		if(tz>=0)	{ tz = '+'+tz; }
		else	{ tz = '-'+tz; }
		params.station_tz	= tz;
	}
    
    var prod_server="nffc_mrsatdb";
    
    for(pkey in opts.DATA.products)
    {
    	if(pkey!="seance_contour")
    	{
	    	prod_server = opts.DATA.products[pkey].server;
	    	break;
    	}
	}

   
	var local_color = 'color="#000000"';
	var remoute_color = local_color;
	//var remoute_color = 'color="#000099"';
	var error_color = 'color="#FF0000"';
    
    var stn_color = local_color;
    
    if(opts.INFO.servers[prod_server].accessibility==0)
    {
    	stn_color = error_color;
	}	        
    else if(opts.INFO.servers[prod_server].is_local==0)
    {
    	stn_color = remoute_color;
	}	
    
    params.stn_color = stn_color;
    
    //  ######################################################## 
    //  ######################################################## 
	 
		var STN_NAME = opts.DATA.common.station;
		
	    params.sat_color = 'color="#000000"';
	    params.clink_begin = "";
	   	params.clink_end = "";



    //  ######################################################## 
    //  ######################################################## 


	if(opts.DATA.common.station) 
	{ 
		if(typeof center_rename == 'function')
		{
			params.station = center_rename(opts.DATA.common.station);
		}	
	}

	if(typeof planeta_sat_rename == 'function')
	{
		params.satellite = planeta_sat_rename(opts.DATA.common.satellite);
	}	
	
	
	return params;
}

function init_date_midsat()
{
  document.getElementById("midsat_date_field").innerHTML=today();
  
	if( typeof( TABS_LIST ) ==	"undefined") { TABS_LIST=[]; }
    TABS_LIST.push('Midsat');
    
    if(typeof ash_palette_controls_onload == 'function')
    {
        ash_palette_controls_onload();
    }    
    
}

function init_midsat_products_list_checkbox()
{
	//globalAlert(dumpObj(products_list,'','	',0));
	
	var i=0;
	var default_active_product = 1;
	var row = "";
	for(key in products_list)
	{
		var lname = products_list[key];
		if(i!=default_active_product)
		{
	    	row = row+"\n"+"<input id='"+key+"' value='"+key+"' name='comp' onclick='setActiveProduct();' type='radio'>";
	    	row = row+"\n"+"<label id='label_"+key+"' style='font-family: times;font-size: 12px;'>"+lname+"</label><br>";
		}
		else
		{
	    	row = row+"\n"+"<input checked id='"+key+"' value='"+key+"' name='comp' onclick='setActiveProduct();' type='radio'>";
	    	row = row+"\n"+"<label id='label_"+key+"' style='font-family: times;font-size: 12px; font-weight:bold'>"+lname+"</label><br>";
		}
		i++;
	}	
    
    document.getElementById("_midsat_prod_list_div").innerHTML = row;
}	

function init_midsat_products_list()
{
	var i=0;
	var default_active_product = 1;
	var row = "<select name='comp' onchange='setActiveProduct();' style='width: 94%;'>\n";
	for(key in products_list)
	{
		var lname = products_list[key];
		if(i!=default_active_product)
		{
	    	if(key.indexOf("label")>-1) // Разделитель строк
	    	{
	    	  row = row+"\n"+"<option disabled=true>"+lname+"</option>";
	    	}
	    	else
	        {
	    	  if(key.length>2)// Skip empty (last element)
	    	  {
	    	    row = row+"\n"+"<option value='"+key+"'>"+lname+"</option>";
	    	  }  
	    	}
		}
		else
		{
	    	row = row+"\n"+"<option value='"+key+"' style='font-weight:bold' selected>"+lname+"</option>";
		}
		i++;
	}

    row = row+"</select>";
    
    document.getElementById("_midsat_prod_list_div").innerHTML = row;
}	


function midsat_date_change()
{
	reload_midsat_parameters();
	if(typeof syncFires2seances == 'function')
	{
		syncFires2seances();
	}	
	if(typeof syncMeteo2seances == 'function')
	{
		syncMeteo2seances();
	}	
	if(typeof syncMrsatAddProducts2seances == 'function')
	{
		syncMrsatAddProducts2seances();
	}	
}	

function date_change(i)
{
	var today_date  = new Date();
	
	var curr_date_st = document.getElementById("midsat_date_field").innerHTML;
	
	var year = curr_date_st.substring(0,4);
	var month = curr_date_st.substring(5,7);
	month=month-1;
	var day = curr_date_st.substring(8,10);
	
	actual_date = new Date(year,month,day);
	
	actual_date.setDate(actual_date.getDate()+i);
	
	if(actual_date.getTime() > today_date.getTime() )
    	{
    		actual_date = new Date();
   	}   
	
	var yr = actual_date.getFullYear();
	var mn = actual_date.getMonth()+1;
	if(mn<10)
	{
	 mn = "0"+mn;
	}   
	var dy = actual_date.getDate();
	if(dy<10)
	{
	  dy = "0"+dy;
	}   
	
	var str = ""+yr+"-"+mn+"-"+dy;
	
	document.getElementById("midsat_date_field").innerHTML = str;
	
	midsat_date_change();
}  


function midsat_OnMetaUpdate(opts)
{
	var obj;

  if(selected_midsat_scene_update != "")
  {
  	selectedSceneMidsatRedraw(selected_midsat_scene_update);
	}	

    
	if(opts && opts.metadataid)
	{
		obj = document.getElementById("_metadata_midsat_portion_info");
		if(obj)
		{
			if(defined(opts.INFO.query.count) && opts.INFO.query.count!==null)
			{       
					if(project_language == 'rus')
					{
						obj.innerHTML = "Найдено сеансов: "+opts.INFO.query.count;
					}	
					if(project_language == 'eng')
					{
						obj.innerHTML = "Found seances: "+opts.INFO.query.count;
					}	
			}
			else
			{
				obj.innerHTML = "&nbsp;";
			}
		}
	}
}

function midsat_OnMetaClick()
{
	
	if(activeProduct=="none")
	{
		if(false)
		{  // checkbox style
			document.midsat_product_filter.comp[1].checked=true;
		 	var l1 = document.getElementById("label_"+"seance_contour");
		 	l1.style.fontWeight = 'bold';
		 	var l1 = document.getElementById("label_"+"none");
		 	l1.style.fontWeight = 'normal';
		}
		else
		{  
			document.midsat_product_filter.comp.options[1].selected=true;
		 	document.midsat_product_filter.comp.options[1].style.fontWeight = 'bold';
		 	document.midsat_product_filter.comp.options[0].style.fontWeight = 'normal';
		}
		
		
		activeProduct="seance_contour";
	}
	
	// 28.02.2013 Efr - to escape null seances selected
	var selected = metaobj_midsat.GetSelectedMetaInfo();

	// 13.05.2013 Tolpin - disable by date period for VEGA
	if(selected && selected[0] && selected[0].disabled)
	{
		if(session.project == 'fap') 
		{ 
			if(typeof(max_demo_date) !=	"undefined")
			{
				globalAlert('Доступ к данным позднее '+max_demo_date+' в DEMO режиме не возможен!');
			}
			else
			{
				globalAlert('Доступ к данным в DEMO режиме не возможен!');
			}
			clearSelectionMidsat();
			return; 
		}
		else { globalAlert('Доступ к данным не возможен!');clearSelectionMidsat();return; }
	}

	if(!selected[0]["dt"]){return;}
	    
	redrawProductList(); 
	
	setMidsatLayers();
	
	if(typeof reload_seancefires_param == 'function')
	{
		reload_seancefires_param();
	}	
	if(typeof reload_vl_seancefires_param == 'function')
	{
		reload_vl_seancefires_param();
	}	
	if(typeof meteo_sync_to_midsat_time == 'function')
	{
		meteo_sync_to_midsat_time();
	}

}	

function setActiveProduct()
{
	 theGroup = document.midsat_product_filter.comp;
	 
	 for (i=0; i< theGroup.options.length; i++) 
	 {
	     var p = theGroup.options[i].value;
	     
	     if(theGroup.options[i].selected) 
	     {
			
		 	 theGroup.options[i].style.fontWeight = 'bold';
			 activeProduct = p;

			 if(p=="none")
			 {
			 	metaobj_midsat.ClearSelection();
			 }
			
         }
         else
         {
		 	 theGroup.options[i].style.fontWeight = 'normal';
         }

     }
     
     if(typeof useAshPalette == 'function')
     {
        useAshPalette();  
     }
     
     metaobj_midsat.render();

	 reload_midsat_parameters(); // 05.02.2013

     setMidsatLayers();
}	

function redrawProductList()
{
	theGroup = document.midsat_product_filter.comp;
	var selected = metaobj_midsat.GetSelectedMetaInfo( { metadataid : 'seances', 'type': 'group_by_products' } );
	if(selected)
	{

	 for (i=0; i< theGroup.options.length; i++) 
	 {
	   	var p = theGroup.options[i].value;

 	 	var l1 = theGroup.options[i];
 	 	l1.style.color = '#C1C1C1';
        
        if((p=="seance_contour")||(p=="none"))
        {
        	l1.style.color = '#010101';
    	}	
        
		for(product_key in selected)
		{
			if(selected.hasOwnProperty(product_key))
			{
				// ######################################
				
		         if(p==product_key)
		         {
			 	 	l1.style.color = '#020202';
			 	 }
				
				// ######################################
			}
		}
	         
		 	
     }
	 }
}	


function setMidsatLayers()
{   
	if(multi_midsat_on)
	{
		setMultiMidsatLayers();
		return;
	}
	else
	{
		globalAlert("Ошибка модуля: multi_midsat_on должен быть выставлен в 1");
	}		
}	

function setMultiMidsatLayers()
{   
	selected_uid = 0;
	selected_uid_layer = "mrsat";

	var layer_type = "mrsat"; // either mrsat or mrsat_tif 
	
	if(!midsat_visible)
	{
		mapobj.LayerHide('mrsat_multi');
		mapobj.LayerHide('mrsat_tif');
		
		mapobj.LayerHide('mrsat_multi_contour');
		mapobj.LayerHide('mrsat_tif_contour');
		mapobj.LayerHide(seance_composite_layer_name);
		mapobj.LayerHide(seance_composite_layer_name+'_contour');
	}
	 else
	{

		var selected = metaobj_midsat.GetSelectedMetaInfo();
	    
	    //globalAlert(dumpObj(selected,'','	',0));
	    
		var is_find = 0;
		if(selected[0])
		{
			for(product_key in (selected[0]["products"]))
			{
					if(product_key==activeProduct)
					{
		                var uids = ""+selected[0]["products"][product_key]["id"];
		                
		                layer_type = selected[0]["products"][product_key]["layer"];
		                
						if(layer_type=="mrsat_tif")
						{
							layers["mrsat_tif"].params={};
							layers["mrsat_tif"].params["mrsat_tif_uids"] = uids;
							layers["mrsat_tif"].params.server_id = selected[0]["products"][product_key]["server"];

							layers["mrsat_tif_contour"].params={};
							layers["mrsat_tif_contour"].params["mrsat_tif_contour_uids"] = ""+selected[0]["products"]["seance_contour"]["id"];

						}
						if(layer_type=="mrsat")
						{
							layers["mrsat_multi"].params={};
							layers["mrsat_multi"].params["mrsat_uids"] = uids;
							layers["mrsat_multi"].params.server_id = selected[0]["products"][product_key]["server"];

							layers["mrsat_multi_contour"].params={};
							layers["mrsat_multi_contour"].params["mrsat_contour_uids"] = ""+selected[0]["products"]["seance_contour"]["id"];

						}
						
						
						is_find=1;
					}
			}
				if(selected[0]["products"]["seance_contour"])
				{
					selected_uid = selected[0]["products"]["seance_contour"]["id"];
					selected_uid_layer = selected[0]["products"]["seance_contour"]["layer"];
				}	
	    }
	     
if(typeof setAshPaletteParams == 'function')
{
    setAshPaletteParams();	
}    
	
		if(selected[0])
		{
			if(activeProduct=="seance_contour")
			{
				mapobj.LayerHide('mrsat_tif');
				mapobj.LayerHide('mrsat_multi');

				if(layer_type=="mrsat_tif")
				{
					mapobj.LayerShow('mrsat_tif_contour');
					mapobj.LayerHide('mrsat_multi_contour');
				}
				else
				{
					mapobj.LayerHide('mrsat_tif_contour');
					mapobj.LayerShow('mrsat_multi_contour');
				}
				
			}
			else
			{
				mapobj.LayerHide('mrsat_tif_contour');
				mapobj.LayerHide('mrsat_multi_contour');
				
				if(is_find==1)
				{
					if(layer_type=="mrsat_tif")
					{
						mapobj.LayerShow('mrsat_tif');
						mapobj.LayerHide('mrsat_multi');
					}
					if(layer_type=="mrsat")
					{
						mapobj.LayerShow('mrsat_multi');
						mapobj.LayerHide('mrsat_tif');
					}
						
				}
				else
				{
					mapobj.LayerHide('mrsat_tif');
					mapobj.LayerHide('mrsat_multi');
				}		
			}
				
		}
		else
		{
			mapobj.LayerHide('mrsat_tif_contour');
			mapobj.LayerHide('mrsat_multi_contour');
			mapobj.LayerHide('mrsat_tif');
			mapobj.LayerHide('mrsat_multi');
		}		
    
    
        if(document.getElementById('immode_none').checked)
        { 
        	mapobj.LayerHide(seance_composite_layer_name);
        	mapobj.LayerHide(seance_composite_layer_name+'_contour');
    	}	
        if(document.getElementById('immode_contour').checked)
        { 
        	mapobj.LayerShow(seance_composite_layer_name+'_contour');
        	mapobj.LayerHide(seance_composite_layer_name);
    	}	
        if(document.getElementById('immode_img').checked)
        { 
        	if(activeProduct!="seance_contour")
        	{
	        	layers[seance_composite_layer_name].params[seance_composite_layer_name+"_product"] = activeProduct;

	        	layers[seance_composite_layer_name].params[seance_composite_layer_name_2+"_product"] = activeProduct;
	        	layers[seance_composite_layer_name].params[seance_composite_layer_name_3+"_product"] = activeProduct;

	        	mapobj.LayerShow(seance_composite_layer_name);
	        	mapobj.LayerHide(seance_composite_layer_name+'_contour');

        	}
        	else
	        { 
	        	mapobj.LayerShow(seance_composite_layer_name+'_contour');
	        	mapobj.LayerHide(seance_composite_layer_name);
	    	}	
        	
    	}	
    
	}
}	



function midsat2Basket()
{
	var msat = metaobj_midsat.GetSelectedMetaInfo();
	
	if(!(msat[0]))
	{   
		if(project_language == 'rus')
		{
			globalAlert('Нет выбранных данных\nдля добавления в корзину!');
		}	
		if(project_language == 'eng')
		{
			globalAlert('There are no data\n to add in basket!');
		}	
		return;
	}	
	msat[0]['common'] = {};
	msat[0]['common']['type'] = 'midsat';
	msat[0]['activeProduct'] = activeProduct;
	
	for (var x in (msat[0]['products'])) 
	{ 
	   if(x != activeProduct)
	   {
	   	 delete msat[0]['products'][x];
	   }	
	   else
	   {
	   		msat[0]['products']=msat[0]['products'][x];
	   	 delete msat[0]['products'][x];
	   }
	}	

  if(multi_midsat_on==0)
    {
		msat[0]['products']['layer'] = 'mrsat';
	}	

	metaBasket.addData(msat);
	metaBasket.render();
}	



function tab_midlayers_onactive()
{
	reload_midsat_parameters();
}	


function composite_info()
{
 var comp_info_url = "./html/mrsat_legend.html";
 
 var info_url = comp_info_url+"#"+activeProduct;
 var wnd = window.open( info_url, "_info", "width=600,height=350,location=no,toolbar=no,scrollbars=yes,resizable=yes" );
 wnd.focus();
 return false;
}	

var poly_midfind_wkt="";

function poly_find_midsat()
{
	if(document.midsat_addparams_form.poly_find_ch)
	{
	    if(document.midsat_addparams_form.poly_find_ch.checked)
	    {
	 		var poly_obj = mapobj.ActivePolygonGet();
	 		
	 		if(!poly_obj)
	 		{
	 			globalAlert("Полигон не задан!");
	 			document.midsat_addparams_form.poly_find_ch.checked = false;
	 			return;
	 		}
	 
	 		poly_midfind_wkt = poly_obj.toWKT({coordOrder: 'yx', useMultiPolygon: 0});
		}
		else
		{
			poly_midfind_wkt = "";
		}
	}
	
	reload_midsat_parameters();
}	

function clearSelectionMidsat()
{
	metaobj_midsat.ClearSelection(); 

        
    if(multi_midsat_on)
    {
		mapobj.LayerHide('mrsat_multi');
		mapobj.LayerHide('mrsat_tif');
		
		mapobj.LayerHide('mrsat_multi_contour');
		mapobj.LayerHide('mrsat_tif_contour');
   }
   else
   {
		mapobj.LayerHide('mrsat');
		mapobj.LayerHide('mrsat_contour');
	}	
	
}

/* ------------------------------------------------------------ */

function getMidsatTabState()
{
	var obj = { 'MIDSAT_LAYERS_STATE': {} };

	obj['MIDSAT_LAYERS_STATE']['IS_ACTIVE'] = checkMidsatVisible();

	obj['MIDSAT_LAYERS_STATE']['DATE'] = dojo.query("#midsat_date_field")[0].innerHTML;

  // --------------- //

  obj['MIDSAT_LAYERS_STATE']['SATS'] = {};

	var chset = dojo.query("#midsat_satelites_form_id  input[type=checkbox]");

	chset.forEach(function(th)
	{
		if(th.name)
		{
				if(th.checked)
				{
					obj['MIDSAT_LAYERS_STATE']['SATS'][th.name] = 1;
				}	
				else 
				{
					obj['MIDSAT_LAYERS_STATE']['SATS'][th.name] = 0;
				}
    }
  });	
  
  obj['MIDSAT_LAYERS_STATE']['STN'] = {};

	var chset = dojo.query("#midsat_stations_form_id  input[type=checkbox]");

	chset.forEach(function(th)
	{
		if(th.name)
		{
				if(th.checked)
				{
					obj['MIDSAT_LAYERS_STATE']['STN'][th.name] = 1;
				}	
				else 
				{
					obj['MIDSAT_LAYERS_STATE']['STN'][th.name] = 0;
				}
    }
  });	

  // --------------- //

	chset = dojo.query("select[name=comp]");
	
	obj['MIDSAT_LAYERS_STATE']['PRODUCT'] = chset[0].value;
  
  // --------------- //

  obj['MIDSAT_LAYERS_STATE']['ADD_PRODUCTS_LAYERS'] = {};

	var chset = dojo.query("#group_midsat_prod  input[type=checkbox]");

	chset.forEach(function(th)
	{
		if(th.id)
		{
				if(th.checked)
				{
					obj['MIDSAT_LAYERS_STATE']['ADD_PRODUCTS_LAYERS'][th.id] = 1;
				}	
				else 
				{
					obj['MIDSAT_LAYERS_STATE']['ADD_PRODUCTS_LAYERS'][th.id] = 0;
				}
    }
  });	
 


  // --------------- //

	var s = metaobj_midsat.GetSelectedMetaInfo();
        
	if(s[0])
	{
   var s1 = s[0]['dt'];
   var s2 = s[0]['satellite'];
   var s3 = s[0]['station'];
   var sta = ""+s1+"-"+s2+"-"+s3;
   
	 obj['MIDSAT_LAYERS_STATE']['SELECTED_SCENE'] = sta;
	}  
  
  // --------------- //

	return obj;
}



function setMidsatTabState(load_obj)
{
  var obj = load_obj['MIDSAT_LAYERS_STATE'];

	dojo.query("#midsat_date_field")[0].innerHTML = obj['DATE'];
	
	// --------------- //


	var chset = dojo.query("#midsat_satelites_form_id  input[type=checkbox]");

	chset.forEach(function(th)
	{
		if(th.name)
		{
		    if(th.name in obj['SATS'])
		    {
						 if(obj['SATS'][th.name]==1)
						 {
						 		th.checked=true;
					 	 }
					 	 else
						 {
						 		th.checked=false;
					 	 }
				}
    }
  });	


	chset = dojo.query("#midsat_stations_form_id  input[type=checkbox]");

	chset.forEach(function(th)
	{
		if(th.name)
		{
		    if(th.name in obj['STN'])
		    {
						 if(obj['STN'][th.name]==1)
						 {
						 		th.checked=true;
					 	 }
					 	 else
						 {
						 		th.checked=false;
					 	 }
				}
    }
  });	
  
 
  // --------------- //
 
	chset = dojo.query("select[name=comp]");
	
	chset[0].value = obj['PRODUCT'];
	
	// --------------- //
  
	var chset = dojo.query("#group_midsat_prod  input[type=checkbox]");

	chset.forEach(function(th)
	{
		if(th.id)
		{
		    if(th.id in obj['ADD_PRODUCTS_LAYERS'])
		    {
						 if(obj['ADD_PRODUCTS_LAYERS'][th.id]==1)
						 {
						 		th.checked=true;
					 	 }
					 	 else
						 {
						 		th.checked=false;
					 	 }
				}
    }
  });	

	// --------------- //

  if(obj['IS_ACTIVE'])
  {
  		setActiveProduct();
			make_midsat_params();
			metaobj_midsat.SetDataParams(midsat_params);
  		
			if(obj['SELECTED_SCENE'])
			{
				selected_midsat_scene_update = obj['SELECTED_SCENE'];
				metaobj_midsat.get();
			}
		  
	}

  setMidsatVisible(obj['IS_ACTIVE'])
}



function selectedSceneMidsatRedraw(sta) 
{
		  metaobj_midsat.selectByUID(sta);
		  metaobj_midsat.render();
		  selected_midsat_scene_update = "";
}


function setUnionDateMidsat(udate)
{
	document.getElementById("midsat_date_field").innerHTML = udate;  
	midsat_date_change();
}	


