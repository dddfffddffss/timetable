var daily_list = new Map();
function add_hour() {
	let d = Number(document.getElementById("select_day").value);
	let s = Number(document.getElementById("start_time").value);
	let e = Number(document.getElementById("end_time").value);
	let n = document.getElementById("time_name").value;
	if(s>e){
		temp = s;
		s = e;
		e = temp;
		document.getElementById("start_time").value = s;
		document.getElementById("end_time").value = e;
	}

	if(!add_list(d, s, e, n))return;
	add_element(d, s, e, n);
}
function add_element(d, s, e, n) {
	let dpx = (d-1) * 190;
	let spx = (Math.floor(s/100 - 9) + (s%100)/60) * 45;
	let epx = (Math.floor(e/100 - 9) + (e%100)/60) * 45;

	var type = document.createElement("div");
	type.style.position = 'absolute';
	type.style.top = spx + 'px';
	type.style.left = dpx + 'px';
	type.style.width = '180px';
	type.style.height = (epx-spx-10) + 'px';
	type.style.border = "5px dashed blue";
	type.style.lineHeight = (epx-spx-10) + 'px';
	type.style.backgroundColor = document.getElementById("default_color").value;

	type.appendChild(document.createTextNode(n));
	add_color_input(type);
	add_delete(type, d, s);
	document.getElementById("setter").appendChild(type);
}
function add_list(d, s, e, n) {
	if(isoverlap(d,s,e)){
		alert("시간이 겹칩니다!");
		return false;
	}else if(!daily_list.get(d)){
		daily_list.set(d, []);
	}
	daily_list.get(d).push([s, e, n]);
	return true;
}
function add_delete(type, d, s) {
	var jbBtn = document.createElement('button');
	jbBtn.appendChild(document.createTextNode("X"));
	jbBtn.style.position = 'absolute';
	jbBtn.style.top = '0px';
	jbBtn.style.right = '0px';
	jbBtn.addEventListener("click", function () {
        type.remove();
		for(let i=0;i<daily_list.get(d).length ;i++ ){
			if(s==daily_list.get(d)[i][0]){
				daily_list.get(d).splice(i, 1);
				break;
			}
		}
	});

	type.appendChild(jbBtn);
}
function add_color_input(type) {
	var color_input = document.createElement("form");
	var color_text = document.createElement("input");
	color_text.setAttribute('type', 'text');
	color_text.setAttribute('size', '7');
	var color_submit = document.createElement("input");
	color_submit.setAttribute('type', 'button');
	color_submit.setAttribute('value', 'C');
	color_submit.onclick = function () {
		console.log(color_text.value);
		type.style.backgroundColor =  color_text.value; 
	};

	color_input.appendChild(color_text);
	color_input.appendChild(color_submit);
	color_input.style.position = 'absolute';
	color_input.style.top = '70%';
	color_input.style.left = '0%';
	color_input.style.lineHeight = '5px';
	type.appendChild(color_input);
}
function isoverlap(d, s, e){
	for (let i in daily_list.get(d)) {
		let t = daily_list.get(d)[i];
		if(t[0]>=e){
			break;
		} else if((t[0]<e && t[1]>s)){
			return true;
		}
	}
	return false;
}
function backup(){
	var content = "";
	for (let [d, l] of daily_list) {
		for (let i in l) {
			let t = l[i];
			content += d+"\t"+t[0]+"\t"+t[1]+"\t"+t[2].replace(" ", "_")+"\n";
		}
	}
	
  const url = window.URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
  const a = document.createElement("a");
  a.href = url;
  a.download = "save.txt";
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}
function restore(event) {
	let fr = new FileReader();
	fr.readAsText(document.getElementById("input_file").files[0], "utf-8");
	fr.onload = () => {
		let strlist = fr.result.split("\r\n");
		for(let str in strlist){
			let temp = strlist[str].split("\t");
			add_list(Number(temp[0]), temp[1], temp[2], temp[3]);
			add_element(Number(temp[0]), temp[1], temp[2], temp[3]);
		}
	}
}