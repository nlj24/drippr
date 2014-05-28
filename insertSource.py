import feedparser, urllib2
import MySQLdb

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()






for article in articlesToAdd:
	try:
		# execute SQL query using execute() method.
		sql = "INSERT INTO Articles (headline, imgUrl, url, source, date, category) VALUES (\'" + article['headline'] + "\',\'" + article['image'] + "\',\'" + article['url'] + "\',\'" + article['source'] + "\',\'" + article['date'] + "\',\'" + article['category'] + "\')"
		cursor.execute(sql)
		db.commit()
	except:
		db.rollback()

db.close()