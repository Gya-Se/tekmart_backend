import math
result = 0
for i in range(1, 1000):
    result += 1/(math.sqrt(i) + math.sqrt(i+1))
print(round(result, 4))