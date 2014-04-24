import MySQLdb

db = MySQLdb.connect('54.86.82.21','root','drippr','drippr_db')
cursor = db.cursor()

try:
	# execute SQL query using execute() method.
	cursor.execute("""INSERT into tbl (id, value) values (10, 'fuck')""")
	db.commit()
except:
	db.rollback()
db.close()