import feedparser, urllib2
import MySQLdb
from random import shuffle
from time import mktime
from datetime import datetime, timedelta

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()
articlesToAdd = []

noPics = {"ABC News": "/images/abcnews.png", "Reuters": "/images/reuters.jpg","SFGate":"/images/sfgate.png"}

print "starting script"
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
	cutoff = datetime.utcnow() - timedelta(days=1)
	for (id, source, url, category) in rss2:
		print "looking at feed: " + source
		feed = feedparser.parse(url)
		lst = feed['items']
		for a in lst:
			headline_result = a['title'].encode('utf-8')
			url_result = a['link']
			if url_result not in articleUrls2:
				try:
					date = a['published_parsed']
					date = datetime.fromtimestamp(mktime(date))
					date2 = str(date)
					print date2
				except:
					pass
				if date > cutoff:
					if source in noPics:
						image_result = noPics[source]
					else:
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
					articlesToAdd.append({'headline':headline_result,'image':image_result,'url':url_result,'source':source,'date': date2, 'category':category})

	shuffle(articlesToAdd)
	print "going to add to database"
	for article in articlesToAdd:
		try:
			# execute SQL query using execute() method.
			sql = "INSERT INTO Articles (headline, imgUrl, url, source, date, category, numLikes, numDislikes, collected) VALUES (\"" + article['headline'] + "\",\'" + article['image'] + "\',\'" + article['url'] + "\',\'" + article['source'] + "\',\'" + article['date'] + "\',\'"  + article['category'] + "\',0,0,1)"
			cursor.execute(sql)
			db.commit()
		except:
			db.rollback()

	db.close()
except Exception as e:
	print e
	db.rollback()
	db.close()





