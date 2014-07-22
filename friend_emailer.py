from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEImage import MIMEImage
import MySQLdb
import urllib2

import facebook
import requests

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()
access_token = f86fde4992f8be9ff00338040d9a734c
graph = facebook.GraphAPI(access_token)


try:
    # sql = "SELECT fName, lName, Users.id, email, emailable, FROM Users"
    # cursor.execute(sql)
    # all_users = cursor.fetchall()
    # all_users_dict = {}
    # for user in all_users:
    # 	all_users_dict[user[2]] = user

    # print all_users_dict

    sql = "SELECT fName, Users.id, lName FROM Users WHERE created>NOW() - INTERVAL 3 DAY"
    # sql = "SELECT email, fName FROM Dripps WHERE unreadDripps=1 INNER JOIN Users ON Dripps.recipientId=Users.id GROUP BY Dripps.recipientId"
    cursor.execute(sql)
    new_users = cursor.fetchall()
    print new_users



except Exception as e:
    print e
    db.rollback()
    db.close()

for user in new_users:
	#get friend list from fb
	print user
	friends = graph.get_connections(user[1], 'friends')
	print friends
