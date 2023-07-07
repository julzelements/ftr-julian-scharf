import json

def fibonacci(n):
    sequence = [0, 1]
    while len(sequence) < n:
        sequence.append(sequence[-1] + sequence[-2])
    return sequence

def save_to_file(filename, data):
    with open(filename, 'w') as f:
        json.dump(data, f)

if __name__ == '__main__':
    fibonacci_numbers = fibonacci(1000)
    save_to_file('fibonacci_numbers.json', fibonacci_numbers)
