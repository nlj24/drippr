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
    sql = "SELECT fName, lName, Users.id, email FROM Users WHERE isReal = 1 AND emailable = 1 AND email != 'undefined';"
    cursor.execute(sql)
    all_users = cursor.fetchall()
    all_users_dict = {}
    for user in all_users:
        all_users_dict[user[2]] = user

    sql = "SELECT fName, Users.id, lName FROM Users WHERE created>NOW() - INTERVAL 3 DAY"
    cursor.execute(sql)
    new_users = cursor.fetchall()

    candidate_emails = {}
    to_send=[]
    for user in new_users:
        friends = graph.get_connections(user[1], 'friends')
        for friend in friends['data']:
            if friend['id'] in all_users_dict:
                if friend['id'] not in candidate_emails:
                    candidate_emails[friend['id']] = []
                    pass
                candidate_emails[friend['id']].append(user)
                pass
    for user in candidate_emails:
        to_send.append({"fName": all_users_dict[user][0] , "lName": all_users_dict[user][1] , "email": all_users_dict[user][3] , "id": all_users_dict[user][2], "friends_joined": candidate_emails[user]})
    print to_send
except Exception as e:
    print e
    db.rollback()
    db.close()

for user in to_send:

    fName = user['fName']
    strTo = user['email']
    numFriends = len(user['friends_joined'])
    user_id = int(user['id'])
    lName = user['lName']

    if (not strTo=='') and (numFriends > 0):

        # Define these once; use them twice!

        # Create the root message and fill in the from, to, and subject headers
        msgRoot = MIMEMultipart('related')
        msgRoot['Subject'] = 'welcome your friends to drippr!'
        msgRoot['From'] = 'drippr'  + '<info.drippr@gmail.com>'
        msgRoot['To'] = strTo
        msgRoot.add_header('Reply-to', 'info.drippr@gmail.com')
        msgRoot.preamble = 'This is a multi-part message in MIME format.'

        # Encapsulate the plain and HTML versions of the message body in an
        # 'alternative' part, so message agents can decide which they want to display.
        msgAlternative = MIMEMultipart('alternative')
        msgRoot.attach(msgAlternative)

        word = "have"
        word2 = "friends"
        if numFriends==1:
            numFriends = "One"
            word = "has"
            word2 = "friend"

        

        # We reference the image in the IMG SRC attribute by the ID we give it below

        #set up header, sentence
        msgText = '<div style="font-weight:bold; color: #6D6E70; border:1px solid #1C75BB; background:#e9eaed; padding:8px 8px 8px 8px; font-size:18px; font-family:Helvetica Neue"><table><tbody><tr><td><img width="100px" style="margin-left:6px; margin-right:13px; border-radius:10px; border: 3px solid #1C75BB" src="cid:image1"></td><td>Hey ' + fName + ',<br><br><div style="font-weight:bolder;">' +  str(numFriends) + ' of your friends ' + word + ' joined drippr in the last 3 days: '
        #friend is a (fName, id, lName)
        msgText += '<table>'
        for friend in user['friends_joined']:
            msgText += '<tr><td><img width=50px" style="margin-left:6px; margin-right:13px; border-radius:10px; border: 1px solid #1C75BB" src="cid:image' +friend[1] + '"></td><td>' + friend[0] + ' ' +friend[2] +'</td></tr>'
            fp = urllib2.urlopen("http://graph.facebook.com/" + friend[1] + "/picture?width=50&height=50")
            msgImage = MIMEImage(fp.read())
            fp.close()

            # Define the image's ID as referenced above
            msgImage.add_header('Content-ID', '<image' + friend[1] + '>')
            msgRoot.attach(msgImage)

        msgText += '</table> <br> visit <a href="http://drippr.me" style="text-decoration:none; color:#1C75BB"> drippr.me </a> to welcome your ' + word2 + ' with some interesting dripps or by adding your ' + word2 + ' to your favorite groups<br>questions or comments? email <a href="mailto:info.drippr@gmail.com" style="text-decoration:none; color:#1C75BB">info.drippr@gmail.com</a><br><br>thank you, <br><img height="32px" style="margin-left:8px" src="cid:image2"><br><br><div style="font-size:10px; font-style:italic">this email intended for ' + fName + " " + lName + ', all rights reserved<br>copyright &copy; 2014 drippr<br>320 Greenwich Street, New York, NY 10013<br></div><a style="text-decoration:none" href="http://drippr.me/unsubscribe.html?id=' + str(user_id) + '"><span style="font-size:10px; color:#6D6E70">unsubscribe</span></a></td></tr></tbody></table></div>'

        msgMIMEText = MIMEText(msgText, 'html')
        msgAlternative.attach(msgMIMEText)

        # This example assumes the image is in the current directory
        fp = urllib2.urlopen("http://graph.facebook.com/" + str(user_id) + "/picture?width=100&height=100")
        msgImage = MIMEImage(fp.read())
        fp.close()

        # Define the image's ID as referenced above
        msgImage.add_header('Content-ID', '<image1>')
        msgRoot.attach(msgImage)

        # This example assumes the image is in the current directory
        fp = urllib2.urlopen("http://drippr.me/images/logo.png")
        msgImage = MIMEImage(fp.read())
        fp.close()

        # Define the image's ID as referenced above
        msgImage.add_header('Content-ID', '<image2>')
        msgRoot.attach(msgImage)

        # Send the email (this example assumes SMTP authentication is required)
        import smtplib
        smtp = smtplib.SMTP()
        smtp.connect('smtp.gmail.com:587')
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login('info.drippr@gmail.com', 'drizzardthelizzard')
        smtp.sendmail('info.drippr@gmail.com', strTo, msgRoot.as_string())
        smtp.quit()
