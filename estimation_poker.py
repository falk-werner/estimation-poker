#!/usr/bin/env python3

import argparse
import os
import re
import sys
from textual.app import App, ComposeResult
from textual.containers import Horizontal
from textual.widgets import Label, Button, Header, Footer
from textual.binding import Binding

def file_write_text(filename, content):
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
    except:
        pass

def file_read_text(filename):
    try:
        with open(filename, "r", encoding="utf-8") as f:
            content = f.read()
        return content
    except:
        return ""

def state_file(room):
    return os.path.join(room, "state.txt")

def estimate_file(room, username):
    return os.path.join(room, f"{username}.estimate")

class EstimationPoker(App):
    room: str
    username: str

    BINDINGS = [
        Binding(key="q", action="quit", description="Quit the app"),
    ]    

    def __init__(self, room: str, name: str, *args, **kwargs):
        super(EstimationPoker, self).__init__(*args, **kwargs)
        self.room = room
        self.username = name
        file_write_text(estimate_file(self.room, self.username), "")

    def compose(self) -> ComposeResult:
        yield Header()
        yield Horizontal(
            Button("Show"),
            Button("Hide"),
            Button("Clear"),
            Button("Wipe"),
        )
        yield Label("")
        yield Horizontal(
            Button("0"),
            Button("0.5"),
            Button("1"),
            Button("2"),
            Button("3"),
            Button("5"),
            Button("8"),
            Button("13"),
            Button("20"),
            Button("?"),
        )
        yield Footer()

    def on_button_pressed(self, event: Button.Pressed) -> None:
        text = str(event.button.label)
        if text == "Show":
            file_write_text(state_file(self.room), "shown")
        elif text == "Hide":
            file_write_text(state_file(self.room), "hidden")
        elif text == "Clear":
            file_write_text(state_file(self.room), "hidden")
            for filename in os.listdir(self.room):
                fullpath = os.path.join(self.room, filename)
                if filename.endswith("estimate") and os.path.isfile(fullpath):
                    file_write_text(fullpath, "")
        elif text == "Wipe":
            os.remove(state_file(self.room))
            for filename in os.listdir(self.room):
                fullpath = os.path.join(self.room, filename)
                if filename.endswith("estimate") and os.path.isfile(fullpath):
                    os.remove(fullpath)
        else:
            file_write_text(estimate_file(self.room, self.username), text)
        self.update()

    def on_ready(self):
        self.update()
        self.set_interval(1, self.update)

    def update(self):
        content = ""
        state = file_read_text(state_file(self.room))

        for filename in os.listdir("room"):
            fullpath = os.path.join("room", filename)
            if filename.endswith(".estimate") and os.path.isfile(fullpath):
                name = os.path.splitext(filename)[0]
                estimate = file_read_text(fullpath)
                if state != "shown":
                    estimate = "ready" if len(estimate) > 0 else "waiting..."
                elif estimate == "":
                    estimate = "waiting..."
                content += f"{name:<20}{estimate}\n"
        self.query_one(Label).update(content)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("name", type=str)
    args = parser.parse_args()

    if not re.fullmatch("[a-zA-Z0-9-_]+", args.name):
        print("error: invalid name")
        sys.exit(1)

    if len(args.name) > 16:
        print("error: name too long")
        sys.exit(1)

    app = EstimationPoker("room", args.name)
    app.run()

if __name__ == "__main__":
    main()
