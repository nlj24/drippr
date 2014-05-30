import feedparser, urllib2
import MySQLdb

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()
print 'gay'
# rss = [("ESPN","http://sports.espn.go.com/espn/rss/news"),("Fox News", "http://feeds.foxnews.com/foxnews/latest"),("CNN", "http://rss.cnn.com/rss/cnn_topstories.rss")]
articlesToAdd = []

try:
	# execute SQL query using execute() method.
	sql = "SELECT * FROM Sources WHERE id=2"
	cursor.execute(sql)
	rss = cursor.fetchall()

	sql = "SELECT url FROM Articles Where collected = 1"
	cursor.execute(sql)
	articleUrls = cursor.fetchall()
	articleUrls2 = []
	for url in articleUrls:
		articleUrls2.append(url[0])
	print articleUrls2
	print 1


	for (id, source, url, category) in rss:
		feed = feedparser.parse(url)
		lst = feed['items']
		for a in lst:
			headline_result = a['title'].encode('utf-8')
			url_result = a['link']
			date_result = a['published']
			request = urllib2.Request(url_result)
			request.add_header("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 5.1; es-ES; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5")
			usock = urllib2.urlopen(request)
			data = usock.read()
			usock.close()
			try:
				beg = data.rindex('"',0,data.find('jpg')) + 1
				end = data.index('"',data.find('jpg'))
				image_result = data[beg:end]
			except:
				image = 'Stock Photo'
			if (url_result) not in articleUrls2:
				print url_result
				articlesToAdd.append({'headline':headline_result,'image':image_result,'url':url_result,'source':source,'date':'2013-11-13 12:12:12','category':category})

	for article in articlesToAdd:
		try:
			# execute SQL query using execute() method.
			sql = "INSERT INTO Articles (headline, imgUrl, url, source, date, category, numLikes, numDislikes, collected) VALUES (\'" + article['headline'] + "\',\'" + article['image'] + "\',\'" + article['url'] + "\',\'" + article['source'] + "\',NOW(),\'" + article['category'] + "\',0,0,1)"
			print sql
			cursor.execute(sql)
			db.commit()
		except:
			db.rollback()

	db.close()
except Exception as e:
	print e
	db.rollback()
	db.close()





