import tkinter as tk
from tkinter import messagebox
import threading
import time
import random
import subprocess
import os
import sys
from pathlib import Path

class AdvancedHorrorGame:
    def __init__(self, root):
        self.root = root
        self.root.attributes('-fullscreen', True)
        self.root.configure(bg='black')
        self.running = True
        self.game_started = False
        self.intensity = 0
        
        self.canvas = tk.Canvas(root, bg='black', highlightthickness=0, cursor="none")
        self.canvas.pack(fill=tk.BOTH, expand=True)
        
        self.root.bind('<Escape>', self.attempt_exit)
        self.root.bind('<Any-KeyPress>', self.on_key_press)
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        
        self.start_screen()
        
        self.click_count = 0
        self.mouse_x = 0
        self.mouse_y = 0
        
    def start_screen(self):
        self.canvas.delete("all")
        w = self.root.winfo_width() // 2
        h = self.root.winfo_height() // 2
        
        self.canvas.create_text(
            w, h - 150,
            text="⚠ WARNING ⚠",
            font=("Arial", 60, "bold"),
            fill="red"
        )
        
        self.canvas.create_text(
            w, h - 50,
            text="SYSTEM BREACH DETECTED",
            font=("Arial", 40),
            fill="white"
        )
        
        self.canvas.create_text(
            w, h + 80,
            text="Click anywhere to continue...",
            font=("Arial", 25),
            fill="yellow"
        )
        
        self.canvas.create_text(
            w, h + 150,
            text="(If you dare)",
            font=("Arial", 20, "italic"),
            fill="lime"
        )
        
        self.canvas.bind("<Button-1>", self.start_game)
        self.canvas.bind("<Motion>", self.on_mouse_move)
        
    def on_mouse_move(self, event):
        self.mouse_x = event.x
        self.mouse_y = event.y
        
    def start_game(self, event=None):
        if self.game_started:
            return
        self.game_started = True
        self.canvas.unbind("<Button-1>")
        
        thread = threading.Thread(target=self.game_loop, daemon=True)
        thread.start()
        
    def on_key_press(self, event):
        if self.game_started and event.keysym != 'Escape':
            messagebox.showwarning("DETECTED", f"Key '{event.char}' logged and sent.")
            
    def game_loop(self):
        start_time = time.time()
        
        while self.running and time.time() - start_time < 90:
            self.intensity = (time.time() - start_time) / 90
            
            rng = random.random()
            
            if rng < 0.15:
                self.glitch_screen()
            elif rng < 0.30:
                self.show_error()
            elif rng < 0.45:
                self.open_program()
            elif rng < 0.60:
                self.distort_display()
            elif rng < 0.75:
                self.creepy_text()
            elif rng < 0.85:
                self.file_corruption()
            elif rng < 0.95:
                self.malfunction_sound()
            else:
                self.random_popup()
            
            time.sleep(random.uniform(1.5 + (2 * self.intensity), 4 - (2 * self.intensity)))
        
        if self.running:
            self.final_scare()
        
    def glitch_screen(self):
        if not self.running:
            return
            
        for _ in range(random.randint(15, 40)):
            x = random.randint(0, self.root.winfo_width())
            y = random.randint(0, self.root.winfo_height())
            w = random.randint(30, 400)
            h = random.randint(10, 150)
            
            color = random.choice(['red', 'green', 'cyan', 'white', 'yellow', 'magenta', 'lime'])
            self.canvas.create_rectangle(x, y, x + w, y + h, fill=color, outline=color)
            
            self.root.update()
            time.sleep(0.03)
        
        self.canvas.delete("all")
        
    def show_error(self):
        if not self.running:
            return
            
        self.root.after(0, self._show_error_dialog)
        
    def _show_error_dialog(self):
        errors = [
            ("SYSTEM ALERT", "Backdoor detected in system32.\nInitiating shutdown..."),
            ("CRITICAL ERROR 0xDEADBEEF", "Memory corruption detected.\nCore files exposed."),
            ("INTRUSION DETECTED", "Unauthorized access to:\n- Passwords\n- Browser history\n- Personal files"),
            ("WARNING", "Keystroke logger installed.\nAll keystrokes being recorded."),
            ("MALWARE FOUND", "WinLock.Ransomware detected.\nFiles are being encrypted."),
            ("VIRUS ALERT", "Your computer has been infected with trojans.\nSystem will shut down in 30 seconds."),
        ]
        
        title, msg = random.choice(errors)
        try:
            self.root.after(0, lambda: messagebox.showerror(title, msg))
        except:
            pass
            
    def open_program(self):
        if not self.running:
            return
            
        programs = [
            "notepad",
            "calc",
            "mspaint",
            "taskmgr",
            "cmd",
        ]
        
        prog = random.choice(programs)
        try:
            subprocess.Popen(prog, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        except:
            pass
            
    def distort_display(self):
        if not self.running:
            return
            
        self.canvas.delete("all")
        lines = int(100 + (150 * self.intensity))
        
        for i in range(lines):
            x = random.randint(0, self.root.winfo_width())
            y = random.randint(0, self.root.winfo_height())
            self.canvas.create_line(x, y, x + random.randint(-150, 150), y + random.randint(-150, 150),
                                   fill=random.choice(['lime', 'red', 'cyan', 'magenta']), width=random.randint(1, 4))
        
        self.root.update()
        time.sleep(1)
        self.canvas.delete("all")
        
    def creepy_text(self):
        if not self.running:
            return
            
        messages = [
            "We're watching...",
            "HELP ME...",
            "Can you hear me?",
            "RUN RUN RUN",
            "You're already infected",
            "No escape",
            "JOIN US",
            "Your data is ours",
            "SCREAM",
            "PAIN",
        ]
        
        self.canvas.delete("all")
        self.canvas.create_rectangle(0, 0, self.root.winfo_width(), self.root.winfo_height(), fill='black')
        
        msg = random.choice(messages)
        size = int(40 + (40 * self.intensity))
        self.canvas.create_text(
            self.root.winfo_width() // 2,
            self.root.winfo_height() // 2,
            text=msg,
            font=("Arial", size, "bold"),
            fill=random.choice(['red', 'lime', 'magenta', 'cyan'])
        )
        
        self.root.update()
        time.sleep(random.uniform(1, 3))
        self.canvas.delete("all")
        
    def file_corruption(self):
        if not self.running:
            return
            
        self.canvas.delete("all")
        self.canvas.create_rectangle(0, 0, self.root.winfo_width(), self.root.winfo_height(), fill='darkred')
        
        files = [
            "C:\\Users\\%USERNAME%\\Documents\\*",
            "C:\\Users\\%USERNAME%\\Desktop\\*",
            "C:\\Program Files\\*",
            "C:\\Windows\\System32\\*",
        ]
        
        text = f"CORRUPTING FILES:\n{random.choice(files)}\n\nDo not turn off your computer"
        
        self.canvas.create_text(
            self.root.winfo_width() // 2,
            self.root.winfo_height() // 2,
            text=text,
            font=("Arial", 35, "bold"),
            fill="yellow"
        )
        
        self.root.update()
        time.sleep(2)
        
    def malfunction_sound(self):
        try:
            freq = random.randint(100 + int(400 * self.intensity), 1500)
            duration = random.randint(100, 500)
            winsound_module = __import__('winsound')
            winsound_module.Beep(freq, duration)
        except:
            pass
            
    def random_popup(self):
        if not self.running:
            return
            
        popups = [
            ("SYSTEM", "Unauthorized activity detected on your account."),
            ("ALERT", "Your computer is at risk."),
            ("WARNING", "Click OK to prevent data loss..."),
            ("ERROR", "System32 corrupted."),
        ]
        
        title, msg = random.choice(popups)
        try:
            self.root.after(0, lambda: messagebox.showinfo(title, msg))
        except:
            pass
            
    def final_scare(self):
        if not self.running:
            return
            
        self.running = False
        self.canvas.delete("all")
        
        messages = [
            "GAME OVER",
            "BUT THE HORROR DOESN'T END",
            "THE VIRUS REMAINS",
            "GOODBYE...",
        ]
        
        for msg in messages:
            if not self.running:
                break
            self.canvas.delete("all")
            self.canvas.create_rectangle(0, 0, self.root.winfo_width(), self.root.winfo_height(), 
                                        fill=random.choice(['red', 'darkred', 'black']))
            
            for size in range(10, 100, 3):
                if not self.running:
                    break
                self.canvas.delete("all")
                self.canvas.create_rectangle(0, 0, self.root.winfo_width(), self.root.winfo_height(), 
                                            fill=random.choice(['red', 'darkred', 'black']))
                self.canvas.create_text(
                    self.root.winfo_width() // 2,
                    self.root.winfo_height() // 2,
                    text=msg,
                    font=("Arial", size, "bold"),
                    fill="white"
                )
                self.root.update()
                time.sleep(0.08)
            
            time.sleep(1)
        
        try:
            self.root.after(2000, self.quit_game)
        except:
            pass
            
    def quit_game(self):
        if self.running:
            self.running = False
        try:
            self.root.quit()
            self.root.destroy()
        except:
            pass
        sys.exit(0)
            
    def attempt_exit(self, event=None):
        if random.random() > 0.3 and self.game_started:
            messagebox.showwarning("EXIT BLOCKED", "The program is not responding.\nPress Ctrl+Alt+Del to force quit...")
            return "break"
        else:
            self.quit_game()
            
    def on_closing(self):
        self.attempt_exit()

if __name__ == "__main__":
    root = tk.Tk()
    root.title("System Alert")
    game = AdvancedHorrorGame(root)
    root.mainloop()
