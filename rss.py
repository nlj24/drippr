import feedparser, urllib2
import MySQLdb
from random import shuffle
from time import mktime
from datetime import datetime

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()
articlesToAdd = []

try:
	# execute SQL query using execute() method.
	sql = "SELECT * FROM Sources"
	cursor.execute(sql)
	rss = cursor.fetchall()
	rss2 = []
	for a in rss:
		rss2.append(a)
	
	sql = "SELECT url FROM Articles Where collected = 1"
	cursor.execute(sql)
	articleUrls = cursor.fetchall()
	articleUrls2 = []
	for url in articleUrls:
		articleUrls2.append(url[0])

	dateListFail = []
	b = 0
	for (id, source, url, category) in rss2:
		feed = feedparser.parse(url)
		lst = feed['items']
		for a in lst:
			print 1
			b = b + 1
			headline_result = a['title'].encode('utf-8')
			url_result = a['link']
			try:
				date = a['published_parsed']
				date = str(datetime.fromtimestamp(mktime(date)))
			except:
				date = 'no date'
				dateListFail.append(source)
				print date
			request = urllib2.Request(url_result)
			request.add_header("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 5.1; es-ES; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5")
			try:
				usock = urllib2.urlopen(request)
				data = usock.read()
				usock.close()
				beg = data.rindex('"',0,data.find('jpg')) + 1
				end = data.index('"',data.find('jpg'))
				image_result = data[beg:end]
			except:
				image_result = '/images/drop.png'
			if (url_result) not in articleUrls2:
				print url_result
				articlesToAdd.append({'headline':headline_result,'image':image_result,'url':url_result,'source':source,'date': date, 'category':category})
	print dateListFail
	shuffle(articlesToAdd)
	print articlesToAdd
	for article in articlesToAdd:
		try:
			# execute SQL query using execute() method.
			sql = "INSERT INTO Articles (headline, imgUrl, url, source, date, category, numLikes, numDislikes, collected) VALUES (\"" + article['headline'] + "\",\'" + article['image'] + "\',\'" + article['url'] + "\',\'" + article['source'] + "\',\'" + article['date'] + "\',\'"  + article['category'] + "\',0,0,1)"
			print sql
			cursor.execute(sql)
			db.commit()
		except:
			db.rollback()

	db.close()
	print b
except Exception as e:
	print e
	db.rollback()
	db.close()





