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
    sql = "SELECT fName, lName, Users.id, email, emailable, FROM Users"
    cursor.execute(sql)
    all_users = cursor.fetchall()
    all_users_dict = {}
    for user in all_users:
    	all_users_dict[user[2]] = user

    print all_users_dict

    sql = "SELECT fName, Users.id, lName FROM Users WHERE created>NOW() - INTERVAL 3 DAY"
    # sql = "SELECT email, fName FROM Dripps WHERE unreadDripps=1 INNER JOIN Users ON Dripps.recipientId=Users.id GROUP BY Dripps.recipientId"
    cursor.execute(sql)
    new_users = cursor.fetchall()
    print new_users

    email_dict = {}
	for user in new_users:
		print user
		friends = graph.get_connections(user[1], 'friends')
		while True:
		    try:
		        # Perform some action on each post in the collection we receive from
		        # Facebook.
		        for friend in friends:
		        	if friend['id'] in all_users_dict:
		        		if friend['id'] not in email_dict:
		        			email_dict[friend['id']] = []
		        		email_dict[friend['id']].push(user)
		        # Attempt to make a request to the next page of data, if it exists.
		        friends = requests.get(friends['paging']['next']).json()
		    except KeyError:
		        # When there are no more pages (['paging']['next']), break from the
		        # loop and end the script.
		        break
	print email_dict

except Exception as e:
    print e
    db.rollback()
    db.close()

