import { Editor, MarkdownView, Plugin } from 'obsidian';

export default class ClassSchedulePlugin extends Plugin {
    async onload() {
        this.addCommand({
            id: 'insert-class-schedule',
            name: 'Insert Class Schedule',
            hotkeys: [
                {
                    modifiers: ["Ctrl"],
                    key: "F5",
                },
            ],
            editorCallback: (editor: Editor, view: MarkdownView) => {
                // Class schedule data
                const classSchedule = [
                    {
                        day: 'Monday',
                        startTime: '13:00',
                        endTime: '14:50',
                        className: 'COSC 1437 02 PROGRAMMING FUNDAMENTALS II',
                        duration: 110
                    },
                    {
                        day: 'Monday',
                        startTime: '19:30',
                        endTime: '21:20',
                        className: 'COSC 1436 61 PROGRAMMING FUNDAMENTALS I',
                        duration: 110
                    },
                    {
                        day: 'Tuesday',
                        startTime: '13:00',
                        endTime: '14:50',
                        className: 'COSC 1436 04 PROGRAMMING FUNDAMENTALS I',
                        duration: 110
                    },
                    {
                        day: 'Tuesday',
                        startTime: '17:30',
                        endTime: '18:40',
                        className: 'COSC 2336 61 PROGRAMMING FUNDAMENTALS III',
                        duration: 70
                    },
                    {
                        day: 'Wednesday',
                        startTime: '13:00',
                        endTime: '14:50',
                        className: 'COSC 1437 02 PROGRAMMING FUNDAMENTALS II',
                        duration: 110
                    },
                    {
                        day: 'Wednesday',
                        startTime: '19:30',
                        endTime: '21:20',
                        className: 'COSC 1436 61 PROGRAMMING FUNDAMENTALS I',
                        duration: 110
                    },
                    {
                        day: 'Thursday',
                        startTime: '13:00',
                        endTime: '14:50',
                        className: 'COSC 1436 04 PROGRAMMING FUNDAMENTALS I',
                        duration: 110
                    },
                    {
                        day: 'Thursday',
                        startTime: '17:30',
                        endTime: '18:40',
                        className: 'COSC 2336 61 PROGRAMMING FUNDAMENTALS III',
                        duration: 70
                    },
                ];

                // Function to convert time string to minutes
                function timeStringToMinutes(timeStr: string): number {
                    let [hours, minutes] = timeStr.split(':').map(Number);
                    return hours * 60 + minutes;
                }

                // Get current date and time
                let currentDate = new Date();
                let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                let currentDayName = daysOfWeek[currentDate.getDay()];
                let currentMonthName = months[currentDate.getMonth()];
                let currentDay = currentDate.getDate();
                let currentTimeMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

                // Filter classes for today
                let todayClasses = classSchedule.filter(c => c.day === currentDayName);

                // Find the class that started before or at current time and has the latest start time
                let selectedClass = null;
                let latestStartTime = -1;
                for (let c of todayClasses) {
                    let classStartTime = timeStringToMinutes(c.startTime);
                    if (classStartTime <= currentTimeMinutes && classStartTime > latestStartTime) {
                        latestStartTime = classStartTime;
                        selectedClass = c;
                    }
                }

                // If no class has started yet today, find the next class
                if (selectedClass === null) {
                    let earliestStartTimeAfter = 24 * 60; // Max possible time
                    for (let c of todayClasses) {
                        let classStartTime = timeStringToMinutes(c.startTime);
                        if (classStartTime > currentTimeMinutes && classStartTime < earliestStartTimeAfter) {
                            earliestStartTimeAfter = classStartTime;
                            selectedClass = c;
                        }
                    }
                }

                // Prepare the text to insert
                let headerText = '';
                if (selectedClass === null) {
                    headerText = `## ${currentDayName}, ${currentMonthName} ${currentDay}, No classes today.`;
                } else {
                    headerText = `## ${currentDayName}, ${currentMonthName} ${currentDay}, ${selectedClass.startTime} ${selectedClass.className}`;
                }

                // Insert the formatted text as a header followed by two newlines
                editor.replaceSelection(`${headerText}\n\n`);
            }
        });
    }

    onunload() {

    }
}
