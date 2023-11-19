
class identify  {
    constructor(body) {
        this.body = body;
    }

    pastTime() {
        const date = this.body;

        const now = new Date(); 
        const startDate = new Date(date);
    
        const time = now.getTime() - startDate.getTime();
        const timeMin = Math.floor(time / 1000 / 60);
        const timeHour = parseInt(timeMin / 60);
        const timeDay = parseInt(timeHour / 24);
        const timeWeek = parseInt(timeDay / 7);
        const timeMonth = parseInt(timeWeek / 4);
        const timeYear = parseInt(timeMonth / 12);
    
        let timestamp;
        if(timeMin === 0) {
            timestamp = "방금 전"
        } else if(timeMin > 0 && timeMin < 60) {
            timestamp = String(timeMin) + "분 전";
        } else if(timeHour >= 1 && timeHour < 24) {
            timestamp = String(timeHour) + "시간 전";
        } else if(timeDay >= 1 && timeDay < 7) {
            timestamp = String(timeDay) + "일 전";
        } else if(timeWeek >= 1 && timeWeek < 4) {
            timestamp = String(timeWeek) + "주 전";
        } else if(timeMonth >= 1 && timeMonth < 12) {
            timestamp = String(timeMonth) + "개월 전";
        } else if(timeYear >= 1) {
            timestamp = String(timeYear) + "년 전";
        } 
        return timestamp;
    }

    name() {
        const writer = this.body
        const name = String(writer).slice(0,1) + "*".repeat(String(writer).length - 1);
        return name;
    }

    day() {

        const yyyyMMdd = String(this.body);
        const sYear = yyyyMMdd.substring(0,4);
        const sMonth = yyyyMMdd.substring(4,6);
        const sDate = yyyyMMdd.substring(6,8);

        const date = new Date(Number(sYear), Number(sMonth)-1, Number(sDate));

        const week = ['일', '월', '화', '수', '목', '금', '토'];

        return  week[date.getDay()] + '요일';
    
    }

    date() {
        const dateString = this.body;
        const inputDate = new Date(dateString);
        const current = new Date();
        const currentDate = new Date(current.getTime() + 9 * 60 * 60 * 1000);
        const currentYear = currentDate.getFullYear();
        const inputYear = inputDate.getFullYear();
        
        let result = '';
        
        if (currentYear !== inputYear) {
          result += `${inputYear}년 `;
        }
        const timeDifference = currentDate - inputDate;
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        
        if (daysDifference === 0) {
          result += "오늘";
        } else if (daysDifference === 1) {
          result += "어제";
        } else {
          const inputMonth = inputDate.getMonth() + 1;
          const inputDay = inputDate.getDate();
          result += `${inputMonth}월 ${inputDay}일`;
        }

        return result;
    }

    hourMin() {
        const inputDateStr = this.body
        const inputDate = new Date(inputDateStr);

        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();

        const amPm = hours > 12 ? "오후" : "오전";

        const hours12 = hours % 12 || 12;

        const formattedDate = `${amPm} ${hours12}:${minutes.toString().padStart(2, '0')}`;

        return formattedDate
    }

    untilTime() {
        const targetDateStr = this.body;
        const currentDate = new Date();
        const targetDate = new Date(targetDateStr);
        const timeDifference = targetDate - currentDate;
        const millisecondsInADay = 24 * 60 * 60 * 1000;
        const daysRemaining = Math.floor(timeDifference / millisecondsInADay);
        const hoursRemaining = Math.floor((timeDifference % millisecondsInADay) / (60 * 60 * 1000));

        if(daysRemaining <= 0) {
            return hoursRemaining + "시간";
        } else {
            return daysRemaining + "일"
        }
    }

    url() {
        const text = this.body;
        const urlPattern = /(https?:\/\/[^ ]*)/;
      
        const parts = text.split(urlPattern);
      
        const elements = parts.map((part, index) => {
            if (urlPattern.test(part)) {
                return (
                <a key={index} href={part} target="_blank" >
                    {part}
                </a>
                );
            } else {
                return part;
            }
        });
      
        return elements;
    }

    text(maxLength) {
        const inputStr = this.body;
        if (inputStr.length > maxLength) {
            return inputStr.substring(0, maxLength - 3) + "...";
        } else {
            return inputStr;
        }
    }
}

export {identify}