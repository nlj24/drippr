from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.MIMEImage import MIMEImage
import MySQLdb
import urllib2

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()

try:
    sql = "SELECT fName, email, Users.id, lName FROM Users WHERE unreadDripps=1 AND emailable=1 AND isReal=1 GROUP BY Dripps.recipientUserId"
    # sql = "SELECT email, fName FROM Dripps WHERE unreadDripps=1 INNER JOIN Users ON Dripps.recipientId=Users.id GROUP BY Dripps.recipientId"
    cursor.execute(sql)
    email_data = cursor.fetchall()
    print email_data
except Exception as e:
    print e
    db.rollback()
    db.close()
