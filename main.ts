import { Editor, MarkdownView, Plugin } from 'obsidian';

export default class ClassSchedulePlugin extends Plugin {
    private currentClassIndex = 0;

    async onload() {
        console.log('Loading Class Schedule Plugin...');

        this.addCommand({
            id: 'cycle-through-classes-command',
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

        console.log('Cycle Through Classes command registered');

        this.addCommand({
            id: 'insert-class-schedule-command',
            name: 'Insert Class Schedule',
            hotkeys: [
                {
                    modifiers: ["Ctrl"],
                    key: "F5",
                },
            ],
            editorCallback: (editor: Editor, view: MarkdownView) => {
                this.insertClassSchedule(editor);
            },
        });

        console.log('Insert Class Schedule command registered');
    }

    onunload() {
        console.log('Unloading Class Schedule Plugin...');
    }

    cycleThroughClasses(editor: Editor) {
        const classSchedule = this.getClassSchedule();
        const totalClasses = classSchedule.length;

        // Get the current class
        const selectedClass = classSchedule[this.currentClassIndex];

        // Prepare the text to insert with ## at the beginning and only the start time
        const classText = `## ${selectedClass.day}, ${selectedClass.startTime}: ${selectedClass.className}`;

        // Replace the current line with the class info
        const currentLine = editor.getCursor().line;
        editor.setLine(currentLine, classText);

        // Increment the class index and loop back if necessary
        this.currentClassIndex = (this.currentClassIndex + 1) % totalClasses;

        console.log(`Cycled to class: ${selectedClass.className}`);
    }

    insertClassSchedule(editor: Editor) {
        const classSchedule = this.getClassSchedule();

        let currentDate = new Date();
        let daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let currentDayName = daysOfWeek[currentDate.getDay()];
        let currentMonthName = months[currentDate.getMonth()];
        let currentDay = currentDate.getDate();
        let currentTimeMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

        let todayClasses = classSchedule.filter(c => c.day === currentDayName);

        let selectedClass = null;
        let latestStartTime = -1;
        for (let c of todayClasses) {
            let classStartTime = this.timeStringToMinutes(c.startTime);
            if (classStartTime <= currentTimeMinutes && classStartTime > latestStartTime) {
                latestStartTime = classStartTime;
                selectedClass = c;
            }
        }

        if (selectedClass === null) {
            let earliestStartTimeAfter = 24 * 60; 
            for (let c of todayClasses) {
                let classStartTime = this.timeStringToMinutes(c.startTime);
                if (classStartTime > currentTimeMinutes && classStartTime < earliestStartTimeAfter) {
                    earliestStartTimeAfter = classStartTime;
                    selectedClass = c;
                }
            }
        }

        let headerText = '';
        if (selectedClass === null) {
            headerText = `## ${currentDayName}, ${currentMonthName} ${currentDay}, No classes today.`;
        } else {
            headerText = `## ${currentDayName}, ${currentMonthName} ${currentDay}, ${selectedClass.startTime} ${selectedClass.className}`;
        }

        editor.replaceSelection(`${headerText}\n\n`);
    }

    timeStringToMinutes(timeStr: string): number {
        let [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

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
}
