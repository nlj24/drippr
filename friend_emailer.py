from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEImage import MIMEImage
import MySQLdb
import urllib2

import facebook
import requests

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()
access_token = facebook.get_app_access_token('231951950330964', 'f86fde4992f8be9ff00338040d9a734c')
graph = facebook.GraphAPI(access_token)


try:
    sql = "SELECT fName, lName, Users.id, email, emailable FROM Users;"
    cursor.execute(sql)
    all_users = cursor.fetchall()
    all_users_dict = {}
    for user in all_users:
    	all_users_dict[user[2]] = user


    sql = "SELECT fName, Users.id, lName FROM Users WHERE created>NOW() - INTERVAL 3 DAY"
    cursor.execute(sql)
    new_users = cursor.fetchall()

    candidate_emails = {}
	to_send = []
    for user in new_users:
		print user
		friends = graph.get_connections(user[1], 'friends')
		for friend in friends['data']:
			if friend['id'] in all_users_dict:
				if friend['id'] not in candidate_emails:
					candidate_emails[friend['id']] = []
				candidate_emails[friend['id']].append(user)

	for user in candidate_emails:
		if all_users_dict[user][4] = '1':
			to_send.append({"fName": all_users_dict[user][0] , "lName": all_users_dict[user][1] , "email": all_users_dict[user][3] , "friends_joined": candidate_emails[user]})
	print to_send
except Exception as e:
    print e
    db.rollback()
    db.close()

