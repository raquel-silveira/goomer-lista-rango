interface ICreateOpeningHoursDTO {
  id: string;
  weekday: string;
  start_time: string;
  finish_time: string;
  restaurant_id: string;
}

export { ICreateOpeningHoursDTO };
