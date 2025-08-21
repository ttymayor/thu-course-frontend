type ScheduleEntry = {
  day: string;
  periods: number[];
  location?: string;
};

export function courseTimeParser(input: string): ScheduleEntry[] {
  const lines = input.split("\n").filter((line) => line.trim() !== "");
  const results: ScheduleEntry[] = [];
  const daysMap: { [key: string]: string } = {
    一: "星期一",
    二: "星期二",
    三: "星期三",
    四: "星期四",
    五: "星期五",
    六: "星期六",
    日: "星期日",
  };

  for (const line of lines) {
    let currentDay = "";
    let currentPeriods: number[] = [];
    let currentLocation = "";
    let readingPeriods = false;
    let readingLocation = false;
    let tempNumString = "";

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (daysMap[char]) {
        // New weekday detected
        if (currentDay && (currentPeriods.length > 0 || currentLocation)) {
          results.push({
            day: currentDay,
            periods: currentPeriods,
            ...(currentLocation && { location: currentLocation }),
          });
        }
        currentDay = daysMap[char];
        currentPeriods = [];
        currentLocation = "";
        readingPeriods = false;
        readingLocation = false;
        tempNumString = "";
      } else if (char === "/") {
        readingPeriods = true;
      } else if (char === ",") {
        if (tempNumString) {
          currentPeriods.push(parseInt(tempNumString, 10));
          tempNumString = "";
        }
      } else if (char === ";" || (char === " " && readingPeriods)) {
        if (tempNumString) {
          currentPeriods.push(parseInt(tempNumString, 10));
          tempNumString = "";
        }
        if (currentDay) {
          results.push({
            day: currentDay,
            periods: currentPeriods,
            ...(currentLocation && { location: currentLocation }),
          });
        }
        currentDay = "";
        currentPeriods = [];
        currentLocation = "";
        readingPeriods = false;
      } else if (char === "[") {
        if (tempNumString) {
          currentPeriods.push(parseInt(tempNumString, 10));
          tempNumString = "";
        }
        readingPeriods = false;
        readingLocation = true;
        currentLocation = "";
      } else if (char === "]") {
        readingLocation = false;
      } else if (readingPeriods) {
        if (!isNaN(parseInt(char, 10))) {
          tempNumString += char;
        } else {
          // End of number, push to periods
          if (tempNumString) {
            currentPeriods.push(parseInt(tempNumString, 10));
            tempNumString = "";
          }
        }
      } else if (readingLocation) {
        currentLocation += char;
      }
    }

    // Push the last entry of the line
    if (tempNumString) {
      currentPeriods.push(parseInt(tempNumString, 10));
    }
    if (currentDay) {
      results.push({
        day: currentDay,
        periods: currentPeriods,
        ...(currentLocation && { location: currentLocation }),
      });
    }
  }

  return results;
}
