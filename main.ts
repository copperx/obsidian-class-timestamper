import { Editor, MarkdownView, Plugin } from 'obsidian';

export default class ClassSchedulePlugin extends Plugin {
    private currentClassIndex = 0;

    async onload() {
        // Register the command for cycling through classes with Command-Option-L
        this.addCommand({
            id: 'cycle-through-classes',
            name: 'Cycle Through Classes',
            hotkeys: [
                {
                    modifiers: ["Mod", "Alt"],
                    key: "L",
                },
            ],
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.cycleThroughClasses(editor);
            },
        });

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
                this.insertClassSchedule(editor);
            }
        });
    }

    // Function to cycle through classes and replace the current line with the next class
    cycleThroughClasses(editor: Editor) {
        const classSchedule = this.getClassSchedule();
        const totalClasses = classSchedule.length;

        // Get the current class
        const selectedClass = classSchedule[this.currentClassIndex];

        // Prepare the text to insert
        const classText = `${selectedClass.day}, ${selectedClass.startTime} - ${selectedClass.endTime}: ${selectedClass.className}`;

        // Replace the current line with the class info
        const currentLine = editor.getCursor().line;
        editor.setLine(currentLine, classText);

        // Increment the class index and loop back if necessary
        this.currentClassIndex = (this.currentClassIndex + 1) % totalClasses;
    }

    // Function to insert the class schedule based on the current time
    insertClassSchedule(editor: Editor) {
        const classSchedule = this.getClassSchedule();

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
            let classStartTime = this.timeStringToMinutes(c.startTime);
            if (classStartTime <= currentTimeMinutes && classStartTime > latestStartTime) {
                latestStartTime = classStartTime;
                selectedClass = c;
            }
        }

        // If no class has started yet today, find the next class
        if (selectedClass === null) {
            let earliestStartTimeAfter = 24 * 60; // Max possible time
            for (let c of todayClasses) {
                let classStartTime = this.timeStringToMinutes(c.startTime);
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

    // Utility function to convert time strings to minutes
    timeStringToMinutes(timeStr: string): number {
        let [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Function to return the class schedule array
    getClassSchedule() {
        return [
            {
                day: 'Monday',
                startTime: '10:00',
                endTime: '11:50',
                className: 'C S 171G D02 MODERN COMPUTING IN PRACTICE',
                duration: 110
            },
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
                duration: 80
            },
            {
                day: 'Wednesday',
                startTime: '10:00',
                endTime: '11:50',
                className: 'C S 171G D02 MODERN COMPUTING IN PRACTICE',
                duration: 110
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
                duration: 80
            },
        ];
    }

    onunload() {

    }
}
