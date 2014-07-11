# SOURCE: http://code.activestate.com/recipes/473810-send-an-html-email-with-embedded-image-and-plain-t/
# Send an HTML email with an embedded image and a plain text message for
# email clients that don't want to display the HTML.

from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEImage import MIMEImage
import MySQLdb

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()

try:
    sql = "SELECT fName, email, COUNT(unreadDripps) FROM Dripps INNER JOIN Users ON Dripps.recipientUserId=Users.id WHERE unreadDripps=1 AND emailable=1 AND isReal=1 GROUP BY Dripps.recipientUserId"
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

    if (not strTo=='') and (unread_dripps > 0):

        # Define these once; use them twice!
        strFrom = 'info.drippr@gmail.com'

        # Create the root message and fill in the from, to, and subject headers
        msgRoot = MIMEMultipart('related')
        msgRoot['Subject'] = 'you have unread dripps!'
        msgRoot['From'] = strFrom
        msgRoot['To'] = strTo
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

        msgText = MIMEText('<div style="font-weight:bold; color: #6D6E70; border:1px solid #1C75BB; background:#e9eaed; padding:8px 8px 8px 8px; font-size:18px; font-family:Helvetica Neue">Hey ' + fName + ',<br><br><div style="font-weight:bolder; color: #1C75BB">you have ' + str(unread_dripps) + ' unread ' + word +'!</div><br>visit <a style="text-decoration:none; color:#1C75BB" href="http://drippr.me">drippr.me</a> to view<br><br><a href="http://drippr.me"><img width="100px" src="cid:image1"></a><br><br><div style="font-size:10px; font-style:italic">copyright &copy; 2014 drippr<br>320 Greenwich Street, New York, NY 10013</div><a style="font-size:10px; text-decoration:none; color:#6D6E70" href="http://drippr.me/unsubscribe">unsubscribe</a></div>', 'html')
        msgAlternative.attach(msgText)

        # This example assumes the image is in the current directory
        fp = open('images/drop.png', 'rb')
        msgImage = MIMEImage(fp.read())
        fp.close()

        # Define the image's ID as referenced above
        msgImage.add_header('Content-ID', '<image1>')
        msgRoot.attach(msgImage)

        # Send the email (this example assumes SMTP authentication is required)
        import smtplib
        smtp = smtplib.SMTP()
        smtp.connect('smtp.gmail.com:587')
        smtp.ehlo()
        smtp.starttls()
        smtp.ehlo()
        smtp.login('info.drippr@gmail.com', 'drizzardthelizzard')
        smtp.sendmail(strFrom, strTo, msgRoot.as_string())
        smtp.quit()