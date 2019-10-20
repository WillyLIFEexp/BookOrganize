$(document).ready(function() {
    // Define variable
    var edit_modal = document.getElementById("edit_modal");
    var tag_list_content = document.getElementById("tag_list");

    // Edit book's info format
    $(document).on('click','.edit',function() {
          var ll = $(this).parent().siblings().text().trim().split(' ')
          var index = $(this).parent().parent()[0].id
    	  edit_modal.style.display = "block";
          var content= "<span class='close'>&times;</span>"
          content += '<p><strong>更改書籍</strong><span class="hrline"></span><span>分類 : <input type="text" name="book_name" placeholder="' + ll[0] + '"></span>';
       	  content += '<span>編號 : <input type="text" name="book_name" placeholder="'    + ll[2] + '"></span>';
    	  content += '<span>書名 : <input type="text" name="book_name" placeholder="'    + ll[4] + '"></span>';
    	  content += '<span>數量 : <input type="text" name="book_name" placeholder="'    + ll[8] + '"></span>';
    	  content += '<span class="notshow">' + index + '</span>';
    	  content += '<span class="two_btn"><a href="#" class="btn btn-outline-success update" style="margin-right:5px">完成'
    	  content += '<a href="#" class="btn btn-outline-danger delete">刪除</span></p>'
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
    	  edit_modal.style.display = "block";
          var content= "<span class='close'>&times;</span>"
    	  content += '<p><strong>新增書籍</strong><span class="hrline"></span><span>分類 : <input type="text" name="book_name" placeholder="請輸入新分類" value="'+prefix_cat+'"></span>';
    	  content += '<span>編號 : <input type="text" name="book_name" placeholder="請輸入新編號"></span>';
    	  content += '<span>書名 : <input type="text" name="book_name" placeholder="請輸入新書名"></span>';
    	  content += '<span>數量 : <input type="text" name="book_name" placeholder="請輸入總書量" required ></span>';
    	  content += '<span class="one_btn"><a href="#" class="btn btn-outline-success new">完成</span></p>'
    	  $(".edit_modal_content").empty().append(content)
    	  edit_modal.style.display = "block";
    	  })
    })

    // Closing button
    $(document).on('click','.close',function() {
    	  edit_modal.style.display = "none";
    })

    // When click update, send data back to sql
    $(document).on('click','.update',function(){
          cur_box = $(this).parent().siblings()
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
                if ($('div.wrapper').is('#admin')){
                    var new_content = admin_create_card(return_books,return_books.length)
                }
                else{
                    var new_content = create_card(return_books,return_books.length)
                }
                find_box.empty().append(new_content)
       	        edit_modal.style.display = "none";

          })
    })

    // When click delete, delete data from sql, and change to -----
    $(document).on('click','.delete',function(){
          cur_box = $(this).parent().siblings()
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
                if ($('div.wrapper').is('#admin')){
                    var new_content = admin_create_card(return_books,return_books.length)
                }
                else{
                    var new_content = create_card(return_books,return_books.length)
                }
                find_box.empty().append(new_content)
       	        edit_modal.style.display = "none";
          })
    })
    // Create new book
    $(document).on('click','.new', function(){
          cur_box = $(this).parent().siblings()
          book_prefix_cat = $(cur_box[2]).children()[0].value
          book_num = $(cur_box[3]).children()[0].value
          title = $(cur_box[4]).children()[0].value
          stock = $(cur_box[5]).children()[0].value
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

    // adding new tab
    $(document).on('dblclick','.add_new_tabs', function(){
          var content= "<span class='close'>&times;</span>"
    	  content += '<p><strong>新增分類</strong><span class="hrline"></span><span>分類 : <input type="text" placeholder="請輸入新分類"></span>';
    	  content += '<span class="one_btn"><a href="#" class="btn btn-outline-success new_tab">完成</span></p>'
    	  $(".edit_modal_content").empty().append(content)
    	  edit_modal.style.display = "block";
    })

    // Create new tab
    $(document).on('click','.new_tab', function(){
          cur_box = $(this).parent().siblings()
          new_tag_name = $(cur_box[2]).children()[0].value
          $.ajax({
              data : {
                      new_tag : new_tag_name
              },
              type : "POST",
              url : '/add_tab',
              dataType : 'json'
          })
          .done(function(data){
                cat_list = data.cat_list
                edit_modal.style.display = "none";
                content = create_tags(cat_list, data.cat_name)
                $(tag_list_content).empty().append(content)
          })
    })

    // update tab
    $(document).on('dblclick','.update_tab', function(){
          var content= "<span class='close'>&times;</span>"
          w = $(this)[0]
    	  content += '<p><strong>修改分類</strong><span class="hrline"></span><span>分類 : <input id='+ w.id +' type="text" placeholder="'+ w.getAttribute('name') + w.textContent +'"></span>';
    	  content += '<span class="one_btn"><a href="#" class="btn btn-outline-success edit_tab">完成</span></p>'
    	  $(".edit_modal_content").empty().append(content)
    	  edit_modal.style.display = "block";
    })

    // Update old tab
    $(document).on('click','.edit_tab', function(){
          cur_box = $(this).parent().siblings()
          edit_tag = $($(cur_box[2])[0]).children()[0]
          eti = edit_tag.id
          etv = edit_tag.value
          $.ajax({
              data : {
                      edit_tag_id : eti,
                      edit_tag_name : etv
              },
              type : "POST",
              url : '/change_tab',
              dataType : 'json'
          })
          .done(function(data){
                cat_list = data.cat_list
                edit_modal.style.display = "none";
                content_t = create_tags(cat_list, data.cat_name)

                return_books = data.new_book_list
                return_pages = data.new_page_count
                var content = "<div id='forcards'>"
                if ($('div.wrapper').is('#admin')){
                    content += admin_create_cards(return_books,return_books.length)
                }
                else{
                    content += create_cards(return_books,return_books.length)
                }
                content += "</div>"
                content += create_pages(return_pages)

                $(tag_list_content).empty().append(content_t)
                $('#replace_all').empty().append(content)
          })
    })

});
