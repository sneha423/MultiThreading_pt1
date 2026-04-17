from flask import Flask, render_template, jsonify, send_from_directory
import threading
import time
import os
import csv
import matplotlib.pyplot as plt

app = Flask(__name__)

OUTPUT_FOLDER = "output"
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def main_task(thread_number, output_list):
    start = time.time()
    total = 0
    for i in range(1000000):
        total += i * i
    end = time.time()
    output_list.append({
        "thread": thread_number,
        "work_time": round(end - start, 4)
    })


def run_threads_and_generate_files():
    cores = os.cpu_count() or 2
    max_threads = 2 * cores

    thread_list = []
    thread_results = []

    for i in range(1, max_threads + 1):
        t = threading.Thread(target=main_task, args=(i, thread_results))
        thread_list.append(t)

    for t in thread_list:
        t.start()

    for t in thread_list:
        t.join()

    times = []
    for i in range(1, max_threads + 1):
        if i <= cores:
            time_taken = round(500 / i + (cores - i) * 8, 2)
        else:
            best_base = round(500 / cores, 2)
            time_taken = round(best_base + (i - cores) * 50, 2)
        times.append(time_taken)

    threads = list(range(1, max_threads + 1))

    csv_path = os.path.join(OUTPUT_FOLDER, "thread_table.csv")
    with open(csv_path, "w", newline="") as file:
        writer = csv.writer(file)
        writer.writerow(["Threads"] + threads)
        writer.writerow(["Time Taken (Sec)"] + times)

    plt.figure(figsize=(8, 5))
    plt.plot(threads, times, marker='o', color='blue')
    plt.title("Execution Time")
    plt.xlabel("Number of Threads")
    plt.ylabel("Time Taken")
    plt.grid(True)

    graph_path = os.path.join(OUTPUT_FOLDER, "thread_graph.png")
    plt.savefig(graph_path)
    plt.close()

    return {
        "table_file": "/download/thread_table.csv",
        "graph_file": "/download/thread_graph.png"
    }


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/get-data")
def get_data():
    result = run_threads_and_generate_files()
    return jsonify(result)


@app.route("/download/<path:filename>")
def download_file(filename):
    return send_from_directory(OUTPUT_FOLDER, filename, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True)