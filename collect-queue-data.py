import json
import urllib3
import boto3
from datetime import datetime, timezone

s3 = boto3.client('s3')
bucket_name = 'queuetycoon'
http = urllib3.PoolManager()

def fetch_park_data(park):
    schedule_url = f'https://api.themeparks.wiki/v1/entity/{park[0]}/schedule'
    wait_times_url = f'https://api.themeparks.wiki/v1/entity/{park[0]}/live'
    
    schedule_response = http.request('GET', schedule_url)
    wait_times_response = http.request('GET', wait_times_url)
    
    if schedule_response.status == 200 and wait_times_response.status == 200:
        scheduleData = json.loads(schedule_response.data)['schedule']
        if not scheduleData:
            return None, ""
        schedule = scheduleData[0]
        wait_times = json.loads(wait_times_response.data)
        
        opening_time = datetime.fromisoformat(schedule["openingTime"])
        closing_time = datetime.fromisoformat(schedule["closingTime"])
        
        time_zone = opening_time.tzinfo
        current_time = datetime.now(timezone.utc).astimezone(time_zone)

        if opening_time <= current_time <= closing_time and schedule["type"] == "OPERATING":
            return wait_times, current_time
    return None, ""

def getParks():
    parks_url = f'https://api.themeparks.wiki/v1/destinations'
    data = http.request('GET', parks_url).data
    data = json.loads(data)
    parks = []
    for destination in data['destinations']:
        for park in destination['parks']:
            parks.append([park['id'], park['name']])
    return parks

def getFolderDate(dt):
    minute = (dt.minute // 15) * 15
    rounded_dt = dt.replace(minute=minute, second=0, microsecond=0)
    folder_name = rounded_dt.strftime('%Y/%m/%d/%H-%M')
    return folder_name

def test_handler():
    parks = getParks()
    for park in parks:
        wait_times, current_time = fetch_park_data(park)
        print(park[1])
        if wait_times:
            folder_name = getFolderDate(current_time)
            print("Open! " + folder_name)
        else:
            print("Closed")

def lambda_handler(event, context):
    parks = getParks()
    for park in parks:
        wait_times, current_time = fetch_park_data(park)
        if wait_times:
            folder_name = getFolderDate(current_time)
            file_name = f'{park[1]}/{folder_name}.json'
            s3.put_object(
                Bucket=bucket_name,
                Key=file_name,
                Body=json.dumps(wait_times),
                ContentType='application/json'
            )
    return {
        'statusCode': 200,
        'body': json.dumps('Data fetched and stored successfully!')
    }

if __name__ == "__main__":
    test_handler()