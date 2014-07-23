from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEImage import MIMEImage
import MySQLdb
import urllib2

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()

try:
    sql = "SELECT fName, email, COUNT(unreadDripps), Users.id, lName FROM Dripps INNER JOIN Users ON Dripps.recipientUserId=Users.id WHERE unreadDripps=1 AND emailable=1 AND isReal=1 GROUP BY Dripps.recipientUserId"
    # sql = "SELECT email, fName FROM Dripps WHERE unreadDripps=1 INNER JOIN Users ON Dripps.recipientId=Users.id GROUP BY Dripps.recipientId"
    cursor.execute(sql)
    email_data = cursor.fetchall()
    print email_data
except Exception as e:
    print e
    db.rollback()
    db.close()


for user in email_data:

    fName = user[0]
    strTo = user[1]
    unread_dripps = int(user[2])
    user_id = int(user[3])
    lName = user[4]

    if (not strTo=='') and (unread_dripps > 0) and (strTo != 'undefined'):

        # Define these once; use them twice!

        # Create the root message and fill in the from, to, and subject headers
        msgRoot = MIMEMultipart('related')
        msgRoot['Subject'] = 'you have unread dripps!'
        msgRoot['From'] = 'drippr'  + '<info.drippr@gmail.com>'
        msgRoot['To'] = strTo
        msgRoot.add_header('Reply-to', 'info.drippr@gmail.com')
        msgRoot.preamble = 'This is a multi-part message in MIME format.'

        # Encapsulate the plain and HTML versions of the message body in an
        # 'alternative' part, so message agents can decide which they want to display.
        msgAlternative = MIMEMultipart('alternative')
        msgRoot.attach(msgAlternative)

        msgText = MIMEText('you have ' + str(unread_dripps) + ' dripps. visit drippr.me to check them out.')
        msgAlternative.attach(msgText)

        # We reference the image in the IMG SRC attribute by the ID we give it below
        word = "dripps"
        if unread_dripps==1:
            word="dripp"

        msgText = MIMEText('<div style="font-weight:bold; color: #6D6E70; border:1px solid #1C75BB; background:#e9eaed; padding:8px 8px 8px 8px; font-size:18px; font-family:Helvetica Neue"><table><tbody><tr><td><img width="100px" style="margin-left:6px; margin-right:13px; border-radius:10px; border: 3px solid #1C75BB" src="cid:image1"></td><td>Hey ' + fName + ',<br><br><div style="font-weight:bolder; color: #1C75BB">you have ' + str(unread_dripps) + ' unread ' + word +'!</div>visit <a style="text-decoration:none; color:#1C75BB" href="http://drippr.me">drippr.me</a> to view<br><br>questions or comments? email <a href="mailto:info.drippr@gmail.com" style="text-decoration:none; color:#1C75BB">info.drippr@gmail.com</a><br><br>thank you, <br><img height="32px" style="margin-left:8px" src="cid:image2"><br><br><div style="font-size:10px; font-style:italic">this email intended for ' + fName + " " + lName + ', all rights reserved<br>copyright &copy; 2014 drippr<br>320 Greenwich Street, New York, NY 10013<br></div><a style="text-decoration:none" href="http://drippr.me/unsubscribe.html?id=' + str(user_id) + '"><span style="font-size:10px; color:#6D6E70">unsubscribe</span></a></td></tr></tbody></table></div>', 'html')
        msgAlternative.attach(msgText)

        # This example assumes the image is in the current directory
        fp = urllib2.urlopen("http://graph.facebook.com/" + str(user_id) + "/picture?width=400&height=400")
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