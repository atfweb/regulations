#ATF NOTICE

api_address = "http://www.federalregister.gov/api/v1/documents.json?per_page=1000&order=oldest&conditions%5Bterm%5D="

api_cfr = "%20CFR%20"
 
api_conditions = "&conditions%5Bagencies%5D%5B%5D=alcohol-tobacco-firearms-and-explosives-bureau&conditions%5Btype%5D%5B%5D=RULE" 

part_list = ["447", "478", "479", "555", "646", "771"]
cfr_title = "27"

from_addr = 'atfwebnotices@gmail.com'
from_pass = 'PA$$w0rd1'

recipients =["TimothyAndry@gmail.com"]



#SITE IMPROVE API

site_id = "15875133705"

site_improve_user = "timothy.andry@atf.gov"

site_improve_key = "4b17d72328cd9d60fad4f98b8a4e57e7"

site_improve_base = "https://api.siteimprove.com/v2/sites/"

site_improve_search = "/analytics/internal_searches/"

site_improve_internal = "/analytics/internal_searches?page=1&page_size=500&period=last_month&search_results=all"

site_improve_popular = "/analytics/content/most_popular_pages?page=1&page_size=999&search_in=url"
