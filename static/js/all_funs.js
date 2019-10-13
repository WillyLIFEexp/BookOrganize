// This is all the functions will be used in other js files
// Create multiply cards
function create_cards(book_list, list_length){
     var card_contents = "";
     for (i = 0; i < list_length; i++){
        card_contents += '<div class="col-xs-6 col-sm-3 col-md-6 col-lg-4 card_style">'
        card_contents += '<div id=' + book_list[i][0] + '>'
        card_contents += "<span class='card_txt'> " + book_list[i][1] + book_list[i][6] + ' - ' + book_list[i][2] + " </span><br>"
        card_contents += '<span> ' + book_list[i][3] + ' </span><br>'


        if (Number(book_list[i][4]) == 0){
           card_contents += '<span> ' + book_list[i][4] + ' / ' + book_list[i][4]+ ' </span><br>'
           card_contents += '<span><button type="button" class="btn btn-outline-danger borrow" style="margin-right:0.2vw" disabled>借出</button></span>'
           card_contents += '<span><button type="button" class="btn btn-outline-success return" style="margin-right:0.2vw" disabled>歸還</button></span>'
        }
        else if (Number(book_list[i][5]) == 0){
           card_contents += '<span> ' + (Number(book_list[i][4]) - Number(book_list[i][5])).toString() + ' / ' + book_list[i][4]+ ' </span><br>'
           card_contents += '<span><button type="button" class="btn btn-outline-danger borrow" style="margin-right:0.2vw">借出</button></span>'
           card_contents += '<span><button type="button" class="btn btn-outline-success return" style="margin-right:0.2vw" disabled>歸還</button></span>'
        }
        else if((Number(book_list[i][4]) - Number(book_list[i][5])) <= 0){
           card_contents += '<span> ' + (Number(book_list[i][4]) - Number(book_list[i][5])).toString() + ' / ' + book_list[i][4]+ ' </span><br>'
           card_contents += '<span><button type="button" class="btn btn-outline-danger borrow" style="margin-right:0.2vw" disabled>借出</button></span>'
           card_contents += '<span><button type="button" class="btn btn-outline-success return" style="margin-right:0.2vw">歸還</button></span>'
        }
        else{
           card_contents += '<span> ' + (Number(book_list[i][4]) - Number(book_list[i][5])).toString() + ' / ' + book_list[i][4]+ ' </span><br>'
           card_contents += '<span><button type="button" class="btn btn-outline-danger borrow" style="margin-right:0.2vw">借出</button></span>'
           card_contents += '<span><button type="button" class="btn btn-outline-success return" style="margin-right:0.2vw">歸還</button></span>'
        }
        card_contents +='</div></div>'
        }
     return card_contents
}

// Create multiply cards
function admin_create_cards(book_list, list_length){
     var card_contents = "";
     for (i = 0; i < list_length; i++){
        card_contents += '<div class="col-xs-6 col-sm-3 col-md-6 col-lg-4 card_style">'
        card_contents += '<div id=' + book_list[i][0] + '>'
        card_contents += "<span class='card_txt'> " + book_list[i][1] + book_list[i][6] + ' - ' + book_list[i][2] + " </span><br>"
        card_contents += '<span> ' + book_list[i][3] + ' </span><br>'
        card_contents += '<span> ' + (Number(book_list[i][4]) - Number(book_list[i][5])).toString() + ' / ' + book_list[i][4]+ ' </span><br>'
        card_contents += '<span><button type="button" class="btn btn-outline-info edit" style="margin-right:0.2vw">修改</button></span>'
        card_contents += '<span><button type="button" class="btn btn-outline-danger remove">移除</button></span>'
        card_contents +='</div></div>'
        }
     return card_contents
}

// Create only one card
function create_card(book_list){
     var card_contents = "";
         card_contents += '<div id=' + book_list[0] + '>'
         card_contents += "<span class='card_txt'> " + book_list[1] + book_list[6] + ' - ' + book_list[2] + " </span><br>"
         card_contents += '<span> ' + book_list[3] + ' </span><br>'
         if (Number(book_list[4]) == 0){
            card_contents += '<span> ' + book_list[4] + ' / ' + book_list[4] + ' </span><br>'
            card_contents += '<span><button type="button" class="btn btn-outline-danger borrow" style="margin-right:0.2vw" disabled>借出</button></span>'
            card_contents += '<span><button type="button" class="btn btn-outline-success return" style="margin-right:0.2vw" disabled>歸還</button></span>'
         }
         else if (Number(book_list[5]) == 0){
            card_contents += '<span> ' + (Number(book_list[4]) - Number(book_list[5])).toString() + ' / ' + book_list[4] + ' </span><br>'
            card_contents += '<span><button type="button" class="btn btn-outline-danger borrow" style="margin-right:0.2vw">借出</button></span>'
            card_contents += '<span><button type="button" class="btn btn-outline-success return" style="margin-right:0.2vw" disabled>歸還</button></span>'
         }
         else if((Number(book_list[4])) - Number(book_list[5]) <= 0){
            card_contents += '<span> ' + (Number(book_list[4]) - Number(book_list[5])).toString() + ' / ' + book_list[4] + ' </span><br>'
            card_contents += '<span><button type="button" class="btn btn-outline-danger borrow" style="margin-right:0.2vw" disabled>借出</button></span>'
            card_contents += '<span><button type="button" class="btn btn-outline-success return" style="margin-right:0.2vw">歸還</button></span>'
         }
         else{
            card_contents += '<span> ' + (Number(book_list[4]) - Number(book_list[5])).toString() + ' / ' + book_list[4] + ' </span><br>'
            card_contents += '<span><button type="button" class="btn btn-outline-danger borrow" style="margin-right:0.2vw">借出</button></span>'
            card_contents += '<span><button type="button" class="btn btn-outline-success return" style="margin-right:0.2vw">歸還</button></span>'
         }
         card_contents +='</div>'
     return card_contents
}

// Create only one card
function admin_create_card(book_list){
     var card_contents = "";
         card_contents += '<div id=' + book_list[0] + '>'
         card_contents += "<span class='card_txt'> " + book_list[1] + book_list[6] + ' - ' + book_list[2] + " </span><br>"
         card_contents += '<span> ' + book_list[3] + ' </span><br>'
         card_contents += '<span> ' + (Number(book_list[4]) - Number(book_list[5])).toString() + ' / ' + book_list[4] + ' </span><br>'
         card_contents += '<span><button type="button" class="btn btn-outline-info edit" style="margin-right:0.2vw">修改</button></span>'
         card_contents += '<span><button type="button" class="btn btn-outline-danger remove">移除</button></span>'
         card_contents +='</div>'
     return card_contents
}

// Create multiply pages
function create_pages(page_number){
     var page_contents = '<div id="forpgs"><ul class="pagination dark" id="switch_page">';
     page_contents +='<li><button type="button" class="btn page text-white bg-dark" aria-label="Previous"><span aria-hidden="true">&laquo;</span></li>'
     page_contents +='<li><button type="button" class="btn page text-white bg-dark current"> 1 </li>'
     for (j = 2; j<=page_number ; j++){
        if (j < 11 ){
        page_contents += '<li><button type="button" class="btn page text-white bg-dark">' + j.toString() + ' </li>'
        }
        else{
        page_contents += '<li><button type="button" class="btn page text-white bg-dark notshow">' + j.toString() + ' </li>'
        }
     }
     page_contents +='<li><button type="button" class="btn page text-white bg-dark" aria-label="Next"><span aria-hidden="true">&raquo;</span></li></ul></div>'
     return page_contents
}

function create_one_pages(page_number){
     var page_contents = '<div id="forpgs"><ul class="pagination dark" id="switch_page">';
     page_contents +='<li><button type="button" class="btn page text-white bg-dark" aria-label="Previous"><span aria-hidden="true">&laquo;</span></li>'
     if (page_number < 11){
        for(j = 1; j<page_number-1 ; j++){
            page_contents += '<li><button type="button" class="btn page text-white bg-dark">' + j.toString() + ' </li>'
        }
     }
     else{
        for (j = 1; j<=page_number - 1 ; j++){
            if (j <= page_number - 10 ){
            page_contents += '<li><button type="button" class="btn page text-white bg-dark notshow">' + j.toString() + ' </li>'
            }
            else{
            page_contents += '<li><button type="button" class="btn page text-white bg-dark">' + j.toString() + ' </li>'
            }
     }}
     page_contents +='<li><button type="button" class="btn page text-white bg-dark current">'+ page_number+'</li>'
     page_contents +='<li><button type="button" class="btn page text-white bg-dark" aria-label="Next"><span aria-hidden="true">&raquo;</span></li></ul></div>'
     return page_contents
}

//SQL Related
function update_sql(cur_box){
    if (cur_box[0].children[0].value == ''){
         cat = cur_box[0].children[0].placeholder
    }
    else{
         cat = cur_box[0].children[0].value
    }

    if (cur_box[1].children[0].value == ''){
         num = cur_box[1].children[0].placeholder
    }
    else{
         num = cur_box[1].children[0].value
    }

    if (cur_box[2].children[0].value == ''){
         title = cur_box[2].children[0].placeholder
    }

    else{
         title = cur_box[2].children[0].value
    }

    if (cur_box[3].children[0].value == ''){
         count = cur_box[3].children[0].placeholder
    }
    else{
         count = cur_box[3].children[0].value
    }
    index = cur_box[4].textContent
    new_info = [cat, num, title, count, index]
    return new_info
}

function delete_sql(cur_box){
    cat = cur_box[0].children[0].placeholder
    num = cur_box[1].children[0].placeholder
    title = '------------'
    count = 0
    index = cur_box[4].textContent
    new_info = [cat, num, title, count, index]
    return new_info
}

