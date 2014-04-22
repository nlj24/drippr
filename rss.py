import feedparser, urllib2, csv

rss = ["http://rss.nytimes.com/services/xml/rss/nyt/World.xml"]


with open('Articles.csv', 'wb') as f:
	writer = csv.writer(f)
	writer.writerow(["Title","URL","Image","Date","Source"])
	for sources in rss:
		feed = feedparser.parse(sources)
		lst = feed['items']
		source = feed[ "channel" ][ "title" ]
		for a in lst:
			title = a['title']
			url = a['link']
			date = a['published']
			request = urllib2.Request(url)
			request.add_header("User-Agent", "Mozilla/5.0 (Windows; U; Windows NT 5.1; es-ES; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5")
			usock = urllib2.urlopen(request)
			data = usock.read()
			usock.close()
			try:
				beg = data.rindex('"',0,data.find('jpg')) + 1
				end = data.index('"',data.find('jpg'))
				image = data[beg:end]
			except:
				image = 'Stock Photo'
			writer.writerow([title,url,image,date,source])