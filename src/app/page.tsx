'use client';
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

const initialValue = dayjs('2025-05-14');

// ✅ 月ごとにハイライト日をまとめておく


const highlightedDaysMap: Record<string, Dayjs[]> = {
  '2025-05': [
    dayjs('2025-05-01'),
    dayjs('2025-05-05'),
    dayjs('2025-05-10'),
    dayjs('2025-05-12'),
    dayjs('2025-05-15'),
    dayjs('2025-05-20'),
    dayjs('2025-05-25'),
  ],
  '2025-06': [
    dayjs('2025-06-03'),
    dayjs('2025-06-09'),
    dayjs('2025-06-18'),
  ],
};

function ServerDay(props: PickersDayProps & { highlightedDays?: Dayjs[] }) {
  const { day, outsideCurrentMonth, highlightedDays = [], ...other } = props;
  const isSelected = !outsideCurrentMonth && highlightedDays.some(d => d.isSame(day, 'day'));

  return (
    <Badge
      key={day.toString()}
      overlap="circular"
      badgeContent={isSelected ? '🌚' : undefined}
    >
      <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
    </Badge>
  );
}

export default function DateCalendarServerRequest() {
  const [inputdate,setInputdate] = React.useState("")
  const [currentMonth, setCurrentMonth] = React.useState(initialValue);
  const [isLoading, setIsLoading] = React.useState(false);

  // ✅ 現在の月に対応するハイライトデータを取得
  const highlightedDays = highlightedDaysMap[currentMonth.format('YYYY-MM')] || [];

  const handleMonthChange = (date: Dayjs) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentMonth(date);
      setIsLoading(false);
    }, 400); // ローディング演出用
  };

  const handleDate = (value: Dayjs | null) => {
    console.log(value?.format('YYYY-MM-DD'));
  };

  const addDate = ()=>{
  highlightedDaysMap['2025-05'].push(dayjs(inputdate));
  setInputdate("")
}

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          defaultValue={initialValue}
          loading={isLoading}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          onChange={handleDate}
          slots={{
            day: (dayProps) => (
              <ServerDay {...dayProps} highlightedDays={highlightedDays} />
            ),
          }}
        />
      </LocalizationProvider>

      <input type="date" onChange={(e)=>{setInputdate(e.target.value)}} />
      <form action="submit" onClick={()=>{addDate()}}>送信</form>
    </>
  );
}
