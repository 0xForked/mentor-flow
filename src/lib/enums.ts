export enum OAuthProvider {
  GOOGLE = "google",
  MICROSOFT = "microsoft",
}

export enum InstalledAppType {
  CALENDAR = "calendar",
  CONFERENCING = "conferencing",
}

export enum GlobalStateKey {
  DisplayNoAvailabilityModal = "display_no_availability_modal",
  UpdateAvailabilityData = "update_availability_data",
  MentorCalendarDialog = "mentor_calendar_dialog",
  // FOR BOOKING DIALOG INITIALIZATION
  CurrentDate = "current_date",
  StartRangeDate = "start_range_date",
  EndRangeDate = "end_range_date",
  // FOR BOOKING SHEET
  DisplayMenteeBookingDetail = "display_mentee_booking_detail",
  // FOR RESCHEDULE BOOKING
  RescheduleCalendarDialog = "reschedule_calendar_dialog",
}
