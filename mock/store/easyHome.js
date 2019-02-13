import moment from 'moment'

export default {
    "holidays": [
        {
            "date": moment("2019-02-02T16:00:00.000Z"),
            "name": "",
            "isHoliday": "是",
            "holidayCategory": "星期六、星期日",
            "description": ""
        },
        {
            "date": moment("2019-02-03T16:00:00.000Z"),
            "name": "農曆除夕",
            "isHoliday": "是",
            "holidayCategory": "放假之紀念日及節日",
            "description": "全國各機關學校放假一日。"
        }
    ],
    "scheduleTimes": [
        moment("2019-02-01T12:04:49.279Z"),
        moment("2019-02-16T12:04:49.279Z")
    ],
    "humanResDefs": [
        {
            "name": "早",
            "startTime": "8:00",
            "endTime": "12:00",
            "humans": "2"
        },
        {
            "name": "午",
            "startTime": "12:00",
            "endTime": "18:00",
            "humans": "3"
        },
        {
            "name": "晚",
            "startTime": "18:00",
            "endTime": "21:00",
            "humans": "3"
        }
    ],
    "fullTimeRes": [
        {
            "name": "小明",
            "timeOff": [
                moment("2019-02-08T12:09:46.512Z")
            ],
            "2019/02/06": {
                "includes": [
                    {
                        "name": "A班"
                    }
                ]
            }
        },
        {
            "name": "小華",
            "timeOff": []
        },
        {
            "name": "小毛",
            "timeOff": []
        }
    ],
    "partTimeRes": [{
        "name": "花花",
        "2019/02/07": {
            "availables": [
                {
                    "name": "D班"
                }
            ]
        }
    }],
    "scheduleClassDefs": [
        {
            "name": "A班",
            "startTime": "8:00",
            "endTime": "15:00",
            "priority": "1",
            "humanResDef": [
                "早"
            ],
            "hours": "6.5"
        },
        {
            "name": "B班",
            "startTime": "15:00",
            "endTime": "21:30",
            "priority": "1",
            "humanResDef": [
                "晚",
                "午"
            ],
            "hours": "6"
        },
        {
            "name": "C班",
            "startTime": "8:00",
            "endTime": "18:00",
            "priority": "1",
            "humanResDef": [
                "早",
                "午"
            ],
            "hours": "9"
        },
        {
            "name": "D班",
            "startTime": "8:00",
            "endTime": "21:30",
            "priority": "2",
            "humanResDef": [
                "晚",
                "早",
                "午"
            ],
            "hours": "12.5"
        },
        {
            "name": "E班",
            "startTime": "18:00",
            "endTime": "21:30",
            "priority": "2",
            "humanResDef": [
                "晚"
            ],
            "hours": "3.5"
        }
    ]
}