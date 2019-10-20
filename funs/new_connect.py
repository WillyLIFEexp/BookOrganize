import mysql.connector


class MySql:
    def __init__(self):
        self.my_db = mysql.connector.connect(
            host="localhost",
            user="root", password="password123",
            auth_plugin='mysql_native_password',
            database="book_keeper")
        # host="gunter888.mysql.pythonanywhere-services.com",
        # user="gunter888", password="-------",
        # auth_plugin='mysql_native_password',
        # database="gunter888$book_keeper")

        self.cur = self.my_db.cursor()

    def connect_again(self):
        try:
            self.my_db.reconnect(attempts=1, delay=0)
        except Exception as e:
            self.my_db = mysql.connector.connect(
                host="localhost",
                user="root", password="password123",
                auth_plugin='mysql_native_password',
                database="book_keeper")
            # host="gunter888.mysql.pythonanywhere-services.com",
            # user="gunter888", password="--------",
            # auth_plugin='mysql_native_password',
            # database="gunter888$book_keeper")

        self.cur = self.my_db.cursor()

    def get_a_book(self, book_oid):
        """
        Getting a book information
        :return: book's information.
        """
        # Get all book info for first cat
        self.connect_again()

        sql_code = '''select * from combine_data
                      where id = %s and
                            show_no_show = '1'
                   '''
        self.cur.execute(sql_code, tuple([book_oid]))
        only_book = self.cur.fetchall()
        self.cur.close()
        return only_book

    def get_everything(self):
        """
        Return all data from database
        :return:
        """
        self.connect_again()
        sql_code = '''select * from combine_data'''
        self.cur.execute(sql_code)
        every_book = self.cur.fetchall()
        self.cur.close()
        return every_book

    def get_all_cat_tags(self):
        """
        Getting all the tags name from database.
        :return:
        """

        self.connect_again()
        sql_code = "SELECT id, cat_prefix, cat_name from book_cat_info"
        self.cur.execute(sql_code)
        all_tags_name = self.cur.fetchall()
        self.cur.close()
        return all_tags_name

    def get_cat_tag_info(self, cat_name):
        """
        Get cat information
        :param cat_name:
        :return:
        """
        self.connect_again()
        sql_code = """select * from book_cat_info
                      where cat_name = %s
                   """
        self.cur.execute(sql_code, [cat_name[2:]])
        cat_info = self.cur.fetchall()
        self.cur.close()
        return cat_info

    def get_first_page_books(self, cat_name='套書'):
        """
        Getting the first 30 cards of certain cat_name
        :return: 30 cards of book info and also the cat_page counts.
        """
        self.connect_again()
        # Get all cat info
        sql_code = '''select * from book_cat_info
                      where cat_name='{}'
                   '''.format(cat_name)
        self.cur.execute(sql_code)
        first_cat_info = self.cur.fetchall()[0]

        # Get all book info for first cat
        sql_code = '''select * from combine_data
                      where cat_name = %s and
                            show_no_show = '1'
                      order by num
                      limit 30;
                   '''
        self.cur.execute(sql_code, tuple([cat_name]))
        first_page_books_info = self.cur.fetchall()
        self.cur.close()
        return first_page_books_info, int(first_cat_info[-1])

    def get_nth_page_books(self, cat_name, page):
        """
        Getting books from nth page
        :param cat_name: Current cat name
        :param page: Current page num
        :return: 30 cards of book info from nth page.
        """
        self.connect_again()
        sql_code = '''select * from combine_data
                      where cat_name = %s and
                            show_no_show = '1'
                      order by num
                      limit %s, 30;
                   '''
        self.cur.execute(sql_code, tuple([cat_name, (page - 1) * 30]))
        nth_page_books = self.cur.fetchall()
        self.cur.close()
        return nth_page_books

    def get_prefix_cat(self, cat_name):
        """
        Get prefix by cat_name
        :param cat_name:
        :return:
        """
        self.connect_again()
        sql_code = '''
                   select cat_prefix, cat_name from book_cat_info
                   where cat_name = %s
                   '''
        self.cur.execute(sql_code, [cat_name])
        prefix_cat = self.cur.fetchall()
        self.cur.close()
        return prefix_cat

    def insert_book(self, book_prefix_cat, book_num, title, stock):
        """
        Insert a new book to database.
        :param book_prefix_cat: book_prefix_cat.
        :param book_num: num to insert.
        :param title: title of book.
        :param stock: total count of books
        :return:
        """
        self.connect_again()
        # Get the cat from book_cat_info
        sql_code = '''select id from book_cat_info
                      where cat_name = %s
                   '''
        self.cur.execute(sql_code, [book_prefix_cat[2:]])
        res_cat_id = self.cur.fetchall()[0][0]

        # Insert new book to book_info
        sql_code = '''insert into book_info
                      (`num`, `title`, `stock`, `out`, `cat`)
                      values
                      (%s ,%s ,%s ,%s ,%s);
                   '''
        val = [str(book_num), str(title), int(stock), 0, int(res_cat_id)]
        self.cur.execute(sql_code, val)

        # Update total count in book_cat_info
        sql_code = '''update book_cat_info
                      set `cat_total_counts`=`cat_total_counts` + 1,
                          `cat_total_pages` = CEILING(`cat_total_counts`/30)
                      where id = %s;
                   '''
        val = [int(res_cat_id)]
        self.cur.execute(sql_code, val)
        self.my_db.commit()
        self.cur.close()

    def insert_new_cat(self, prefix, name):
        """
        Insert new book cat to database
        :param prefix: Cat's prefix
        :param name: Cat's name
        :return:
        """
        self.connect_again()
        sql_code = '''
                   insert into book_cat_info
                   (`cat_prefix`, `cat_name`, `cat_total_counts`,`cat_total_pages`) 
                   values
                   (%s, %s, %s, %s)
                   '''
        val = [prefix, name, 0, 0]
        self.cur.execute(sql_code, val)
        self.my_db.commit()
        self.cur.close()

    def update_old_cat(self, prefix, name, id):
        """
        Update old cat name
        :param prefix: new pre
        :param name:
        :return:
        """
        self.connect_again()
        sql_code = '''
                   update
                   `book_cat_info`
                   set
                   `cat_prefix` = %s,
                   `cat_name` = %s
                   where
                   `id` = %s
                   '''
        val = [prefix, name, id]
        self.cur.execute(sql_code, val)
        self.my_db.commit()
        self.cur.close()

    def update_book_out_count(self, book_oid, action):
        """
        Depend on borrow or return, change the total count of out.
        :param book_oid: The index of the book.
        :param action: The action to be perform.
        :return: Happy Thoughts
        """
        self.connect_again()
        if action == 'Borrow':
            sql_code = 'update book_info set `out` = `out` + 1 where id = %s;'
        elif action == 'Return':
            sql_code = 'update book_info set `out` = `out` - 1 where id = %s;'
        self.cur.execute(sql_code, tuple([book_oid]))
        self.my_db.commit()
        self.cur.close()

    def update_book_info(self, ori_book_info):
        self.connect_again()
        book_info = ori_book_info
        book_index = int(book_info[-1])
        book_cat = book_info[0][2:].strip()
        book_num = book_info[1].strip()
        book_title = book_info[2].strip()
        book_stock = int(book_info[3])
        sql_code = '''select id from book_cat_info
                      where cat_name = %s
                   '''
        self.cur.execute(sql_code, [book_cat])
        new_cat = self.cur.fetchall()[0][0]
        sql_code = '''
                   update book_info
                   set `num`=%s, `title` = %s, `stock` = %s, `cat` = %s
                   where id = %s;
                   '''
        val = (book_num, book_title, book_stock, new_cat, book_index)
        self.cur.execute(sql_code, val)
        self.my_db.commit()
        self.cur.close()

    def search_for_books(self, book_name):
        """
        Search books wil similar book_name
        :return:
        """
        self.connect_again()
        sql_code = '''select * from combine_data
                      where title like '%{}%' and
                            show_no_show = '1'
                   '''.format(book_name)
        self.cur.execute(sql_code)
        all_similar_books = self.cur.fetchall()
        self.cur.close()
        return all_similar_books

    def remove_book_from_db(self, book_oid):
        """
        Remove book from database
        :param book_oid:
        :return:
        """
        self.connect_again()
        sql_code = '''
                   UPDATE `book_info` SET `show_no_show` = '0' WHERE (`id` = %s);
                   '''
        self.cur.execute(sql_code, [book_oid])
        self.my_db.commit()
        self.cur.close()


if __name__ == '__main__':
    my = MySql()
    a = my.get_a_book('001')
