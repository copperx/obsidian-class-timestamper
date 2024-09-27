## Obsidian Class Schedule Plugin

This plugin helps you quickly insert your current or upcoming class information into your Obsidian notes. It automatically detects the current day and time and inserts a header with the relevant class details. If there are no classes today, it will indicate that.

### Features

* **Automatic class detection:**  The plugin intelligently determines your current or next class based on the current day and time.
* **Header insertion:** It neatly inserts the class information as a header in your note, making it visually prominent.
* **No class indication:**  If you have no classes on a particular day, the plugin will inform you.

### Installation

1. **Download:** Download the latest release of the plugin from the Releases  page.
2. **Install:**  In Obsidian, go to `Settings` -> `Third-party plugins` -> `Turn on Community plugins`. Then click on `Browse` and select the downloaded plugin file.

### Usage

1. **Configure your class schedule:**  Modify the `classSchedule` array in the plugin code to reflect your actual class schedule. Make sure to include the day, start time, end time, class name, and duration for each class.
2. **Insert class information:**  Use the hotkey `Ctrl+F5` to insert the current or upcoming class information into your note. 

### Example

```
## Monday, September 24, 10:00 C S 171G D02 MODERN COMPUTING IN PRACTICE


```


