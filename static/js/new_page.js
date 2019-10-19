$(document).ready(function() {
    // This is the tag function
    $(document).on('click','.tag_item',function(){
      $(this).siblings().find('a.active').removeClass('active').addClass('text-light')
      $(this).children().addClass('active').removeClass('text-light')
      var new_cat = $(this).children().text()
      $.ajax({
              data : {
                     cat_name : new_cat,
              },
              type : "POST",
              url : '/change_whole',
              dataType : 'json'
              })
      .done(function(data){
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
              $('#replace_all').empty().append(content)
              })
      })

    // This is the page function
    $(document).on('click','ul.pagination li button',function(){
        if ($(this).attr('aria-label') == 'Previous'){
            if ($(this).parent().parent().find('li button.current').parent().prev().children().attr('aria-label') != 'Previous'){
                var p_page = $(this).parent().parent().find('li button.current').parent().prev().children()
                if(p_page.hasClass('notshow')){
                    var disappear = $(this).parent().siblings().children().not('.notshow')
                    disappear = disappear[disappear.length - 2]
                    $(disappear).addClass('notshow')
                    $(this).parent().parent().find('li button.current').removeClass('current')
                    p_page.removeClass('notshow').addClass('current')
                 }
                 else{
                $(this).parent().parent().find('li button.current').removeClass('current')
                p_page.addClass('current')
                }
            }
        }
        else if($(this).attr('aria-label') == 'Next'){
        if ($(this).parent().parent().find('li button.current').parent().next().children().attr('aria-label') != 'Next'){
                var p_page = $(this).parent().parent().find('li button.current').parent().next().children()
                if(p_page.hasClass('notshow')){
                    var disappear = $(this).parent().siblings().children().not('.notshow')[1]
                    $(disappear).addClass('notshow')
                    $(this).parent().parent().find('li button.current').removeClass('current')
                    p_page.removeClass('notshow').addClass('current')
                }
                else{
                $(this).parent().parent().find('li button.current').removeClass('current')
                p_page.addClass('current')
                }
            }
        }
        else{
            $(this).parent().parent().find('li button.current').removeClass('current')
            $(this).addClass('current')
        }
        page_num = $('#forpgs li').find('button.current').text()
        cate_select = $('ul#tag_list li').find('a.active').text()
        $.ajax({
                data : {
                      cate_select : cate_select,
                      page_num : page_num
                },
                type : "POST",
                url : '/change_page',
                dataType : 'json'
                })
                .done(function(data){
                return_books = data.new_book_list
//                var content = create_cards(books, books.length)
                if ($('div.wrapper').is('#admin')){
                    var content = admin_create_cards(return_books,return_books.length)
                }
                else{
                    var content = create_cards(return_books,return_books.length)
                }
                $('#forcards').empty().append(content)
                })
    })

    // This is the search function
    $(document).on('keyup', '#search_box', function(e){
    if (e.which == 13){
       var tmp_name = $(this)[0].value
       $.ajax({
               data : {
                      book_name : tmp_name
               },
               type : "POST",
               url : '/get_a_book',
               dataType : 'json'
       })
       .done(function(data){
       return_books = data.return_book
       $('#search_box')[0].value = ""
       var content = "<div id='forcards'>"
//       content += create_cards(return_book,return_book.length)
       if ($('div.wrapper').is('#admin')){
           content += admin_create_cards(return_books,return_books.length)
       }
       else{
           content += create_cards(return_books,return_books.length)
       }
       content += "</div>"
       content += create_pages(1)
       $('#replace_all').empty().append(content)
       })
    }
    })
})
