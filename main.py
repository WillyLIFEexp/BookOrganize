from flask import Flask, render_template, request, url_for, jsonify, send_from_directory
from flask_bootstrap import Bootstrap
from funs.new_connect import MySql

import json
import pandas as pd
import os

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
Bootstrap(app)

m = MySql()


@app.route('/')
def show_list():
    """
    This is the home page.
    :return:
    """
    first_page_cards, page_num = m.get_first_page_books()
    category_list = m.get_all_cat_tags()
    return render_template('new_home.html', all_category=category_list, all_books=first_page_cards, pages=page_num)


@app.route('/only_admin', methods=['GET'])
def only_admin():
    """
    This is the admin page
    :return:
    """
    first_page_cards, page_num = m.get_first_page_books()
    category_list = m.get_all_cat_tags()
    return render_template('admin_page.html', all_category=category_list, all_books=first_page_cards, pages=page_num)


@app.route('/add_card', methods=['POST'])
def add_card():
    """
    Adding a new book to database
    :return:
    """
    book_prefix_cat = request.form['book_prefix_cat']
    book_num = request.form['book_num']
    title = request.form['title']
    stock = request.form['stock']
    m.insert_book(book_prefix_cat, book_num, title, int(stock))
    last_page = m.get_cat_tag_info(book_prefix_cat)[0][-1]
    nth_page_books_info = m.get_nth_page_books(book_prefix_cat[2:], int(last_page))
    return jsonify({'new_book_list': nth_page_books_info, 'page_num': int(last_page)})


@app.route('/get_a_book', methods=['POST'])
def get_a_book():
    """
    Get a book info
    :return:
    """
    book_name = request.form['book_name']
    res_book = m.search_for_books(book_name)
    return jsonify({'return_book': res_book})


@app.route('/change_card', methods=['POST'])
def change_card():
    """
    Change single card.
    This function is used at bo_re.js
    :return:
    """
    search_oid = request.form['book_oid']
    action = request.form['action']
    m.update_book_out_count(search_oid, action)
    res_info = m.get_a_book(search_oid)[0]
    return jsonify({'return_book_info': res_info})


@app.route('/change_page', methods=['POST'])
def change_page():
    """
    Query need books list when change to different page.
    This function is used at new_page.js
    :return:
    """
    page_num = request.form['page_num']
    cat_select = request.form['cate_select']
    nth_page_books_info = m.get_nth_page_books(cat_select, int(page_num))
    return jsonify({'new_book_list': nth_page_books_info})


@app.route('/change_whole', methods=['POST'])
def change_whole():
    """
    Change the whole page when new category been selected
    :return:
    """
    cat_name = request.form['cat_name']
    filtered_first_page_cards, filtered_page_num = m.get_first_page_books(cat_name)
    return jsonify({'new_book_list': filtered_first_page_cards, 'new_page_count': filtered_page_num})


@app.route('/update_info', methods=['POST'])
def update_info():
    """
    Upate info to sql
    :return:
    """
    res_info = request.form['book_info']
    new_info = json.loads(res_info)
    m.update_book_info(new_info)
    res_info = m.get_a_book(int(new_info[-1]))
    return jsonify({'return_book_info': res_info[0]})


@app.route('/search_cat_info', methods=['POST'])
def search_cat_info():
    cat = request.form['search_cat']
    prefix_cats_list = m.get_prefix_cat(cat)[0]
    prefix_cat = prefix_cats_list[0] + prefix_cats_list[1]
    return jsonify({'prefix_cat': prefix_cat})


@app.route('/remove_card', methods=['POST'])
def remove_card():
    book_prefix_cat = request.form['book_prefix_cat']
    page_num = request.form['page_num']
    book_oid = request.form['book_oid']
    m.remove_book_from_db(int(book_oid))
    nth_page_books_info = m.get_nth_page_books(book_prefix_cat, int(page_num))
    return jsonify({'new_book_list': nth_page_books_info})


@app.route('/outputCSV')
def outputCSV():
    """
    Output CSV files
    :return:
    """
    cols = ['Index', 'pre_cat', '編號', '書名', '總數量', '借出數量', 'cat', '顯示狀態']
    temp_df = pd.DataFrame(m.get_everything(), columns=cols)
    temp_df['書分類'] = temp_df['pre_cat'] + temp_df['cat']
    temp_df['顯示狀態'] = temp_df['顯示狀態'].apply(lambda x: '顯示' if 1 else '不顯示')
    all_df = temp_df[['書分類', '編號', '書名', '總數量', '借出數量', '顯示狀態']]
    sheet_lists = all_df['書分類'].unique()
    writer = pd.ExcelWriter('all_books.xlsx', engine='xlsxwriter')
    for sheet_name in sheet_lists:
        tmp = all_df[all_df['書分類'] == sheet_name]
        tmp.to_excel(writer, sheet_name=sheet_name, index=False)
    writer.save()

    return send_from_directory(directory=os.path.dirname(os.path.abspath(__file__)), filename='all_books.xlsx',
                               as_attachment=True)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port='5000', debug=True, threaded=True)
