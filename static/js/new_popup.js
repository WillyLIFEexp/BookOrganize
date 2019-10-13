// This is all the actions for pop up
$(document).ready(function() {
    // Edit book's info format
    $(document).on('click','.edit',function() {
          var ll = $(this).parent().siblings().text().trim().split(' ')
          var index = $(this).parent().parent()[0].id
    	  var edit_modal = document.getElementById("edit_modal");
    	  edit_modal.style.display = "block";
          var content= "<span class='close'>&times;</span>"
          content += '<p><span>分類 : <input type="text" name="book_name" placeholder="' + ll[0] + '"></span>';
       	  content += '<span>編號 : <input type="text" name="book_name" placeholder="'    + ll[2] + '"></span>';
    	  content += '<span>書名 : <input type="text" name="book_name" placeholder="'    + ll[4] + '"></span>';
    	  content += '<span>數量 : <input type="text" name="book_name" placeholder="'    + ll[8] + '"></span>';
    	  content += '<span class="notshow">' + index + '</span></p>';
    	  content += '<div class="two_btn"><button type="button" class="btn btn-outline-success update" style="margin-right:5px">完成</button>'
    	  content += '<button type="button" class="btn btn-outline-danger delete">刪除</button></div>'
    	  $(".edit_modal_content").empty().append(content)
    })

    // Adding new book format
    $(document).on('click','#add_new_book',function() {
          search_cat = $('a.nav-link.active')[0].text
          $.ajax({
                data : {
                        search_cat : search_cat
                },
                type : 'POST',
                url : '/search_cat_info',
                dataType : 'json'
          })
          .done(function(data){
          prefix_cat = data.prefix_cat
    	  var edit_modal = document.getElementById("edit_modal");
    	  edit_modal.style.display = "block";
          var content= "<span class='close'>&times;</span>"
    	  content += '<p><span>分類 : <input type="text" name="book_name" placeholder="請輸入新分類" value="'+prefix_cat+'"></span>';
    	  content += '<span>編號 : <input type="text" name="book_name" placeholder="請輸入新編號"></span>';
    	  content += '<span>書名 : <input type="text" name="book_name" placeholder="請輸入新書名"></span>';
    	  content += '<span>數量 : <input type="text" name="book_name" placeholder=" 1 "></span></p>';
    	  content += '<div class="one_btn"><button type="button" class="btn btn-outline-success new">完成</button></div>'
    	  $(".edit_modal_content").empty().append(content)
    	  $('edit_modal').style.display = "block";
    	  })
    })
    // Closing button
    $(document).on('click','.close',function() {
    	  var edit_modal = document.getElementById("edit_modal");
    	  edit_modal.style.display = "none";
     })

    // When click update, send data back to sql
    $(document).on('click','.update',function(){
          cur_box = $(this).parent().siblings().children()
          new_box = update_sql(cur_box)
          find_box = $('#' + new_box[new_box.length-1]).parent()
          $.ajax({
              data : {
                     book_info : JSON.stringify(new_box),
              },
              type : "POST",
              url : '/update_info',
              dataType : 'json'
              })
          .done(function(data){
                return_books = data.return_book_info
//                new_content = create_card(return_book_info)
                if ($('div.wrapper').is('#admin')){
                    var new_content = admin_create_card(return_books,return_books.length)
                }
                else{
                    var new_content = create_card(return_books,return_books.length)
                }
                find_box.empty().append(new_content)
                var edit_modal = document.getElementById("edit_modal");
       	        edit_modal.style.display = "none";

          })
    })

    // When click delete, delete data from sql, and change to -----
    $(document).on('click','.delete',function(){
          cur_box = $(this).parent().siblings().children()
          new_box = delete_sql(cur_box)
          find_box = $('#' + new_box[new_box.length-1]).parent()
          $.ajax({
              data : {
                     book_info : JSON.stringify(new_box),
              },
              type : "POST",
              url : '/update_info',
              dataType : 'json'
              })
          .done(function(data){
                return_books = data.return_book_info
//                new_content = create_card(return_book_info)
                if ($('div.wrapper').is('#admin')){
                    var new_content = admin_create_card(return_books,return_books.length)
                }
                else{
                    var new_content = create_card(return_books,return_books.length)
                }
                find_box.empty().append(new_content)
                var edit_modal = document.getElementById("edit_modal");
       	        edit_modal.style.display = "none";
          })
    })
    // Create new book
        $(document).on('click','.new', function(){
          cur_box = $(this).parent().siblings().children()
          book_prefix_cat = $(cur_box[0]).children()[0].value
          book_num = $(cur_box[1]).children()[0].value
          title = $(cur_box[2]).children()[0].value
          stock = $(cur_box[3]).children()[0].value
          $.ajax({
              data : {
                     book_prefix_cat : book_prefix_cat,
                     book_num : book_num,
                     title : title,
                     stock : stock
              },
              type : "POST",
              url : '/add_card',
              dataType : 'json'

          })
          .done(function(data){
  	          edit_modal.style.display = "none";
  	          return_books = data.new_book_list
              return_pages = data.page_num
              var content = "<div id='forcards'>"
              if ($('div.wrapper').is('#admin')){
                  content += admin_create_cards(return_books,return_books.length)
              }
              else{
                  content += create_cards(return_books,return_books.length)
              }
//              content += create_cards(return_books,return_books.length)
              content += "</div>"
              content += create_one_pages(return_pages)
              $('#replace_all').empty().append(content)
          })
    })
    // remove a book
        $(document).on('click','.remove', function(){
          cur_box = $(this).parent().parent()
          page_num = $('button.current')[0].textContent
          book_prefix_cat = $('a.active')[0].text
          book_oid = cur_box[0].id
          $.ajax({
              data : {
                     book_prefix_cat : book_prefix_cat,
                     page_num : page_num,
                     book_oid : book_oid
              },
              type : "POST",
              url : '/remove_card',
              dataType : 'json'
          })
          .done(function(data){
                return_books = data.new_book_list
                if ($('div.wrapper').is('#admin')){
                    var content = admin_create_cards(return_books,return_books.length)
                }
                else{
                    var content = create_cards(return_books,return_books.length)
                }
                $('#forcards').empty().append(content)
          })
    })

});

