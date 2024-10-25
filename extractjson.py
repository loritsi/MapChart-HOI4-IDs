import json

with open("version.txt", "r", encoding="utf-8") as file:
    lines = file.readlines()
output = []

for line in lines:
    if line[0] == "|" and not line[1] == "-":
        statename = ""
        id = ""
        section = 0
        for index, char in enumerate(line):
            if index == 0:
                continue
            elif char == "|": #and line[index + 1] == "|":
                section = section + 1
                index = index + 2
                continue
            if section == 1:
                statename = statename + char
            if section == 3:
                id = id + char
        statename = statename.strip()
        id = id.strip()
        print(f"State: {statename}, ID: {id}")
        if not statename == "" and not id == "":
            output.append({statename: id})

output.sort(key=lambda x: int(list(x.values())[0]))

with open('output.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=4)