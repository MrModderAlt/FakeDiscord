import tkinter as tk
from tkinter import messagebox
import threading
import time
import random
import subprocess
import ctypes
import os
import sys
from pathlib import Path

class HorrorGame:
    def __init__(self, root):
        self.root = root
        self.root.attributes('-fullscreen', True)
        self.root.configure(bg='black')
        self.running = True
        self.game_started = False
        
        self.canvas = tk.Canvas(root, bg='black', highlightthickness=0)
        self.canvas.pack(fill=tk.BOTH, expand=True)
        
        self.start_screen()
        
        self.root.bind('<Escape>', self.attempt_exit)
        self.root.protocol("WM_DELETE_WINDOW", self.on_closing)
        
    def start_screen(self):
        self.canvas.delete("all")
        
        self.canvas.create_text(
            self.root.winfo_width() // 2,
            self.root.winfo_height() // 2 - 100,
            text="DO NOT PLAY",
            font=("Arial", 80, "bold"),
            fill="red"
        )
        
        self.canvas.create_text(
            self.root.winfo_width() // 2,
            self.root.winfo_height() // 2 + 50,
            text="Click to start... if you dare",
            font=("Arial", 30),
            fill="white"
        )
        
        self.canvas.bind("<Button-1>", self.start_game)
        
    def start_game(self, event=None):
        if self.game_started:
            return
        self.game_started = True
        self.canvas.unbind("<Button-1>")
        
        thread = threading.Thread(target=self.game_loop, daemon=True)
        thread.start()
        
    def game_loop(self):
        events = [
            self.glitch_screen,
            self.show_error,
            self.change_wallpaper,
            self.open_program,
            self.distort_display,
            self.creepy_text,
            self.malfunction_sound
        ]
        
        start_time = time.time()
        
        while self.running and time.time() - start_time < 60:
            event = random.choice(events)
            event()
            time.sleep(random.uniform(2, 5))
        
        if self.running:
            self.final_scare()
        
    def glitch_screen(self):
        if not self.running:
            return
            
        for _ in range(20):
            x = random.randint(0, self.root.winfo_width())
            y = random.randint(0, self.root.winfo_height())
            w = random.randint(50, 300)
            h = random.randint(20, 100)
            
            color = random.choice(['red', 'green', 'cyan', 'white', 'yellow'])
            self.canvas.create_rectangle(x, y, x + w, y + h, fill=color, outline=color)
            
            self.root.update()
            time.sleep(0.05)
        
        self.canvas.delete("all")
        
    def show_error(self):
        if not self.running:
            return
            
        self.root.after(0, self._show_error_dialog)
        
    def _show_error_dialog(self):
        errors = [
            ("SYSTEM ERROR", "Unauthorized access detected.\nYour files are being compromised."),
            ("WARNING", "Suspicious activity on your device.\nDo not turn off your computer."),
            ("CRITICAL ERROR", "Malware infection detected.\nSystem failure imminent."),
            ("ERROR 0xDEADBEEF", "Critical kernel panic.\nData corruption in progress."),
            ("SECURITY ALERT", "Your passwords have been stolen."),
        ]
        
        title, msg = random.choice(errors)
        try:
            self.root.after(0, lambda: messagebox.showerror(title, msg))
        except:
            pass
            
    def change_wallpaper(self):
        try:
            self.canvas.delete("all")
            self.canvas.create_rectangle(0, 0, self.root.winfo_width(), self.root.winfo_height(), 
                                        fill=random.choice(['darkred', 'darkgreen', 'navy', 'maroon']))
            self.canvas.create_text(
                self.root.winfo_width() // 2,
                self.root.winfo_height() // 2,
                text=random.choice(['HACKED', 'INFECTED', 'COMPROMISED', 'PWNED']),
                font=("Arial", 100, "bold"),
                fill="red"
            )
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
        ]
        
        prog = random.choice(programs)
        try:
            subprocess.Popen(prog)
        except:
            pass
            
    def distort_display(self):
        if not self.running:
            return
            
        self.canvas.delete("all")
        for i in range(200):
            x = random.randint(0, self.root.winfo_width())
            y = random.randint(0, self.root.winfo_height())
            self.canvas.create_line(x, y, x + random.randint(-100, 100), y + random.randint(-100, 100),
                                   fill=random.choice(['lime', 'red', 'cyan']), width=random.randint(1, 3))
        
        self.root.update()
        time.sleep(1)
        self.canvas.delete("all")
        
    def creepy_text(self):
        if not self.running:
            return
            
        messages = [
            "We see you...",
            "Help me...",
            "Stop...",
            "RUN",
            "You can't escape",
            "Your screen is watching you",
            "JOIN US",
        ]
        
        self.canvas.delete("all")
        self.canvas.create_rectangle(0, 0, self.root.winfo_width(), self.root.winfo_height(), fill='black')
        
        msg = random.choice(messages)
        self.canvas.create_text(
            self.root.winfo_width() // 2,
            self.root.winfo_height() // 2,
            text=msg,
            font=("Arial", 60, "bold"),
            fill="red"
        )
        
        self.root.update()
        time.sleep(2)
        self.canvas.delete("all")
        
    def malfunction_sound(self):
        try:
            freq = random.randint(100, 1000)
            duration = random.randint(100, 500)
            winsound_module = __import__('winsound')
            winsound_module.Beep(freq, duration)
        except:
            pass
            
    def final_scare(self):
        if not self.running:
            return
            
        self.running = False
        self.canvas.delete("all")
        self.canvas.create_rectangle(0, 0, self.root.winfo_width(), self.root.winfo_height(), fill='red')
        
        for size in range(20, 120, 5):
            if not self.running:
                break
            self.canvas.delete("all")
            self.canvas.create_rectangle(0, 0, self.root.winfo_width(), self.root.winfo_height(), fill='red')
            self.canvas.create_text(
                self.root.winfo_width() // 2,
                self.root.winfo_height() // 2,
                text="GOODBYE",
                font=("Arial", size, "bold"),
                fill="white"
            )
            self.root.update()
            time.sleep(0.1)
        
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
        if random.random() > 0.5:
            messagebox.showwarning("EXIT BLOCKED", "You can't escape that easily...")
            return "break"
        else:
            self.quit_game()
            
    def on_closing(self):
        self.attempt_exit()

if __name__ == "__main__":
    root = tk.Tk()
    root.title("System Alert")
    game = HorrorGame(root)
    root.mainloop()
