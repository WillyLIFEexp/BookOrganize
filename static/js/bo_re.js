// This is the action for borrwo and return
$(document).ready(function() {
    // Edit book's info format
    $(document).on('click','.borrow',function() {
        var current_box = $(this).parent().parent()
        $.ajax({
                data : {
                        book_oid : current_box[0].id,
                        action : 'Borrow'
                },
                type : "POST",
                url : '/change_card',
                dataType : 'json'
                })
        .done(function(data){
                return_book_info = data.return_book_info
                new_content = create_card(return_book_info)
                current_box.empty().append(new_content)
                })
    })
    $(document).on('click','.return',function() {
        var current_box = $(this).parent().parent()
        $.ajax({
                data : {
                        book_oid : current_box[0].id,
                        action : 'Return'
                },
                type : "POST",
                url : '/change_card',
                dataType : 'json'
                })
        .done(function(data){
                return_book_info = data.return_book_info
                new_content = create_card(return_book_info)
                current_box.empty().append(new_content)
                })
    })
});

