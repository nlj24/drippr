from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEImage import MIMEImage
import MySQLdb
import urllib2

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()

try:
    sql = "SELECT fName, email, Users.id, fullName FROM Users WHERE emailable=1 AND isReal=1"
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
    user_id = int(user[2])
    name = user[3]

    if (not strTo==''):

        # Define these once; use them twice!

        # Create the root message and fill in the from, to, and subject headers
        msgRoot = MIMEMultipart('related')
        msgRoot['Subject'] = 'drippr newsletter!'
        msgRoot['From'] = 'messages-noreply@drippr.me'
        msgRoot['To'] = strTo
        msgRoot.add_header('Reply-to', 'info.drippr@gmail.com')
        msgRoot.preamble = 'This is a multi-part message in MIME format.'

        # Encapsulate the plain and HTML versions of the message body in an
        # 'alternative' part, so message agents can decide which they want to display.
        msgAlternative = MIMEMultipart('alternative')
        msgRoot.attach(msgAlternative)

        msgText = MIMEText('checkout drippr to explore our new features and content!')
        msgAlternative.attach(msgText)

        # We reference the image in the IMG SRC attribute by the ID we give it below

        msgText = MIMEText('<div style="font-weight:bold; color: #6D6E70; border:1px solid #1C75BB; background:#e9eaed; padding:8px 8px 8px 8px; font-size:18px; font-family:Helvetica Neue">hey ' + fName + ',<br><br>Thank you for being a loyal drippr user. drippr is reaching new heights - We recently expanded our article library to over 100,000 articles! We continue to add more news providers to our existing database of already 150+ providers!<br><br>Did you know that you can now send dripps not only to your friends, but also custom groups of friends that you have created? You can also find articles from top sources such as the Washington Post, ESPN, BuzzFeed, CNN, FoxNews, and more in our many categories. Additionally, you can dripp articles from any website using our <a href ="https://chrome.google.com/webstore/detail/drippr/ecnogdhghoaohnoaepppgehodleikkbf" style="text-decoration:none;  color: #1C75BB">chrome extension</a>!<br><br>Some highlights of the past week include:<br><center><u>top dripp</u><br><a href ="http://www.huffingtonpost.com/2014/07/15/derek-jeter-last-all-star-game_n_5587743.html?utm_hp_ref=sports&ir=Sports" style="text-decoration:none;  color: #6D6E70">Derek Jeter\'s Final All-Star Game Is A Huge Deal For Everyone But Derek Jeter</a><br><a href ="http://www.huffingtonpost.com/2014/07/15/derek-jeter-last-all-star-game_n_5587743.html?utm_hp_ref=sports&ir=Sports"><img src="cid:image1" style = "width:300px; border:3px solid #1C75BB; border-radius:10px; margin-top:5px"></a><br><br><u>top like</u><br><a href ="http://www.cbsnews.com/news/does-going-organic-benefit-your-health/" style="text-decoration:none;  color: #6D6E70">Does going organic benefit your health?</a><br><a href ="http://www.cbsnews.com/news/does-going-organic-benefit-your-health/"><img src="cid:image2" style = "width:300px; border:3px solid #1C75BB; border-radius:10px; margin-top:5px"></a><br><br><u>top save</u><br><a href ="http://www.cbsnews.com/news/apple-iwatch-may-cost-300-sell-millions-in-first-year-report/" style="text-decoration:none;  color: #6D6E70">Will the Apple iWatch sell at this price?</a><br><a href ="http://www.cbsnews.com/news/apple-iwatch-may-cost-300-sell-millions-in-first-year-report/"><img src="cid:image3" style = "width:300px; border:3px solid #1C75BB; border-radius:10px; margin-top:5px"></a><br></center><br><br>visit <a style = "text-decoration:none; color: #1C75BB" href = "http://drippr.me">drippr.me</a>!<br><br>questions or comments? <a href = "mailto:info.drippr@gmail.com" style = "text-decoration:none; color: #1C75BB">info.drippr@gmail.com</a><br><br><a href = "http://drippr.me/#dripp" title="find"><img src ="cid:image4" style="height:40px; width:40px"></a><a href = "http://drippr.me/#bucket" title="bucket"><img src ="cid:image5" style="height:40px; width:40px"></a><a href = "http://drippr.me/#group" title="group"><img src ="cid:image6" style="height:40px; width:40px"></a><br><br>thank you, <br><img height="32px" style="margin-left:8px" src="cid:image7"><br><br><div style="font-size:10px; font-style:italic">this email intended for ' + name + ', all rights reserved<br>copyright &copy; 2014 drippr<br>320 Greenwich Street, New York, NY 10013<br></div><a style="font-size:10px; text-decoration:none; color:#6D6E70" href="http://drippr.me/unsubscribe.html?id=' + str(user_id) + '">unsubscribe</a></div>', 'html')
        msgAlternative.attach(msgText)

        fp = urllib2.urlopen("http://i.huffpost.com/gen/1910740/thumbs/o-DEREK-JETER-facebook.jpg")
        msgImage = MIMEImage(fp.read())
        fp.close()
        msgImage.add_header('Content-ID', '<image1>')
        msgRoot.attach(msgImage)

        fp = urllib2.urlopen("http://cbsnews2.cbsistatic.com/hub/i/r/2014/07/15/d78740cd-83e2-4f77-a065-4a14c8e2a701/thumbnail/620x350/28f2d77367d4a2cbfe44cd0c94e88ca6/istock000010141090small.jpg")
        msgImage = MIMEImage(fp.read())
        fp.close()
        msgImage.add_header('Content-ID', '<image2>')
        msgRoot.attach(msgImage)

        fp = urllib2.urlopen("http://cbsnews2.cbsistatic.com/hub/i/r/2014/07/15/f4a07d54-eb78-48cd-a9bb-1cc68022ff33/thumbnail/620x350/5527f4546b975618038f28e70058d4b9/iwatch-concept-2cnet620x350.jpg")
        msgImage = MIMEImage(fp.read())
        fp.close()
        msgImage.add_header('Content-ID', '<image3>')
        msgRoot.attach(msgImage)
       
        fp = open("images/drop.png", 'rb')
        msgImage = MIMEImage(fp.read())
        fp.close()
        msgImage.add_header('Content-ID', '<image4>')
        msgRoot.attach(msgImage)

        fp = open("images/bucketGrey.png", 'rb')
        msgImage = MIMEImage(fp.read())
        fp.close()
        msgImage.add_header('Content-ID', '<image5>')
        msgRoot.attach(msgImage)

        fp = open("images/groupGrey.png", 'rb')
        msgImage = MIMEImage(fp.read())
        fp.close()
        msgImage.add_header('Content-ID', '<image6>')
        msgRoot.attach(msgImage)

        fp = open("images/logo.png", 'rb')
        msgImage = MIMEImage(fp.read())
        fp.close()
        msgImage.add_header('Content-ID', '<image7>')
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