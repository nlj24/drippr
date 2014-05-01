import feedparser, urllib2
import MySQLdb

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()

cursor.execute("Truncate table Articles")
rss = ["http://sports.espn.go.com/espn/rss/news","http://feeds.foxnews.com/foxnews/latest","http://rss.cnn.com/rss/cnn_topstories.rss"]

articlesToAdd = []

for sources in rss:
	feed = feedparser.parse(sources)
	lst = feed['items']
	source = feed[ "channel" ][ "title" ]
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

		if sources == "http://sports.espn.go.com/espn/rss/news":
			cat = "Sports"
		elif sources == "http://feeds.foxnews.com/foxnews/latest":
			cat = "World"
		else:
			cat = "Politics"



		articlesToAdd.append({'headline':headline_result,'image':image_result,'url':url_result,'source':'ESPN','date':'2013-11-13 12:12:12','category':cat})

for article in articlesToAdd:
	try:
		# execute SQL query using execute() method.
		sql = "INSERT INTO Articles (headline, imgUrl, url, source, date, category) VALUES (\'" + article['headline'] + "\',\'" + article['image'] + "\',\'" + article['url'] + "\',\'" + article['source'] + "\',\'" + article['date'] + "\',\'" + article['category'] + "\')"
		cursor.execute(sql)
		db.commit()
	except:
		db.rollback()

db.close()