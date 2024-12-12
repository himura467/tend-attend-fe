// Attendance Status defined by CEDS
// https://ceds.ed.gov/element/000076
export enum AttendanceStatus {
  // 出席
  PRESENT = 0,
  // 連絡済み欠席
  EXCUSED_ABSENCE = 1,
  // 未連絡欠席
  UNEXCUSED_ABSENCE = 2,
  // 遅刻
  TARDY = 3,
  // 早退
  EARLY_DEPARTURE = 4,
}
