// ==UserScript==
// @name        UserScript List Order Writer
// @namespace        http://tampermonkey.net/
// @version        0.2
// @description        Tampermonkey の登録スクリプトの実効順をリスト一覧表に書込む
// @author        Personwritep
// @match        https://blog.ameba.jp/ucs/entry/srventryupdate*
// @exclude        https://blog.ameba.jp/ucs/entry/srventryupdateend*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameblo.jp
// @grant        none
// @updateURL        https://github.com/personwritep/UserScript_List_Order_Writer/raw/main/UserScript_List_Order_Writer.user.js
// @downloadURL        https://github.com/personwritep/UserScript_List_Order_Writer/raw/main/UserScript_List_Order_Writer.user.js
// ==/UserScript==


main();


function main(){

    let raw_list=[]; // リスト表示元の配列
    let refer_name; // 参照バックアップファイル名
    let usl_set=0; //「UserScript List」のコントロール　配列の降順表示：「0」昇順「1」降順

    display();
    disp_last_data();
    file_read();



    function disp_last_data(){
        refer_name=localStorage.getItem('USList_name'); // 参照バックアップファイル名 🔵
        if(refer_name){
            let fname=document.querySelector('.file_reader_USS .fname');
            if(fname){
                fname.textContent=refer_name; }}

        name_search();

    } // disp_last_data()




    function display(){

        let write_SVG=
            '<svg id="write_in" viewBox="-25 -50 300 300">'+
            '<path style="fill:#333" d="M102 136L72 136C67 136 61 136 58 141C54 148 '+
            '59 153 63 158C72 169 82 180 91 191C100 201 109 212 118 222C122 226 '+
            '126 232 132 232C138 232 142 226 146 222C155 211 164 201 173 190C182 '+
            '179 192 169 201 158C205 153 210 148 207 142C203 136 198 136 192 '+
            '136L162 136C162 108 157 79 145 54C139 43 132 31 121 24C102 13 79 '+
            '13 58 17C53 18 39 20 38 27C37 31 49 29 51 29C67 27 85 32 96 45C102 53 '+
            '104 63 105 72C108 94 105 114 102 136z"/></svg>';

        let rev_SVG=
            '<svg viewBox="0 0 120 120" style="height: 22px; padding-top: 1px;">'+
            '<path style="fill: #1976D2;" d="M83 13C74 22 63 31 56 41L77 41L77 1'+
            '03L90 103L90 41L111 41C104 31 93 20 83 13M30 18L30 81L9 81C16 91 27 100 '+
            '36 109C46 102 57 91 64 81L43 81L43 18L30 18z"></path>'+
            '</svg>';

        let panel=
            '<div id="panel_USS">'+
            '<div class="main_panel">'+
            '<div id="search_panel">'+
            'Script name<input type="text" class="script_name">'+
            'Reference file<button class="sw4 sw" type="submit">Set</button>'+
            'Write in<button class="sw5 sw" type="submit">'+ write_SVG +'</button>'+
            '</div>'+

            '<div class="file_reader_USS">'+
            '<input class="sw1 sw" type="submit" value="File">'+
            '<input class="sw2" type="file">'+
            '<span class="fname"></span>'+
            '<button class="sw3 sw" type="submit">'+ rev_SVG +'</button>'+
            '</div>'+
            '<div class="us_list">'+
            '<ul></ul>'+
            '</div></div></div>'+

            '<style>'+
            '#panel_USS { font: 16px Meiryo; color: #666; box-sizing: border-box; '+
            'position: absolute; top: 91px; right: 0; z-index: 40; } '+

            '#panel_USS .main_panel { display: flex; flex-direction: column; width: fit-content; '+
            'padding: 8px 10px; background: #a2c0ce; } '+

            '#search_panel * { font: normal 16px Meiryo; } '+
            '#search_panel { Meiryo; padding: 6px 12px; color: #fff; background: #333; '+
            'white-space: nowrap; } '+
            '.script_name { width: 49px; height: 20px; padding: 2px 6px 0; margin: 0 8px 0 4px; '+
            'color: #333; } '+
            '.script_name:focus-visible { outline: 1px solid #4FC3F7; } '+

            '.file_reader_USS { position: relative; z-index: 1; display: flex; align-items: center; '+
            'padding: 0 15px; height: 40px; margin-bottom: 6px; color: #000; background: #fff; } '+

            '#panel_USS .sw { font: normal 16px/27px Meiryo; width: 26px; height: 26px; '+
            'padding: 0; border: 1px solid #aaa; border-radius: 2px; } '+
            '#panel_USS .sw1 { height: 26px; width: 38px; cursor: pointer; } '+
            '#panel_USS .sw2 { display: none; } '+
            '#panel_USS .fname { font: normal 16px/24px Meiryo; margin: 0 12px; height: 21px; } '+
            '#panel_USS .sw3 { position: absolute; top: 7px; right: 12px; cursor: pointer; } '+
            '#panel_USS .sw4 { margin: 0 8px 0 4px; width: auto; padding: 0 4px; cursor: pointer; '+
            'color: #333; } '+
            '#panel_USS .sw5 { margin-left: 4px; vertical-align: -4px; cursor: pointer; } '+
            '#panel_USS .sw5 svg { width: 22px; height: 22px; } '+

            '#panel_USS .us_list { width: 440px; height: calc(100vh - 286px); '+
            'overflow-y: scroll; overflow-x: hidden; '+
            'font-weight: bold; color: #555; background: #fff; outline: none; } '+
            '#panel_USS .us_list ul { padding: 0; margin: 0; } '+
            '#panel_USS .us_list li { line-height: 22px; height: 23.2px; box-sizing: content-box; '+
            'padding: 4px 0 0 0; border-bottom: 1px solid #ccc; list-style: none; } '+
            '#panel_USS .us_list li:hover { box-shadow: inset 0 0 0 40px #aaaaaa20; } '+
            '#panel_USS .us_list li >* { display: inline-block; } '+
            '#panel_USS .dp { width: 55px; text-align: center; } '+
            '#panel_USS .dn { width: 300px; white-space: nowrap; overflow-x: scroll; '+
            'scrollbar-width: none; vertical-align: -6px; } '+
            '#panel_USS .dv { width: 60px; padding: 0 6px; margin: 0 -20px 2px 15px; } '+

            '#js-header-bar { right: unset; left: 838px; } '+
            '#js-header-bar:hover { width: 120px; } '+
            '.l-gHeaderLeft__link a { right: unset; left: 970px; } '+
            '.l-container { position: absolute; width: fit-content; left: 20px; } '+
            '</style>'+
            '</div>';

        if(!document.querySelector('#panel_USS')){
            document.body.insertAdjacentHTML('beforeend', panel); }

    } // display()




    function file_read(){
        let sw1=document.querySelector('.file_reader_USS .sw1');
        let sw2=document.querySelector('.file_reader_USS .sw2');
        sw1.onclick=()=>{
            sw2.value=null; // 同じファイルの再読み込みを可能にする
            sw2.click(); }

        sw2.addEventListener("change" , function(){
            if(!(sw2.value)) return; // ファイルが選択されない場合
            let file_list=sw2.files;
            if(!file_list) return; // ファイルリストが選択されない場合
            let file=file_list[0];
            if(!file) return; // ファイルが無い場合

            let fname=document.querySelector('.file_reader_USS .fname');
            fname.textContent=file_time(file.name); // 🔵 読込んだバックアップファイル名を表示する

            let file_reader=new FileReader();
            file_reader.readAsText(file);
            file_reader.onload=function(){
                let data_in=JSON.parse(file_reader.result);
                extract_data(data_in); }}); // データの表示


        function file_time(filename){
            if(filename){
                let full=filename.split('T');
                full[0]=full[0].replace('tampermonkey', 'TM');
                let tail=full[1];
                if(tail){
                    tail=tail.substring(0, 5);
                    return full[0] +'　T'+ tail; }}}


        let sw3=document.querySelector('#panel_USS .sw3');
        if(sw3){
            sw3.onclick=()=>{
                nor_rev(); }}


        let sw4=document.querySelector('#panel_USS .sw4');
        if(sw4){
            sw4.onclick=()=>{
                let ok=confirm(
                    '💢 現在のリストを「基準リスト」に設定しますか？\n'+
                    '「基準リスト」はツール起動時に常に読み込まれ 最初の検索対象になります\n\n'+
                    '　　●  「OK」➔ 基準リストに設定する\n'+
                    '　　●  「キャンセル」➔ 設定しない');
                if(ok){
                    set_standerd();
                }
                else{ ; }}}


        let sw5=document.querySelector('#panel_USS .sw5');
        if(sw5){
            sw5.onclick=()=>{
                let ok=confirm(
                    '💢 登録スクリプトの適用順をファイルから書き込みます\n\n'+
                    '　　●  「OK」➔ 記事の適用順を更新する\n'+
                    '　　●  「キャンセル」➔ 更新しない');
                if(ok){
                    set_table(); }
                else{ ; }}}

    } //  file_read()




    function extract_data(dat){
        raw_list=[]; // 初期化

        let scripts=dat.scripts;
        for(let k=0; k<scripts.length; k++){
            let name=scripts[k].name;
            let position=scripts[k].position;
            let source=scripts[k].source;
            source=source.substring(0, 300);

            let decoded;
            let version;
            if(source){
                try {
                    decoded=atob(source);
                    let decoded_array=
                        new Uint8Array(Array.prototype.map.call(decoded, c => c.charCodeAt()));
                    decoded=new TextDecoder().decode(decoded_array);

                    let ver=decoded.substring(decoded.indexOf('// @version')+12);
                    ver=ver.substring(0, ver.indexOf('// @'));
                    version=ver.trim(); }
                catch {
                    version=''; }}

            raw_list.push([position, name, version]); }


        if(raw_list.length>0){
            if(usl_set==1){
                raw_list.reverse(); }
            disp_list(); }

    } // extract_data()




    function disp_list(){
        let get=[]; // 初期化
        for(let k=0; k<raw_list.length; k++){
            get.push([raw_list[k][0], raw_list[k][1], raw_list[k][2]]); }


        let ul=document.querySelector('#panel_USS .us_list ul');
        let li='';
        if(ul){
            ul.innerHTML=''; // 書込みをクリア

            for(let k=0; k<get.length; k++){
                li+=
                    '<li><span class="dp">'+ get[k][0] +'</span>'+
                    '<span class="dn">'+ get[k][1] +'</span>'+
                    '<span class="dv">'+ get[k][2] +'</span></li>'; }

            ul.insertAdjacentHTML('beforeend', li ); }

    } // disp_list()




    function name_search(){
        let script_name=document.querySelector('.script_name');
        if(script_name){
            script_name.focus();
            script_name.oninput=()=>{
                search_do(script_name); }

            document.addEventListener('keydown', function(event){
                if(event.keyCode==27){ //「ESC」で検索終了
                    script_name.value='';
                    end_name_search(); }});

        } // if(script_name)


        function search_do(script_name){
            let ask=script_name.value;

            let list=document.querySelector('.us_list');
            if(list){
                search_list(list, ask); }

            function search_list(list, ask){
                let items=list.querySelectorAll('li');
                for(let k=0; k<items.length; k++){
                    let dn=items[k].querySelector('.dn')
                    if(dn){
                        if(dn.textContent.startsWith(ask)){
                            items[k].style.display=''; }
                        else{
                            items[k].style.display='none'; }}
                    else{
                        items[k].style.display='none'; }}}

        } // search_do()


        function end_name_search(){
            let list_li=document.querySelectorAll('.us_list li');
            for(let k=0; k<list_li.length; k++){
                list_li[k].style.display=''; }

            let list=document.querySelector('.us_list');
            if(list){
                list.scrollTop=0; }}

    } // name_search()




    function nor_rev(){
        if(usl_set==0){
            usl_set=1;
            sort_reverse(); } // 降順
        else{
            usl_set=0;
            sort_normal(); } // 昇順


        function sort_reverse(){
            if(raw_list.length>1){
                if(raw_list[0][0]<raw_list[1][0]){
                    raw_list.reverse();
                    disp_list(); }}}


        function sort_normal(){
            if(raw_list.length>1){
                if(raw_list[0][0]>raw_list[1][0]){
                    raw_list.reverse();
                    disp_list(); }}}

    } // nor_rev()




    function set_standerd(){
        let fname=document.querySelector('.file_reader_USS .fname');
        if(fname){
            let file_name=fname.textContent;
            if(file_name.length>0){
                localStorage.setItem('USList_name', file_name); }} // 参照バックアップファイル名 🔵

    } // set_standerd()




    function set_table(){
        let editor_iframe=document.querySelector('.cke_wysiwyg_frame');
        if(editor_iframe){
            let iframe_doc=editor_iframe.contentWindow.document;
            if(iframe_doc){
                let table=iframe_doc.querySelector('table[id*="ambt"]');

                if(table){
                    let rows=table.querySelectorAll('tr');


                    let no_order_before=0;
                    for(let k=2; k<rows.length; k++){
                        let script_order=rows[k].querySelectorAll('td')[0].textContent;
                        if(script_order=='--'){
                            no_order_before+=1; }} // 処理前の「--」のカウント


                    let no_order_after=0;
                    for(let k=2; k<rows.length; k++){
                        let script_name=rows[k].querySelectorAll('td')[1].textContent;
                        if(script_name){
                            let has_order=0;
                            for(let i=0; i<raw_list.length; i++){
                                if(script_name==raw_list[i][1]){ // 元リストにデータがあれば書込む
                                    let order=raw_list[i][0];
                                    rows[k].querySelectorAll('td')[0].textContent=order;
                                    has_order=1;
                                    break; }
                                else{
                                    if(script_name==raw_list[i][1].replace(/▢|▩/g, '').trim()){
                                        let order=raw_list[i][0];
                                        rows[k].querySelectorAll('td')[0].textContent=order;
                                        has_order=1;
                                        break; }}}

                            if(has_order==0){ // 元リストでデータが無かった場合
                                rows[k].querySelectorAll('td')[0].textContent='--';
                                no_order_after+=1; }}} // 処理後の「--」のカウント


                    disp_result(no_order_before, no_order_after);

                } // if(table)

            }}} // set_table()



    function disp_result(before, after){
        let panel_r=
            '<div id="panel_USS_r">'+
            '<p class="show_r">処理前の「--」： '+ before +'</p>　　'+
            '<p class="show_r">処理後の「--」： '+ after +'</p>　　'+
            '<button class="close_r" type="submit">✖</button></p>'+
            '<style>'+
            '#panel_USS_r { position: absolute; top: 15px; right: 10px; z-index: 100; display: flex; '+
            'font: bold 16px/20px Meiryo; color: #333; padding: 10px; border: 1px solid #aaa; '+
            'background: #fff; box-shadow: 10px 10px 20px #072a4750; } '+
            '.show_r { padding: 4px 0 0; } '+
            'button.close_r { width: 24px; height: 24px; padding: 1px 0 0; cursor: pointer; } '+
            '</style>'+
            '</div>';

        if(!document.querySelector('#panel_USS_r ')){
            document.body.insertAdjacentHTML('beforeend', panel_r); }


        let panel_USS_r=document.querySelector('#panel_USS_r ');
        let close=document.querySelector('#panel_USS_r button');

        if(panel_USS_r && close){
            close.onclick=function(){
                panel_USS_r.remove(); }}

    } // disp_result()

} // main()
