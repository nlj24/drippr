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
    sql = "SELECT email, fName, COUNT(unreadDripps) FROM Dripps INNER JOIN Users ON Dripps.recipientUserId=Users.id WHERE unreadDripps=1 GROUP BY Dripps.recipientUserId"
    # sql = "SELECT email, fName FROM Dripps WHERE unreadDripps=1 INNER JOIN Users ON Dripps.recipientId=Users.id GROUP BY Dripps.recipientId"
    cursor.execute(sql)
    email_data = cursor.fetchall()
    print email_data
except Exception as e:
    print e
    db.rollback()
    db.close()


# # Define these once; use them twice!
# strFrom = 'info.drippr@gmail.com'
# strTo = 'nathanieljones1992@gmail.com'

# # Create the root message and fill in the from, to, and subject headers
# msgRoot = MIMEMultipart('related')
# msgRoot['Subject'] = 'test message'
# msgRoot['From'] = strFrom
# msgRoot['To'] = strTo
# msgRoot.preamble = 'This is a multi-part message in MIME format.'

# # Encapsulate the plain and HTML versions of the message body in an
# # 'alternative' part, so message agents can decide which they want to display.
# msgAlternative = MIMEMultipart('alternative')
# msgRoot.attach(msgAlternative)

# msgText = MIMEText('This is the alternative plain text message.')
# msgAlternative.attach(msgText)

# # We reference the image in the IMG SRC attribute by the ID we give it below
# msgText = MIMEText('<b>Some <i>HTML</i> text</b> and an image.<br><img src="cid:image1"><br>Nifty!', 'html')
# msgAlternative.attach(msgText)

# # This example assumes the image is in the current directory
# fp = open('rsz_drop.jpg', 'rb')
# msgImage = MIMEImage(fp.read())
# fp.close()

# # Define the image's ID as referenced above
# msgImage.add_header('Content-ID', '<image1>')
# msgRoot.attach(msgImage)

# # Send the email (this example assumes SMTP authentication is required)
# import smtplib
# smtp = smtplib.SMTP()
# smtp.connect('smtp.gmail.com:587')
# smtp.ehlo()
# smtp.starttls()
# smtp.ehlo()
# smtp.login('info.drippr@gmail.com', 'drizzardthelizzard')
# smtp.sendmail(strFrom, strTo, msgRoot.as_string())
# smtp.quit()