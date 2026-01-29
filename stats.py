import json

file = open('quran-simple.json', encoding='utf-8')
quran = json.load(file)

total_words = 77800
total_chars = 330709

def get_surah(surah_id):
    surah = quran[surah_id - 1]
    words = chars = 0

    for verse in surah['verses']:
        ayah = verse['text']
        words += len(ayah.split())
        chars += (len(ayah) - ayah.count(' '))
    
    return words, chars


def get_surah_by_ayah(surah_id, ayah_list):
    surah = quran[surah_id - 1]
    ayahs = [surah['verses'][idx-1]['text'] for idx in ayah_list]
    words = chars = 0

    for ayah in ayahs:
        words += len(ayah.split())
        chars += (len(ayah) - ayah.count(' '))
    
    return words, chars


def get_surah_percent(surah_id, ayah_list):
    twords, tchars = get_surah(surah_id)
    words, chars = get_surah_by_ayah(surah_id, ayah_list)

    wp = words * 100 / twords
    cp = chars * 100 / tchars
    ap = (wp + cp)/ 2

    return cp, wp, ap


def get_full_stats(inputs):
    words = chars = 0
    for idx, string in enumerate(inputs, start=1):
        x, y = get_surah_by_ayah(surah_id=idx, ayah_list=get_ayah_list(idx, string))
        words += x
        chars += y
    
    wp = words * 100 / total_words
    cp = chars * 100 / total_chars
    ap = (wp + cp)/ 2

    return cp, wp, ap


def get_ayah_list(surah_id, ayah_string):
    total_ayah = quran[surah_id - 1]['total_verses']
    res = [i for i in range(1, total_ayah + 1)]
    if ayah_string == 'F':
        return res
    elif ayah_string == '0':
        return []
    else:
        res = []
        parts = ayah_string.split(',')
        for part in parts:
            mparts = part.split('-')
            start = int(mparts[0])
            if len(mparts) == 1:
                res.append(start)
            elif len(mparts) == 2:
                end = int(mparts[1])
                res += [i for i in range(start, end + 1)]

        return res
        

print(get_surah_by_ayah(1, [1, 2, 3, 4, 5, 6, 7]))

inputs = ['0'] * 114

surah_names = []
res = get_full_stats(inputs)
print(f"chars: {res[0]} \t words: {res[1]} \t avg: {res[2]}")

res = get_surah_percent(4, get_ayah_list(4, "1-68, 148-176"))
print(f"chars: {res[0]} \t words: {res[1]} \t avg: {res[2]}")

for i in range(1, 69):

    string = input(f"{i}. Surah {quran[i-1]['transliteration']}: ")
    if string == '':
        string = '0'
    inputs[i-1] = string
    res = get_surah_percent(i, get_ayah_list(i, string))
    print(f"chars: {res[0]} \t words: {res[1]} \t avg: {res[2]}")

for i in range(69, 114):
    inputs[i] = 'F'

res = get_full_stats(inputs)
print(f"chars: {res[0]} \t words: {res[1]} \t avg: {res[2]}")
