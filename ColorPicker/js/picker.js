
var picker = {
	V: 100,
	S:100,
	status:false,
	
	init: function () {
     var id_elements = {primary: "primary_block", arrows: "arrows", block: "block_picker", circle: "circle", line: "line"}; 

    var s ={h:180, w:20, th: id_elements.arrows, bk: id_elements.block, line: id_elements.line};
	/*
	Параметры передаваемые через обьект "s" обьекту "Line"
	h - высота линни Hue
	w- ширина линни Hue
	th  - id для елмента в котором находяться стрелки || ползунок для управление шкалой Hue
	bk - id блока главного блока с изображение и изменяемым фоном
	*/
    Line.init(s);//отрисовка линий hue и привязка событий

     var b = {block: id_elements.block, circle: id_elements.circle};
	/*
	Параметры передаваемые через обьект "b" обьекту "Block"
	id - id блока выбора цвета (основной блок)
	c - круг для перемещения по основнoму блоку(для выбора цвета)
	*/
     Block.init(b);// привязка событий к блоку и кругу для управления

      picker.out_color = document.getElementById("out_color");

}
};

var Line ={
	  
	   Hue: 0,
	
	init: function (elem){
		
      var canvaLine, cAr, pst, bk, t = 0;;
        
		canvaLine = Line.create(elem.h, elem.w, elem.line, "cLine");

          cAr = document.getElementById(elem.th);
           bk = document.getElementById(elem.bk);

       Line.posit = function (e){
		 var top, rgb;
           
		  top = mouse.pageY(e) - pst;
           top = (top < 0 )? 0 : top;
             top = (top > elem.h )? elem.h  : top;
 
               cAr.style.top = top-2 +"px";
                t =  Math.round(top /(elem.h/ 360));
                 t = Math.abs(t - 360);
                   t = (t == 360)? 0 : t;
  
                     Line.Hue = t;

                       bk.style.backgroundColor = "rgb("+convert.hsv_rgb(t,100,100)+")";
                         picker.out_color.style.backgroundColor= "rgb("+convert.hsv_rgb(t,picker.S,picker.V)+")";
	}
// события перемещения по линии
      cAr.onmousedown = function (){
	
	      pst = Obj.positY(canvaLine);
	
	         document.onmousemove = function(e){Line.posit(e);}
		}

       cAr.onclick = Line.posit;

         canvaLine.onclick = function (e){Line.posit(e)};
           
		   canvaLine.onmousedown = function (){
	
	         pst = Obj.positY(canvaLine);
	           
			   document.onmousemove = function(e){Line.posit(e);}
	}
                 document.onmouseup = function (){
					 document.onmousemove = null; 
					 cAr.onmousemove = null; 
					 
					 }
},
	
	
	create : function (height, width, line, cN){
	  var canvas = document.createElement("canvas");
	
	    canvas.width = width;
	     canvas.height = height;	
	
	       canvas.className = cN;
	        
			document.getElementById(line).appendChild(canvas);
		 
		      Line.grd(canvas, height, width);
		 
		 return canvas;
	},
	
	grd:function (canva, h, w){
		var gradient,hue,color, canva, gradient1;
		
		 canva = canva.getContext("2d");

	       gradient = canva.createLinearGradient(w/2,h,w/2,0);
	 
	         hue = [[255,0,0],[255,255,0],[0,255,0],[0,255,255],[0,0,255],[255,0,255],[255,0,0]];
	
	for (var i=0; i <= 6;i++){
		
	  color = 'rgb('+hue[i][0]+','+hue[i][1]+','+hue[i][2]+')';
	
	     gradient.addColorStop(i*1/6, color);
	
	};
	  canva.fillStyle = gradient;
         	canva.fillRect(0,0, w ,h);	
	}
};

	var Block = {
			
	init: function (elem) {
		
		var circle, block, colorO, bPstX, bPstY, bWi, bHe, cW, cH, pxY, pxX;
		 
		 circle = document.getElementById(elem.circle);
		  block = document.getElementById(elem.block);
		    cW = circle.offsetWidth ;
	         cH = circle.offsetHeight;
		       bWi = block.offsetWidth - cW;
	             bHe = block.offsetHeight - cH;
		           pxY = bHe / 100; 
		            pxX = bWi / 100; 
		
		Block.cPos = function (e){
			
			var top, left, S, V;
			
			 document.ondragstart = function() { return false;}
			
			   document.body.onselectstart = function() { return false; }
			
			left = mouse.pageX(e) - bPstX - cW/2;
			 left = (left < 0)? 0 : left;
			  left = (left > bWi  )? bWi  : left;
			   
			   circle.style.left = left  + "px"; 
			   
			    S = Math.ceil(left /pxX) ;
			    
				 top = mouse.pageY(e)  - bPstY - cH/2;
			      top = (top > bHe  )? bHe : top;
			
			        top = (top < 0)? 0 : top;
			
			          circle.style.top = top   + "px";
			
			            V = Math.ceil(Math.abs(top / pxY - 100));
			             
						 if (V <50) circle.style.borderColor = "#fff";
			
			else circle.style.borderColor = "#000";
			
			picker.S = S;
			
			  picker.V = V;
			
			     picker.out_color.style.backgroundColor = "rgb("+convert.hsv_rgb(Line.Hue,S,V)+")";
				 var _res = convert.hsv_rgb(Line.Hue,S,V);
			     _res = _res[0].toString(16)+""+_res[1].toString(16)+""+_res[2].toString(16);
				 console.log(_res);
			}
			
			block.onclick = function(e){Block.cPos(e);}
			block.onmousedown  = function (){
			document.onmousemove = function (e){
				bPstX = Obj.positX(block);
				bPstY = Obj.positY(block);
				Block.cPos(e);

				}
			}

			document.onmouseup=function() {
				document.onmousemove = null;
				}
		}
		
		};

var convert = {
	
	hsv_rgb: function (H,S,V){

	 var f , p, q , t, lH;

    var H_H =document.getElementById('HSV_H');
    H_H.value=Math.ceil(H);
    var H_S =document.getElementById('HSV_S');
    H_S.value=Math.ceil(S); 
    var H_V =document.getElementById('HSV_V');
    H_V.value=Math.ceil(V);
	  S /=100;
      V /=100;
     
	 lH = Math.floor(H / 60);
      
	  f = H/60 - lH;
        p = V * (1 - S); 
         q = V *(1 - S*f);
	       t = V* (1 - (1-f)* S);
      
	  switch (lH){
      
	  case 0: R = V; G = t; B = p; break;
        case 1: R = q; G = V; B = p; break;
         case 2: R = p; G = V; B = t; break;
           case 3: R = p; G = q; B = V; break;
            case 4: R = t; G = p; B = V; break;
              case 5: R = V; G = p; B = q; break;}
     






     RS = R*255;
     GS = G*255;
     BS = B*255;
     He = ((1 << 24) + (RS << 16) + (GS << 8) + BS).toString(16).slice(1);
    var HEXCalc =document.getElementById('hex');
      HEXCalc.value=(He[0]+He[1]+He[2]+He[3]+He[4]+He[5]);

      
    var R_R =document.getElementById('RGB_R');
    R_R.value=Math.ceil(R*255);
    var R_G =document.getElementById('RGB_G');
    R_G.value=Math.ceil(G*255); 
    var R_B =document.getElementById('RGB_B');
    R_B.value=Math.ceil(B*255);

    


    var K;

    if ((R == 0) && (G == 0) && (B == 0)) {
      C=0,M=0,Y=0,K=1;
    }else{
    var calcR = 1 - R,
            calcG = 1 - G,
            calcB = 1 - B;

    K = Math.min(calcR, Math.min(calcG, calcB)),
            C = (calcR - K) / (1 - K),
            M = (calcG - K) / (1 - K),
            Y = (calcB - K) / (1 - K);
    }

    var C_C =document.getElementById('CMYK_C');
    C_C.value=Math.ceil(C*100);
    var C_M =document.getElementById('CMYK_M');
    C_M.value=Math.ceil(M*100)
    var C_Y =document.getElementById('CMYK_Y');
    C_Y.value=Math.ceil(Y*100);
    var C_K =document.getElementById('CMYK_K');
    C_K.value=Math.ceil(K*100);

    var Rs = R;
    var Gs = G;
    var Bs = B;

    var RsCalc = ((Rs + 0.055) / 1.055);
    var GsCalc = ((Gs + 0.055) / 1.055)
    var BsCalc = ((Bs + 0.055) / 1.055)

  if (Rs > 0.04045){
    Rs = Math.pow(RsCalc, 2.4);
  }else{
    Rs = Rs / 12.92;
  }
  if (Gs > 0.04045){
    Gs = Math.pow(GsCalc, 2.4);
  }else{
    Gs = Gs / 12.92;
  }
  if(Bs > 0.04045){
    Bs = Math.pow(BsCalc, 2.4);
  }else{
    Bs = Bs / 12.92;
  }

  Rs = Rs * 100;
  Gs = Gs * 100;
  Bs = Bs * 100;

  X = Rs * 0.4124 + Gs * 0.3576 + Bs * 0.1805;
  Y = Rs * 0.2126 + Gs * 0.7152 + Bs * 0.0722;
  Z = Rs * 0.0193 + Gs * 0.1192 + Bs * 0.9505;

  var X_X =document.getElementById('XYZ_X');
    X_X.value=Math.ceil(X);
  var X_Y =document.getElementById('XYZ_Y');
    X_Y.value=Math.ceil(Y);
  var X_Z =document.getElementById('XYZ_Z');
    X_Z.value=Math.ceil(Z);

  var Xw = 95.047;
  var Yw = 100;
  var Zw = 108.883;

  var XCalc = X / Xw;
  var YCalc = Y / Yw;
  var ZCalc = Z / Zw;

  if(XCalc > 0.008856){
    XCalc = Math.pow(XCalc,1/3);
  }else{ 
    XCalc = (7.787 * XCalc) + (16 / 116);
  }
  if(YCalc > 0.008856){
    YCalc = Math.pow(YCalc,1/3);;
  }else{ 
    YCalc = (7.787 * YCalc) + (16 / 116);
  }
  if(ZCalc > 0.008856){
    ZCalc = Math.pow(ZCalc,1/3);
  }else{ 
    ZCalc = (7.787 * ZCalc) + (16 / 116);
  }

  var L = (116 * YCalc)-16;
  var A = 500 * (XCalc - YCalc);
  var B_B = 200 * (YCalc - ZCalc);



  var L_L =document.getElementById('LAB_L');
    L_L.value=Math.ceil(L);
  var L_B =document.getElementById('LAB_A');
    L_B.value=Math.ceil(A);
  var L_B =document.getElementById('LAB_B');
    L_B.value=Math.ceil(B_B);

  

  var max = Math.max(R, G, B), min = Math.min(R, G, B);
    var Hs, Ss, Ls = (max + min) / 2;
    if(max == min){
        Hs = Ss = 0; 
    }else{
        var d = max - min;
        Ss = Ls > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case R: Hs = (G - B) / d + (G < B ? 6 : 0); break;
            case G: Hs = (B - R) / d + 2; break;
            case B: Hs = (R - G) / d + 4; break;
        }
        Hs /= 6;
      }
  var H_HS =document.getElementById('HSL_H');
    H_HS.value=Math.ceil(Hs*100);
  var H_S =document.getElementById('HSL_S');
    H_S.value=Math.ceil(Ls*100);
  var H_L =document.getElementById('HSL_L');
    H_L.value=Math.ceil(Ss*100);

      

	 return [parseInt(R*255), parseInt(G*255), parseInt(B*255)];
   
	}
  
};
  
   


